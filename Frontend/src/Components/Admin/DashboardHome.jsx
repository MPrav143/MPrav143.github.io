import React, { useState, useEffect } from 'react';
import { Users, MessageSquare, Briefcase, Award } from 'lucide-react';
import api from '../../api';

const DashboardHome = () => {
    const [stats, setStats] = useState({
        visitorCount: 0,
        contactCount: 0,
        projectCount: 0,
        certificateCount: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await api.get('/analytics');
                setStats(res.data);
            } catch (err) {
                console.error("Error fetching analytics:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    const StatCard = ({ title, value, icon: Icon, color }) => (
        <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 hover:border-cyan-500/50 transition-all">
            <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-lg ${color} bg-opacity-20`}>
                    <Icon className={`w-6 h-6 ${color.replace('bg-', 'text-')}`} />
                </div>
                <span className="text-gray-400 text-sm font-medium">Total</span>
            </div>
            <h3 className="text-3xl font-bold text-white mb-1">{value}</h3>
            <p className="text-gray-400 text-sm">{title}</p>
        </div>
    );

    if (loading) return <div className="text-white p-6">Loading dashboard...</div>;

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-white">Dashboard Overview</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="Total Visitors"
                    value={stats.visitorCount}
                    icon={Users}
                    color="bg-purple-500"
                />
                <StatCard
                    title="Messages"
                    value={stats.contactCount}
                    icon={MessageSquare}
                    color="bg-blue-500"
                />
                <StatCard
                    title="Projects"
                    value={stats.projectCount}
                    icon={Briefcase}
                    color="bg-green-500"
                />
                <StatCard
                    title="Certificates"
                    value={stats.certificateCount}
                    icon={Award}
                    color="bg-amber-500"
                />
            </div>

            {/* Additional Quick Actions or Charts could go here */}
            <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Quick Actions</h3>
                <div className="flex gap-4">
                    <button onClick={() => window.location.href = '/admin/projects'} className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded text-cyan-400 text-sm transition-colors">
                        + Add Project
                    </button>
                    <button onClick={() => window.location.href = '/admin/skills'} className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded text-cyan-400 text-sm transition-colors">
                        + Manage Skills
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DashboardHome;
