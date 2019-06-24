import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import cors from 'cors';
import router from './routes';
// import fileupload from 'express-fileupload';

const app = express();
const port = 3001;

const mongoDB = 'mongodb://127.0.0.1/thermometer';

mongoose.connect(mongoDB, { useNewUrlParser: true });

let db = mongoose.connection;
db.on('open', () => {
    console.log('Connected to Mongo server');
});
db.on('error', err => {
    console.error.bind(console, 'MongoDB connection error:')
    process.exit(-1);
});

app.use(bodyParser.json({limit: '200mb', extended: true}));
app.use(bodyParser.urlencoded({ limit: '200mb', extended: true }));
app.use(cors());
// app.use(fileupload());

app.use('/thermometer/', router);
app.listen(port, () => console.log(`Example app listening on port ${port}!`));