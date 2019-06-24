import express from 'express';
import multer from 'multer';
import { postReadings, getReadings, extractFile, checkJson } from './controller';

let router = express.Router();

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads/')
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
})
  
let upload = multer({ storage });

router.get('/getReadings/:fileName', getReadings);
 
router.post('/postReadings', upload.single('file'), extractFile, postReadings);

export default router;