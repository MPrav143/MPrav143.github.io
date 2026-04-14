import React, { useState, useEffect } from 'react';
import api from '../../api';
import { Edit2, Trash2 } from 'lucide-react';

const ManageSkills = () => {
    const [skills, setSkills] = useState([]);
    const [formData, setFormData] = useState({
        category: '', items: ''
    });
    const [editId, setEditId] = useState(null);

    useEffect(() => {
        fetchSkills();
    }, []);

    const fetchSkills = async () => {
        try {
            const res = await api.get('/skills');
            setSkills(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // items is comma separated string
            const dataToSend = {
                category: formData.category,
                items: formData.items.split(',').map(item => item.trim())
            };

            if (editId) {
                await api.put(`/skills/${editId}`, dataToSend);
                setEditId(null);
            } else {
                await api.post('/skills', dataToSend);
            }

            fetchSkills();
            setFormData({ category: '', items: '' });
        } catch (err) {
            console.error(err);
        }
    };

    const handleEdit = (skill) => {
        setFormData({
            category: skill.category,
            items: skill.items.join(', ')
        });
        setEditId(skill._id);
        window.scrollTo(0, 0);
    };

    const handleCancelEdit = () => {
        setFormData({ category: '', items: '' });
        setEditId(null);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Delete this skill category?')) {
            try {
                await api.delete(`/skills/${id}`);
                fetchSkills();
            } catch (err) {
                console.error(err);
            }
        }
    };

    return (
        <div>
            <h2 className="text-2xl font-bold mb-4">Manage Skills</h2>

            {/* Add/Edit Form */}
            <form onSubmit={handleSubmit} className="bg-gray-800 p-6 rounded mb-8 space-y-4">
                <input
                    type="text" placeholder="Category (e.g. Languages)" className="w-full p-2 bg-gray-700 rounded text-white"
                    value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                />
                <textarea
                    placeholder="Items (comma separated, e.g. Python, Java, C++)" className="w-full p-2 bg-gray-700 rounded text-white"
                    value={formData.items} onChange={(e) => setFormData({ ...formData, items: e.target.value })}
                />
                <div className="flex gap-2">
                    <button type="submit" className={`px-4 py-2 rounded text-white ${editId ? 'bg-green-600 hover:bg-green-500' : 'bg-blue-600 hover:bg-blue-500'}`}>
                        {editId ? 'Update Skill Category' : 'Add Skill Category'}
                    </button>
                    {editId && (
                        <button type="button" onClick={handleCancelEdit} className="bg-gray-600 px-4 py-2 rounded hover:bg-gray-500 text-white">
                            Cancel
                        </button>
                    )}
                </div>
            </form>

            {/* List */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {skills.map(skill => (
                    <div key={skill._id} className="group bg-gray-800 p-4 rounded flex justify-between items-start">
                        <div>
                            <h3 className="font-bold text-cyan-400">{skill.category}</h3>
                            <div className="flex flex-wrap gap-2 mt-2">
                                {skill.items.map((item, idx) => (
                                    <span key={idx} className="bg-gray-700 text-xs px-2 py-1 rounded">{item}</span>
                                ))}
                            </div>
                        </div>
                        <div className="flex gap-2 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity duration-300">
                            <button
                                onClick={() => handleEdit(skill)}
                                className="bg-cyan-500/10 text-cyan-500 hover:bg-cyan-500 hover:text-white p-2 rounded-lg transition-all"
                                title="Edit"
                            >
                                <Edit2 size={18} />
                            </button>
                            <button
                                onClick={() => handleDelete(skill._id)}
                                className="bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white p-2 rounded-lg transition-all"
                                title="Delete"
                            >
                                <Trash2 size={18} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ManageSkills;
