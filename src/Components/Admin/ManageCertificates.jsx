import React, { useState, useEffect } from 'react';
import api from '../../api';
import { Upload, X, Save, FileText, Edit2, Info, Image, Eye, EyeOff } from 'lucide-react';
import { Reorder, motion } from 'framer-motion';
import Certificates from '../Certificates'; // Live preview

const ManageCertificates = () => {
    const [certificates, setCertificates] = useState([]);
    const [formData, setFormData] = useState({
        title: '', platform: '', category: 'Technical', pdfLink: '', image: '', date: '', companyLogo: '', description: ''
    });
    const [editId, setEditId] = useState(null);
    const [isPreviewMode, setIsPreviewMode] = useState(false);
    const [isSavingOrder, setIsSavingOrder] = useState(false);

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


    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const data = { ...formData, index: editId ? undefined : certificates.length };
            
            if (editId) {
                await api.put(`/certificates/${editId}`, data);
                setEditId(null);
            } else {
                await api.post('/certificates', data);
            }

            fetchCertificates();
            setFormData({ title: '', platform: '', category: 'Technical', pdfLink: '', image: '', date: '', companyLogo: '', description: '' });
        } catch (err) {
            console.error(err);
        }
    };

    const handleEdit = (cert) => {
        setFormData({
            title: cert.title || '',
            platform: cert.platform || '',
            category: cert.category || 'Technical',
            pdfLink: cert.pdfLink || '',
            image: cert.image || '',
            date: cert.date || '',
            companyLogo: cert.companyLogo || '',
            description: cert.description || ''
        });
        setEditId(cert._id);
        window.scrollTo(0, 0);
    };

    const handleCancelEdit = () => {
        setFormData({ title: '', platform: '', category: 'Technical', pdfLink: '', image: '', date: '', companyLogo: '', description: '' });
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

    const handleSaveOrder = async () => {
        setIsSavingOrder(true);
        try {
            await Promise.all(
                certificates.map((cert, index) => 
                    api.put(`/certificates/${cert._id}`, { index })
                )
            );
            alert("Order saved successfully!");
        } catch (err) {
            console.error(err);
        } finally {
            setIsSavingOrder(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto px-4">
            <div className="flex justify-between items-center mb-8">
                <h2 className="text-3xl font-bold text-white flex items-center gap-3">
                    <span className="bg-cyan-600 w-2 h-8 rounded-full"></span>
                    Manage Certificates
                </h2>
                <button
                    onClick={() => setIsPreviewMode(!isPreviewMode)}
                    className="flex items-center gap-2 bg-gray-800 border border-gray-700 hover:border-cyan-500 text-cyan-400 px-4 py-2 rounded-lg text-sm transition-all"
                >
                    {isPreviewMode ? <EyeOff size={16} /> : <Eye size={16} />}
                    {isPreviewMode ? 'Exit Preview' : 'Live Preview'}
                </button>
            </div>

            {isPreviewMode && (
                <div className="fixed inset-0 z-50 bg-black overflow-y-auto pt-16">
                    <div className="absolute top-4 right-4 z-50">
                        <button 
                            onClick={() => setIsPreviewMode(false)}
                            className="bg-gray-900/80 border border-gray-800 p-2 rounded-full text-white hover:bg-cyan-950 hover:border-cyan-500 transition-all"
                        >
                            <X size={24} />
                        </button>
                    </div>
                    <Certificates manualCerts={certificates} />
                </div>
            )}

            {/* Add/Edit Form */}
            <form onSubmit={handleSubmit} className="bg-gray-800 p-8 rounded-2xl shadow-xl mb-12 border border-gray-700">
                <h3 className="text-xl font-semibold mb-6 text-gray-200">{editId ? 'Edit Certificate' : 'Add New Certificate'}</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    {/* Images URLs Input Area */}
                    <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Certificate Preview Image */}
                        <div className="flex flex-col gap-2">
                            <label className="block text-gray-400 text-sm">Certificate Image / PDF Link (URL)</label>
                            <div className="flex items-center gap-4">
                                <div className="relative w-24 h-24 bg-gray-700 rounded-lg overflow-hidden border border-gray-600 flex items-center justify-center">
                                    {formData.image ? (
                                        <img src={formData.image} alt="Preview" className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="text-gray-500 text-xs"><Image size={24} /></div>
                                    )}
                                </div>
                                <input
                                    type="text" placeholder="Paste Image / PDF URL here"
                                    className="flex-1 p-2 self-center bg-gray-900 border border-gray-700 rounded text-sm text-white focus:outline-none focus:border-cyan-500"
                                    value={formData.image || ''}
                                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                                />
                            </div>
                        </div>

                        {/* Company Logo Image */}
                        <div className="flex flex-col gap-2">
                            <label className="block text-gray-400 text-sm">Company Logo Link (URL)</label>
                            <div className="flex items-center gap-4">
                                <div className="relative w-12 h-12 bg-gray-700 rounded-full overflow-hidden border border-gray-600 flex items-center justify-center p-2">
                                    {formData.companyLogo ? (
                                        <img src={formData.companyLogo} alt="Logo" className="w-full h-full object-contain" />
                                    ) : (
                                        <div className="text-gray-500 text-xs"><FileText size={16} /></div>
                                    )}
                                </div>
                                <input
                                    type="text" placeholder="Paste Logo Image URL"
                                    className="flex-1 p-2 self-center bg-gray-900 border border-gray-700 rounded text-sm text-white focus:outline-none focus:border-cyan-500"
                                    value={formData.companyLogo || ''}
                                    onChange={(e) => setFormData({ ...formData, companyLogo: e.target.value })}
                                />
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
                            type="text" placeholder="Platform/Company (e.g. Google, Udemy)"
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
                            <option value="Non-Technical">Non-Technical</option>
                        </select>
                        <input
                            type="text" placeholder="Issued Date (e.g. Oct 2024)"
                            className="w-full p-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-cyan-500 outline-none"
                            value={formData.date} onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                        />
                    </div>

                    <div className="md:col-span-2">
                        <textarea
                            placeholder="Brief Description for certification details (revealed on back of card)"
                            className="w-full p-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-cyan-500 outline-none h-20 resize-none text-sm"
                            value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })}
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
                        className="flex items-center gap-2 bg-cyan-600 hover:bg-cyan-500 text-white px-6 py-3 rounded-lg font-medium transition-colors shadow-lg shadow-cyan-600/20"
                    >
                        <Save size={18} />
                        {editId ? 'Update' : 'Save'}
                    </button>
                </div>
            </form>

            {/* Drag & Drop Reorder List */}
            <div className="flex justify-between items-center mb-4">
                <span className="text-gray-400 text-sm flex items-center gap-1">
                    <Info size={14} /> Drag rows to reorder certificates carousel
                </span>
                <button
                    onClick={handleSaveOrder}
                    disabled={isSavingOrder}
                    className="bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 px-3 py-1.5 rounded-lg text-sm hover:bg-cyan-500 hover:text-white transition-all disabled:opacity-50"
                >
                    {isSavingOrder ? 'Saving...' : 'Save Updates Order'}
                </button>
            </div>

            <Reorder.Group values={certificates} onReorder={setCertificates} className="space-y-4">
                {certificates.map(cert => (
                    <Reorder.Item key={cert._id} value={cert} className="group cursor-grab active:cursor-grabbing bg-gray-800/50 p-4 rounded-xl border border-gray-700 flex justify-between items-center hover:bg-gray-800 transition-colors">
                        <div className="flex items-center gap-4">
                            <div className="w-16 h-12 bg-gray-700 rounded-lg overflow-hidden flex-shrink-0 flex items-center justify-center border border-gray-600">
                                {cert.image ? (
                                    <img src={cert.image} alt={cert.title} className="w-full h-full object-cover" />
                                ) : (
                                    <FileText size={20} className="text-gray-500" />
                                )}
                            </div>
                            <div>
                                <h3 className="font-bold text-md text-white line-clamp-1">{cert.title}</h3>
                                <p className="text-xs text-gray-400">{cert.platform} • {cert.category}</p>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <button
                                onClick={(e) => { e.stopPropagation(); handleEdit(cert); }}
                                className="bg-cyan-500/10 text-cyan-500 hover:bg-cyan-500 hover:text-white p-2 rounded-lg transition-all"
                                title="Edit"
                            >
                                <Edit2 size={16} />
                            </button>
                            <button
                                onClick={(e) => { e.stopPropagation(); handleDelete(cert._id); }}
                                className="bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white p-2 rounded-lg transition-all"
                                title="Delete"
                            >
                                <X size={16} />
                            </button>
                        </div>
                    </Reorder.Item>
                ))}
            </Reorder.Group>
        </div>
    );
};

export default ManageCertificates;;
