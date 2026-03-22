import React, { useState, useEffect } from 'react';
import { Save, Loader, Upload, Crown, MapPin, Mail, Phone, Globe, Github, Linkedin, ExternalLink, Trash2, Plus, Pencil, X } from 'lucide-react';
import api from '../../api';

const ManageProfile = () => {
    const [profile, setProfile] = useState({
        name: '',
        title: '',
        email: '',
        phone: '',
        location: '',
        summary: '',
        profileImage: '', // Add this
        socialLinks: {
            linkedin: '',
            github: '',
            portfolio: '',
        },
        leadership: [], // Add leadership array
        sectionBackgrounds: {
            hero: '',
            about: '',
            education: '',
            experience: '',
            projects: '',
            skills: '',
            leetcode: '',
            certificates: '',
            achievements: '',
            contact: ''
        }
    });
    const [newLeadership, setNewLeadership] = useState({ role: '', period: '', organization: '' }); // State for new entry
    const [editIndex, setEditIndex] = useState(null); // Track which item is being edited
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [imageUploading, setImageUploading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const res = await api.get('/about');
            if (res.data && res.data.length > 0) {
                let fetchedProfile = res.data[0];
                
                // Helper to clean drive links
                const cleanDriveLink = (url) => {
                    if (!url) return url;
                    if (url.includes('drive.google.com/file/d/')) {
                        const m = url.match(/\/d\/([a-zA-Z0-9_-]+)/);
                        if (m && m[1]) return `https://drive.google.com/uc?id=${m[1]}`;
                    } else if (url.includes('drive.google.com/open?id=')) {
                        const m = url.match(/id=([a-zA-Z0-9_-]+)/);
                        if (m && m[1]) return `https://drive.google.com/uc?id=${m[1]}`;
                    }
                    return url;
                };

                if (fetchedProfile.sectionBackgrounds) {
                    Object.keys(fetchedProfile.sectionBackgrounds).forEach(key => {
                        fetchedProfile.sectionBackgrounds[key] = cleanDriveLink(fetchedProfile.sectionBackgrounds[key]);
                    });
                }
                
                setProfile(prev => ({
                    ...prev,
                    ...fetchedProfile,
                    sectionBackgrounds: {
                        ...prev.sectionBackgrounds,
                        ...(fetchedProfile.sectionBackgrounds || {})
                    }
                }));
            }
        } catch (err) {
            console.error("Error fetching profile:", err);
            setMessage({ type: 'error', text: 'Failed to load profile data.' });
        } finally {
            setLoading(false);
        }
    };

    // Removed handleImageUpload and handleBackgroundUpload as Cloudinary is no longer used


    const removeBackground = (section) => {
        setProfile(prev => ({
            ...prev,
            sectionBackgrounds: {
                ...prev.sectionBackgrounds,
                [section]: ''
            }
        }));
    };


    const handleChange = (e, index, field) => {
        if (index !== undefined) {
            // Handle Leadership Array Change
            const updatedLeadership = [...profile.leadership];
            updatedLeadership[index][field] = e.target.value;
            setProfile({ ...profile, leadership: updatedLeadership });
        } else {
            const { name, value } = e.target;
            
            // Auto-convert Google Drive viewing links to direct image rendering links
            let finalValue = value;
            if (finalValue.includes('drive.google.com/file/d/')) {
                const match = finalValue.match(/\/d\/([a-zA-Z0-9_-]+)/);
                if (match && match[1]) {
                    finalValue = `https://drive.google.com/uc?id=${match[1]}`;
                }
            } else if (finalValue.includes('drive.google.com/open?id=')) {
                const match = finalValue.match(/id=([a-zA-Z0-9_-]+)/);
                if (match && match[1]) {
                    finalValue = `https://drive.google.com/uc?id=${match[1]}`;
                }
            } else if (finalValue.trim() && !finalValue.includes('http') && /^[a-zA-Z0-9_-]{25,50}$/.test(finalValue.trim())) {
                finalValue = `https://drive.google.com/uc?id=${finalValue.trim()}`;
            }

            if (name.includes('.')) {
                const [parent, child] = name.split('.');
                setProfile(prev => ({
                    ...prev,
                    [parent]: {
                        ...prev[parent],
                        [child]: finalValue
                    }
                }));
            } else {
                setProfile(prev => ({ ...prev, [name]: finalValue }));
            }
        }
    };

    const handleNewLeadershipChange = (e) => {
        const { name, value } = e.target;
        setNewLeadership(prev => ({ ...prev, [name]: value }));
    };

    const addLeadership = () => {
        if (!newLeadership.role || !newLeadership.organization) {
            alert("Role and Organization are required");
            return;
        }

        const updatedLeadership = [...(profile.leadership || [])];

        if (editIndex !== null) {
            // Update existing
            updatedLeadership[editIndex] = newLeadership;
            setEditIndex(null);
        } else {
            // Add new
            updatedLeadership.push(newLeadership);
        }

        setProfile({ ...profile, leadership: updatedLeadership });
        setNewLeadership({ role: '', period: '', organization: '' }); // Reset form
    };

    const editLeadership = (index) => {
        setNewLeadership(profile.leadership[index]);
        setEditIndex(index);
    };

    const cancelEdit = () => {
        setNewLeadership({ role: '', period: '', organization: '' });
        setEditIndex(null);
    };

    const removeLeadership = (index) => {
        const updatedLeadership = [...profile.leadership];
        updatedLeadership.splice(index, 1);
        setProfile({ ...profile, leadership: updatedLeadership });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setMessage({ type: '', text: '' });

        try {
            if (profile._id) {
                await api.put(`/about/${profile._id}`, profile);
            } else {
                await api.post('/about', profile);
            }
            setMessage({ type: 'success', text: 'Profile updated successfully!' });
            fetchProfile(); // Refresh
        } catch (err) {
            console.error("Error saving profile:", err);
            setMessage({ type: 'error', text: 'Failed to save changes.' });
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="text-white p-6">Loading profile...</div>;

    return (
        <div className="p-6">
            <h2 className="text-3xl font-bold text-white mb-8">Manage Profile</h2>

            {message.text && (
                <div className={`p-4 mb-6 rounded ${message.type === 'error' ? 'bg-red-500/20 text-red-400' : 'bg-green-500/20 text-green-400'}`}>
                    {message.text}
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* LEFT COLUMN: EDIT FORM */}
                <form onSubmit={handleSubmit} className="bg-gray-800 p-6 rounded-lg border border-gray-700 space-y-6 h-fit">
                    <h3 className="text-xl font-semibold text-cyan-400 border-b border-gray-700 pb-2 mb-4">Edit Profile</h3>

                    {/* Image URL Input */}
                    <div>
                        <label className="block text-gray-400 mb-2">Profile Photo (Google Drive Link/ID)</label>
                        <div className="flex items-center gap-6">
                            <div className="w-24 h-24 bg-gray-700 rounded-full overflow-hidden flex-shrink-0 border-2 border-gray-600 relative group">
                                {profile.profileImage ? (
                                    <img src={profile.profileImage} alt="Profile" className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-500">No Img</div>
                                )}
                            </div>
                            <div className="flex-1">
                                <div className="relative">
                                    <input
                                        type="text"
                                        placeholder="Paste Google Drive link or file ID"
                                        className="w-full p-2 bg-gray-900 border border-gray-600 rounded text-sm text-white focus:outline-none focus:border-cyan-400"
                                        value={profile.profileImage && profile.profileImage.includes('drive.google.com/uc?id=') ? profile.profileImage.split('id=')[1] : profile.profileImage || ''}
                                        onChange={(e) => {
                                            let val = e.target.value;
                                             if (val.includes('drive.google.com/file/d/')) {
                                                 const m = val.match(/\/d\/([a-zA-Z0-9_-]+)/);
                                                 if (m && m[1]) val = `https://drive.google.com/uc?id=${m[1]}`;
                                             } else if (val.includes('drive.google.com/open?id=')) {
                                                 const m = val.match(/id=([a-zA-Z0-9_-]+)/);
                                                 if (m && m[1]) val = `https://drive.google.com/uc?id=${m[1]}`;
                                             } else if (val.trim() && !val.includes('http') && /^[a-zA-Z0-9_-]{25,50}$/.test(val.trim())) {
                                                 val = `https://drive.google.com/uc?id=${val.trim()}`;
                                             }
                                             setProfile({ ...profile, profileImage: val });
                                        }}
                                    />
                                </div>
                                <p className="text-xs text-gray-500 mt-2">Enter the standard viewing URL or 25-50 length character Drive file ID.</p>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-gray-400 mb-2">Full Name</label>
                            <input
                                type="text"
                                name="name"
                                value={profile.name}
                                onChange={handleChange}
                                className="w-full bg-gray-900 border border-gray-600 rounded p-2 text-white focus:outline-none focus:border-cyan-400"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-gray-400 mb-2">Job Title</label>
                            <input
                                type="text"
                                name="title"
                                value={profile.title}
                                onChange={handleChange}
                                className="w-full bg-gray-900 border border-gray-600 rounded p-2 text-white focus:outline-none focus:border-cyan-400"
                                required
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-gray-400 mb-2">Email</label>
                            <input
                                type="email"
                                name="email"
                                value={profile.email}
                                onChange={handleChange}
                                className="w-full bg-gray-900 border border-gray-600 rounded p-2 text-white focus:outline-none focus:border-cyan-400"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-gray-400 mb-2">Phone</label>
                            <input
                                type="text"
                                name="phone"
                                value={profile.phone}
                                onChange={handleChange}
                                className="w-full bg-gray-900 border border-gray-600 rounded p-2 text-white focus:outline-none focus:border-cyan-400"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-gray-400 mb-2">Location</label>
                        <input
                            type="text"
                            name="location"
                            value={profile.location}
                            onChange={handleChange}
                            className="w-full bg-gray-900 border border-gray-600 rounded p-2 text-white focus:outline-none focus:border-cyan-400"
                        />
                    </div>

                    <div>
                        <label className="block text-gray-400 mb-2">Bio / Summary</label>
                        <textarea
                            name="summary"
                            value={profile.summary}
                            onChange={handleChange}
                            rows="4"
                            className="w-full bg-gray-900 border border-gray-600 rounded p-2 text-white focus:outline-none focus:border-cyan-400"
                            required
                        ></textarea>
                    </div>

                    <div className="border-t border-gray-700 pt-4">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold text-cyan-400">{editIndex !== null ? 'Edit Leadership Role' : 'Add New Leadership'}</h3>
                            {editIndex !== null && (
                                <button type="button" onClick={cancelEdit} className="text-xs text-red-400 hover:text-red-300 flex items-center gap-1">
                                    <X size={14} /> Cancel Edit
                                </button>
                            )}
                        </div>
                        <div className={`space-y-4 bg-gray-900/50 p-4 rounded border ${editIndex !== null ? 'border-cyan-500/50' : 'border-gray-700'}`}>
                            <div>
                                <label className="block text-gray-400 text-sm mb-1">Role</label>
                                <input
                                    type="text"
                                    name="role"
                                    value={newLeadership.role}
                                    onChange={handleNewLeadershipChange}
                                    className="w-full bg-gray-800 border border-gray-600 rounded p-2 text-white focus:outline-none focus:border-cyan-400"
                                    placeholder="e.g. Head of Club"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-gray-400 text-sm mb-1">Period</label>
                                    <input
                                        type="text"
                                        name="period"
                                        value={newLeadership.period}
                                        onChange={handleNewLeadershipChange}
                                        className="w-full bg-gray-800 border border-gray-600 rounded p-2 text-white focus:outline-none focus:border-cyan-400"
                                        placeholder="e.g. Present"
                                    />
                                </div>
                                <div>
                                    <label className="block text-gray-400 text-sm mb-1">Organization</label>
                                    <input
                                        type="text"
                                        name="organization"
                                        value={newLeadership.organization}
                                        onChange={handleNewLeadershipChange}
                                        className="w-full bg-gray-800 border border-gray-600 rounded p-2 text-white focus:outline-none focus:border-cyan-400"
                                        placeholder="e.g. KCE"
                                    />
                                </div>
                            </div>
                            <button
                                type="button"
                                onClick={addLeadership}
                                className={`w-full py-2 rounded flex items-center justify-center gap-2 transition-all ${editIndex !== null
                                    ? 'bg-amber-600/20 hover:bg-amber-600/30 text-amber-400 border border-amber-400/30'
                                    : 'bg-cyan-600/20 hover:bg-cyan-600/30 text-cyan-400 border border-cyan-400/30'
                                    }`}
                            >
                                {editIndex !== null ? <Save size={18} /> : <Plus size={18} />}
                                {editIndex !== null ? 'Update Role' : 'Add Role'}
                            </button>
                        </div>
                    </div>





                    <div className="flex justify-end">
                        <button
                            type="submit"
                            disabled={saving}
                            className="bg-cyan-600 hover:bg-cyan-500 text-white px-6 py-2 rounded flex items-center gap-2 disabled:opacity-50"
                        >
                            {saving ? <Loader className="animate-spin" size={20} /> : <Save size={20} />}
                            ```
                            Save Changes
                        </button>
                    </div>
                </form>

                {/* RIGHT COLUMN: SAVED DATA VIEW */}
                <div className="space-y-6">
                    <div className="sticky top-6 space-y-6">
                        {/* Profile Summary Card */}
                        <div className="bg-gray-800 border border-gray-700 p-6 rounded-xl">
                            <h3 className="text-lg font-semibold text-cyan-400 mb-4 border-b border-gray-700 pb-2">Profile Summary</h3>
                            <div className="flex items-center gap-4 mb-4">
                                <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-700 border-2 border-gray-600">
                                    {profile.profileImage ? (
                                        <img src={profile.profileImage} alt="Profile" className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-gray-500 text-xs text-center">No Img</div>
                                    )}
                                </div>
                                <div>
                                    <h4 className="font-bold text-white text-lg">{profile.name}</h4>
                                    <p className="text-cyan-400 text-sm">{profile.title}</p>
                                </div>
                            </div>
                            <div className="mb-4">
                                <p className="text-gray-400 text-sm line-clamp-3 italic">
                                    "{profile.summary}"
                                </p>
                            </div>
                        </div>

                        {/* Leadership List Card */}
                        <div className="bg-gray-800 border border-cyan-700 p-6 rounded-xl">
                            <h3 className="text-lg font-semibold text-cyan-400 mb-4 border-b border-cyan-700 pb-2">Leadership History</h3>

                            {profile.leadership && profile.leadership.length > 0 ? (
                                <div className="space-y-3">
                                    {profile.leadership.map((item, index) => (
                                        <div
                                            key={index}
                                            className={`p-3 rounded border transition-all ${editIndex === index
                                                ? 'bg-cyan-900/20 border-cyan-500/50'
                                                : 'bg-gray-900/50 border-cyan-700 hover:border-cyan-500'
                                                }`}
                                        >
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <div className="flex items-center gap-2">
                                                        <span className="font-medium text-white">{item.role}</span>
                                                        {item.period && (
                                                            <span className="text-xs text-cyan-400 bg-cyan-400/10 px-1.5 py-0.5 rounded border border-cyan-400/20">{item.period}</span>
                                                        )}
                                                    </div>
                                                    <p className="text-sm text-gray-400 mt-0.5">{item.organization}</p>
                                                </div>
                                                <div className="flex gap-1">
                                                    <button
                                                        type="button"
                                                        onClick={() => editLeadership(index)}
                                                        className="p-1.5 text-cyan-400 hover:text-cyan-400 hover:bg-cyan-700 rounded transition-colors"
                                                        title="Edit"
                                                    >
                                                        <Pencil size={18} />
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => removeLeadership(index)}
                                                        className="p-1.5 text-red-400 hover:text-white hover:bg-red-900 backdrop-blur-sm rounded transition-colors"
                                                        title="Delete"
                                                    >
                                                        <Trash2 size={18} />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-gray-500 italic text-sm text-center py-4">No leadership roles added yet.</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
};

export default ManageProfile;
