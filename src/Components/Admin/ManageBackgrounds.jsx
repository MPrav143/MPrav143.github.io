import React, { useState, useEffect } from 'react';
import { Save, Loader, Trash2, Crown } from 'lucide-react';
import api from '../../api';

const ManageBackgrounds = () => {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const res = await api.get('/about');
            if (res.data && res.data.length > 0) {
                setProfile(res.data[0]);
            }
        } catch (err) {
            console.error("Error fetching profile backgrounds:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e, section) => {
        const { value } = e.target;
        setProfile(prev => ({
            ...prev,
            sectionBackgrounds: {
                ...prev.sectionBackgrounds,
                [section]: value
            }
        }));
    };

    const removeBackground = (section) => {
        setProfile(prev => ({
            ...prev,
            sectionBackgrounds: {
                ...prev.sectionBackgrounds,
                [section]: ''
            }
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setMessage({ type: '', text: '' });

        try {
            await api.put(`/about/${profile._id}`, {
                sectionBackgrounds: profile.sectionBackgrounds
            });
            setMessage({ type: 'success', text: 'Backgrounds updated successfully!' });
        } catch (err) {
            console.error("Error saving backgrounds:", err);
            setMessage({ type: 'error', text: 'Failed to save changes.' });
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="text-white p-6">Loading Backgrounds...</div>;
    if (!profile) return <div className="text-white p-6">No Profile Loaded found.</div>;

    const sections = ['hero', 'about', 'education', 'experience', 'projects', 'skills', 'leetcode', 'certificates', 'achievements', 'contact'];

    return (
        <div className="p-6">
            <h2 className="text-3xl font-bold text-white mb-8">Manage Background Images</h2>

            {message.text && (
                <div className={`p-4 mb-6 rounded ${message.type === 'error' ? 'bg-red-500/20 text-red-400' : 'bg-green-500/20 text-green-400'}`}>
                    {message.text}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {sections.map(section => (
                        <div key={section} className="bg-gray-800 p-4 rounded-xl border border-gray-700 hover:border-cyan-400/40 transition-all">
                            <div className="flex justify-between items-center mb-3">
                                <label className="block text-cyan-400 capitalize font-bold tracking-wide">{section}</label>
                                <button type="button" onClick={() => removeBackground(section)} className="text-red-400 hover:bg-red-400/10 p-1.5 rounded" title="Remove Background">
                                    <Trash2 size={16} />
                                </button>
                            </div>

                            {profile.sectionBackgrounds?.[section] ? (
                                <div className="w-full h-36 rounded-lg overflow-hidden relative mb-3 border border-gray-600 shadow-inner group">
                                    <img src={profile.sectionBackgrounds[section]} alt={`${section} bg`} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                                </div>
                            ) : (
                                <div className="w-full h-36 bg-gray-900/80 rounded-lg flex flex-col items-center justify-center text-gray-600 text-sm border-2 border-dashed border-gray-700 mb-3">
                                    <Crown size={24} className="mb-1 opacity-40" />
                                    No Custom Background
                                </div>
                            )}

                            <input
                                type="text"
                                placeholder="Paste Image URL"
                                value={profile.sectionBackgrounds?.[section] || ''}
                                onChange={(e) => handleChange(e, section)}
                                className="w-full bg-gray-900 border border-gray-600 rounded-lg p-2 text-white focus:outline-none focus:border-cyan-400 text-xs font-sans tracking-wide"
                            />
                        </div>
                    ))}
                </div>

                <div className="flex justify-end mt-4">
                    <button
                        type="submit"
                        disabled={saving}
                        className="bg-cyan-600 hover:bg-cyan-500 text-white px-8 py-2.5 rounded-xl flex items-center gap-2 font-bold shadow-md shadow-cyan-500/10 disabled:opacity-50 transition-all"
                    >
                        {saving ? <Loader className="animate-spin" size={20} /> : <Save size={20} />}
                        Save Backgrounds
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ManageBackgrounds;
