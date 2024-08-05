const { Schema, model } = require('mongoose');

const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    documents: [{
        type: Schema.Types.ObjectId,
        ref: 'Document'
    }]
});

module.exports = model('User', userSchema);