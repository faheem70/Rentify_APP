const mongoose = require('mongoose');

const PropertySchema = new mongoose.Schema({
    seller: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    place: String,
    area: Number,
    bedrooms: Number,
    bathrooms: Number,
    nearbyHospitals: String,
    nearbyColleges: String,
    likes: { type: Number, default: 0 },
});

module.exports = mongoose.model('Property', PropertySchema);
