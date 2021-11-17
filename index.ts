import express, { NextFunction } from 'express';
import { Request, Response } from 'express';

const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
// import path from 'path';
const app = express();

const {
  PORT = 3000,
} = process.env;

app.use(cookieParser())
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
  // Set a cookie that will expire far in the future
  res.cookie(name, data, {maxAge: 999999999999, sameSite: 'strict'})
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
  console.log(name);

  let data = req.cookies[name]

  console.log(data)

  if (!data) {
    data = "{}"
  }

  res.send(data);
})

app.listen(PORT, () => {
  console.log('server started at http://localhost:'+PORT);
});