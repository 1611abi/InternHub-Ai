import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import careervaultApi from '../../services/careervaultApi';
import { Upload, X, AlertCircle } from 'lucide-react';

const AddResource = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        type: 'youtube',
        field: '',
        difficulty: 'beginner',
        url: '',
        tags: ''
    });

    const [file, setFile] = useState(null);

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            const selectedFile = e.target.files[0];
            if (selectedFile.type !== 'application/pdf') {
                setError('Only PDF files are allowed.');
                return;
            }
            if (selectedFile.size > 10 * 1024 * 1024) {
                setError('File size must be less than 10MB.');
                return;
            }
            setError(null);
            setFile(selectedFile);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const data = new FormData();
        Object.keys(formData).forEach(key => {
            data.append(key, formData[key]);
        });
        if (file) {
            data.append('file', file);
        }

        try {
            const res = await careervaultApi.createResource(data);
            if (res.data.success) {
                alert(`Resource submitted successfully! ${res.data.message === 'Pending approval' ? 'It is currently pending admin approval.' : ''}`);
                navigate('/careervault');
            }
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.message || 'Error uploading resource. Please ensure all fields are filled properly.');
        } finally {
            setLoading(false);
        }
    };

    const isFileUploadRequired = formData.type === 'notes' || formData.type === 'roadmap';
    const isUrlRequired = formData.type === 'youtube' || formData.type === 'course' || formData.type === 'github';

    return (
        <div className="max-w-2xl mx-auto px-6 py-10">
            <h1 className="text-2xl font-bold text-slate-900 mb-2">Share a Resource</h1>
            <p className="text-slate-500 mb-8">Help the community grow by sharing valuable courses, notes, and roadmaps.</p>

            <form onSubmit={handleSubmit} className="bg-white border border-slate-200 shadow-sm rounded-xl p-8 flex flex-col gap-6">

                {error && (
                    <div className="bg-red-50 text-red-700 p-4 font-medium text-sm rounded-lg flex gap-3 border border-red-100">
                        <AlertCircle size={20} className="shrink-0" />
                        <span>{error}</span>
                    </div>
                )}

                <div className="grid md:grid-cols-2 gap-6">
                    <div className="flex flex-col gap-1.5 md:col-span-2">
                        <label className="text-sm font-semibold text-slate-700">Resource Title <span className="text-red-500">*</span></label>
                        <input
                            name="title"
                            required
                            value={formData.title}
                            onChange={handleInputChange}
                            className="input-field py-2.5"
                            placeholder="e.g. Master React in 2026"
                        />
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <label className="text-sm font-semibold text-slate-700">Type <span className="text-red-500">*</span></label>
                        <select name="type" required value={formData.type} onChange={handleInputChange} className="input-field py-2.5">
                            <option value="youtube">YouTube Video/Playlist</option>
                            <option value="course">External Course (Free/Paid)</option>
                            <option value="notes">PDF Notes</option>
                            <option value="roadmap">Career Roadmap (PDF)</option>
                            <option value="github">GitHub Repository</option>
                        </select>
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <label className="text-sm font-semibold text-slate-700">Difficulty <span className="text-red-500">*</span></label>
                        <select name="difficulty" required value={formData.difficulty} onChange={handleInputChange} className="input-field py-2.5">
                            <option value="beginner">Beginner</option>
                            <option value="intermediate">Intermediate</option>
                            <option value="advanced">Advanced</option>
                        </select>
                    </div>

                    <div className="flex flex-col gap-1.5 md:col-span-2">
                        <label className="text-sm font-semibold text-slate-700">Field/Category <span className="text-red-500">*</span></label>
                        <select name="field" required value={formData.field} onChange={handleInputChange} className="input-field py-2.5">
                            <option value="" disabled>Select a field</option>
                            <option value="Frontend">Frontend Development</option>
                            <option value="Backend">Backend Development</option>
                            <option value="Data Science">Data Science</option>
                            <option value="AI/ML">AI & Machine Learning</option>
                            <option value="DevOps">DevOps & Cloud</option>
                            <option value="UI/UX">UI/UX Design</option>
                            <option value="Mobile">Mobile Development</option>
                        </select>
                    </div>
                </div>

                <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-semibold text-slate-700">Description</label>
                    <textarea
                        name="description"
                        rows="4"
                        value={formData.description}
                        onChange={handleInputChange}
                        className="input-field px-4 py-3"
                        placeholder="What will users learn from this resource?..."
                    ></textarea>
                </div>

                {/* Conditional Fields based on Type */}
                <div className="p-5 bg-slate-50 border border-slate-200 rounded-lg">
                    {isUrlRequired && (
                        <div className="flex flex-col gap-1.5">
                            <label className="text-sm font-semibold text-slate-700">Resource URL <span className="text-red-500">*</span></label>
                            <input
                                type="url"
                                name="url"
                                required={isUrlRequired}
                                value={formData.url}
                                onChange={handleInputChange}
                                className="input-field py-2.5 bg-white"
                                placeholder="https://..."
                            />
                        </div>
                    )}

                    {isFileUploadRequired && (
                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-semibold text-slate-700">Upload PDF <span className="text-red-500">*</span> <span className="text-slate-400 font-normal">(Max 10MB)</span></label>

                            {!file ? (
                                <div className="border-2 border-dashed border-slate-300 rounded-xl p-8 text-center bg-white hover:bg-slate-50 transition-colors relative cursor-pointer group">
                                    <input
                                        type="file"
                                        accept="application/pdf"
                                        required={isFileUploadRequired}
                                        onChange={handleFileChange}
                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                    />
                                    <Upload className="mx-auto text-blue-500 mb-3 group-hover:-translate-y-1 transition-transform" />
                                    <p className="text-sm text-slate-700 font-medium">Click to select or drag and drop a PDF file here</p>
                                </div>
                            ) : (
                                <div className="flex items-center justify-between p-4 bg-white border border-blue-200 shadow-sm rounded-lg">
                                    <div className="flex flex-col">
                                        <span className="text-sm font-bold text-slate-900">{file.name}</span>
                                        <span className="text-xs text-slate-500">{(file.size / 1024 / 1024).toFixed(2)} MB</span>
                                    </div>
                                    <button type="button" onClick={() => setFile(null)} className="p-1.5 bg-red-50 text-red-600 rounded hover:bg-red-100 transition-colors">
                                        <X size={16} />
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-semibold text-slate-700">Tags (comma separated)</label>
                    <input
                        name="tags"
                        value={formData.tags}
                        onChange={handleInputChange}
                        className="input-field py-2.5"
                        placeholder="react, hooks, tailwind..."
                    />
                </div>

                <div className="pt-4 border-t border-slate-100 flex justify-end gap-3 mt-2">
                    <button type="button" onClick={() => navigate(-1)} className="btn-secondary px-6">Cancel</button>
                    <button type="submit" disabled={loading} className="btn-primary px-8 flex items-center gap-2 shadow-md">
                        {loading ? 'Submitting...' : 'Submit Resource'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AddResource;
