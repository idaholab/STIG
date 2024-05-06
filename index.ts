import express, { Request, Response } from 'express';

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
  res.redirect('/static/index.js');
});

app.get('/', (_req: Request, res: Response) => {
  res.redirect('/index.html');
});

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log('server started at http://localhost:' + PORT);
});
