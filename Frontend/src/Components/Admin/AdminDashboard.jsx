import React, { useState } from 'react';
import { Layout, LogOut, Menu, X } from 'lucide-react';
import { Link, Outlet, useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
    const [activeTab, setActiveTab] = useState('dashboard');
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const navigate = useNavigate();

    const handleLogout = () => {
        sessionStorage.removeItem('auth-token');
        navigate('/login');
    };

    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

    const closeSidebar = () => setIsSidebarOpen(false);

    const menuItems = [
        { name: 'Dashboard', path: '/admin', id: 'dashboard' },
        { name: 'Achievements', path: '/admin/achievements', id: 'achievements' },
        { name: 'Certificates', path: '/admin/certificates', id: 'certificates' },
        { name: 'Education', path: '/admin/education', id: 'education' },
        { name: 'Experience', path: '/admin/experience', id: 'experience' },
        { name: 'Messages', path: '/admin/messages', id: 'messages' },
        { name: 'Profile', path: '/admin/profile', id: 'profile' },
        { name: 'Projects', path: '/admin/projects', id: 'projects' },
        { name: 'Resume', path: '/admin/resume', id: 'resume' },
        { name: 'Skills', path: '/admin/skills', id: 'skills' },
    ];

    return (
        <div className="flex h-screen overflow-hidden bg-gray-900 text-white">
            {/* Mobile Header */}
            <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-gray-800 z-40 flex items-center justify-between px-4 border-b border-gray-700">
                <h2 className="text-xl font-bold flex items-center gap-2">
                    <Layout className="w-5 h-5" /> Admin
                </h2>
                <button onClick={toggleSidebar} className="p-2 text-gray-300 hover:text-white">
                    {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            {/* Sidebar Overlay for Mobile */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 md:hidden"
                    onClick={closeSidebar}
                />
            )}

            {/* Sidebar */}
            <div className={`
                fixed inset-y-0 left-0 z-50 w-64 bg-gray-800 p-6 flex flex-col transition-transform duration-300 ease-in-out md:translate-x-0 md:static md:inset-auto
                ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
            `}>
                <div className="flex items-center justify-between mb-8">
                    <h2 className="text-2xl font-bold flex items-center gap-2">
                        <Layout className="w-6 h-6" /> Admin Panel
                    </h2>
                    <button onClick={closeSidebar} className="md:hidden text-gray-400 hover:text-white">
                        <X size={24} />
                    </button>
                </div>

                <nav className="flex-1 space-y-2 overflow-y-auto">
                    {menuItems.map((item) => (
                        <Link
                            key={item.id}
                            to={item.path}
                            className={`block px-4 py-2 rounded transition-colors ${activeTab === item.id
                                ? 'bg-blue-600'
                                : 'hover:bg-gray-700'
                                }`}
                            onClick={() => {
                                setActiveTab(item.id);
                                closeSidebar();
                            }}
                        >
                            {item.name}
                        </Link>
                    ))}
                </nav>
                <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 text-red-500 hover:text-white hover:bg-red-500 mt-4 p-2 rounded hover:bg-gray-700/50 transition-colors"
                >
                    <LogOut size={20} /> Logout
                </button>
            </div>

            {/* Main Content */}
            <div className={`flex-1 overflow-y-auto p-4 md:p-8 pt-20 md:pt-8 transition-all duration-300`}>
                <div className="max-w-7xl mx-auto">
                    <Outlet />
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
