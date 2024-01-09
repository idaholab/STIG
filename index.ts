import express, { NextFunction, Request, Response } from 'express';
import { IDatabaseConfigOptions, TaxiiParams } from './src/storage/database-configuration-storage';
import session from 'express-session';
import { StigDB } from './db';
import { execSync } from 'child_process';
import bodyParser from 'body-parser';

const app = express();

const dbs: Map<string, StigDB> = new Map<string, StigDB>();

const {
  PORT = 3000,
  COOKIE_SECRET = 'stig_cookie'
} = process.env;

app.use(session({
  secret: COOKIE_SECRET,
  resave: true,
  saveUninitialized: false,
  cookie: { maxAge: 9999999999, sameSite: 'strict' } // Set the session cookie to expire far in the future
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static('src'));
app.use('/node_modules', express.static('node_modules'));
app.use(express.static('dist'));

app.get('/script', (_req, res) => {
  if (process.env.NODE_ENV === 'development') {
    res.redirect('http://localhost:8080/index.js');
  } else {
    res.redirect('/static/index.js');
  }
});

/*********************
 * Check db
 *
 * Determines the status of the database connection.
 * If connected, returns the name of the database.
 * If not connected, returns undefined
 */
app.get('/check_db', (req, res) => {
  res.send({ data: dbs?.get((req.session as any).dbId)?.odb?.name });
});

app.use((req: Request, _res: Response, next: NextFunction) => {
  // eslint-disable-next-line no-console
  console.log(`[${req.method}] - ${req.url}`);

  next();
});

app.get('/', (_req: Request, res: Response) => {
  res.redirect('/index.html');
});

/***********************************************
 * save
 * req.body
 *        name: string
 *        data: string
 *
 * Save data in a cookie
 ***********************************************/
app.post('/save', (req: Request, res: Response) => {
  const name = req.body.name;
  const data = req.body.data;

  req.session[name] = data;

  // eslint-disable-next-line no-console
  console.log(`Saving cookie ${name}`);

  res.status(200);
  res.end();
});

/***********************************************
 * data
 * req.body
 *        name: string
 *
 * Retrieve data from a cookie
 ***********************************************/
app.get('/data', (req: Request, res: Response) => {
  const name = req.query.name as string;

  let data = req.session[name];

  if (data === 'undefined' || data === undefined) {
    // eslint-disable-next-line no-console
    console.log(`Cookie ${name} not found`);
    data = '{}';
  }

  res.send(data);
});

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
// eslint-disable-next-line @typescript-eslint/no-misused-promises
app.post('/use_db', async (req, res) => {
  const config: IDatabaseConfigOptions = req.body.config;
  if (config) {
    try {
      const dbId = (req.session as any).dbId;
      if (dbId === undefined) {
        (req.session as any).dbId = req.sessionID;
        req.session.save();
      }

      dbs.set(dbId, new StigDB());
      // console.log(dbs.values())
      await dbs.get(dbId)?.configure(config);
      const message = 'Connected to database ' + dbs.get(dbId)?.odb.name + " as user '" + config.username + "'";
      res.write(`{"message": "${message}"}`);
    } catch (err) {
      // console.error(err)
      if (err.code === 'ECONNREFUSED') {
        const message = 'Unable to connect to OrientDB. Is it running?';
        res.write(`{"message": "${message}"}`);
      } else if (err.code === 5) {
        const message = 'Unable to connect to OrientDB. Invalid username/password.';
        res.write(`{"message": "${message}"}`);
      } else if (err.message === 'Unable to create database') {
        const message = "Database does not exist, and user '" + config.username + "' does not have permission to create one.";
        res.write(`{"message": "${message}"}`);
      } else {
        const message = 'Unknown error occurred';
        res.write(`{"message": "${message}"}`);
      }
      res.status(500);
    }
  } else {
    res.status(400);
  }

  res.end();
});

/************
 * Commit
 *
 * Commits the object to the database
 */
// eslint-disable-next-line @typescript-eslint/no-misused-promises
app.post('/commit', async (req, res) => {
  const data = req.body.data;
  let message = '';
  if (data) {
    try {
      await dbs.get((req.session as any).dbId)?.updateDB(data);
    } catch (err) {
      if (err.toString().includes('does not have permission')) {
        message = 'Insufficient permissions.';
      } else {
        message = 'DB error here: ' + err.toString();
      }
    }
  } else {
    res.status(400);
  }

  res.write(`{"message": "${message}"}`);

  res.end();
});

/*************
 * Delete
 *
 * Deletes the object from the database
 */
// eslint-disable-next-line @typescript-eslint/no-misused-promises
app.post('/delete', async (req, res) => {
  const data = req.body.data;
  let message = '';
  if (data) {
    try {
      const db = dbs.get((req.session as any).dbId);
      if (!db) {
        res.status(500);
        return;
      }
      // Check if the STIX object is an edge
      if (data.type === 'relationship') {
        // Delete edge
        await db.sroDestroyedUI(data);
      } else {
        // Delete node
        await db.sdoDestroyedUI(data);
      }
    } catch (err) {
      if (err.toString().includes('does not have permission')) {
        message = 'Insufficient permissions.';
      } else {
        message = 'Error deleting from db.';
      }
    }
  } else {
    res.status(400);
  }

  res.write(`{"message": "${message}"}`);

  res.end();
});

/**************
 * Query Incoming
 *
 * Finds the nodes with edges coming in to the passed node
 */
// eslint-disable-next-line @typescript-eslint/no-misused-promises
app.post('/query_incoming', async (req, res) => {
  const id = req.body.id;
  let message = '';
  if (id) {
    try {
      const stix = await dbs.get((req.session as any).dbId)?.traverseNodeIn(id);
      res.write(JSON.stringify({ data: stix }));
    } catch (err) {
      if (err.toString().includes('does not have permission')) {
        message = 'Insufficient permissions.';
      } else {
        message = 'Error executing query.';
      }

      res.write(`{"message": "${message}"}`);
    }
  } else {
    message = 'Invalid request';

    res.write(`{"message": "${message}"}`);
    res.status(400);
  }

  res.end();
});

/*************
 * Query Outgoing
 *
 * Finds the nodes with edges coming out of the passed node
 */
// eslint-disable-next-line @typescript-eslint/no-misused-promises
app.post('/query_outgoing', async (req, res) => {
  const id = req.body.id;
  let message = '';
  if (id) {
    try {
      const stix = await dbs.get((req.session as any).dbId)?.traverseNodeOut(id);
      res.write(JSON.stringify({ data: stix }));
    } catch (err) {
      if (err.toString().includes('does not have permission')) {
        message = 'Insufficient permissions.';
      } else {
        message = 'Error executing query.';
      }

      res.write(`{"message": "${message}"}`);
    }
  } else {
    message = 'Invalid request';

    res.write(`{"message": "${message}"}`);
    res.status(400);
  }

  res.end();
});

/************
 * Query
 *
 * Issues a query supplied by the client
 */
// eslint-disable-next-line @typescript-eslint/no-misused-promises
app.post('/query', async (req, res) => {
  const query = req.body.query;
  let message = '';
  if (query) {
    let message = '';
    try {
      const stix = await dbs.get((req.session as any).dbId)?.executeQuery(query);
      res.write(JSON.stringify({ data: stix }));
    } catch (err) {
      if (err.toString().includes('does not have permission')) {
        message = 'Insufficient permissions.';
      } else {
        message = 'Error executing query.';
      }

      res.write(`{"message": "${message}"}`);
    }
  } else {
    message = 'Invalid request';
    res.write(`{"message": "${message}"}`);
    res.status(400);
  }

  res.end();
});

/**************
 * Diff
 *
 * Finds the difference between the passed node and what is in the database
 */
// eslint-disable-next-line @typescript-eslint/no-misused-promises
app.post('/diff', async (req, res) => {
  const node = req.body.data;
  if (node) {
    try {
      const diff = await dbs.get((req.session as any).dbId)?.getDiff(node);
      res.write(JSON.stringify({ data: diff }));
    } catch (e) {
      res.status(500);
    }
  } else {
    res.status(400);
  }

  res.end();
});

/**************
 * Taxii
 *
 * Runs python code
 */
app.post('/taxii', (req, res) => {
  const tax: TaxiiParams = req.body.params;
  if (tax) {
    try {
      let pyArgs = 'python3 taxii-client.py';
      if (tax.url !== '') {
        pyArgs += ' -u ' + tax.url;
      }
      if (tax.apiroot_name) {
        pyArgs += ' -a ' + tax.apiroot_name;
      }
      if (tax.collection_id) {
        pyArgs += ' -c ' + tax.collection_id;
      }
      if (tax.username) {
        pyArgs += ' -n ' + tax.username;
      }
      if (tax.password) {
        pyArgs += ' -p ' + tax.password;
      }

      const taxiiBuf = execSync(pyArgs);
      const taxiiStr = taxiiBuf.toString();

      res.write(JSON.stringify({ taxii: taxiiStr }));
    } catch (e) {
      res.status(500);
    }
  } else {
    res.status(400);
  }

  res.end();
});

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log('server started at http://localhost:' + PORT);
});
