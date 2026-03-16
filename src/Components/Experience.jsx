import React, { useState, useEffect } from 'react';
import api from '../api';

const Experience = () => {
  const [experiences, setExperiences] = useState([]);

  useEffect(() => {
    const fetchExperience = async () => {
      try {
        const res = await api.get('/experience');
        setExperiences(res.data);
      } catch (err) {
        console.error("Error fetching experience:", err);
      }
    };
    fetchExperience();
  }, []);

  return (
    <section
      id="experience"
      className="py-20 relative"
      style={{
        backgroundImage: "url('https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed"
      }}
    >
      <div className="absolute inset-0 bg-gray-900/90"></div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <h2 className="text-3xl font-bold mb-12 text-center">
          <span className="border-b-2 border-cyan-400 pb-1 text-cyan-400">Experience</span>
        </h2>

        {/* Changed from space-y-8 to grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
          {experiences.map((exp, index) => (
            <div
              key={exp._id || index}
              className="bg-gray-800 p-6 rounded-xl hover:shadow-lg hover:shadow-cyan-400/10 transition-all h-full flex flex-col"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-bold text-cyan-400">{exp.role}</h3>
                  <p className="text-lg font-semibold text-white">{exp.company}</p>
                </div>
                <div className="text-right">
                  <p className="text-gray-400">
                    {(exp.fromDate || exp.toDate) ? `${exp.fromDate} - ${exp.toDate}` : exp.duration}
                  </p>
                  <p className="text-sm text-gray-500">{exp.location}</p>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <span className="text-sm text-gray-300 bg-gray-700 px-3 py-1 rounded-full">
                  {exp.type}
                </span>
              </div>

              <ul className="text-gray-300 mt-4 space-y-2 flex-grow">
                {exp.description && exp.description.slice(0, 3).map((point, idx) => (
                  <li key={idx} className="flex items-start">
                    <span className="text-cyan-400 mr-2">•</span>
                    <span className="text-sm">{point}</span>
                  </li>
                ))}
                {exp.description && exp.description.length > 3 && (
                  <li className="text-gray-500 italic text-sm">
                    +{exp.description.length - 3} more points...
                  </li>
                )}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Experience;