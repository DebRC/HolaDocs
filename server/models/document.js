const { Schema, model } = require('mongoose');

const documentSchema = new Schema({
    title: String,
    data: Object
});

module.exports = model('Document', documentSchema);