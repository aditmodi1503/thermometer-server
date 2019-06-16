import { Thermometer } from './model';

export const postReadings = (req, res) => {
    Thermometer.find({ fileName: req.body.name }, (err, docs) => {
        if (err) console.log(err);
        if (docs.length != 0) {
            docs[0].reading = req.body.data;
            docs[0].fileName = req.body.name;
            docs[0].UpdatedOn = new Date();
            docs[0].save((err, response) => {
                if (err) console.log(err);
                if (response) res.send({message: 'Data updated', statusCode: 200});
            })
        }
        else {
            Thermometer.create({
                reading: req.body.data,
                fileName: req.body.name,
                IsActive: true,
                CreatedOn: new Date(),
            }, (err, obj) => {
                if (err) return handleError(err);
                    res.send({message: 'Data saved', statusCode: 200});
            })
        }
    })
}

export const getReadings = (req, res) => {
    Thermometer.find({ fileName: req.params.fileName }, (err, obj) => {
        if (err) return handleError(err)
        res.send(obj);
    })
}