const router = require('express').Router();
const User = require('./../models/user');
const authMiddleware = require('./../middlewares/authMiddleware');
const message = require('../models/message');
const cloudinary = require('./../cloudinary');
const user = require('./../models/user');

// GET DETAILS OF CURRENT LOGGED-IN USER
router.get('/get-logged-user', authMiddleware, async (req, res) => {
   try {
       const user = await User.findOne({ _id: req.userId });
       res.send({
           message: 'user fetched successfully',
           success: true,
           data: user
       });
   } catch (error) {
       res.status(400).send({
           message: error.message,
           success: false
       });
   }
});

router.get('/get-all-users', authMiddleware, async (req, res) => {
   try {
       const allUsers = await User.find({ _id: { $ne: req.userId } });
       res.send({
           message: 'All users fetched successfully',
           success: true,
           data: allUsers
       });
   } catch (error) {
       res.status(400).send({
           message: error.message,
           success: false
       });
   }
});


router.post('/upload-profile-pic', authMiddleware, async (req, res) => {
    try {
        const { image, userId } = req.body;

        if (!image || !userId) {
            return res.status(400).send({
                success: false,
                message: "Missing image or userId"
            });
        }

        // Cloudinary upload
        const uploadedImage = await cloudinary.uploader.upload(image, {
            folder: 'liveTalker'
        });

        const user = await User.findByIdAndUpdate(
            userId,
            { profilePic: uploadedImage.secure_url },
            { new: true }
        );

        res.send({
            message: 'Profile picture uploaded successfully',
            success: true,
            data: user
        });

    } catch (error) {
        console.error("Cloudinary Upload Error:", error);
        res.status(500).send({
            message: error.message || 'Upload failed',
            success: false
        });
    }
});




module.exports = router;
