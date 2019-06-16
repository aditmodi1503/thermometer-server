import mongoose from 'mongoose';

let ThermometerSchema = new mongoose.Schema({
    reading: [
        {
            ts: Number,
            val: Number
        }
    ],
    fileName: String,
    IsActive: Boolean,
    CreatedOn: {
        type: Date,
        default: new Date()
    },
    UpdatedOn: {
        type: Date,
        default: null
    }
});

export const Thermometer = mongoose.model('Thermometer', ThermometerSchema);