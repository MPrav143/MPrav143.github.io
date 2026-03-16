import React, { useState, useEffect } from 'react';
import { Upload, FileText, Save, Loader } from 'lucide-react';
import api from '../../api';

const ManageResume = () => {
    const [resumeUrl, setResumeUrl] = useState('');
    const [profileId, setProfileId] = useState(null);
    const [saving, setSaving] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const res = await api.get('/about');
            if (res.data && res.data.length > 0) {
                setResumeUrl(res.data[0].resume || '');
                setProfileId(res.data[0]._id);
            }
        } catch (err) {
            console.error("Error fetching profile:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setSaving(true);

        try {
            // Update Profile with new URL
            if (profileId) {
                await api.put(`/about/${profileId}`, { resume: resumeUrl });
                alert('Resume link updated successfully!');
            } else {
                alert('Profile not found. Please create a profile first.');
            }
        } catch (err) {
            console.error('Update Error:', err);
            alert('Failed to update resume link.');
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="text-white p-6">Loading...</div>;

    return (
        <div className="p-6">
            <h2 className="text-3xl font-bold text-white mb-8 border-b border-gray-700 pb-4">Manage Resume</h2>

            <div className="bg-gray-800 p-6 md:p-8 rounded-xl border border-gray-700 max-w-2xl">
                <div className="space-y-6">

                    {/* Icon */}
                    <div className="flex items-center gap-4">
                        <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center shrink-0">
                            <FileText size={32} className="text-cyan-400" />
                        </div>
                        <div>
                            <h3 className="text-xl font-semibold text-white">Resume Link</h3>
                            <p className="text-gray-400 text-sm">Provide a public link to your resume (Google Drive, OneDrive, etc.)</p>
                        </div>
                    </div>

                    {/* Input Form */}
                    <form onSubmit={handleSave} className="space-y-4">
                        <div>
                            <label className="block text-gray-400 mb-2 text-sm">Resume URL</label>
                            <input
                                type="url"
                                placeholder="https://drive.google.com/file/d/..."
                                value={resumeUrl}
                                onChange={(e) => setResumeUrl(e.target.value)}
                                className="w-full bg-gray-900 border border-gray-600 rounded p-3 text-white focus:outline-none focus:border-cyan-400"
                                required
                            />
                        </div>

                        <div className="flex justify-end gap-3 pt-2">
                            {resumeUrl && (
                                <a
                                    href={resumeUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="px-4 py-2 border border-gray-600 text-gray-300 rounded hover:bg-gray-700 transition-colors flex items-center justify-center"
                                >
                                    Test Link
                                </a>
                            )}
                            <button
                                type="submit"
                                disabled={saving}
                                className="bg-cyan-600 hover:bg-cyan-500 text-white px-6 py-2 rounded flex items-center gap-2 disabled:opacity-50"
                            >
                                {saving ? <Loader className="animate-spin" size={18} /> : <Save size={18} />}
                                Save Link
                            </button>
                        </div>
                    </form>

                </div>
            </div>
        </div>
    );
};

export default ManageResume;
