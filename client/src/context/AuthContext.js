import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            axios.defaults.headers.common['x-auth-token'] = token;
            axios.get('http://localhost:5000/api/users/me')
                .then(res => setUser(res.data))
                .catch(err => {
                    console.error(err);
                    localStorage.removeItem('token');
                })
                .finally(() => setLoading(false));
        } else {
            setLoading(false);
        }
    }, []);

    const login = async (email, password) => {
        const res = await axios.post('http://localhost:5000/api/users/login', { email, password });
        localStorage.setItem('token', res.data.token);
        axios.defaults.headers.common['x-auth-token'] = res.data.token;
        const userRes = await axios.get('http://localhost:5000/api/users/me');
        setUser(userRes.data);
    };

    const register = async (userData) => {
        const res = await axios.post('http://localhost:5000/api/users/register', userData);
        localStorage.setItem('token', res.data.token);
        axios.defaults.headers.common['x-auth-token'] = res.data.token;
        const userRes = await axios.get('http://localhost:5000/api/users/me');
        setUser(userRes.data);
    };

    const logout = () => {
        localStorage.removeItem('token');
        delete axios.defaults.headers.common['x-auth-token'];
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, register, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export { AuthProvider, AuthContext };
