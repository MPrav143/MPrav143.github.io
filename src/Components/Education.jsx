import { GraduationCap } from 'lucide-react';

import React, { useState, useEffect } from 'react';
import api from '../api';

const Education = () => {
  const [educationData, setEducationData] = useState([]);

  useEffect(() => {
    const fetchEducation = async () => {
      try {
        const res = await api.get('/education');
        setEducationData(res.data);
      } catch (err) {
        console.error("Error fetching education:", err);
      }
    };
    fetchEducation();
  }, []);

  return (
    <section
      id="education"
      className="py-20 text-white relative"
      style={{
        backgroundImage: "url('https://res.cloudinary.com/diwykgo1k/image/upload/v1748800126/Education_crzdje.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed"
      }}
    >
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-[#0e1628]/90 z-0"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">
          <span className="text-cyan-400">Education</span>
          <div className="w-20 h-1 bg-gradient-to-r from-cyan-400 to-cyan-900 mx-auto rounded-full"></div>
        </h2>

        <div className="grid md:grid-cols-2 gap-8">
          {educationData.map((edu) => (
            <div
              key={edu._id}
              className="
                bg-gray-900/80 border border-cyan-400/20 rounded-xl p-6 
                hover:border-cyan-400/40 transition-all duration-300
                hover:transform hover:-translate-y-1 hover:shadow-lg hover:shadow-cyan-400/10
                backdrop-blur-sm
              "
            >
              <div className="flex items-start gap-5">
                <div className="bg-cyan-400/10 p-3 rounded-full">
                  <GraduationCap className="text-cyan-400" size={24} />
                </div>
                <div>
                  <div className="grid grid-cols-6 gap-4 mb-4">
                    <div className="col-span-4 text-left">
                      <p className="text-xl font-bold text-cyan-400">{edu.institution}</p>
                      <p className="font-semibold text-white">{edu.degree}</p>
                    </div>
                    <div className="col-span-2 text-right">
                      <p className="text-gray-400 font-medium ">
                        {(edu.fromDate || edu.toDate) ? `${edu.fromDate} - ${edu.toDate}` : edu.duration}
                      </p>
                      <p className="text-sm text-gray-400 text-center">{edu.gpa}</p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {edu.courses && edu.courses.map((course, idx) => (
                      <span key={idx} className="text-xs bg-gray-800 px-2 py-1 rounded text-white">{course}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Education;