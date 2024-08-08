const { Schema, model } = require('mongoose');

const documentSchema = new Schema({
    title: String,
    data: Object,
    shared: Boolean,
});

module.exports = model('Document', documentSchema);