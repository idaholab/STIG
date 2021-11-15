import express, { NextFunction } from 'express';
import { Request, Response } from 'express';
// import path from 'path';
const app = express();

const {
  PORT = 3000,
} = process.env;

app.use((req: Request, _res: Response, next: NextFunction) => {
  console.log(`[${req.method}] - ${req.url}`);

  next();
})

app.use(express.static('src'))
app.use('/node_modules', express.static('node_modules'))
app.use(express.static('dist'))

app.get('/', (_req: Request, res: Response) => {
  res.redirect('/index.html');
})

app.listen(PORT, () => {
  console.log('server started at http://localhost:'+PORT);
});