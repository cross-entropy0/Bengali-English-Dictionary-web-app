const mongoose = require('mongoose');

const engSchema = new mongoose.Schema({
    serial: { type: Number, required: true, index: true },
    word: { type: String, required: true, index: true }
}, { collection: 'eng' });

const otenSchema = new mongoose.Schema({
    serial: { type: Number, required: true, index: true },
    ot: { type: String, required: true, index: true },
    en: { type: Buffer }
}, { collection: 'oten' });

const otherSchema = new mongoose.Schema({
    serial: { type: Number, required: true, index: true },
    word: { type: String, required: true, index: true },
    ed: { type: Buffer },
    tr: { type: String },
    ant: { type: String },
    def: { type: String },
    exm: { type: String }
}, { collection: 'other' });

const otherWordsSchema = new mongoose.Schema({
    word: { type: String, required: true, index: true }
}, { collection: 'other_words' });

const Eng = mongoose.model('Eng', engSchema);
const Oten = mongoose.model('Oten', otenSchema);
const Other = mongoose.model('Other', otherSchema);
const OtherWords = mongoose.model('OtherWords', otherWordsSchema);

module.exports = { Eng, Oten, Other, OtherWords };
