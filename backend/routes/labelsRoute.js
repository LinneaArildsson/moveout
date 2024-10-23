const express = require('express');
const {
    getLabels,
    getLabel,
    createLabel,
    deleteLabel,
    updateLabel,
    multipleUpload,
    verifyPin
} = require('../controllers/labelController');
const requireAuth = require('../middleware/requireAuth');

const router = express.Router();

// Public route: GET a single label (for QR code scanning)
router.get('/:id', getLabel);

router.post('/verify-pin', verifyPin);

// Routes that require authentication
router.use(requireAuth);

// Protected routes
// GET all labels (only for the logged-in user)
router.get('/', getLabels);

// POST a new label
router.post('/', multipleUpload, createLabel);

// DELETE a label
router.delete('/:id', deleteLabel);

// UPDATE a label
router.patch('/:id', multipleUpload, updateLabel);

module.exports = router;
