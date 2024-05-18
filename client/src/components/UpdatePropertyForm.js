import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import './UpdatePropertyForm.css';

const UpdatePropertyForm = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        place: '',
        area: '',
        bedrooms: '',
        bathrooms: '',
        nearbyHospitals: '',
        nearbyColleges: ''
    });
    const { id } = useParams();

    useEffect(() => {
        const fetchProperty = async () => {
            try {
                const res = await axios.get(`http://localhost:5000/api/properties/${id}`);
                const propertyData = res.data;
                setFormData({
                    place: propertyData.place,
                    area: propertyData.area,
                    bedrooms: propertyData.bedrooms,
                    bathrooms: propertyData.bathrooms,
                    nearbyHospitals: propertyData.nearbyHospitals,
                    nearbyColleges: propertyData.nearbyColleges
                });

            } catch (err) {
                console.error(err);
            }
        };
        fetchProperty();
    }, [id]);

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

            await axios.put(`http://localhost:5000/api/properties/${id}`, body, config);

            // Redirect or display a success message as needed
            alert("Updated Successully")
            navigate("/")
        } catch (err) {
            console.error(err.response.data); // Handle error response accordingly
        }
    };

    return (
        <div className="update-property-form-container">
            <h2>Update Property</h2>
            <form onSubmit={onSubmit}>
                <div>
                    <label>Place:</label>
                    <input
                        type="text"
                        name="place"
                        value={place}
                        onChange={onChange}
                        required
                    />
                </div>
                <div>
                    <label>Area:</label>
                    <input
                        type="text"
                        name="area"
                        value={area}
                        onChange={onChange}
                        required
                    />
                </div>
                <div>
                    <label>Bedrooms:</label>
                    <input
                        type="number"
                        name="bedrooms"
                        value={bedrooms}
                        onChange={onChange}
                        required
                    />
                </div>
                <div>
                    <label>Bathrooms:</label>
                    <input
                        type="number"
                        name="bathrooms"
                        value={bathrooms}
                        onChange={onChange}
                        required
                    />
                </div>
                <div>
                    <label>Nearby Hospitals:</label>
                    <input
                        type="text"
                        name="nearbyHospitals"
                        value={nearbyHospitals}
                        onChange={onChange}
                    />
                </div>
                <div>
                    <label>Nearby Colleges:</label>
                    <input
                        type="text"
                        name="nearbyColleges"
                        value={nearbyColleges}
                        onChange={onChange}
                    />
                </div>
                <input type="submit" value="Update" />
            </form>
        </div>
    );
};

export default UpdatePropertyForm;
