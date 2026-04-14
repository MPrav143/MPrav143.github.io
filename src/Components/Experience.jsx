import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import api from '../api';
import Doodles from './Doodles';

const Experience = () => {
  const [experiences, setExperiences] = useState([]);
  const [bgImage, setBgImage] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [expRes, aboutRes] = await Promise.all([
          api.get('/experience'),
          api.get('/about')
        ]);
        setExperiences(expRes.data || []);
        if (aboutRes.data && aboutRes.data.length > 0 && aboutRes.data[0].sectionBackgrounds?.experience) {
          setBgImage(`url('${aboutRes.data[0].sectionBackgrounds.experience}')`);
        }
      } catch (err) {
        console.error("Error fetching experience:", err);
      }
    };
    fetchData();
  }, []);

  // 1. DYNAMIC SORTING LOGIC: LATEST TO OLDEST
  const sortedExperiences = [...experiences].sort((a, b) => {
    const dateA = new Date(a.fromDate || a.startDate || 0);
    const dateB = new Date(b.fromDate || b.startDate || 0);
    return dateB - dateA;
  });

  // 2. CHUNK LOGIC FOR DESKTOP ROWS OF 3 (to center the last row)
  const chunkArray = (arr, size) => {
    const chunked = [];
    for (let i = 0; i < arr.length; i += size) {
      chunked.push(arr.slice(i, i + size));
    }
    return chunked;
  };
  const rows = chunkArray(sortedExperiences, 3);

  const ExperienceCard = ({ exp, index }) => (
    <motion.div
      id={`experience-${exp.company ? exp.company.toLowerCase().replace(/\s+/g, '-') : index}`}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="bg-gray-800 p-6 rounded-xl hover:shadow-lg hover:shadow-cyan-400/10 transition-all border border-gray-700/50 flex flex-col w-full md:max-w-md h-auto focus:outline-none focus:ring-2 focus:ring-cyan-500"
    >
      <div className="flex justify-between items-start mb-4 gap-3">
        <div className="flex gap-3 items-center">
          {exp.companyLogo && (
            <img src={exp.companyLogo} alt={exp.company} className="w-12 h-12 rounded-lg object-contain bg-gray-900 p-1 border border-gray-700" />
          )}
          <div>
            <h3 className="text-xl font-bold text-cyan-400">{exp.role}</h3>
            <p className="text-md font-semibold text-white">{exp.company}</p>
          </div>
        </div>
        <div className="text-right flex-shrink-0">
          <p className="text-xs md:text-sm text-gray-400 font-medium">
            {(exp.fromDate || exp.toDate) ? `${exp.fromDate} - ${exp.toDate}` : exp.duration}
          </p>
          <p className="text-xs text-gray-500">{exp.location}</p>
        </div>
      </div>
      
      <div className="flex flex-wrap items-center gap-2 mb-3">
        <span className="text-xs text-gray-300 bg-gray-700/60 px-2 py-1 rounded-full">{exp.type}</span>
      </div>

      <ul className="text-gray-300 mt-2 space-y-1 flex-grow">
        {exp.description && exp.description.slice(0, 3).map((point, idx) => (
          <li key={idx} className="flex items-start">
            <span className="text-cyan-400 mr-2 font-black">•</span>
            <span className="text-sm text-gray-300 leading-relaxed font-sans">{point}</span>
          </li>
        ))}
        {exp.description && exp.description.length > 3 && (
          <li className="text-gray-500 italic text-xs mt-1">+{exp.description.length - 3} more points...</li>
        )}
      </ul>
    </motion.div>
  );

  return (
    <section
      id="experience"
      className={`py-20 relative font-experience bg-cover bg-center ${bgImage ? 'md:bg-fixed' : ''}`}
      style={bgImage ? { backgroundImage: bgImage } : {}}
    >
      <div className={`absolute inset-0 ${bgImage ? 'bg-gray-900/60' : 'bg-gray-900/90'}`}></div>
      <Doodles sectionName="experience" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full flex flex-col items-center">
        <div className="section-heading-container mb-12">
          <h2 className="section-heading">
            <span className="text-cyan-400 capitalize">Experience</span>
          </h2>
          <div className="section-underline"></div>
        </div>

        {/* 🚀 DESKTOP MODE (Row chunking centering rule offsets setups) */}
        <div className="hidden lg:flex flex-col gap-6 w-full items-center">
          {rows.map((row, rowIndex) => (
            <div key={rowIndex} className="flex flex-row justify-center gap-6 w-full">
              {row.map((exp, cardIndex) => (
                <div key={exp._id || cardIndex} className="w-[360px]">
                  <ExperienceCard exp={exp} index={rowIndex * 3 + cardIndex} />
                </div>
              ))}
            </div>
          ))}
        </div>

        {/* 📱 TABLET & MOBILE MODE (Grid list setup flawlessly aligns side grids) */}
        <div className="flex lg:hidden flex-col md:grid md:grid-cols-2 gap-6 w-full max-w-4xl mx-auto justify-center">
          {sortedExperiences.map((exp, index) => (
            <div key={exp._id || index} className="w-full flex justify-center">
              <ExperienceCard exp={exp} index={index} />
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default Experience;