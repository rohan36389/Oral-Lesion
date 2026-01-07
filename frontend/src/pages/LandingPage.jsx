import React from 'react';
import { Link } from 'react-router-dom';
import { Activity, ArrowRight, ShieldCheck, Zap } from 'lucide-react';

const LandingPage = () => {
    return (
        <div className="bg-white">
            {/* Hero Section */}
            <section className="relative overflow-hidden pt-16 pb-32 space-y-24">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="lg:w-2/3 mx-auto text-center space-y-8">
                        <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight text-slate-900">
                            Early Detection for <br />
                            <span className="text-blue-600">Oral Health</span>
                        </h1>
                        <p className="text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
                            Empowering professionals with AI-driven insights. Our advanced system analyzes oral cavity images to assist in early cancer detection with high precision.
                        </p>
                        <div className="flex justify-center gap-4">
                            <Link
                                to="/predict"
                                className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold rounded-lg text-white bg-blue-600 hover:bg-blue-700 transition-all shadow-lg hover:shadow-xl"
                            >
                                Start Diagnosis
                                <ArrowRight className="ml-2 h-5 w-5" />
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Features */}
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid md:grid-cols-3 gap-12 text-center">
                        <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                            <div className="w-14 h-14 mx-auto bg-blue-100 rounded-full flex items-center justify-center mb-6 text-blue-600">
                                <Zap className="h-7 w-7" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-3">Fast Analysis</h3>
                            <p className="text-slate-600">Real-time inference providing results in milliseconds.</p>
                        </div>
                        <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                            <div className="w-14 h-14 mx-auto bg-green-100 rounded-full flex items-center justify-center mb-6 text-green-600">
                                <Activity className="h-7 w-7" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-3">High Accuracy</h3>
                            <p className="text-slate-600">Powered by state-of-the-art deep learning models.</p>
                        </div>
                        <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                            <div className="w-14 h-14 mx-auto bg-purple-100 rounded-full flex items-center justify-center mb-6 text-purple-600">
                                <ShieldCheck className="h-7 w-7" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-3">Secure & Private</h3>
                            <p className="text-slate-600">Client-side processing logic prepared for secure environments.</p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default LandingPage;
