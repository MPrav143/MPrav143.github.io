import React, { useState, useEffect } from 'react';
import api from '../../api';
import { Upload, X, Save, Edit2, Trash2, Github, CheckCircle, XCircle, Star, Eye, EyeOff, Pin } from 'lucide-react';

const ManageProjects = () => {
    const [projects, setProjects] = useState([]);
    const [formData, setFormData] = useState({
        title: '', description: '', techStack: '', category: '', link: '', repo: '', image: '', fromDate: '', toDate: ''
    });
    const [syncing, setSyncing] = useState(false);
    const [loading, setLoading] = useState(true);
    const [editId, setEditId] = useState(null);

    useEffect(() => {
        fetchProjects();
    }, []);

    const fetchProjects = async () => {
        setLoading(true);
        try {
            const res = await api.get('/projects/admin/all');
            setProjects(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleSync = async () => {
        setSyncing(true);
        try {
            const res = await api.post('/projects/sync');
            alert(`Sync completed! Added: ${res.data.results.added}, Updated: ${res.data.results.updated}, Skipped: ${res.data.results.skipped}`);
            fetchProjects();
        } catch (err) {
            console.error(err);
            alert('Sync failed');
        } finally {
            setSyncing(false);
        }
    };

    const toggleStatus = async (id, field, value) => {
        try {
            await api.patch(`/projects/${id}/status`, { [field]: value });
            setProjects(projects.map(p => p._id === id ? { ...p, [field]: value } : p));
        } catch (err) {
            console.error(err);
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
        <div className="max-w-5xl mx-auto p-4 sm:p-6 lg:p-8">
            <div className="flex justify-between items-center mb-10">
                <h2 className="text-3xl font-bold text-white flex items-center gap-3">
                    <span className="bg-cyan-500 w-2 h-10 rounded-full"></span>
                    Manage Projects
                </h2>
                <button 
                    onClick={handleSync}
                    disabled={syncing}
                    className={`flex items-center gap-2 px-6 py-3 rounded-full font-bold transition-all ${syncing ? 'bg-gray-700 cursor-not-allowed text-gray-400' : 'bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white shadow-lg shadow-cyan-500/20'}`}
                >
                    <Github size={20} className={syncing ? 'animate-spin' : ''} />
                    {syncing ? 'Syncing...' : 'Sync GitHub Repos'}
                </button>
            </div>

            {/* Add/Edit Form */}
            <form onSubmit={handleSubmit} className="bg-gray-800/80 backdrop-blur-sm p-8 rounded-3xl shadow-2xl mb-12 border border-white/5">
                {/* ... existing form fields ... */}
                <h3 className="text-xl font-semibold mb-6 text-cyan-400">{editId ? 'Edit Project' : 'Add New Manual Project'}</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div className="md:col-span-2">
                        <label className="block text-gray-400 text-sm mb-3">Project Image (URL)</label>
                        <div className="flex items-center gap-6">
                            <div className="relative w-40 h-40 bg-gray-900 rounded-2xl overflow-hidden border border-white/10 flex items-center justify-center group">
                                {formData.image ? (
                                    <img src={formData.image} alt="Preview" className="w-full h-full object-cover" />
                                ) : (
                                    <div className="text-gray-600 text-xs text-center px-2">No Preview Available</div>
                                )}
                            </div>
                            <div className="flex-1 space-y-4">
                                <input
                                    type="text"
                                    placeholder="Paste Image URL"
                                    className="w-full p-3 bg-gray-900 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-cyan-500/50"
                                    value={formData.image || ''}
                                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                                />
                                {formData.image && (
                                    <button
                                        type="button"
                                        onClick={() => setFormData({ ...formData, image: '' })}
                                        className="text-red-400 text-sm hover:text-red-300 font-medium transition-colors"
                                    >
                                        Remove Image Link
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <input
                            type="text" placeholder="Project Title"
                            className="w-full p-4 bg-gray-900 border border-white/10 rounded-2xl text-white focus:ring-2 focus:ring-cyan-500/50 outline-none transition-all"
                            value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        />
                        <input
                            type="text" placeholder="Category (e.g. Full Stack)"
                            className="w-full p-4 bg-gray-900 border border-white/10 rounded-2xl text-white focus:ring-2 focus:ring-cyan-500/50 outline-none transition-all"
                            value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        />
                        <input
                            type="text" placeholder="From Date (e.g. July 2023)"
                            className="w-full p-4 bg-gray-900 border border-white/10 rounded-2xl text-white focus:ring-2 focus:ring-cyan-500/50 outline-none transition-all"
                            value={formData.fromDate} onChange={(e) => setFormData({ ...formData, fromDate: e.target.value })}
                        />
                    </div>

                    <div className="space-y-4">
                        <input
                            type="text" placeholder="Live Link"
                            className="w-full p-4 bg-gray-900 border border-white/10 rounded-2xl text-white focus:ring-2 focus:ring-cyan-500/50 outline-none transition-all"
                            value={formData.link} onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                        />
                        <input
                            type="text" placeholder="GitHub Repository"
                            className="w-full p-4 bg-gray-900 border border-white/10 rounded-2xl text-white focus:ring-2 focus:ring-cyan-500/50 outline-none transition-all"
                            value={formData.repo} onChange={(e) => setFormData({ ...formData, repo: e.target.value })}
                        />
                        <input
                            type="text" placeholder="To Date (e.g. Present)"
                            className="w-full p-4 bg-gray-900 border border-white/10 rounded-2xl text-white focus:ring-2 focus:ring-cyan-500/50 outline-none transition-all"
                            value={formData.toDate} onChange={(e) => setFormData({ ...formData, toDate: e.target.value })}
                        />
                    </div>
                </div>

                <div className="space-y-6">
                    <input
                        type="text" placeholder="Tech Stack (comma separated ex: React, Node.js)"
                        className="w-full p-4 bg-gray-900 border border-white/10 rounded-2xl text-white focus:ring-2 focus:ring-cyan-500/50 outline-none transition-all"
                        value={formData.techStack} onChange={(e) => setFormData({ ...formData, techStack: e.target.value })}
                    />
                    <textarea
                        placeholder="Description" rows="4"
                        className="w-full p-4 bg-gray-900 border border-white/10 rounded-2xl text-white focus:ring-2 focus:ring-cyan-500/50 outline-none transition-all resize-none"
                        value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    />
                </div>

                <div className="mt-10 flex justify-end gap-4">
                    {editId && (
                        <button
                            type="button"
                            onClick={handleCancelEdit}
                            className="bg-gray-700 hover:bg-gray-600 text-white px-8 py-4 rounded-2xl font-bold transition-all"
                        >
                            Cancel
                        </button>
                    )}
                    <button
                        type="submit"
                        className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white px-10 py-4 rounded-2xl font-bold transition-all shadow-xl shadow-blue-900/40"
                    >
                        <Save size={20} />
                        {editId ? 'Update project' : 'Save Project'}
                    </button>
                </div>
            </form>

            <div className="space-y-6">
                <h3 className="text-xl font-bold text-white mb-4">Project Inventory ({projects.length})</h3>
                {loading ? (
                    <div className="text-center py-10 text-gray-400">Loading your projects...</div>
                ) : projects.map(proj => (
                    <div key={proj._id} className={`group bg-gray-800/40 p-6 rounded-3xl border ${proj.isApproved ? 'border-emerald-500/30' : 'border-white/5'} flex flex-col lg:flex-row gap-6 hover:bg-gray-800/60 transition-all duration-300 relative overflow-hidden shadow-xl`}>
                        {/* Status Badges */}
                        <div className="absolute top-4 right-4 flex gap-2">
                           {proj.isPinned && <Pin size={16} className="text-yellow-400 fill-yellow-400" />}
                           {proj.isHidden && <EyeOff size={16} className="text-red-400" />}
                        </div>

                        <div className="flex-shrink-0 w-full lg:w-32 h-32 bg-gray-900 rounded-2xl overflow-hidden border border-white/5">
                            {proj.image ? (
                                <img src={proj.image} alt={proj.title} className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-700 to-gray-800 text-white font-black text-2xl uppercase">
                                    {proj.title?.[0] || 'P'}
                                </div>
                            )}
                        </div>

                        <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                                <h3 className="font-bold text-xl text-white">{proj.title}</h3>
                                {proj.githubId && <Github size={16} className="text-gray-400" />}
                            </div>
                            <p className="text-gray-400 text-sm mb-3 font-medium">
                                {proj.category} • {proj.fromDate || 'N/A'} - {proj.toDate || 'N/A'}
                            </p>
                            
                            {proj.githubId && (
                                <div className="flex gap-4 mb-4 text-xs font-bold text-gray-500 bg-black/30 w-fit px-3 py-1.5 rounded-full border border-white/5">
                                    <span className="flex items-center gap-1"><Star size={12} /> {proj.stars || 0}</span>
                                    <span className="flex items-center gap-1 uppercase">{proj.language || 'No Lang'}</span>
                                    <span>Updated: {proj.lastUpdated ? new Date(proj.lastUpdated).toLocaleDateString() : 'N/A'}</span>
                                </div>
                            )}

                            <div className="flex flex-wrap gap-2 text-xs">
                                {proj.isApproved ? (
                                    <button onClick={() => toggleStatus(proj._id, 'isApproved', false)} className="flex items-center gap-1.5 bg-emerald-500/10 text-emerald-500 px-3 py-1.5 rounded-lg border border-emerald-500/20 hover:bg-emerald-500 hover:text-white transition-all">
                                        <CheckCircle size={14} /> Approved
                                    </button>
                                ) : (
                                    <button onClick={() => toggleStatus(proj._id, 'isApproved', true)} className="flex items-center gap-1.5 bg-gray-700 text-gray-300 px-3 py-1.5 rounded-lg border border-white/5 hover:bg-cyan-600 hover:text-white transition-all">
                                        <Save size={14} /> Approve
                                    </button>
                                )}
                                
                                <button 
                                    onClick={() => toggleStatus(proj._id, 'isPinned', !proj.isPinned)}
                                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border transition-all ${proj.isPinned ? 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20' : 'bg-gray-700 text-gray-300 border-white/5'}`}
                                >
                                    <Pin size={14} /> {proj.isPinned ? 'Pinned' : 'Pin'}
                                </button>

                                <button 
                                    onClick={() => toggleStatus(proj._id, 'isHidden', !proj.isHidden)}
                                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border transition-all ${proj.isHidden ? 'bg-red-500/10 text-red-500 border-red-500/20' : 'bg-gray-700 text-gray-300 border-white/5'}`}
                                >
                                    {proj.isHidden ? <EyeOff size={14} /> : <Eye size={14} />} {proj.isHidden ? 'Hidden' : 'Visible'}
                                </button>
                            </div>
                        </div>

                        <div className="flex lg:flex-col gap-2 justify-center">
                            <button
                                onClick={() => handleEdit(proj)}
                                className="flex-1 lg:flex-none p-3 bg-cyan-500/10 text-cyan-500 hover:bg-cyan-500 hover:text-white rounded-xl transition-all border border-cyan-500/20"
                                title="Edit Project"
                            >
                                <Edit2 size={18} />
                            </button>
                            <button
                                onClick={() => handleDelete(proj._id)}
                                className="flex-1 lg:flex-none p-3 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white rounded-xl transition-all border border-red-500/20"
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
