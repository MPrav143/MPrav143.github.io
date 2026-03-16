import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api';


const Login = () => {
    const [credentials, setCredentials] = useState({ username: '', password: '' });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        // Clear session on mount to ensure "always remove login credentials"
        sessionStorage.removeItem('auth-token');
        localStorage.removeItem('auth-token'); // Clear legacy if exists
    }, []);

    const handleChange = (e) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await api.post('/auth/login', credentials);
            console.log("Login success. Token received:", res.data.token);
            sessionStorage.setItem('auth-token', res.data.token);
            navigate('/admin');
        } catch (err) {
            setError('Invalid Username or Password');
        }
    };

    return (
        <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
            <div className="bg-gray-800 p-6 md:p-8 rounded-2xl shadow-2xl w-full max-w-sm md:max-w-md border border-gray-700">
                <h2 className="text-2xl md:text-3xl font-bold text-white mb-6 text-center">Admin Access</h2>
                {error && <p className="text-red-500 text-center mb-4">{error}</p>}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="text-gray-400 text-sm mb-2 block">Username</label>
                        <input
                            type="text" name="username"
                            className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-cyan-500 outline-none"
                            onChange={handleChange}
                        />
                    </div>
                    <div>
                        <label className="text-gray-400 text-sm mb-2 block">Password</label>
                        <input
                            type="password" name="password"
                            className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-cyan-500 outline-none"
                            onChange={handleChange}
                        />
                    </div>
                    <button type="submit" className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-3 rounded-lg transition-colors">
                        Login
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Login;
