import Unrar from 'node-unrar';
import fs from 'fs';
import JSONStream from 'JSONStream';
import Async from 'async';
import { Thermometer } from './model';

export const postReadings = (req, res) => {
    const startTime = Date.now();
    let count = 0, totalCount = 0, timeTaken;
    // const rarFile = new Unrar();
    Async.waterfall([
        // cb => {
        //     let rarFile = new Unrar('uploads/' + req.file.originalname);
        //     console.log('rar1:', rarFile);
        //     rarFile.extract('extracted-json/', null, err => {
        //         if (err) console.log(err);
        //         return cb(null);
        //     });
        //     return cb(null, rarFile);
        // },
        // cb => {
        //     if (fs.existsSync('extracted-json/THERM0001.json')) {
        //         // console.log('rar2:', rarFile);
        //         return cb(null);
        //     }
        // },
        cb => {
            console.log(1234);
            const dataStreamFromFile = fs.createReadStream(`${__dirname}/extracted-json/THERM0001.json`);

            let selfChunk = [];
            dataStreamFromFile.pipe(JSONStream.parse('*').on('data', chunk => {
                // console.log('ne: ', chunk);
                selfChunk.push(chunk);
                count++;
                totalCount++;
                // console.log(count);
                if (count == 20000) {
                    console.log(selfChunk.length);
                    count = 0;
                    let obj = {
                        reading: selfChunk,
                        fileName: req.file.originalname,
                        IsActive: true,
                        CreatedOn: new Date(),
                        UpdatedOn: null
                    }
                    new Thermometer(obj).save();
                    selfChunk = [];
                    // console.log('seldchunk:', selfChunk);
                }
            }));

            dataStreamFromFile.on('end', () => {
                let obj = {
                    reading: selfChunk,
                    fileName: req.file.originalname,
                    IsActive: true,
                    CreatedOn: new Date(),
                    UpdatedOn: null
                }
                new Thermometer(obj).save();
                timeTaken = Date.now() - startTime;
                console.log('time taken:', timeTaken);
                console.log('count:', count);
                console.log('totalCount:', totalCount);
                // res.send({ timeTaken, statusCode: 200, dataCount: count });
                // process.exit(0);
            })
            return cb(null);
        }
    ], (err, result) => {
            if (err) console.log(err);
            res.send({ timeTaken, totalCount, statusCode: 200 });
    })
    // console.log(req.file);
    // Thermometer.find({ fileName: req.body.name }, (err, docs) => {
        //     if (err) console.log(err);
        //     if (docs.length != 0) {
            //         docs[0].reading = req.body.data;
            //         docs[0].fileName = req.body.name;
            //         docs[0].UpdatedOn = new Date();
            //         docs[0].save((err, response) => {
                //             if (err) console.log(err);
                //             if (response) res.send({message: 'Data updated', statusCode: 200});
                //         })
                //     }
                //     else {
                    //         Thermometer.create({
                        //             reading: req.body.data,
                        //             fileName: req.body.name,
                        //             IsActive: true,
                        //             CreatedOn: new Date(),
                        //         }, (err, obj) => {
                            //             if (err) return handleError(err);
                            //                 res.send({message: 'Data saved', statusCode: 200});
                            //         })
                            //     }
                            // })
    
    
    // const jsonToInsert = JSONStream.parse(JSON.stringify(fs.readFileSync(__dirname + '/extracted-json/THERM0001.json', 'utf-8')));
    // // const jsonToInsert = fs.readFileSync(__dirname + '/extracted-json/THERM0001.json', 'utf-8');

    // console.log(jsonToInsert);


    // console.log(req.file);
    
    // jsonToInsert.on('data', data => {
    //     console.log(data);
    // })
    // Thermometer.insertMany({
    //     reading: jsonToInsert,
    //     fileName: req.file.originalname,
    //     IsActive: true,
    //     CreatedOn: new Date()
    // }, (err, docs) => {
    //     if (err) console.log('err', err);
    //     console.log('docs:', docs)
    // });
    // console.log('DONE');
    // console.log(req.params);
    // const archive = new Unrar('./uploads/*');
    // archive.list((err, entries) => {
    //     console.log(entries);
    // })
    // console.log(req.file);

}

export const getReadings = (req, res) => {
    Thermometer.find({ fileName: req.params.fileName }, (err, obj) => {
        if (err) return handleError(err)
        res.send(obj);
    })
}

export const extractFile = async (req, res, next) => {
    console.log('1');
    let rarFile = await new Unrar('uploads/' + req.file.originalname).extract('extracted-json/', null, err => {
        if (err) console.log(err);
        console.log('2');
        if (fs.existsSync('/extracted-json/THERM0001.json')) {
            next();
        }
        // else {
        // }
        // next();
    });
    // await rarFile.extract('extracted-json/', null, err => {
    //     if (err) console.log(err);
    // });
    
}

export const checkJson = (req, res, next) => {
    console.log('2');
    if (fs.existsSync('/extracted-json/THERM0001.json')) {
        next();
    }
    else {
        extractFile(req, res, next);
    }
}