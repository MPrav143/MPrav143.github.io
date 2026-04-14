import { Crown } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import api from '../api';
import Doodles from './Doodles';

const About = () => {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get('/about');
        if (res.data && res.data.length > 0) {
          setProfile(res.data[0]);
        }
      } catch (err) {
        console.error("Error fetching profile:", err);
      }
    };
    fetchProfile();
  }, []);

  if (!profile) return null;

  return (
    <section
      id="about"
      className={`py-20 relative font-about bg-cover bg-center ${profile?.sectionBackgrounds?.about ? 'md:bg-fixed' : ''}`}
      style={profile?.sectionBackgrounds?.about ? { backgroundImage: `url('${profile.sectionBackgrounds.about}')` } : {}}
    >
      <div className={`absolute inset-0 ${profile?.sectionBackgrounds?.about ? 'bg-gray-900/60' : 'bg-gray-900/90'}`}></div>
      <Doodles sectionName="about" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full flex flex-col items-center">
        
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="section-heading-container mb-12"
        >
          <h2 className="section-heading">
            <span className="text-cyan-400 capitalize">About Me</span>
          </h2>
          <div className="section-underline"></div>
        </motion.div>

        <div className="flex flex-col lg:flex-row gap-12 w-full max-w-4xl justify-center">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="w-full"
          >
            <motion.div 
              whileHover={{ scale: 1.01, boxShadow: "0 10px 30px rgba(34,211,238,0.1)" }}
              className="bg-gray-800/50 border border-gray-700/50 rounded-2xl p-6 mb-8 transition-all duration-300 backdrop-blur-sm cursor-default"
            >
              <h3 className="text-2xl font-bold mb-4 text-cyan-400 tracking-wide font-sans">Bio</h3>
              <p className="text-gray-300 whitespace-pre-line leading-relaxed text-sm md:text-base">
                {profile.summary || "Passionate Data Science enthusiast and CSE undergraduate with hands-on experience in data analysis, machine learning, and building predictive models. Also skilled in MERN Stack development, building full-stack web applications. Leading the Software Development Club while continuously upskilling."}
              </p>
            </motion.div>

            {profile.leadership && profile.leadership.length > 0 && (
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="bg-gray-800/50 border border-gray-700/50 rounded-2xl p-6 hover:shadow-lg transition-all duration-300 backdrop-blur-sm cursor-default"
              >
                <h3 className="text-2xl font-bold mb-5 text-cyan-400 tracking-wide font-sans">Leadership</h3>
                <div className="space-y-6 ml-1">
                  {profile.leadership.map((item, index) => (
                    <div key={index} className="flex items-start gap-4">
                      <Crown className="text-cyan-400 mt-1 flex-shrink-0" size={20} />
                      <div>
                        <div className="flex flex-wrap items-baseline gap-2">
                          <h4 className="text-lg font-bold text-white">{item.role}</h4>
                          <span className="text-[10px] text-cyan-400 font-semibold px-2.5 py-1 bg-cyan-400/10 rounded-full border border-cyan-400/20">{item.period}</span>
                        </div>
                        <p className="text-sm text-gray-400 mt-1 font-medium">{item.organization}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default About;