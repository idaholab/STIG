import express, { NextFunction } from 'express';
import { Request, Response } from 'express'; 
import { IDatabaseConfigOptions } from './src/storage/database-configuration-storage';
import session from 'express-session';
import { StigDB } from './db';
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
// import path from 'path';
const app = express();

// let client: OrientDBClient = null
// let db: ODatabaseSession = null

let db: StigDB = null;

const {
  PORT = 3000,
  COOKIE_SECRET = "stig_cookie"
} = process.env;

app.use(session({
  secret: COOKIE_SECRET,
  resave: true,
  saveUninitialized: false,
  cookie: { maxAge: 9999999999, sameSite: 'strict' } // Set the session cookie to expire far in the future
}))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))


app.use(express.static('src'))
app.use('/node_modules', express.static('node_modules'))
app.use(express.static('dist'))

app.use((req: Request, _res: Response, next: NextFunction) => {
  console.log(`[${req.method}] - ${req.url}`);

  next();
})

app.get('/', (_req: Request, res: Response) => {
  res.redirect('/index.html');
})

/***********************************************
 * save
 * req.body
 *        name: string
 *        data: string
 * 
 * Save data in a cookie
 ***********************************************/
app.post('/save', (req: Request, res: Response) => {
  let name = req.body.name;
  let data = req.body.data;

  req.session[name] = data;

  res.status(200);
  res.end();
})

/***********************************************
 * data
 * req.body
 *        name: string
 * 
 * Retrieve data from a cookie
 ***********************************************/
app.get('/data', (req: Request, res: Response) => {
  let name = req.query.name as string;

  let data = req.session[name]

  if (data === "undefined" || data === undefined) {
    console.log(`Cookie ${name} not found`)
    data = "{}"
  }

  res.send(data);
})


/**************************************************************
 * Database endpoints
 * 
 **************************************************************/

/*************
 * Use db
 * 
 * Connects to a database with a configuration. 
 * If the db doesn't exist, a new database is created.
 */
app.post("/use_db", async (req, res) => {
  let config: IDatabaseConfigOptions = req.body.config;
  if (config) {
    try {
      db = new StigDB(config)
    } catch (err) {
      console.error(err)
      res.status(500)
    }
  } else {
    res.status(400)
  }

  res.end()
})

app.post("/commit", (req, res) => {
  let data = req.body.data;
  console.log(data)
  if (data) {
    try {
      db.updateDB(data)
    } catch (err) {
      console.error(err)
      res.status(500)
    }
  } else {
    res.status(400)
  }

  res.end()
  
})

app.post("/delete", (req, res) => {
  let data = req.body.data;
  console.log(data)
  if (data) {
    try {
      // Check if the STIX object is an edge
      if (data.type === 'relationship') {
        // Delete edge
        db.sroDestroyedUI(data)
      } else {
        // Delete node
        db.sdoDestroyedUI(data)
      }
    } catch (err) {
      console.error(err)
      res.status(500)
    }
  } else {
    res.status(400)
  }

  res.end()
})

app.post('/query_incoming', async (req, res) => {
  let id = req.body.id
  if (id) {
    try {
      let stix = await db.traverseNodeIn(id)
      res.write(JSON.stringify({data: stix}))
    } catch (err) {
      console.error(err)
      res.status(500)
    }
  } else {
    res.status(400)
  }

  res.end()
})

app.post('/query_outgoing', async (req, res) => {
  let id = req.body.id
  if (id) {
    try {
      let stix = await db.traverseNodeOut(id)
      res.write(JSON.stringify({data: stix}))
    } catch (err) {
      console.error(err)
      res.status(500)
    }
  } else {
    res.status(400)
  }

  res.end()
})

app.listen(PORT, () => {
  console.log('server started at http://localhost:'+PORT);
});