import { Crown } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import api from '../api';

const About = () => {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get('/about');
        if (res.data && res.data.length > 0) {
          setProfile(res.data[0]); // Assuming single profile for now
        }
      } catch (err) {
        console.error("Error fetching profile:", err);
      }
    };
    fetchProfile();
  }, []);

  if (!profile) return null; // or loading state

  return (
    <section
      id="about"
      className="py-20 relative"
      style={{
        backgroundImage: "url('https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&q=80')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed"
      }}
    >
      <div className="absolute inset-0 bg-gray-900/90"></div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <h2 className="text-3xl font-bold mb-12 text-center">
          <span className="border-b-2 border-cyan-400 pb-1 text-cyan-400">About Me</span>
        </h2>

        <div className="flex flex-col lg:flex-row gap-12">
          <div className="w-full">
            <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-6 mb-8 hover:transform hover:scale-[1.02] transition-all duration-300 hover:shadow-lg hover:shadow-cyan-400/10">
              <h3 className="text-2xl font-semibold mb-4 text-cyan-400">Bio</h3>
              <p className="text-gray-300 whitespace-pre-line leading-relaxed">
                {profile.summary || "Passionate Data Science enthusiast and CSE undergraduate with hands-on experience in data analysis, machine learning, and building predictive models. Also skilled in MERN Stack development, building full-stack web applications. Leading the Software Development Club while continuously upskilling."}
              </p>
            </div>

            {/* Dynamic Leadership Section */}
            {profile.leadership && profile.leadership.length > 0 && (
              <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-6 hover:transform hover:scale-[1.02] transition-all duration-300 hover:shadow-lg hover:shadow-cyan-400/10">
                <h3 className="text-2xl font-semibold mb-4 text-cyan-400">Leadership</h3>
                <div className="space-y-6 ml-2">
                  {profile.leadership.map((item, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <Crown className="text-cyan-400 mt-1 flex-shrink-0" size={20} />
                      <div>
                        <div className="flex flex-wrap items-baseline gap-2">
                          <h4 className="text-xl font-medium text-white">{item.role}</h4>
                          <span className="text-sm text-cyan-400 font-medium px-2 py-0.5 bg-cyan-400/10 rounded-full border border-cyan-400/20">{item.period}</span>
                        </div>
                        <p className="text-gray-400 mt-1">{item.organization}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>


        </div>
      </div>
    </section>
  );
};

export default About;