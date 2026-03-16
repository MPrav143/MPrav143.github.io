import React, { useState, useEffect } from 'react';
import { Trash2, Plus, Save, Loader } from 'lucide-react';
import api from '../../api';

const ManageEducation = () => {
    const [educationList, setEducationList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({
        institution: '',
        degree: '',
        duration: '',
        fromDate: '',
        toDate: '',
        gpa: '',
        courses: '' // comma separated
    });
    const [isEditing, setIsEditing] = useState(null);

    useEffect(() => {
        fetchEducation();
    }, []);

    const fetchEducation = async () => {
        try {
            const res = await api.get('/education');
            setEducationList(res.data);
        } catch (err) {
            console.error("Error fetching education:", err);
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
                courses: formData.courses.split(',').map(c => c.trim()).filter(c => c)
            };

            if (isEditing) {
                await api.put(`/education/${isEditing}`, data);
            } else {
                await api.post('/education', data);
            }

            fetchEducation();
            resetForm();
        } catch (err) {
            console.error("Error saving education:", err);
            alert("Failed to save education.");
        }
    };

    const handleEdit = (edu) => {
        setIsEditing(edu._id);
        setFormData({
            institution: edu.institution,
            degree: edu.degree,
            duration: edu.duration,
            fromDate: edu.fromDate || '',
            toDate: edu.toDate || '',
            gpa: edu.gpa,
            courses: edu.courses.join(', ')
        });
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this education entry?")) {
            try {
                await api.delete(`/education/${id}`);
                setEducationList(prev => prev.filter(e => e._id !== id));
            } catch (err) {
                console.error("Error deleting education:", err);
            }
        }
    };

    const resetForm = () => {
        setIsEditing(null);
        setFormData({
            institution: '',
            degree: '',
            duration: '',
            fromDate: '',
            toDate: '',
            gpa: '',
            courses: ''
        });
    };

    if (loading) return <div className="text-white p-6">Loading education data...</div>;

    return (
        <div className="p-6">
            <h2 className="text-3xl font-bold text-white mb-8">Manage Education</h2>

            <div className="grid lg:grid-cols-2 gap-8">
                {/* Form Section */}
                <div className="bg-gray-800 p-6 rounded-lg border border-gray-700 h-fit">
                    <h3 className="text-xl font-semibold text-cyan-400 mb-4">
                        {isEditing ? 'Edit Education' : 'Add New Education'}
                    </h3>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-gray-400 mb-1 text-sm">Institution</label>
                            <input
                                type="text"
                                name="institution"
                                value={formData.institution}
                                onChange={handleChange}
                                className="w-full bg-gray-900 border border-gray-600 rounded p-2 text-white focus:outline-none focus:border-cyan-400"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-gray-400 mb-1 text-sm">Degree</label>
                            <input
                                type="text"
                                name="degree"
                                value={formData.degree}
                                onChange={handleChange}
                                className="w-full bg-gray-900 border border-gray-600 rounded p-2 text-white focus:outline-none focus:border-cyan-400"
                                required
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-gray-400 mb-1 text-sm">From Date</label>
                                <input
                                    type="text"
                                    name="fromDate"
                                    placeholder="e.g. 2020"
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
                                    placeholder="e.g. 2024"
                                    value={formData.toDate}
                                    onChange={handleChange}
                                    className="w-full bg-gray-900 border border-gray-600 rounded p-2 text-white focus:outline-none focus:border-cyan-400"
                                />
                            </div>
                            <div>
                                <label className="block text-gray-400 mb-1 text-sm">GPA/Score</label>
                                <input
                                    type="text"
                                    name="gpa"
                                    placeholder="e.g. 8.5 CGPA"
                                    value={formData.gpa}
                                    onChange={handleChange}
                                    className="w-full bg-gray-900 border border-gray-600 rounded p-2 text-white focus:outline-none focus:border-cyan-400"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-gray-400 mb-1 text-sm">Courses (comma separated)</label>
                            <input
                                type="text"
                                name="courses"
                                placeholder="DSA, OS, DBMS"
                                value={formData.courses}
                                onChange={handleChange}
                                className="w-full bg-gray-900 border border-gray-600 rounded p-2 text-white focus:outline-none focus:border-cyan-400"
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
                                className="bg-cyan-600 hover:bg-cyan-500 text-white px-6 py-2 rounded flex items-center gap-2"
                            >
                                <Save size={18} /> {isEditing ? 'Update' : 'Add'}
                            </button>
                        </div>
                    </form>
                </div>

                {/* List Section */}
                <div className="space-y-4">
                    <h3 className="text-xl font-semibold text-white mb-4">Current Education</h3>
                    {educationList.length === 0 ? (
                        <p className="text-gray-500 italic">No education records found.</p>
                    ) : (
                        educationList.map((edu) => (
                            <div key={edu._id} className="bg-gray-800 p-4 rounded-lg border border-gray-700 group hover:border-cyan-400/50 transition-colors relative">
                                <div>
                                    <h4 className="font-bold text-lg text-white">{edu.institution}</h4>
                                    <p className="text-cyan-400 font-medium">{edu.degree}</p>
                                    <p className="text-sm text-gray-400 mt-1">
                                        {(edu.fromDate || edu.toDate) ? `${edu.fromDate} - ${edu.toDate}` : edu.duration}
                                    </p>

                                    <div className="flex flex-wrap gap-2 mt-2">
                                        {edu.courses.map((c, i) => (
                                            <span key={i} className="text-xs bg-gray-900 px-2 py-1 rounded text-gray-400 border border-gray-700">
                                                {c}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                <div className="absolute top-4 right-4 flex gap-2 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity">
                                    <button
                                        onClick={() => handleEdit(edu)}
                                        className="p-2 text-cyan-400 hover:bg-cyan-400/10 rounded"
                                        title="Edit"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path></svg>
                                    </button>
                                    <button
                                        onClick={() => handleDelete(edu._id)}
                                        className="p-2 text-red-400 hover:bg-red-400/10 rounded"
                                        title="Delete"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default ManageEducation;
