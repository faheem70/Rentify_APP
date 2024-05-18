import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import './PropertyList.css';

const PropertyList = () => {
    const [properties, setProperties] = useState([]);
    const [filter, setFilter] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [propertiesPerPage] = useState(3);
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProperties = async () => {
            const res = await axios.get('https://rentify-app.onrender.com/api/properties');
            setProperties(res.data);
        };
        fetchProperties();
    }, []);

    const handleLike = async (id) => {
        if (!user) {
            alert('You need to login to like properties.');
            return;
        }
        await axios.put(`https://rentify-app.onrender.com/api/properties/like/${id}`);
        const res = await axios.get('https://rentify-app.onrender.com/api/properties');
        setProperties(res.data);
    };

    const handleInterest = async (id) => {
        try {
            if (!user) {
                alert('You need to login to show interest in properties.');
                navigate('/login');
                return;
            }
            await axios.post(`https://rentify-app.onrender.com/api/properties/interest/${id}`);
        } catch (error) {
            alert('An error occurred while showing interest in the property.');
            console.error('Error:', error);
        }
    };


    const handleAddProperty = () => {
        navigate('/addproperty');
    };

    const handleUpdateProperty = (id) => {
        navigate(`/updateproperty/${id}`);
    };
    const handleDeleteProperty = async (id) => {
        if (window.confirm('Are you sure you want to delete this property?')) {
            try {
                await axios.delete(`https://rentify-app.onrender.com/api/properties/${id}`);
                const updatedProperties = properties.filter(property => property._id !== id);
                setProperties(updatedProperties);
                alert('Property deleted successfully!');
            } catch (error) {
                console.error('Error deleting property:', error);
                alert('An error occurred while deleting the property. Please try again later.');
            }
        }
    };

    const filteredProperties = properties.filter(property => property.place.toLowerCase().includes(filter.toLowerCase()));

    const indexOfLastProperty = currentPage * propertiesPerPage;
    const indexOfFirstProperty = indexOfLastProperty - propertiesPerPage;
    const currentProperties = filteredProperties.slice(indexOfFirstProperty, indexOfLastProperty);

    const paginate = pageNumber => setCurrentPage(pageNumber);

    return (
        <div className="property-list-container">
            <header>
                {user ? (
                    <div className="user-info">
                        <h2>Welcome, {user.firstName} {user.lastName}</h2>
                        <button className="login-button" onClick={logout}>Logout</button>
                        <span className="button-divider"></span>
                        {user.isSeller && <button className="login-button" onClick={handleAddProperty}>Add Property</button>}
                    </div>
                ) : (
                    <div className="auth-buttons">
                            <a className="login-button" href='/#login'>Login</a>
                        <span className="button-divider"></span>
                            <a className="register-button" href="/#register">Register</a>
                    </div>
                )}
            </header>
            <div>
                <div className="search-bar">
                    <input type="text" value={filter} onChange={(e) => setFilter(e.target.value)} placeholder="Search by place" />
                </div>
                <div className="property-list">
                    {currentProperties.map(property => (
                        <div key={property._id} className="property-card">
                            <h2>{property.place}</h2>
                            <p>Area: {property.area}</p>
                            <p>Bedrooms: {property.bedrooms}</p>
                            <p>Bathrooms: {property.bathrooms}</p>
                            <p>Hospitals: {property.nearbyHospitals}</p>
                            <p>Colleges: {property.nearbyColleges}</p>
                            <button onClick={() => handleLike(property._id)}>Like ({property.likes})</button>
                            <span className="button-divider"></span>
                            <button onClick={() => handleInterest(property._id)}>I'm Interested</button>
                            {user && user.isSeller && (
                                <div className="seller-buttons">
                                    <br></br>
                                    <button onClick={() => handleUpdateProperty(property._id)}>Update</button>
                                    <span className="button-divider"></span>
                                    <button onClick={() => handleDeleteProperty(property._id)}>Delete</button>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
                <Pagination propertiesPerPage={propertiesPerPage} totalProperties={filteredProperties.length} paginate={paginate} />
            </div>
        </div>
    );
};

const Pagination = ({ propertiesPerPage, totalProperties, paginate }) => {
    const pageNumbers = [];

    for (let i = 1; i <= Math.ceil(totalProperties / propertiesPerPage); i++) {
        pageNumbers.push(i);
    }

    return (
        <nav>
            <ul className='pagination'>
                {pageNumbers.map(number => (
                    <li key={number} className='page-item'>
                        <a onClick={() => paginate(number)} className='page-link'>
                            {number}
                        </a>
                    </li>
                ))}
            </ul>
        </nav>
    );
};

export default PropertyList;
