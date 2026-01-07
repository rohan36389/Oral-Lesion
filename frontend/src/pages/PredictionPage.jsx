import React, { useState } from 'react';
import axios from 'axios';
import { Upload, AlertCircle, CheckCircle, FileText, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';

const PredictionPage = () => {
    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState(null);
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [error, setError] = useState(null);

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            setFile(selectedFile);
            setPreview(URL.createObjectURL(selectedFile));
            setResult(null);
            setError(null);
        }
    };

    const handleSubmit = async () => {
        if (!file) return;

        setLoading(true);
        setError(null);

        const formData = new FormData();
        formData.append('file', file);

        try {
            // Assuming backend runs on 8000
            const response = await axios.post('http://localhost:8000/predict', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            setResult(response.data);
        } catch (err) {
            console.error(err);
            setError("Failed to get prediction. Ensure backend is running.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 p-8">
            <div className="max-w-4xl mx-auto">
                <header className="mb-10 flex items-center justify-between">
                    <Link to="/" className="text-2xl font-bold text-slate-800 hover:text-blue-600 transition-colors">
                        OralAI
                    </Link>
                    <h2 className="text-lg font-medium text-slate-500">Prediction Console</h2>
                </header>

                <div className="grid md:grid-cols-2 gap-8">
                    {/* Upload Section */}
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
                        <h3 className="text-xl font-bold text-slate-900 mb-6">Upload Image</h3>

                        <div className="border-2 border-dashed border-slate-300 rounded-xl p-8 flex flex-col items-center justify-center hover:bg-slate-50 transition-colors cursor-pointer relative">
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleFileChange}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            />
                            {preview ? (
                                <div className="relative w-full h-64 rounded-lg overflow-hidden bg-slate-100">
                                    <img src={preview} alt="Preview" className="w-full h-full object-contain" />
                                </div>
                            ) : (
                                <div className="text-center space-y-4">
                                    <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto">
                                        <Upload className="w-8 h-8" />
                                    </div>
                                    <p className="text-slate-600 font-medium">Click to upload or drag & drop</p>
                                    <p className="text-sm text-slate-400">JPG, PNG supported</p>
                                </div>
                            )}
                        </div>

                        <button
                            onClick={handleSubmit}
                            disabled={!file || loading}
                            className={`mt-6 w-full py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition-all ${loading || !file
                                    ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                                    : 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg hover:shadow-xl'
                                }`}
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="w-6 h-6 animate-spin" />
                                    Analyzing...
                                </>
                            ) : (
                                "Analyze Image"
                            )}
                        </button>

                        {error && (
                            <div className="mt-4 p-4 bg-red-50 text-red-600 rounded-lg flex items-center gap-2">
                                <AlertCircle className="w-5 h-5" />
                                {error}
                            </div>
                        )}
                    </div>

                    {/* Results Section */}
                    <div className="space-y-6">
                        {result ? (
                            <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
                                <div className="p-6 border-b border-slate-100">
                                    <h3 className="text-lg font-semibold text-slate-500 uppercase tracking-wider">Prediction Result</h3>
                                </div>
                                <div className="p-8 text-center space-y-6">
                                    {result.prediction === 'Cancer' ? (
                                        <div className="inline-flex items-center justify-center w-24 h-24 bg-red-100 text-red-600 rounded-full">
                                            <AlertCircle className="w-12 h-12" />
                                        </div>
                                    ) : (
                                        <div className="inline-flex items-center justify-center w-24 h-24 bg-green-100 text-green-600 rounded-full">
                                            <CheckCircle className="w-12 h-12" />
                                        </div>
                                    )}

                                    <div>
                                        <h2 className={`text-4xl font-extrabold mb-2 ${result.prediction === 'Cancer' ? 'text-red-600' : 'text-green-600'}`}>
                                            {result.prediction}
                                        </h2>
                                        <p className="text-slate-400">Classification</p>
                                    </div>

                                    <div className="bg-slate-50 rounded-xl p-6">
                                        <div className="flex justify-between items-end mb-2">
                                            <span className="font-semibold text-slate-600">Confidence Score</span>
                                            <span className="text-2xl font-bold text-slate-800">{result.confidence}%</span>
                                        </div>
                                        <div className="w-full bg-slate-200 rounded-full h-3">
                                            <div
                                                className={`h-3 rounded-full transition-all duration-1000 ${result.prediction === 'Cancer' ? 'bg-red-500' : 'bg-green-500'}`}
                                                style={{ width: `${result.confidence}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="h-full bg-white rounded-2xl shadow-sm border border-slate-200 p-8 flex flex-col items-center justify-center text-center text-slate-400 border-dashed">
                                <FileText className="w-16 h-16 mb-4 opacity-50" />
                                <p className="text-lg">Upload an image to view detailed analysis and predictions.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PredictionPage;
