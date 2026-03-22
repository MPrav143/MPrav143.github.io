import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import api from '../api';
import Doodles from './Doodles';

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [bgImage, setBgImage] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [projRes, aboutRes] = await Promise.all([
          api.get('/projects'),
          api.get('/about')
        ]);
        setProjects(projRes.data);
        if (aboutRes.data && aboutRes.data.length > 0 && aboutRes.data[0].sectionBackgrounds?.projects) {
          setBgImage(`url('${aboutRes.data[0].sectionBackgrounds.projects}')`);
        }
      } catch (err) {
        console.error("Error fetching projects:", err);
      }
    };
    fetchData();
  }, []);

  const handleViewProject = (url) => {
    if (url) {
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  };

  const [isPaused, setIsPaused] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState(null);

  const displayProjects = projects;
  const N = Math.max(displayProjects.length, 1);
  const anglePerCard = 360 / N;
  const radius = N > 3 ? Math.round(150 / Math.tan(Math.PI / N)) + 30 : (N === 3 ? 200 : (N === 2 ? 160 : 0));

  return (
    <section
      id="projects"
      className={`py-20 relative font-projects overflow-hidden min-h-[900px] flex flex-col justify-center bg-cover bg-center ${bgImage ? 'md:bg-fixed' : ''}`}
      style={bgImage ? { backgroundImage: bgImage } : { backgroundColor: '#0f172a' }}
    >
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <Doodles sectionName="projects" />
        <div className="absolute top-[80%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[300px] bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-cyan-500/20 via-cyan-900/5 to-transparent blur-[80px] rounded-[100%]"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        
        <motion.div 
          initial={{ opacity: 0, y: -30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="section-heading-container mb-24"
        >
          <h2 className="section-heading">
            <span className="text-cyan-400 capitalize">Projects</span>
          </h2>
          <div className="section-underline"></div>
        </motion.div>

        {displayProjects.length > 0 ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 50 }}
            whileInView={{ opacity: 1, scale: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="flex justify-center items-center mt-20 mb-32" 
            style={{ perspective: '1500px' }}
          >
            <div 
              className={`relative w-[300px] h-[360px] animate-carousel-spin`}
              style={{
                transformStyle: 'preserve-3d',
                animationPlayState: isPaused ? 'paused' : 'running',
              }}
              onMouseEnter={() => setIsPaused(true)}
              onMouseLeave={() => setIsPaused(false)}
            >
              {displayProjects.map((project, index) => {
                const angle = anglePerCard * index;
                const isHovered = hoveredIndex === index;

                return (
                  <div
                    key={project._id}
                    className="absolute inset-0"
                    style={{
                      transform: `rotateY(${angle}deg) translateZ(${radius}px)`,
                      transformStyle: 'preserve-3d',
                      transition: 'transform 800ms cubic-bezier(0.4, 0, 0.2, 1)',
                    }}
                    onMouseEnter={() => setHoveredIndex(index)}
                    onMouseLeave={() => setHoveredIndex(null)}
                  >
                    {/* The Flipping Card */}
                    <div
                      className="relative w-full h-full rounded-2xl cursor-pointer"
                      style={{
                        transformStyle: 'preserve-3d',
                        transition: 'transform 800ms cubic-bezier(0.4, 0, 0.2, 1)',
                        transform: isHovered ? 'scale(1.1) rotateY(180deg)' : 'scale(1) rotateY(0deg)',
                      }}
                    >
                      {/* Front Face: High-resolution image with a bottom-aligned glassmorphism title bar */}
                      <div
                        className="absolute inset-0 rounded-2xl overflow-hidden shadow-[0_10px_30px_rgba(0,0,0,0.5)] border border-white/10"
                        style={{ backfaceVisibility: 'hidden' }}
                      >
                        {project.image ? (
                           <img src={project.image} alt={project.title} className="w-full h-full object-cover" />
                        ) : (
                           <div className="w-full h-full bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center font-bold text-4xl text-cyan-400">
                             {project.title.charAt(0)}
                           </div>
                        )}
                        <div className="absolute inset-x-0 bottom-0 p-6 bg-white/10 backdrop-blur-md border-t border-white/20">
                          <h3 className="text-2xl font-bold text-white shadow-sm drop-shadow-lg">{project.title}</h3>
                        </div>
                      </div>

                      {/* Back Face: Full glassmorphism effect (blur: 15px, semi-transparent white bg) */}
                      <div
                        className="absolute inset-0 rounded-2xl overflow-hidden bg-white/10 backdrop-blur-[15px] border border-white/20 p-8 flex flex-col items-center justify-center shadow-[0_10px_40px_rgba(0,0,0,0.4)]"
                        style={{
                          backfaceVisibility: 'hidden',
                          transform: 'rotateY(180deg)',
                        }}
                      >
                        <h3 className="text-xl font-bold text-white mb-3 text-center">{project.title}</h3>
                        <p className="text-white/90 text-xs md:text-sm text-center mb-4 leading-relaxed line-clamp-4 flex-grow w-full">
                          {project.description}
                        </p>

                        {/* Tech-stack pills */}
                        <div className="flex flex-wrap justify-center gap-2 mb-6 w-full">
                          {project.techStack?.slice(0, 4).map(tech => (
                            <span key={tech} className="text-[10px] font-semibold px-2 py-1 bg-black/20 text-white rounded-full border border-white/20 shadow-sm">
                              {tech}
                            </span>
                          ))}
                        </div>

                        {/* Two call-to-action buttons */}
                        <div className="flex gap-3 justify-center mt-auto w-full">
                          {project.link && (
                            <button
                              onClick={(e) => { e.stopPropagation(); handleViewProject(project.link); }}
                              className="flex-1 bg-white text-gray-900 text-sm font-bold py-2 px-2 rounded-xl shadow-lg transition-all hover:scale-105 active:scale-95"
                            >
                              Live Demo
                            </button>
                          )}
                          {project.repo && (
                            <button
                              onClick={(e) => { e.stopPropagation(); handleViewProject(project.repo); }}
                              className="flex-1 bg-black/40 hover:bg-black/60 text-white text-sm font-bold py-2 px-2 rounded-xl border border-white/30 shadow-lg transition-all hover:scale-105 active:scale-95"
                            >
                              View Code
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        ) : (
          <div className="text-center text-gray-400">Loading projects...</div>
        )}
      </div>
    </section>
  );
};

export default Projects;