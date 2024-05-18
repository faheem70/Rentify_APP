import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import './Register.css'; // Import CSS file for styling

const Register = () => {
    const { register } = useContext(AuthContext);
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        password: '',
        isSeller: false,
    });

    const { firstName, lastName, email, phone, password, isSeller } = formData;

    const onChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const onSubmit = async (e) => {
        e.preventDefault();
        await register(formData);
        navigate('/');
    };

    return (
        <form className="register-form" onSubmit={onSubmit}>
            <input type="text" name="firstName" value={firstName} onChange={onChange} placeholder="First Name" required />
            <input type="text" name="lastName" value={lastName} onChange={onChange} placeholder="Last Name" required />
            <input type="email" name="email" value={email} onChange={onChange} placeholder="Email" required />
            <input type="text" name="phone" value={phone} onChange={onChange} placeholder="Phone" required />
            <input type="password" name="password" value={password} onChange={onChange} placeholder="Password" required />
            <label>
                <input type="checkbox" name="isSeller" checked={isSeller} onChange={() => setFormData({ ...formData, isSeller: !isSeller })} />
                Are you a seller?
            </label>
            <button type="submit">Register</button>
        </form>
    );
};

export default Register;
