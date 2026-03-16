import React, { useEffect, useState } from 'react';
import { ExternalLink, Award, Code, Zap, Trophy, Loader, Star } from 'lucide-react';
import api from '../api';

const LeetCode = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [data, setData] = useState({
    stats: {
      totalSolved: 0,
      totalQuestions: 0,
      easy: 0,
      easyTotal: 0,
      medium: 0,
      mediumTotal: 0,
      hard: 0,
      hardTotal: 0,
      ranking: "0",
      contestRating: 0,
      reputation: 0,
    },
    badges: []
  });

  useEffect(() => {
    const fetchLeetCodeData = async () => {
      try {
        const response = await api.get('/leetcode/Praveen_1708');
        const leetData = response.data;

        const matchedUser = leetData.matchedUser;
        const allQuestions = leetData.allQuestionsCount;
        const contestRanking = leetData.userContestRanking;

        // Helper to find count by difficulty
        const getSolved = (diff) => matchedUser.submitStats.acSubmissionNum.find(s => s.difficulty === diff)?.count || 0;
        const getTotal = (diff) => allQuestions.find(q => q.difficulty === diff)?.count || 0;

        const stats = {
          totalSolved: getSolved('All'),
          totalQuestions: getTotal('All'),
          easy: getSolved('Easy'),
          easyTotal: getTotal('Easy'),
          medium: getSolved('Medium'),
          mediumTotal: getTotal('Medium'),
          hard: getSolved('Hard'),
          hardTotal: getTotal('Hard'),
          ranking: matchedUser.profile.ranking.toLocaleString(),
          reputation: matchedUser.profile.reputation,
          contestRating: contestRanking ? Math.round(contestRanking.rating) : 0,
        };

        const badges = matchedUser.badges ? matchedUser.badges.map(badge => ({
          name: badge.displayName,
          icon: badge.icon.startsWith('http') ? badge.icon : `https://leetcode.com${badge.icon}`,
          creationDate: badge.creationDate
        })) : [];

        setData({ stats, badges });
        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch LeetCode data:", err);
        setError("Failed to load LeetCode data");
        setLoading(false);
      }
    };

    fetchLeetCodeData();
  }, []);

  if (loading) {
    return (
      <section className="py-24 bg-[#0a0a0a] flex justify-center items-center min-h-[500px]">
        <div className="relative">
          <div className="absolute inset-0 bg-cyan-500 blur-xl opacity-20 animate-pulse"></div>
          <Loader className="relative z-10 animate-spin text-cyan-400" size={64} />
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-24 bg-[#0a0a0a] flex justify-center items-center">
        <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-8 text-center max-w-lg">
          <h3 className="text-xl text-cyan-400 font-bold mb-3">Unable to Load Stats</h3>
          <p className="text-gray-400 mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-400 rounded-lg transition-colors border border-cyan-500/30"
          >
            Retry
          </button>
        </div>
      </section>
    );
  }

  const { stats, badges } = data;

  return (
    <section
      className="py-24 relative overflow-hidden"
      style={{
        backgroundImage: "url('https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&q=80')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed"
      }}
    >
      <div className="absolute inset-0 bg-[#0a0a0a]/90"></div>
      {/* Abstract Background */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-green-600/10 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2"></div>
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-emerald-600/10 rounded-full blur-[120px] translate-y-1/2 -translate-x-1/2"></div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">

        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
          <div>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 flex items-center gap-4">
              <Code className="text-cyan-400" size={48} />
              <span className="bg-clip-text bg-gradient-to-r text-cyan-400">
                LeetCode
              </span>
            </h2>
            <p className="text-gray-400 text-lg max-w-xl leading-relaxed">
              Continuously pushing boundaries with algorithmic problem solving.
              Here is a snapshot of my coding journey.
            </p>
          </div>

          <a
            href="https://leetcode.com/u/Praveen_1708/"
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-3 px-6 py-3 bg-gray-900 border border-gray-800 rounded-xl hover:border-cyan-500/50 hover:bg-gray-800 transition-all duration-300"
          >
            <span className="text-gray-300 group-hover:text-white font-medium">View Profile</span>
            <ExternalLink size={18} className="text-gray-500 group-hover:text-cyan-400 transition-colors" />
          </a>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

          {/* Main Stats Column */}
          <div className="lg:col-span-4 space-y-6">

            {/* Total Solved Card */}
            <div className="bg-gray-900/50 backdrop-blur-xl rounded-3xl p-8 border border-gray-800 relative overflow-hidden group hover:border-cyan-500/30 transition-all duration-300">
              <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                <Trophy size={100} className="text-cyan-500 transform rotate-12" />
              </div>

              <div className="relative z-10">
                <p className="text-cyan-400 font-medium mb-2">Total Solved</p>
                <div className="flex items-baseline gap-2">
                  <h3 className="text-6xl font-bold text-white">{stats.totalSolved}</h3>
                  <span className="text-gray-500 font-semibold">/ {stats.totalQuestions}</span>
                </div>

                <div className="mt-8 space-y-4">
                  {/* Progress Bars */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-emerald-400 font-medium">Easy</span>
                      <span className="text-gray-400">{stats.easy} <span className="text-xs text-gray-600">/ {stats.easyTotal}</span></span>
                    </div>
                    <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-full" style={{ width: `${(stats.easy / stats.easyTotal) * 100}%` }}></div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-amber-400 font-medium">Medium</span>
                      <span className="text-gray-400">{stats.medium} <span className="text-xs text-gray-600">/ {stats.mediumTotal}</span></span>
                    </div>
                    <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-amber-500 to-amber-400 rounded-full" style={{ width: `${(stats.medium / stats.mediumTotal) * 100}%` }}></div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-rose-400 font-medium">Hard</span>
                      <span className="text-gray-400">{stats.hard} <span className="text-xs text-gray-600">/ {stats.hardTotal}</span></span>
                    </div>
                    <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-rose-500 to-rose-400 rounded-full" style={{ width: `${(stats.hard / stats.hardTotal) * 100}%` }}></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-900/50 backdrop-blur-xl rounded-2xl p-6 border border-gray-800 hover:border-cyan-500/30 transition-all duration-300">
                <div className="bg-yellow-500/10 w-10 h-10 rounded-lg flex items-center justify-center mb-4">
                  <Zap className="text-yellow-500" size={20} />
                </div>
                <p className="text-2xl font-bold text-white mb-1">{stats.contestRating}</p>
                <p className="text-gray-500 text-xs uppercase tracking-wider">Rating</p>
              </div>

              <div className="bg-gray-900/50 backdrop-blur-xl rounded-2xl p-6 border border-gray-800 hover:border-cyan-500/30 transition-all duration-300">
                <div className="bg-purple-500/10 w-10 h-10 rounded-lg flex items-center justify-center mb-4">
                  <Star className="text-purple-500" size={20} />
                </div>
                <p className="text-2xl font-bold text-white mb-1">{stats.ranking}</p>
                <p className="text-gray-500 text-xs uppercase tracking-wider">Global Rank</p>
              </div>
            </div>
          </div>

          {/* Badges Column */}
          <div className="lg:col-span-8">
            <div className="bg-gray-900/50 backdrop-blur-xl rounded-3xl p-8 border border-gray-800 h-full hover:border-cyan-500/30 transition-all duration-300">
              <div className="flex items-center gap-3 mb-8">
                <Award className="text-cyan-400" size={24} />
                <h3 className="text-xl font-bold text-cyan-400">Badges & Achievements</h3>
                <span className="px-3 py-1 bg-gray-800 rounded-full text-xs text-gray-400 border border-gray-700">
                  {badges.length} Unlocked
                </span>
              </div>

              {badges.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-64 text-gray-500 bg-gray-900/30 rounded-2xl border border-dashed border-gray-800 hover:border-cyan-500/30 transition-all duration-300">
                  <Award size={48} className="mb-4 opacity-50" />
                  <p>No badges found yet</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-4">
                  {badges.map((badge, index) => (
                    <div
                      key={index}
                      className="group flex flex-col items-center justify-center p-6 bg-gray-900 rounded-2xl border border-gray-800 hover:border-cyan-500/50 transition-all duration-300 hover:-translate-y-1"
                    >
                      <div className="w-20 h-20 mb-4 relative flex items-center justify-center">
                        <div className="absolute inset-0 bg-cyan-500/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        <img
                          src={badge.icon}
                          alt={badge.name}
                          className="w-full h-full object-contain relative z-10 drop-shadow-lg"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = "https://upload.wikimedia.org/wikipedia/commons/1/19/LeetCode_logo_black.png"
                          }}
                        />
                      </div>
                      <p className="text-gray-300 text-sm font-medium text-center line-clamp-2 group-hover:text-white transition-colors">
                        {badge.name}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default LeetCode;