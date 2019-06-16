import express from 'express';
import { postReadings, getReadings } from './controller';

let router = express.Router();

router.get('/getReadings/:fileName', getReadings);
 
router.post('/postReadings', postReadings);

export default router;