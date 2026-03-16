import React, { useState, useEffect } from 'react';
import { Trash2, Save, Edit2 } from 'lucide-react';
import api from '../../api';

const ManageExperience = () => {
    const [experienceList, setExperienceList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({
        role: '',
        company: '',
        location: '',
        duration: '',
        fromDate: '',
        toDate: '',
        type: '', // Internship vs Full-time
        description: '' // will act as textarea, split by newline for array
    });
    const [isEditing, setIsEditing] = useState(null);

    useEffect(() => {
        fetchExperience();
    }, []);

    const fetchExperience = async () => {
        try {
            const res = await api.get('/experience');
            setExperienceList(res.data);
        } catch (err) {
            console.error("Error fetching experience:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const data = {
                ...formData,
                description: formData.description.split('\n').filter(line => line.trim() !== '')
            };

            if (isEditing) {
                await api.put(`/experience/${isEditing}`, data);
            } else {
                await api.post('/experience', data);
            }

            fetchExperience();
            resetForm();
        } catch (err) {
            console.error("Error saving experience:", err);
            alert("Failed to save experience.");
        }
    };

    const handleEdit = (exp) => {
        setIsEditing(exp._id);
        setFormData({
            role: exp.role,
            company: exp.company,
            location: exp.location,
            duration: exp.duration,
            fromDate: exp.fromDate || '',
            toDate: exp.toDate || '',
            type: exp.type || '',
            description: exp.description ? exp.description.join('\n') : ''
        });
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this experience?")) {
            try {
                await api.delete(`/experience/${id}`);
                setExperienceList(prev => prev.filter(e => e._id !== id));
            } catch (err) {
                console.error("Error deleting experience:", err);
            }
        }
    };

    const resetForm = () => {
        setIsEditing(null);
        setFormData({
            role: '',
            company: '',
            location: '',
            duration: '',
            fromDate: '',
            toDate: '',
            type: '',
            description: ''
        });
    };

    if (loading) return <div className="text-white p-6">Loading experience data...</div>;

    return (
        <div className="p-6">
            <h2 className="text-3xl font-bold text-white mb-8">Manage Experience</h2>

            <div className="grid lg:grid-cols-2 gap-8">
                {/* Form Section */}
                <div className="bg-gray-800 p-6 rounded-lg border border-gray-700 h-fit">
                    <h3 className="text-xl font-semibold text-cyan-400 mb-4">
                        {isEditing ? 'Edit Experience' : 'Add New Experience'}
                    </h3>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-gray-400 mb-1 text-sm">Job Role</label>
                            <input
                                type="text"
                                name="role"
                                value={formData.role}
                                onChange={handleChange}
                                className="w-full bg-gray-900 border border-gray-600 rounded p-2 text-white focus:outline-none focus:border-cyan-400"
                                required
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-gray-400 mb-1 text-sm">Company</label>
                                <input
                                    type="text"
                                    name="company"
                                    value={formData.company}
                                    onChange={handleChange}
                                    className="w-full bg-gray-900 border border-gray-600 rounded p-2 text-white focus:outline-none focus:border-cyan-400"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-gray-400 mb-1 text-sm">Location</label>
                                <input
                                    type="text"
                                    name="location"
                                    value={formData.location}
                                    onChange={handleChange}
                                    className="w-full bg-gray-900 border border-gray-600 rounded p-2 text-white focus:outline-none focus:border-cyan-400"
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-gray-400 mb-1 text-sm">From Date</label>
                                <input
                                    type="text"
                                    name="fromDate"
                                    placeholder="e.g. June '23"
                                    value={formData.fromDate}
                                    onChange={handleChange}
                                    className="w-full bg-gray-900 border border-gray-600 rounded p-2 text-white focus:outline-none focus:border-cyan-400"
                                />
                            </div>
                            <div>
                                <label className="block text-gray-400 mb-1 text-sm">To Date</label>
                                <input
                                    type="text"
                                    name="toDate"
                                    placeholder="e.g. Present"
                                    value={formData.toDate}
                                    onChange={handleChange}
                                    className="w-full bg-gray-900 border border-gray-600 rounded p-2 text-white focus:outline-none focus:border-cyan-400"
                                />
                            </div>
                            <div>
                                <label className="block text-gray-400 mb-1 text-sm">Type</label>
                                <select
                                    name="type"
                                    value={formData.type}
                                    onChange={handleChange}
                                    className="w-full bg-gray-900 border border-gray-600 rounded p-2 text-white focus:outline-none focus:border-cyan-400"
                                >
                                    <option value="">Select Type</option>
                                    <option value="Full-time">Full-time</option>
                                    <option value="Internship">Internship</option>
                                    <option value="Freelance">Freelance</option>
                                </select>
                            </div>
                        </div>
                        <div>
                            <label className="block text-gray-400 mb-1 text-sm">Description (One point per line)</label>
                            <textarea
                                name="description"
                                rows="5"
                                value={formData.description}
                                onChange={handleChange}
                                className="w-full bg-gray-900 border border-gray-600 rounded p-2 text-white focus:outline-none focus:border-cyan-400"
                                placeholder="- Developed user interface..."
                            ></textarea>
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
                                className="bg-cyan-600 hover:bg-cyan-500 text-white px-6 py-2 rounded flex items-center gap-2"
                            >
                                <Save size={18} /> {isEditing ? 'Update' : 'Add'}
                            </button>
                        </div>
                    </form>
                </div>

                {/* List Section */}
                <div className="space-y-4">
                    <h3 className="text-xl font-semibold text-white mb-4">Experience History</h3>
                    {experienceList.length === 0 ? (
                        <p className="text-gray-500 italic">No experience records found.</p>
                    ) : (
                        experienceList.map((exp) => (
                            <div key={exp._id} className="group bg-gray-800 p-4 rounded-lg border border-gray-700 hover:border-cyan-400/50 transition-colors">
                                <div className="flex justify-between items-start mb-3">
                                    <div>
                                        <h4 className="font-bold text-lg text-white">{exp.role}</h4>
                                        <p className="text-cyan-400 font-medium">{exp.company} <span className="text-gray-500 text-sm font-normal">• {exp.type}</span></p>
                                        <p className="text-sm text-gray-400 mt-1">
                                            {(exp.fromDate || exp.toDate) ? `${exp.fromDate} - ${exp.toDate}` : exp.duration} | {exp.location}
                                        </p>
                                    </div>
                                    <div className="flex gap-2 shrink-0 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity duration-300">
                                        <button
                                            onClick={() => handleEdit(exp)}
                                            className="bg-cyan-500/10 text-cyan-500 hover:bg-cyan-500 hover:text-white p-2 rounded-lg transition-all"
                                            title="Edit"
                                        >
                                            <Edit2 size={18} />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(exp._id)}
                                            className="bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white p-2 rounded-lg transition-all"
                                            title="Delete"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </div>

                                <ul className="list-disc list-inside text-gray-300 text-sm space-y-1">
                                    {exp.description && exp.description.slice(0, 2).map((desc, i) => (
                                        <li key={i} className="truncate">{desc}</li>
                                    ))}
                                    {exp.description && exp.description.length > 2 && (
                                        <li className="text-gray-500 italic">+{exp.description.length - 2} more points...</li>
                                    )}
                                </ul>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default ManageExperience;