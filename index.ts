import express, { NextFunction, response } from 'express';
import { Request, Response } from 'express'; 
import { IDatabaseConfigOptions, TaxiiParams } from './src/storage/database-configuration-storage';
import session from 'express-session';
import { StigDB } from './db';
import { exec } from 'child_process';
//const spawn = require('child_process')
const bodyParser = require('body-parser')
// import path from 'path';
const app = express();

// let client: OrientDBClient = null
// let db: ODatabaseSession = null

// let db: StigDB = null;

let dbs: Map<string, StigDB> = new Map<string, StigDB>()

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

app.get("/script", (req, res) => {
  if (process.env.NODE_ENV == "development") {
    res.redirect("http://localhost:8080/index.js")
  } else {
    res.redirect("/static/index.js")
  }
})

/*********************
 * Check db
 * 
 * Determines the status of the database connection.
 * If connected, returns the name of the database.
 * If not connected, returns undefined
 */
app.get("/check_db", (req, res) => {
  // console.log("Check DB")
  // if (dbs != null) {
  //   // console.log(dbs.values())
  //   console.log(req.session["dbId"])
  //   var _db = dbs.get(req.session["dbId"])
  //   console.log("Database: ", _db.odb.name)
  // }
  // if (db?.odb) {
  //   res.send({data: db.odb.name})
  // } else {
  //   res.send({data: undefined})
  // }

  res.send({data: dbs?.get(req.session["dbId"])?.odb?.name})
})

app.use((req: Request, _res: Response, next: NextFunction) => {
  console.log(`[${req.method}] - ${req.url}`);

  next();
})

app.get('/', (req: Request, res: Response) => {
  res.redirect('/index.html')
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

  console.log(`Saving cookie ${name}`)

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
      // console.log("Session id: ", req.session["dbId"])
      // db = new StigDB(config)
      if (req.session["dbId"] == undefined) {
        req.session["dbId"] = req.sessionID
        // console.log("set session: ", req.session["dbId"])
        req.session.save()
      }

      dbs.set(req.session["dbId"], new StigDB())
      // console.log(dbs.values())
      await dbs.get(req.session["dbId"]).configure(config)
      let message = "Connected to database " + dbs.get(req.session["dbId"]).odb.name + " as user '" + config.username + "'"
      console.log(message)
      res.write(`{"message": "${message}"}`)
    } catch (err) {
      // console.error(err)
      if (err.code == "ECONNREFUSED") {
        let message = "Unable to connect to OrientDB. Is it running?"
        console.log(message)
        res.write(`{"message": "${message}"}`)
      } else if (err.code == 5) {
        let message = "Unable to connect to OrientDB. Invalid username/password."
        console.log(message)
        res.write(`{"message": "${message}"}`)
      } else if (err.message == "Unable to create database") {
        let message = "Database does not exist, and user '" + config.username + "' does not have permission to create one."
        console.log(message)
        res.write(`{"message": "${message}"}`)
      } else {
        let message = "Unknown error occurred"
        console.log(message)
        console.error(err)
        res.write(`{"message": "${message}"}`)
      }
      res.status(500)
    }
  } else {
    res.status(400)
  }

  res.end()
})

/************
 * Commit
 * 
 * Commits the object to the database
 */
app.post("/commit", async (req, res) => {
  let data = req.body.data;
  // console.log(data)
  let message = ""
  if (data) {
    try {
      await dbs.get(req.session["dbId"]).updateDB(data)
    } catch (err) {
      if (err.toString().includes("does not have permission")) {
        message = "Insufficient permissions."
      } else {
        message = "Error committing to DB."
      }
      console.log(message)
      // res.status(500)
    }
  } else {
    res.status(400)
  }

  res.write(`{"message": "${message}"}`)

  res.end()
  
})

/*************
 * Delete
 * 
 * Deletes the object from the database
 */
app.post("/delete", async (req, res) => {
  let data = req.body.data;
  console.log(data)
  let message = ""
  if (data) {
    try {
      let db = await dbs.get(req.session["dbId"])
      // Check if the STIX object is an edge
      if (data.type === 'relationship') {
        // Delete edge
        await db.sroDestroyedUI(data)
      } else {
        // Delete node
        await db.sdoDestroyedUI(data)
      }
    } catch (err) {
      if (err.toString().includes("does not have permission")) {
        message = "Insufficient permissions."
      } else {
        message = "Error deleting from db."
        console.error(err)
      }
      console.log(message)
      // res.status(500)
    }
  } else {
    res.status(400)
  }


  res.write(`{"message": "${message}"}`)

  res.end()
})

/**************
 * Query Incoming
 * 
 * Finds the nodes with edges coming in to the passed node
 */
app.post('/query_incoming', async (req, res) => {
  let id = req.body.id
  let message = ""
  if (id) {
    try {
      let stix = await dbs.get(req.session["dbId"]).traverseNodeIn(id)
      res.write(JSON.stringify({data: stix}))
    } catch (err) {
      if (err.toString().includes("does not have permission")) {
        message = "Insufficient permissions."
      } else {
        message = "Error executing query."
      }
      console.log(message)

      res.write(`{"message": "${message}"}`)
      // res.status(500)
    }
  } else {
    message = "Invalid request"

    res.write(`{"message": "${message}"}`)
    res.status(400)
  }

  res.end()
})

/*************
 * Query Outgoing
 * 
 * Finds the nodes with edges coming out of the passed node
 */
app.post('/query_outgoing', async (req, res) => {
  let id = req.body.id
  let message = ""
  if (id) {
    try {
      let stix = await dbs.get(req.session["dbId"]).traverseNodeOut(id)
      res.write(JSON.stringify({data: stix}))
    } catch (err) {
      if (err.toString().includes("does not have permission")) {
        message = "Insufficient permissions."
      } else {
        message = "Error executing query."
      }
      console.log(message)

      res.write(`{"message": "${message}"}`)
      // res.status(500)
    }
  } else {
    message = "Invalid request"

    res.write(`{"message": "${message}"}`)
    res.status(400)
  }


  res.end()
})

/************
 * Query
 * 
 * Issues a query supplied by the client
 */
app.post("/query", async (req, res) => {
  let query = req.body.query
  let message = ""
  if (query) {
    let message = ""
    try {
      let stix = await dbs.get(req.session["dbId"]).executeQuery(query)
      res.write(JSON.stringify({data: stix}))
    } catch (err) {
      if (err.toString().includes("does not have permission")) {
        message = "Insufficient permissions."
      } else {
        message = "Error executing query."
      }


      res.write(`{"message": "${message}"}`)
      console.log(message)
      // res.status(500)
    }
  } else {
    message = "Invalid request"
    res.write(`{"message": "${message}"}`)
    res.status(400)
  }

  res.end()
})

/**************
 * Diff
 * 
 * Finds the difference between the passed node and what is in the database
 */
app.post('/diff', async (req, res) => {
  let node = req.body.data;
  if (node) {
    try {
      const diff = await dbs.get(req.session["dbId"]).getDiff(node)
      res.write(JSON.stringify({data: diff}))
    } catch (e) {
      res.status(500)
    }
  } else {
    res.status(400)
  }

  res.end()
})

/**************
 * Taxii
 * 
 * Runs python code
 */
app.post('/taxii', async (req, res) => {
  let params: TaxiiParams = req.body.params;
  if (params) {
    try {
      // const diff = await dbs.get(req.session["dbId"]).getDiff(node)
      // res.write(JSON.stringify({data: diff}))
      //console.log(params)

      let pyArgs = 'python3 taxii-client.py'
      let test = ['taxii-client.py']
      if (params.url != "") {
          pyArgs += ' -u ' + params.url
      }
      if (params.apiroot_name) {
          pyArgs += ' -a ' + params.apiroot_name
      } 
      if (params.collection_id) {
          pyArgs += ' -c ' + params.collection_id
      }
      if (params.username) {
          pyArgs += ' -n ' + params.username
      }
      if (params.password) {
          pyArgs += ' -p ' + params.password
      }

      console.log(pyArgs)
      //console.log("trying")

      exec(pyArgs, (error, stdout, stderr) => {
        if (error) {
          console.log(`error: ${error.message}`);
        }
        else if (stderr) {
          console.log(`stderr: ${stderr}`);
        }
        else {
          console.log(stdout);
        }
      })

      // let t = spawn("python3", test)
      // t.stdout.on('data', (data) => {
      //   console.log(`stdout: ${data}`);
      // });
      //console.log("lets see: ")
    } catch (e) {
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