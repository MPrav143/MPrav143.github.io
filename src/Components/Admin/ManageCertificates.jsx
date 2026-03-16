import React, { useState, useEffect } from 'react';
import api from '../../api';
import { Upload, X, Save, FileText, Edit2 } from 'lucide-react';

const ManageCertificates = () => {
    const [certificates, setCertificates] = useState([]);
    const [formData, setFormData] = useState({
        title: '', platform: '', category: 'Technical', pdfLink: '', image: '', date: ''
    });
    const [uploading, setUploading] = useState(false);
    const [editId, setEditId] = useState(null);

    useEffect(() => {
        fetchCertificates();
    }, []);

    const fetchCertificates = async () => {
        try {
            const res = await api.get('/certificates');
            setCertificates(res.data);
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
            const res = await api.post('/upload', data, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
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
            if (editId) {
                await api.put(`/certificates/${editId}`, formData);
                setEditId(null);
            } else {
                await api.post('/certificates', formData);
            }

            fetchCertificates();
            setFormData({ title: '', platform: '', category: 'Technical', pdfLink: '', image: '', date: '' });
        } catch (err) {
            console.error(err);
        }
    };

    const handleEdit = (cert) => {
        setFormData({
            title: cert.title,
            platform: cert.platform,
            category: cert.category,
            pdfLink: cert.pdfLink,
            image: cert.image,
            date: cert.date || ''
        });
        setEditId(cert._id);
        window.scrollTo(0, 0);
    };

    const handleCancelEdit = () => {
        setFormData({ title: '', platform: '', category: 'Technical', pdfLink: '', image: '', date: '' });
        setEditId(null);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Delete this certificate?')) {
            try {
                await api.delete(`/certificates/${id}`);
                fetchCertificates();
            } catch (err) {
                console.error(err);
            }
        }
    };

    return (
        <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-8 text-white flex items-center gap-3">
                <span className="bg-cyan-600 w-2 h-8 rounded-full"></span>
                Manage Certificates
            </h2>

            {/* Add/Edit Form */}
            <form onSubmit={handleSubmit} className="bg-gray-800 p-8 rounded-2xl shadow-xl mb-12 border border-gray-700">
                <h3 className="text-xl font-semibold mb-6 text-gray-200">{editId ? 'Edit Certificate' : 'Add New Certificate'}</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    {/* Image Upload Area */}
                    <div className="md:col-span-2">
                        <label className="block text-gray-400 text-sm mb-2">Certificate Image (Thumbnail)</label>
                        <div className="flex items-center gap-4">
                            <div className="relative w-32 h-32 bg-gray-700 rounded-lg overflow-hidden border-2 border-dashed border-gray-600 flex items-center justify-center group">
                                {formData.image ? (
                                    <img src={formData.image} alt="Preview" className="w-full h-full object-cover" />
                                ) : (
                                    <Upload className="text-gray-500 group-hover:text-cyan-400 transition-colors" />
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
                                    {uploading ? 'Uploading...' : 'Click to upload certificate preview'}
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
                            type="text" placeholder="Certificate Title"
                            className="w-full p-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-cyan-500 outline-none"
                            value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            required
                        />
                        <input
                            type="text" placeholder="Platform (e.g. Coursera, Infosys)"
                            className="w-full p-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-cyan-500 outline-none"
                            value={formData.platform} onChange={(e) => setFormData({ ...formData, platform: e.target.value })}
                            required
                        />
                    </div>

                    <div className="space-y-4">
                        <select
                            className="w-full p-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-cyan-500 outline-none"
                            value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        >
                            <option value="Technical">Technical</option>
                            <option value="Soft Skills">Soft Skills</option>
                        </select>
                        <input
                            type="text" placeholder="PDF/Credential Link"
                            className="w-full p-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-cyan-500 outline-none"
                            value={formData.pdfLink} onChange={(e) => setFormData({ ...formData, pdfLink: e.target.value })}
                        />
                    </div>
                </div>

                <div className="flex justify-end gap-3">
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
                        className={`flex items-center gap-2 bg-cyan-600 hover:bg-cyan-500 text-white px-6 py-3 rounded-lg font-medium transition-colors shadow-lg shadow-cyan-600/20 ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                        <Save size={18} />
                        {editId ? 'Update' : 'Save'}
                    </button>
                </div>
            </form>

            {/* List */}
            <div className="space-y-4">
                {certificates.map(cert => (
                    <div key={cert._id} className="group bg-gray-800/50 p-4 rounded-xl border border-gray-700 flex justify-between items-center hover:bg-gray-800 transition-colors">
                        <div className="flex items-center gap-4">
                            <div className="w-16 h-16 bg-gray-700 rounded-lg overflow-hidden flex-shrink-0">
                                {cert.image ? (
                                    <img src={cert.image} alt={cert.title} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-500"><FileText size={20} /></div>
                                )}
                            </div>
                            <div>
                                <h3 className="font-bold text-lg text-white line-clamp-1">{cert.title}</h3>
                                <p className="text-sm text-gray-400">{cert.platform} • {cert.category}</p>
                            </div>
                        </div>
                        <div className="flex gap-2 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity duration-300">
                            <button
                                onClick={() => handleEdit(cert)}
                                className="bg-cyan-500/10 text-cyan-500 hover:bg-cyan-500 hover:text-white p-2 rounded-lg transition-all"
                                title="Edit"
                            >
                                <Edit2 size={18} />
                            </button>
                            <button
                                onClick={() => handleDelete(cert._id)}
                                className="bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white p-2 rounded-lg transition-all"
                                title="Delete"
                            >
                                <X size={20} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ManageCertificates;
