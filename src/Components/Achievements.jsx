import React, { useState, useEffect } from 'react';
import { Award, Calendar, ExternalLink, Star } from 'lucide-react';
import api from '../api';
import Doodles from './Doodles';

const Achievements = () => {
  const [achievements, setAchievements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [bgImage, setBgImage] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [achRes, aboutRes] = await Promise.all([
          api.get('/achievements'),
          api.get('/about')
        ]);
        setAchievements(achRes.data);
        if (aboutRes.data && aboutRes.data.length > 0 && aboutRes.data[0].sectionBackgrounds?.achievements) {
          setBgImage(`url('${aboutRes.data[0].sectionBackgrounds.achievements}')`);
        }
      } catch (err) {
        console.error("Error fetching achievements:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <section id="achievements" className="py-20 bg-gray-900 flex justify-center items-center">
        <div className="animate-pulse text-cyan-400">Loading Achievements...</div>
      </section>
    )
  }

  return (
    <section
      id="achievements"
      className={`py-20 relative font-achievements bg-cover bg-center ${bgImage ? 'md:bg-fixed' : ''}`}
      style={bgImage ? {
        backgroundImage: bgImage,
      } : {}}
    >
      <div className={`absolute inset-0 ${bgImage ? 'bg-gray-900/60' : 'bg-gray-900/90'} z-0`}></div>
      <Doodles sectionName="achievements" />
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2"></div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="section-heading-container">
          <h2 className="section-heading">
            <Award className="text-cyan-400" size={40} />
            <span className="text-cyan-400 capitalize">Achievements</span>
          </h2>
          <div className="section-underline"></div>
        </div>

        <div className="space-y-6">
          {achievements.map((item, index) => (
            <div
              key={index}
              className="bg-gray-800/40 backdrop-blur-md rounded-xl p-6 border border-gray-700 hover:border-cyan-500/50 transition-all duration-300 hover:bg-gray-800/60 group"
            >
              <div className="flex flex-col md:flex-row md:items-start gap-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-cyan-500/10 rounded-full flex items-center justify-center group-hover:bg-cyan-500/20 transition-colors">
                    <Star className="text-cyan-400" size={24} />
                  </div>
                </div>

                <div className="flex-grow">
                  <div className="flex flex-col md:flex-row md:items-center justify-between mb-2">
                    <h3 className="text-xl font-bold text-white group-hover:text-cyan-400 transition-colors">
                      {item.title}
                    </h3>
                    <div className="flex items-center text-gray-500 text-sm mt-1 md:mt-0">
                      <Calendar size={14} className="mr-1" />
                      {item.date}
                    </div>
                  </div>

                  <p className="text-gray-300 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Achievements;