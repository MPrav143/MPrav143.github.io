import React, { useState, useEffect } from 'react';
import { Trash2, Plus, Save, Loader, Globe, ExternalLink } from 'lucide-react';
import api from '../../api';

const ManageContactDetail = () => {
    const [linksList, setLinksList] = useState([]);
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({ platform: '', url: '', icon: '' });
    const [mainContact, setMainContact] = useState({ email: '', phone: '' });
    const [isEditing, setIsEditing] = useState(null);
    const [saving, setSaving] = useState(false);
    const [savingMain, setSavingMain] = useState(false);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [linksRes, aboutRes] = await Promise.all([
                api.get('/sociallinks'),
                api.get('/about')
            ]);
            setLinksList(linksRes.data);
            if (aboutRes.data && aboutRes.data.length > 0) {
                const prof = aboutRes.data[0];
                setProfile(prof);
                setMainContact({ email: prof.email || '', phone: prof.phone || '' });
            }
        } catch (err) {
            console.error("Error fetching contact details:", err);
        } finally {
            setLoading(false);
        }
    };

    const fetchLinks = async () => {
         try {
             const res = await api.get('/sociallinks');
             setLinksList(res.data);
         } catch (err) { console.error(err); }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            if (isEditing) {
                await api.put(`/sociallinks/${isEditing}`, formData);
            } else {
                await api.post('/sociallinks', formData);
            }
            fetchLinks();
            resetForm();
        } catch (err) {
            console.error("Error saving social link:", err);
            alert("Failed to save social link.");
        } finally {
            setSaving(false);
        }
    };

    const handleMainContactSubmit = async (e) => {
        e.preventDefault();
        setSavingMain(true);
        try {
            await api.put(`/about/${profile._id}`, mainContact);
            alert("Main contact updated successfully!");
        } catch (err) {
            console.error(err);
            alert("Failed to update main contact.");
        } finally {
            setSavingMain(false);
        }
    };

    const handleEdit = (link) => {
        setIsEditing(link._id);
        setFormData({
            platform: link.platform,
            url: link.url,
            icon: link.icon || ''
        });
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this social link?")) {
            try {
                await api.delete(`/sociallinks/${id}`);
                setLinksList(prev => prev.filter(l => l._id !== id));
            } catch (err) {
                console.error("Error deleting social link:", err);
            }
        }
    };

    const resetForm = () => {
        setIsEditing(null);
        setFormData({ platform: '', url: '', icon: '' });
    };

    if (loading) return <div className="text-white p-6">Loading Contact Details...</div>;

    return (
        <div className="p-6">
            <h2 className="text-3xl font-bold text-white mb-8">Manage Contact Details</h2>

            {/* Main Contact Section (Email & Phone) */}
            {profile && (
                <div className="bg-gray-800 p-6 rounded-lg border border-gray-700 mb-8 max-w-2xl">
                    <h3 className="text-xl font-semibold text-cyan-400 mb-4">Main Contact Info</h3>
                    <form onSubmit={handleMainContactSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-gray-400 mb-1 text-sm">Email ID</label>
                            <input
                                type="email"
                                value={mainContact.email}
                                onChange={(e) => setMainContact({ ...mainContact, email: e.target.value })}
                                className="w-full bg-gray-900 border border-gray-600 rounded p-2 text-white focus:outline-none focus:border-cyan-400"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-gray-400 mb-1 text-sm">Phone Number</label>
                            <input
                                type="text"
                                value={mainContact.phone}
                                onChange={(e) => setMainContact({ ...mainContact, phone: e.target.value })}
                                className="w-full bg-gray-900 border border-gray-600 rounded p-2 text-white focus:outline-none focus:border-cyan-400"
                            />
                        </div>
                        <div className="md:col-span-2 flex justify-end">
                            <button
                                type="submit"
                                disabled={savingMain}
                                className="bg-cyan-600 hover:bg-cyan-500 text-white px-6 py-2 rounded flex items-center gap-2 disabled:opacity-50"
                            >
                                {savingMain ? <Loader className="animate-spin" size={18} /> : <Save size={18} />}
                                Update Main Info
                            </button>
                        </div>
                    </form>
                </div>
            )}

            <div className="grid lg:grid-cols-2 gap-8">
                {/* Form Section */}
                <div className="bg-gray-800 p-6 rounded-lg border border-gray-700 h-fit">
                    <h3 className="text-xl font-semibold text-cyan-400 mb-4">
                        {isEditing ? 'Edit Social Link' : 'Add New Social Link'}
                    </h3>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-gray-400 mb-1 text-sm">Platform / Label</label>
                            <input
                                type="text"
                                name="platform"
                                placeholder="e.g. LinkedIn, GitHub, WhatsApp"
                                value={formData.platform}
                                onChange={handleChange}
                                className="w-full bg-gray-900 border border-gray-600 rounded p-2 text-white focus:outline-none focus:border-cyan-400"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-gray-400 mb-1 text-sm">URL / Link</label>
                            <input
                                type="text"
                                name="url"
                                placeholder="e.g. https://linkedin.com/in/username"
                                value={formData.url}
                                onChange={handleChange}
                                className="w-full bg-gray-900 border border-gray-600 rounded p-2 text-white focus:outline-none focus:border-cyan-400"
                                required
                            />
                        </div>
                        <div className="flex gap-2 justify-end pt-2">
                            {isEditing && (
                                <button
                                    type="button"
                                    onClick={resetForm}
                                    className="px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-600"
                                >
                                    Cancel
                                </button>
                            )}
                            <button
                                type="submit"
                                disabled={saving}
                                className="bg-cyan-600 hover:bg-cyan-500 text-white px-6 py-2 rounded flex items-center gap-2 disabled:opacity-50"
                            >
                                {saving ? <Loader className="animate-spin" size={18} /> : <Save size={18} />}
                                {isEditing ? 'Update' : 'Add'}
                            </button>
                        </div>
                    </form>
                </div>

                {/* List Section */}
                <div className="space-y-4">
                    <h3 className="text-xl font-semibold text-white mb-4">Social Media Links</h3>
                    {linksList.length === 0 ? (
                        <p className="text-gray-500 italic">No social links added yet.</p>
                    ) : (
                        <div className="grid gap-4">
                            {linksList.map((link) => (
                                <div key={link._id} className="bg-gray-800 p-4 rounded-lg border border-gray-700 group hover:border-cyan-400/50 transition-colors relative flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="bg-gray-900 p-3 rounded-lg border border-gray-700">
                                            <Globe className="text-cyan-400" size={24} />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-lg text-white">{link.platform}</h4>
                                            <a href={link.url} target="_blank" rel="noopener noreferrer" className="text-cyan-400 text-sm flex items-center gap-1 hover:underline">
                                                Visit Link <ExternalLink size={14} />
                                            </a>
                                        </div>
                                    </div>

                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => handleEdit(link)}
                                            className="p-2 text-cyan-400 hover:bg-cyan-400/10 rounded"
                                            title="Edit"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path></svg>
                                        </button>
                                        <button
                                            onClick={() => handleDelete(link._id)}
                                            className="p-2 text-red-400 hover:bg-red-400/10 rounded"
                                            title="Delete"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ManageContactDetail;
