const mongoose = require('mongoose');

const LabelSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    design: {
        type: String,
        required: true
    },
    textList: { type: [String], default: [] },
    imageFiles: { type: [String], default: [] },
    audioFiles: { type: [String], default: [] },
    qrcode: {
        type: String
    },
    user_id: {
        type: String,
        required: true
    },
    totalFileSize: { // Field to store file size
        type: Number, // Size in bytes
        required: true
    },
    isPrivate: {
        type: Boolean,
        default: false
    },
    pin: {
        type: String,
        default: null
    }
}, {timestamps: true});

const LabelModel = mongoose.model('labels', LabelSchema);

module.exports = LabelModel;
