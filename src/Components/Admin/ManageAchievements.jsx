import React, { useState, useEffect } from 'react';
import { Trash2, Save, Trophy } from 'lucide-react';
import api from '../../api';

const ManageAchievements = () => {
    const [achievements, setAchievements] = useState([]);
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        date: ''
    });
    const [isEditing, setIsEditing] = useState(null);

    useEffect(() => {
        fetchAchievements();
    }, []);

    const fetchAchievements = async () => {
        try {
            const res = await api.get('/achievements');
            setAchievements(res.data);
        } catch (err) {
            console.error("Error fetching achievements:", err);
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
            if (isEditing) {
                await api.put(`/achievements/${isEditing}`, formData);
            } else {
                await api.post('/achievements', formData);
            }
            fetchAchievements();
            resetForm();
        } catch (err) {
            console.error("Error saving achievement:", err);
            alert("Failed to save achievement.");
        }
    };

    const handleEdit = (item) => {
        setIsEditing(item._id);
        setFormData({
            title: item.title,
            description: item.description,
            date: item.date
        });
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this achievement?")) {
            try {
                await api.delete(`/achievements/${id}`);
                setAchievements(prev => prev.filter(i => i._id !== id));
            } catch (err) {
                console.error("Error deleting achievement:", err);
            }
        }
    };

    const resetForm = () => {
        setIsEditing(null);
        setFormData({
            title: '',
            description: '',
            date: ''
        });
    };

    if (loading) return <div className="text-white p-6">Loading achievements...</div>;

    return (
        <div className="p-6">
            <h2 className="text-3xl font-bold text-white mb-8">Manage Achievements</h2>

            <div className="grid lg:grid-cols-2 gap-8">
                {/* Form Section */}
                <div className="bg-gray-800 p-6 rounded-lg border border-gray-700 h-fit">
                    <h3 className="text-xl font-semibold text-cyan-400 mb-4">
                        {isEditing ? 'Edit Achievement' : 'Add New Achievement'}
                    </h3>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-gray-400 mb-1 text-sm">Achievement Title</label>
                            <input
                                type="text"
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                className="w-full bg-gray-900 border border-gray-600 rounded p-2 text-white focus:outline-none focus:border-cyan-400"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-gray-400 mb-1 text-sm">Date/Year</label>
                            <input
                                type="text"
                                name="date"
                                placeholder="e.g. 2024"
                                value={formData.date}
                                onChange={handleChange}
                                className="w-full bg-gray-900 border border-gray-600 rounded p-2 text-white focus:outline-none focus:border-cyan-400"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-gray-400 mb-1 text-sm">Description</label>
                            <textarea
                                name="description"
                                rows="3"
                                value={formData.description}
                                onChange={handleChange}
                                className="w-full bg-gray-900 border border-gray-600 rounded p-2 text-white focus:outline-none focus:border-cyan-400"
                                required
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
                    <h3 className="text-xl font-semibold text-white mb-4">Achievements List</h3>
                    {achievements.length === 0 ? (
                        <p className="text-gray-500 italic">No achievements found.</p>
                    ) : (
                        achievements.map((item) => (
                            <div key={item._id} className="bg-gray-800 p-4 rounded-lg border border-gray-700 group hover:border-cyan-400/50 transition-colors">
                                <div className="flex justify-between items-start">
                                    <div className="flex gap-3">
                                        <div className="bg-cyan-400/10 p-2 rounded h-fit">
                                            <Trophy size={20} className="text-cyan-400" />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-lg text-white">{item.title}</h4>
                                            <p className="text-sm text-cyan-400 mb-1">{item.date}</p>
                                            <p className="text-gray-300 text-sm">{item.description}</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-2 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity">
                                        <button
                                            onClick={() => handleEdit(item)}
                                            className="p-2 text-cyan-400 hover:bg-cyan-400/10 rounded"
                                            title="Edit"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path></svg>
                                        </button>
                                        <button
                                            onClick={() => handleDelete(item._id)}
                                            className="p-2 text-red-400 hover:bg-red-400/10 rounded"
                                            title="Delete"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default ManageAchievements;
