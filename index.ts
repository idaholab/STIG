import express, { NextFunction, Request, Response } from 'express';
import { TaxiiParams } from './src/storage/database-configuration-storage';
import { execSync } from 'child_process';

const app = express();

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

app.use((req: Request, _res: Response, next: NextFunction) => {
  // eslint-disable-next-line no-console
  console.log(`[${req.method}] - ${req.url}`);
  next();
});

app.get('/', (_req: Request, res: Response) => {
  res.redirect('/index.html');
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
