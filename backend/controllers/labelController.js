const LabelModel = require('../models/Label');
const mongoose = require('mongoose');
const qrcode = require('qrcode');

// Configure multer to handle multiple file uploads
const multer = require('multer');
const path = require('path');

// Set storage engine
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});

// Check file type
function checkFileType(file, cb) {
    const filetypes = /jpeg|jpg|png|gif|mp3|wav/; // Allowed file extensions
    const allowedMimeTypes = /image\/(jpeg|jpg|png|gif)|audio\/(mpeg|wav)/; // Allowed MIME types
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedMimeTypes.test(file.mimetype);

    console.log(`Uploaded file: ${file.originalname}`);
    console.log(`MIME Type: ${file.mimetype}, Extname: ${path.extname(file.originalname)}`);
    console.log(`Extname Match: ${extname}, Mimetype Match: ${mimetype}`);

    if (mimetype && extname) {
        return cb(null, true);
    } else {
        cb('Error: Images and Audio only!');
    }
}

// Initialize upload
const upload = multer({
    storage: storage,
    limits: { fileSize: 10000000 }, // Limit file size to 10MB
    fileFilter: function (req, file, cb) {
        checkFileType(file, cb);
    }
});

// Upload multiple files for both image and audio
const multipleUpload = upload.fields([{ name: 'imageFiles', maxCount: 5 }, { name: 'audioFiles', maxCount: 5 }]);


//Get all labels
const getLabels = async (req, res) => {
    console.log(req.user);
    const user_id = req.user._id;

    const labels = await LabelModel.find({user_id}).sort({createdAt: -1})

    res.status(200).json(labels)
}

//Get a single label
const getLabel = async (req, res) => {
    const{id} = req.params._id;

    if(!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({error: 'No such label'})
    }

    const label = await LabelModel.findById(id)

    if(!label) {
        return res.status(404).json({error: 'No such label'})
    }

    res.status(200).json(label)
}

//Create new label
const createLabel = async (req, res) => {
    const {title, design, contentType, textList } = req.body

    if (!req.user) {
        return res.status(401).json({ error: 'You must be logged in' });
    }

    let emptyFields = [];

    if (!contentType) {
        emptyFields.push('contentType');
    }

    // Initialize content variables
    let imageFiles = [];
    let audioFiles = [];
    let textContent = [];

    // Handle file uploads (multiple audio or image files)
    if (req.files) {
        if (req.files.imageFiles) {
            imageFiles = req.files.imageFiles.map(file => file.path); // Store image file paths
        }
        if (req.files.audioFiles) {
            audioFiles = req.files.audioFiles.map(file => file.path); // Store audio file paths
        }
    }

    // Handle text list if provided
    if (contentType === 'text') {
        textContent = textList ? textList.split(',').map(item => item.trim()) : []; // Split and trim each item
    }

    // Validate empty fields after handling file uploads
    if (contentType === 'text' && !textList) {
        emptyFields.push('textList');
    } 
    if (contentType === 'image' && imageFiles.length === 0) {
        emptyFields.push('imageFiles');
    } 
    if (contentType === 'audio' && audioFiles.length === 0) {
        emptyFields.push('audioFiles');
    }
    
    if (emptyFields.length > 0) {
        return res.status(400).json({ error: 'Please fill in all fields', emptyFields });
    }

    //Add to the database
    try{
        const user_id = req.user._id;
        
        const label = await LabelModel.create({
            title,
            design,
            textList: textContent,
            imageFiles,
            audioFiles,
            user_id
        });

        const qrurl = `https://moveoutapp.onrender.com/labels/${label._id}`;


        const qrcodedataurl = await qrcode.toDataURL(qrurl);

        label.qrcode = qrcodedataurl;
        await label.save();
        
        res.status(200).json(label)
    } catch (error) {
        res.status(400).json({error: error.message})
    }
}

//Delete a label
const deleteLabel = async (req, res) => {
    const {id} = req.params

    if(!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({error: 'No such label'})
    }

    const label = await LabelModel.findOneAndDelete({_id: id})

    if (!label) {
        return res.status(400).json({error: 'No such label'})
    }

    res.status(200).json(label)
}

//Update a label
const updateLabel = async (req, res) => {
    const {id} = req.params

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({error: 'No such label'})
    }

    const label = await LabelModel.findOneAndUpdate({_id: id}, {
        ...req.body
    })

    if (!label) {
        return res.status(400).json({error: 'No such label'})
    }

    res.status(200).json(label)
}

module.exports = {
    getLabels,
    getLabel,
    createLabel,
    deleteLabel,
    updateLabel,
    multipleUpload // Import multer multiple upload middleware
}