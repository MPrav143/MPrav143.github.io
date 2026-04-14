import { GraduationCap } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import api from '../api';
import Doodles from './Doodles';

const Education = () => {
  const [educationData, setEducationData] = useState([]);
  const [bgImage, setBgImage] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [eduRes, aboutRes] = await Promise.all([
          api.get('/education'),
          api.get('/about')
        ]);
        setEducationData(eduRes.data);
        if (aboutRes.data && aboutRes.data.length > 0 && aboutRes.data[0].sectionBackgrounds?.education) {
          setBgImage(`url('${aboutRes.data[0].sectionBackgrounds.education}')`);
        }
      } catch (err) {
        console.error("Error fetching education:", err);
      }
    };
    fetchData();
  }, []);

  return (
    <section
      id="education"
      className={`py-20 text-white relative font-education bg-cover bg-center ${bgImage ? 'md:bg-fixed' : ''}`}
      style={bgImage ? { backgroundImage: bgImage } : {}}
    >
      <div className={`absolute inset-0 ${bgImage ? 'bg-[#0e1628]/60' : 'bg-[#0e1628]/90'} z-0`}></div>
      <Doodles sectionName="education" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full flex flex-col items-center">
        
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="section-heading-container mb-12"
        >
          <h2 className="section-heading">
            <span className="text-cyan-400 capitalize">Education</span>
          </h2>
          <div className="section-underline"></div>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8 w-full max-w-5xl">
          {educationData.map((edu, index) => (
            <motion.div
              key={edu._id}
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: index * 0.15 }}
              className="bg-gray-900/80 border border-cyan-400/20 rounded-xl p-6 hover:border-cyan-400/40 transition-all duration-300 hover:shadow-lg hover:shadow-cyan-400/10 backdrop-blur-sm cursor-default"
            >
              <div className="flex items-start gap-5">
                <div className="bg-cyan-400/10 p-3 rounded-full flex-shrink-0 animate-pulse">
                  <GraduationCap className="text-cyan-400" size={24} />
                </div>
                <div className="w-full">
                  <div className="grid grid-cols-6 gap-2 mb-4">
                    <div className="col-span-4 text-left">
                      <p className="text-xl font-bold text-cyan-400 tracking-wide">{edu.institution}</p>
                      <p className="font-semibold text-white text-sm mt-1">{edu.degree}</p>
                    </div>
                    <div className="col-span-2 text-right">
                      <p className="text-gray-400 font-medium text-xs">
                        {(edu.fromDate || edu.toDate) ? `${edu.fromDate} - ${edu.toDate}` : edu.duration}
                      </p>
                      <p className="text-xs font-bold text-cyan-400/80 mt-1">{edu.gpa}</p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {edu.courses && edu.courses.map((course, idx) => (
                      <span key={idx} className="text-[10px] bg-gray-800/80 border border-gray-700/50 px-2 py-1 rounded-md text-gray-300 shadow-sm">
                        {course}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Education;