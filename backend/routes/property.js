const express = require('express');
const auth = require('../middlewares/auth');
const Property = require('../models/Property');
const User = require('../models/User');
const { use } = require('./user');
const router = express.Router();

// Post a new property
router.post('/', auth, async (req, res) => {
    const { place, area, bedrooms, bathrooms, nearbyHospitals, nearbyColleges } = req.body;

    try {
        const property = new Property({
            seller: req.user.id,
            place,
            area,
            bedrooms,
            bathrooms,
            nearbyHospitals,
            nearbyColleges,
        });

        await property.save();
        res.json(property);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Get properties for a seller
router.get('/my-properties', auth, async (req, res) => {
    try {
        const properties = await Property.find({ seller: req.user.id });
        res.json(properties);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Get all properties
router.get('/', async (req, res) => {
    try {
        const properties = await Property.find().populate('seller', 'firstName lastName email phone');
        res.json(properties);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});
router.get('/:id', async (req, res) => {
    try {
        const property = await Property.findById(req.params.id);

        if (!property) {
            return res.status(404).json({ msg: 'Property not found' });
        }

        res.json(property);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// Update a property
router.put('/:id', auth, async (req, res) => {
    const { place, area, bedrooms, bathrooms, nearbyHospitals, nearbyColleges } = req.body;

    try {
        let property = await Property.findById(req.params.id);

        if (!property) return res.status(404).json({ msg: 'Property not found' });

        // Make sure user owns the property

        property = await Property.findByIdAndUpdate(
            req.params.id,
            { $set: { place, area, bedrooms, bathrooms, nearbyHospitals, nearbyColleges } },
            { new: true }
        );

        res.json(property);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});


// Delete a property
router.delete('/:id', auth, async (req, res) => {
    try {
        let property = await Property.findById(req.params.id);

        if (!property) {
            return res.status(404).json({ msg: 'Property not found' });
        }

        // Check if the user owns the property


        await Property.findByIdAndDelete(req.params.id);

        res.json({ msg: 'Property removed' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});




// Like a property
router.put('/like/:id', auth, async (req, res) => {
    try {
        let property = await Property.findById(req.params.id);
        if (!property) return res.status(404).json({ msg: 'Property not found' });

        property.likes += 1;
        await property.save();

        res.json(property);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Express interest in a property
router.post('/interest/:id', auth, async (req, res) => {
    try {
        let property = await Property.findById(req.params.id).populate('seller', 'firstName lastName email phone');
        if (!property) return res.status(404).json({ msg: 'Property not found' });

        const seller = await User.findById(property.seller._id);
        const buyer = await User.findById(req.user.id);

        // Send email to seller
        const nodemailer = require('nodemailer');
        let transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        let mailOptions = {
            from: process.env.EMAIL_USER,
            to: seller.email,
            subject: 'Interest in your property',
            text: `Hello ${seller.firstName},\n\n${buyer.firstName} ${buyer.lastName} is interested in your property.\n\nContact details:\nEmail: ${buyer.email}\nPhone: ${buyer.phone}\n\nBest regards,\nReal Estate App Team`,
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                return res.status(500).send('Server error');
            }
            res.json({ msg: 'Interest expressed and email sent' });
        });

        // Send email to buyer
        mailOptions = {
            from: process.env.EMAIL_USER,
            to: buyer.email,
            subject: 'Contact details of the seller',
            text: `Hello ${buyer.firstName},\n\nYou expressed interest in the property posted by ${seller.firstName} ${seller.lastName}.\n\nContact details:\nEmail: ${seller.email}\nPhone: ${seller.phone}\n\nBest regards,\nReal Estate App Team`,
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                return res.status(500).send('Server error');
            }
        });

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

module.exports = router;
