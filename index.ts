import express, { NextFunction } from 'express';
import { Request, Response } from 'express';
import orientjs, { ODatabaseSession, OrientDBClient } from 'orientjs';
import { createClassDeclaration } from 'typescript';
import { IDatabaseConfigOptions } from './src/storage/database-configuration-storage';
import { IOrientJSONClassOptions, schema } from './src/db/schema';
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
// import path from 'path';
const app = express();

let client: OrientDBClient = null
let session: ODatabaseSession = null

const {
  PORT = 3000,
  COOKIE_SECRET = "stig_cookie"
} = process.env;

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))
app.use(cookieParser({secret: COOKIE_SECRET}))

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
  // Set a cookie that will expire far in the future
  res.cookie(name, cookieParser.signedCookie(JSON.stringify(data), COOKIE_SECRET), {maxAge: 999999999999, sameSite: 'strict'})
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

  let data = req.cookies[name]

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
      if (!client) client = await OrientDBClient.connect({host: config.host, port: config.port})

      let dbOptions = {name: config.name, username: config.username, password: config.password}
      if (await client.existsDatabase(dbOptions)) {
        session = await client.session(dbOptions)
      } else {
        client.createDatabase(dbOptions).then(async () => {
          session = await client.session(dbOptions)
          createClasses()
        })
        
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



app.listen(PORT, () => {
  console.log('server started at http://localhost:'+PORT);
});

/*******************************************
 * Database manipulation functions
 * Copied from original STIG source code,
 * with minor modifications to use latest OrientJS features
 *******************************************/

async function createClasses() {
  for (const cls of schema.classes) {
    const c = await class_query(cls);
    await create_properties(c, cls.properties)
  }
}

async function class_query(options: IOrientJSONClassOptions) {
  let name = options.name;
    const idx = name.indexOf('-');
    let alias: string;
    if (idx > -1) {
        alias = name;
        const replaced = name.replace(/-/g, '');
        console.log('found aliases: ', replaced);

        name = replaced;
    }
    try {
        const exists = await session.class.get(name);
        if (exists !== undefined) {
            await session.class.drop(name);
        }
        // tslint:disable-next-line:no-empty
    } catch (e) { }
    const cls = await session.class.create(name, options.superClasses[0]);
    if (alias !== undefined) {
        alias = "`" + alias + "`";
        const query = `ALTER CLASS  ${name}  SHORTNAME ${alias}`;
        await session.exec(query);
    }
    console.log('done with creating superclasses');
    return cls;
}

async function create_properties(cls: orientjs.OClass, props: orientjs.PropertyCreateConfig[]): Promise<orientjs.OClassProperty[]> {
  const created = await cls.property.create(props);
  return created;
}