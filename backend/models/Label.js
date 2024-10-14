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
    }
}, {timestamps: true});

const LabelModel = mongoose.model('labels', LabelSchema);

module.exports = LabelModel;
