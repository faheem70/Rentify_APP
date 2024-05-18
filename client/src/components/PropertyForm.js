import React, { useState } from 'react';
import axios from 'axios';
import './PropertyForm.css'; // Import CSS file for styling
import { useNavigate } from 'react-router-dom';

const PropertyForm = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        place: '',
        area: '',
        bedrooms: '',
        bathrooms: '',
        nearbyHospitals: '',
        nearbyColleges: ''
    });

    const { place, area, bedrooms, bathrooms, nearbyHospitals, nearbyColleges } = formData;

    const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

    const onSubmit = async e => {
        e.preventDefault();
        try {
            const config = {
                headers: {
                    'Content-Type': 'application/json'
                }
            };

            const body = JSON.stringify(formData);

            const res = await axios.post('https://rentify-app.onrender.com/api/properties', body, config);

            console.log(res.data); // Handle success response accordingly
            alert("Created Property Succesfully");
            navigate("/")
        } catch (err) {
            console.error(err.response.data); // Handle error response accordingly
        }
    };

    return (
        <div className="property-form-container">
            <h2>Add Property</h2>
            <form onSubmit={onSubmit} className="property-form">
                <div className="form-group">
                    <label>Place:</label>
                    <input
                        type="text"
                        name="place"
                        value={place}
                        onChange={onChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Area:</label>
                    <input
                        type="text"
                        name="area"
                        value={area}
                        onChange={onChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Bedrooms:</label>
                    <input
                        type="number"
                        name="bedrooms"
                        value={bedrooms}
                        onChange={onChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Bathrooms:</label>
                    <input
                        type="number"
                        name="bathrooms"
                        value={bathrooms}
                        onChange={onChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Nearby Hospitals:</label>
                    <input
                        type="text"
                        name="nearbyHospitals"
                        value={nearbyHospitals}
                        onChange={onChange}
                    />
                </div>
                <div className="form-group">
                    <label>Nearby Colleges:</label>
                    <input
                        type="text"
                        name="nearbyColleges"
                        value={nearbyColleges}
                        onChange={onChange}
                    />
                </div>
                <input type="submit" value="Submit" className="submit-button" />
            </form>
        </div>
    );
};

export default PropertyForm;
