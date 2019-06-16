import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import cors from 'cors';
import router from './routes';

const app = express();
const port = 3001;

const mongoDB = 'mongodb://127.0.0.1/thermometer';

mongoose.connect(mongoDB, { useNewUrlParser: true });

let db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

app.use('/thermometer/', router);
app.listen(port, () => console.log(`Example app listening on port ${port}!`));