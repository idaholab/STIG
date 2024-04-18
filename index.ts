import express, { NextFunction, Request, Response } from 'express';
import { IDatabaseConfigOptions, TaxiiParams } from './src/storage/database-configuration-storage';
import { StigDB } from './src/db';
import { execSync } from 'child_process';

const app = express();

const dbs: Map<string, StigDB> = new Map<string, StigDB>();

const {
  PORT = 3000,
} = process.env;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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
  res.send({ data: dbs?.get((req.session as any)?.dbId)?.getName() });
});

app.use((req: Request, _res: Response, next: NextFunction) => {
  // eslint-disable-next-line no-console
  console.log(`[${req.method}] - ${req.url}`);

  next();
});

app.get('/', (_req: Request, res: Response) => {
  res.redirect('/index.html');
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

      const db = await StigDB.getDB('neo4j', config);
      dbs.set(dbId, db);
      const message = 'Connected to database ' + db.getName() + " as user '" + config.username + "'";
      res.write(`{"message": "${message}"}`);
    } catch (err) {
      res.status(400);
      res.write('{"message": "Unable to connect."}');
    }
  } else {
    res.status(400);
    res.write('{"message": "Missing configuration."}');
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
