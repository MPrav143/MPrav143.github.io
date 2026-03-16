import React, { useState, useEffect } from 'react';
import api from '../../api';
import { Upload, X, Save, Edit2, Trash2 } from 'lucide-react';

const ManageProjects = () => {
    const [projects, setProjects] = useState([]);
    const [formData, setFormData] = useState({
        title: '', description: '', techStack: '', category: '', link: '', repo: '', image: '', fromDate: '', toDate: ''
    });
    const [uploading, setUploading] = useState(false);
    const [editId, setEditId] = useState(null);

    useEffect(() => {
        fetchProjects();
    }, []);

    const fetchProjects = async () => {
        try {
            const res = await api.get('/projects');
            setProjects(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setUploading(true);
        const data = new FormData();
        data.append('file', file);

        try {
            const res = await api.post('/upload', data);
            setFormData({ ...formData, image: res.data.imageUrl });
        } catch (err) {
            console.error('Upload Error:', err);
            alert('Image upload failed');
        } finally {
            setUploading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const dataToSend = {
                ...formData,
                techStack: typeof formData.techStack === 'string' ? formData.techStack.split(',').map(item => item.trim()) : formData.techStack
            };

            if (editId) {
                await api.put(`/projects/${editId}`, dataToSend);
                setEditId(null);
            } else {
                await api.post('/projects', dataToSend);
            }

            fetchProjects();
            setFormData({ title: '', description: '', techStack: '', category: '', link: '', repo: '', image: '', fromDate: '', toDate: '' });
        } catch (err) {
            console.error(err);
        }
    };

    const handleEdit = (project) => {
        setFormData({
            title: project.title,
            description: project.description,
            techStack: project.techStack.join(', '),
            category: project.category,
            link: project.link,
            repo: project.repo,
            image: project.image,
            fromDate: project.fromDate || '',
            toDate: project.toDate || ''
        });
        setEditId(project._id);
        window.scrollTo(0, 0);
    };

    const handleCancelEdit = () => {
        setFormData({ title: '', description: '', techStack: '', category: '', link: '', repo: '', image: '', fromDate: '', toDate: '' });
        setEditId(null);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Delete this project?')) {
            try {
                await api.delete(`/projects/${id}`);
                fetchProjects();
            } catch (err) {
                console.error(err);
            }
        }
    };

    return (
        <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-8 text-white flex items-center gap-3">
                <span className="bg-blue-600 w-2 h-8 rounded-full"></span>
                Manage Projects
            </h2>

            {/* Add/Edit Form */}
            <form onSubmit={handleSubmit} className="bg-gray-800 p-8 rounded-2xl shadow-xl mb-12 border border-gray-700">
                <h3 className="text-xl font-semibold mb-6 text-gray-200">{editId ? 'Edit Project' : 'Add New Project'}</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    {/* Image Upload Area */}
                    <div className="md:col-span-2">
                        <label className="block text-gray-400 text-sm mb-2">Project Image</label>
                        <div className="flex items-center gap-4">
                            <div className="relative w-32 h-32 bg-gray-700 rounded-lg overflow-hidden border-2 border-dashed border-gray-600 flex items-center justify-center group">
                                {formData.image ? (
                                    <img src={formData.image} alt="Preview" className="w-full h-full object-cover" />
                                ) : (
                                    <Upload className="text-gray-500 group-hover:text-blue-400 transition-colors" />
                                )}
                                <input
                                    type="file"
                                    onChange={handleImageUpload}
                                    className="absolute inset-0 opacity-0 cursor-pointer"
                                    accept="image/*"
                                />
                            </div>
                            <div className="flex-1">
                                <p className="text-sm text-gray-400 mb-2">
                                    {uploading ? 'Uploading...' : 'Click or drag to upload image'}
                                </p>
                                {formData.image && (
                                    <button
                                        type="button"
                                        onClick={() => setFormData({ ...formData, image: '' })}
                                        className="text-red-400 text-sm hover:underline"
                                    >
                                        Remove Image
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <input
                            type="text" placeholder="Project Title"
                            className="w-full p-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                            value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        />
                        <input
                            type="text" placeholder="Category (e.g. Full Stack)"
                            className="w-full p-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                            value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        />
                        <input
                            type="text" placeholder="From Date (e.g. July 2023)"
                            className="w-full p-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                            value={formData.fromDate} onChange={(e) => setFormData({ ...formData, fromDate: e.target.value })}
                        />
                    </div>

                    <div className="space-y-4">
                        <input
                            type="text" placeholder="Live Link"
                            className="w-full p-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                            value={formData.link} onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                        />
                        <input
                            type="text" placeholder="GitHub Repository"
                            className="w-full p-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                            value={formData.repo} onChange={(e) => setFormData({ ...formData, repo: e.target.value })}
                        />

                        <input
                            type="text" placeholder="To Date (e.g. Aug 2023)"
                            className="w-full p-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                            value={formData.toDate} onChange={(e) => setFormData({ ...formData, toDate: e.target.value })}
                        />
                    </div>
                </div>

                <div className="space-y-6">
                    <input
                        type="text" placeholder="Tech Stack (comma separated ex: React, Node.js)"
                        className="w-full p-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                        value={formData.techStack} onChange={(e) => setFormData({ ...formData, techStack: e.target.value })}
                    />
                    <textarea
                        placeholder="Description" rows="4"
                        className="w-full p-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all resize-none"
                        value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    />
                </div>

                <div className="mt-8 flex justify-end gap-3">
                    {editId && (
                        <button
                            type="button"
                            onClick={handleCancelEdit}
                            className="bg-gray-700 hover:bg-gray-600 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                        >
                            Cancel
                        </button>
                    )}
                    <button
                        type="submit"
                        disabled={uploading}
                        className={`flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-lg font-medium transition-colors shadow-lg shadow-blue-600/20 ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                        <Save size={18} />
                        {editId ? 'Update Project' : 'Save Project'}
                    </button>
                </div>
            </form>

            {/* List */}
            <div className="space-y-4">
                {projects.map(proj => (
                    <div key={proj._id} className="group bg-gray-800/50 p-4 rounded-xl border border-gray-700 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 hover:bg-gray-800 transition-colors">
                        <div className="flex items-center gap-4">
                            <div className="w-16 h-16 bg-gray-700 rounded-lg overflow-hidden flex-shrink-0">
                                {proj.image ? (
                                    <img src={proj.image} alt={proj.title} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-500 text-xs">No Img</div>
                                )}
                            </div>
                            <div>
                                <h3 className="font-bold text-lg text-white">{proj.title}</h3>
                                <p className="text-sm text-gray-400">
                                    {proj.category}
                                    {(proj.fromDate || proj.toDate) && <span className="text-gray-500"> • {proj.fromDate} - {proj.toDate}</span>}
                                </p>
                                <div className="flex gap-2 mt-1 text-xs text-blue-300">
                                    {proj.link && <a href={proj.link} target="_blank" rel="noopener noreferrer" className="hover:underline">Live Demo</a>}
                                    {proj.repo && <a href={proj.repo} target="_blank" rel="noopener noreferrer" className="hover:underline">GitHub</a>}
                                </div>
                            </div>
                        </div>
                        <div className="flex gap-2 self-end sm:self-center opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity duration-300">
                            <button
                                onClick={() => handleEdit(proj)}
                                className="bg-cyan-500/10 text-cyan-500 hover:bg-cyan-500 hover:text-white p-2 rounded-lg transition-all"
                                title="Edit Project"
                            >
                                <Edit2 size={18} />
                            </button>
                            <button
                                onClick={() => handleDelete(proj._id)}
                                className="bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white p-2 rounded-lg transition-all"
                                title="Delete Project"
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

export default ManageProjects;
