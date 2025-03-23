const mongoose = require('mongoose');
const { IndividualKYC, BusinessKYC, EDD, PeriodicUpdate, Photo } = require('../models/kycSchema');
const multer = require('multer');
//-------------------------------------------------------------------------------------------
// Individual KYC CRUD Operations

// Create Individual KYC
const createIndividualKYC = async (req, res) => {
  try {
    const { userId } = req.params;  // Extract userId from route
    const kyc = new IndividualKYC({ ...req.body, userId });
    await kyc.save();
    res.status(201).json({ message: 'Individual KYC created successfully', data: kyc });
  } catch (error) {
    res.status(400).json({ message: 'Error creating Individual KYC', error });
  }
};

// Read Individual KYC by userId
const getIndividualKYC = async (req, res) => {
  try {
    const { userId } = req.params;
    const kyc = await IndividualKYC.findOne({ userId });
    if (!kyc) return res.status(404).json({ message: 'KYC record not found' });
    res.status(200).json(kyc);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching Individual KYC', error });
  }
};

// Update Individual KYC
const updateIndividualKYC = async (req, res) => {
  try {
    const { userId } = req.params;
    const kyc = await IndividualKYC.findOneAndUpdate({ userId }, req.body, { new: true });
    if (!kyc) return res.status(404).json({ message: 'KYC record not found' });
    res.status(200).json({ message: 'Individual KYC updated successfully', data: kyc });
  } catch (error) {
    res.status(400).json({ message: 'Error updating Individual KYC', error });
  }
};

// Delete Individual KYC
const deleteIndividualKYC = async (req, res) => {
  try {
    const { userId } = req.params;
    const kyc = await IndividualKYC.findOneAndDelete({ userId });
    if (!kyc) return res.status(404).json({ message: 'KYC record not found' });
    res.status(200).json({ message: 'Individual KYC deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting Individual KYC', error });
  }
};

//----------------------------------------------------------------------------------------------------

// Business KYC CRUD Operations

const createBusinessKYC = async (req, res) => {
  try {
    const { userId } = req.params;
    const kyc = new BusinessKYC({ ...req.body, userId });
    await kyc.save();
    res.status(201).json({ message: 'Business KYC created successfully', data: kyc });
  } catch (error) {
    res.status(400).json({ message: 'Error creating Business KYC', error });
  }
};

const getBusinessKYC = async (req, res) => {
  try {
    const kyc = await BusinessKYC.findOne({ userId: req.params.userId });
    if (!kyc) return res.status(404).json({ message: 'Business KYC record not found' });
    res.status(200).json(kyc);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching Business KYC', error });
  }
};

const updateBusinessKYC = async (req, res) => {
  try {
    const kyc = await BusinessKYC.findOneAndUpdate({ userId: req.params.userId }, req.body, { new: true });
    if (!kyc) return res.status(404).json({ message: 'Business KYC record not found' });
    res.status(200).json({ message: 'Business KYC updated successfully', data: kyc });
  } catch (error) {
    res.status(400).json({ message: 'Error updating Business KYC', error });
  }
};

const deleteBusinessKYC = async (req, res) => {
  try {
    const kyc = await BusinessKYC.findOneAndDelete({ userId: req.params.userId });
    if (!kyc) return res.status(404).json({ message: 'Business KYC record not found' });
    res.status(200).json({ message: 'Business KYC deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting Business KYC', error });
  }
};

//-------------------------------------------------------------------------------------------------------
// Enhanced Due Diligence (EDD) CRUD Operations

const createEDD = async (req, res) => {
  try {
    const { userId } = req.params;
    const edd = new EDD({ ...req.body, userId });
    await edd.save();
    res.status(201).json({ message: 'EDD record created successfully', data: edd });
  } catch (error) {
    res.status(400).json({ message: 'Error creating EDD record', error });
  }
};

// Get EDD by userId
const getEDD = async (req, res) => {
  try {
    const edd = await EDD.findOne({ userId: req.params.userId });
    if (!edd) return res.status(404).json({ message: 'EDD record not found' });
    res.status(200).json(edd);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching EDD record', error });
  }
};

// Update EDD by userId
const updateEDD = async (req, res) => {
  try {
    const edd = await EDD.findOneAndUpdate({ userId: req.params.userId }, req.body, { new: true });
    if (!edd) return res.status(404).json({ message: 'EDD record not found' });
    res.status(200).json({ message: 'EDD updated successfully', data: edd });
  } catch (error) {
    res.status(400).json({ message: 'Error updating EDD record', error });
  }
};

// Delete EDD by userId
const deleteEDD = async (req, res) => {
  try {
    const edd = await EDD.findOneAndDelete({ userId: req.params.userId });
    if (!edd) return res.status(404).json({ message: 'EDD record not found' });
    res.status(200).json({ message: 'EDD deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting EDD record', error });
  }
};


//---------------------------------------------------------------------------------------------------------

// Periodic Update CRUD Operations

const createPeriodicUpdate = async (req, res) => {
  try {
    const { userId } = req.params;
    const update = new PeriodicUpdate({ ...req.body, userId });
    await update.save();
    res.status(201).json({ message: 'Periodic update created successfully', data: update });
  } catch (error) {
    res.status(400).json({ message: 'Error creating periodic update', error });
  }
};

// Get Periodic Update by userId
const getPeriodicUpdate = async (req, res) => {
  try {
    const update = await PeriodicUpdate.findOne({ userId: req.params.userId });
    if (!update) return res.status(404).json({ message: 'Periodic update record not found' });
    res.status(200).json(update);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching periodic update', error });
  }
};

// Update Periodic Update by userId
const updatePeriodicUpdate = async (req, res) => {
  try {
    const update = await PeriodicUpdate.findOneAndUpdate({ userId: req.params.userId }, req.body, { new: true });
    if (!update) return res.status(404).json({ message: 'Periodic update record not found' });
    res.status(200).json({ message: 'Periodic update updated successfully', data: update });
  } catch (error) {
    res.status(400).json({ message: 'Error updating periodic update', error });
  }
};

// Delete Periodic Update by userId
const deletePeriodicUpdate = async (req, res) => {
  try {
    const update = await PeriodicUpdate.findOneAndDelete({ userId: req.params.userId });
    if (!update) return res.status(404).json({ message: 'Periodic update record not found' });
    res.status(200).json({ message: 'Periodic update deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting periodic update', error });
  }
};

//--------------------------------------------------------------------------------------------------
//image CRUD
// Create a new KYC record with an image
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');  // Save to 'uploads' directory
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);  // Unique filename with timestamp
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // Limit file size to 5 MB
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'image/jpeg') {
      cb(null, true);
    } else {
      cb(new Error('Only JPEG files are allowed'), false);
    }
  }
});

// Create a new KYC record with an image linked to a user
const createKYCWithImage = async (req, res) => {
  try {
    const { userId } = req.params;  // Extract userId from route
    let photoId = null;

    // If image file exists, save it
    if (req.file) {
      const newPhoto = new Photo({
        filename: req.file.filename,
        path: req.file.path
      });
      const savedPhoto = await newPhoto.save();
      photoId = savedPhoto._id;
    }

    // Create a new KYC record linked to the userId
    const kyc = new IndividualKYC({
      ...req.body,
      userId,
      photo: photoId
    });

    await kyc.save();
    res.status(201).json({ message: 'KYC created successfully with an image', data: kyc });
  } catch (error) {
    res.status(400).json({ message: 'Error creating KYC with an image', error });
  }
};

// Get all KYC records with images for a specific user
const getAllKYC = async (req, res) => {
  try {
    const { userId } = req.params;
    const kycRecords = await IndividualKYC.find({ userId }).populate('photo');
    res.json(kycRecords);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving KYC records', error });
  }
};

// Update a KYC record and its image linked to a user
const updateKYCWithImage = async (req, res) => {
  try {
    const { userId } = req.params;
    const kycRecord = await IndividualKYC.findOne({ userId });

    if (!kycRecord) {
      return res.status(404).json({ message: 'KYC record not found' });
    }

    // If a new image is uploaded, replace the old one
    if (req.file) {
      if (kycRecord.photo) {
        await Photo.findByIdAndDelete(kycRecord.photo);  // Delete old image
      }

      const newPhoto = new Photo({
        filename: req.file.filename,
        contentType: req.file.mimetype,
        path: req.file.path
      });
      const savedPhoto = await newPhoto.save();
      kycRecord.photo = savedPhoto._id;
    }

    // Update other KYC fields
    Object.assign(kycRecord, req.body);
    await kycRecord.save();

    res.json({ message: 'KYC updated successfully', data: kycRecord });
  } catch (error) {
    console.error('Error updating KYC:', error);
    res.status(400).json({ message: 'Error updating KYC', error });
  }
};

// Delete a KYC record and its image for a specific user
const deleteKYCWithImage = async (req, res) => {
  try {
    const { userId } = req.params;
    const kycRecord = await IndividualKYC.findOne({ userId });

    if (!kycRecord) {
      return res.status(404).json({ message: 'KYC record not found' });
    }

    // Delete associated image if it exists
    if (kycRecord.photo) {
      await Photo.findByIdAndDelete(kycRecord.photo);
    }

    // Delete the KYC record
    await IndividualKYC.findOneAndDelete({ userId });

    res.json({ message: 'KYC and associated image deleted successfully' });
  } catch (error) {
    console.error('Error deleting KYC:', error);
    res.status(400).json({ message: 'Error deleting KYC', error });
  }
};


module.exports = {
  createIndividualKYC, getIndividualKYC, updateIndividualKYC, deleteIndividualKYC,
  createBusinessKYC, getBusinessKYC, updateBusinessKYC, deleteBusinessKYC,
  createEDD, getEDD, updateEDD, deleteEDD,
  createPeriodicUpdate, getPeriodicUpdate, updatePeriodicUpdate, deletePeriodicUpdate,
  createKYCWithImage,getAllKYC,updateKYCWithImage,deleteKYCWithImage
};
