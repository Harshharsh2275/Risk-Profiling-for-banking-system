const express = require('express');
const multer = require('multer');
const { GridFsStorage } = require('multer-gridfs-storage');
const mongoose = require('mongoose');


const {
  createIndividualKYC, getIndividualKYC, updateIndividualKYC, deleteIndividualKYC,
  createBusinessKYC, getBusinessKYC, updateBusinessKYC, deleteBusinessKYC,
  createEDD, getEDD, updateEDD, deleteEDD,
  createPeriodicUpdate, getPeriodicUpdate, updatePeriodicUpdate, deletePeriodicUpdate,
  createKYCWithImage, getAllKYC, updateKYCWithImage, deleteKYCWithImage
} = require('../controllers/kycController');
const { Photo } = require('../models/kycSchema');

const router = express.Router();

// Ensure DB connection is established
mongoose.connection.once('open', () => {
  console.log('MongoDB connection established for file storage.');
});
  
//   const upload = multer({ storage });
  
  // Routes for CRUD operations
//   router.post('/create', upload.single('file'), createKYCWithImage);     // Create with image
//   router.get('/all', getAllKYC);                                          // Get all KYCs
//   router.put('/update/:id', upload.single('file'), updateKYCWithImage);  // Update with new image
  router.delete('/delete/:userId', deleteKYCWithImage);  

/* 
  ======================
  Individual KYC Routes
  ======================
*/
router.post('/individual/:userId', createIndividualKYC);
router.get('/individual/:userId', getIndividualKYC);
router.put('/individual/:userId', updateIndividualKYC);
router.delete('/individual/:userId', deleteIndividualKYC);

/* 
  ====================
  Business KYC Routes
  ====================
*/
router.post('/business/:userId', createBusinessKYC);
router.get('/business/:userId', getBusinessKYC);
router.put('/business/:userId', updateBusinessKYC);
router.delete('/business/:userId', deleteBusinessKYC);

/* 
  ==========================
  Enhanced Due Diligence (EDD)
  ==========================
*/
router.post('/edd/:userId', createEDD);
router.get('/edd/:userId', getEDD);
router.put('/edd/:userId', updateEDD);
router.delete('/edd/:userId', deleteEDD);

/* 
  =======================
  Periodic Update Routes
  =======================
*/
router.post('/periodic-update/:userId', createPeriodicUpdate);
router.get('/periodic-update/:userId', getPeriodicUpdate);
router.put('/periodic-update/:userId', updatePeriodicUpdate);
router.delete('/periodic-update/:userId', deletePeriodicUpdate);

module.exports = router;
