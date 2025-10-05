const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('./../models/user');

// USER SIGNUP API
router.post('/signup', async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email });

        if (user) {
            return res.send({
                message: 'User already exists.',
                success: false
            });
        }

        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        req.body.password = hashedPassword;

        const newUser = new User(req.body);
        await newUser.save();

        res.send({
            message: 'User created successfully!',
            success: true
        });
    } catch (error) {
        res.send({
            message: error.message,
            success: false
        });
    }
});

// USER LOGIN API
router.post('/login', async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email }).select('+password');
        
        if (!user) {
            return res.send({
                message: 'User does not exist.',
                success: false
            });
        }

        const isValid = await bcrypt.compare(req.body.password, user.password);

        if (!isValid) {
            return res.send({
                message: 'Invalid password.',
                success: false
            });
        }

        const token = jwt.sign({ userId: user._id }, process.env.SECRET_KEY, { expiresIn: '2d' });

        res.send({
            message: 'User logged in successfully.',
            success: true,
            token
        });
    } catch (error) {
        res.send({
            message: error.message,
            success: false
        });
    }
});

module.exports = router;
