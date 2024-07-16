import express, { urlencoded, json } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import apiRouter from './api/router';
import errorMiddleware from './middlewares/error';

const port = process.env.API_PORT || 8000;
const app = express();

app.use(
  cors({
    origin: ['http://localhost:8000'],
    credentials: true,
  }),
);

app.use(cookieParser());
app.use(urlencoded({ extended: true }));
app.use(json());

app.get('/', (req, res) => {
  res.status(200).json({ msg: 'Server is up and running' });
});

app.use('/api', apiRouter);

app.use(errorMiddleware);

app.listen(port, () => {
  console.log(`Server is listening at port ${port}`);
});
