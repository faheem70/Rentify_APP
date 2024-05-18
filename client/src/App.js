import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Register from './components/Register';
import Login from './components/Login';
import PropertyList from './components/PropertyList';
import PropertyForm from './components/PropertyForm';
import UpdatePropertyForm from './components/UpdatePropertyForm';

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<PropertyList />} />
          <Route path="/addproperty" element={<PropertyForm />} />
          <Route path="/updateproperty/:id" element={<UpdatePropertyForm />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
