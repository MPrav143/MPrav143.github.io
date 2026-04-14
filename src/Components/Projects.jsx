import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../api';
import Doodles from './Doodles';
import { Star, Clock, Code, ExternalLink, Github as GithubIcon } from 'lucide-react';

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [bgImage, setBgImage] = useState("");
  const [sortBy, setSortBy] = useState('default'); // 'default', 'stars', 'updated'
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [projRes, aboutRes] = await Promise.all([
          api.get(`/projects?sortBy=${sortBy}`),
          api.get('/about')
        ]);
        setProjects(projRes.data);
        if (aboutRes.data && aboutRes.data.length > 0 && aboutRes.data[0].sectionBackgrounds?.projects) {
          setBgImage(`url('${aboutRes.data[0].sectionBackgrounds.projects}')`);
        }
      } catch (err) {
        console.error("Error fetching projects:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [sortBy]);

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
  const radius = N > 3 ? Math.round(150 / Math.tan(Math.PI / N)) + 50 : (N === 3 ? 220 : (N === 2 ? 180 : 0));

  return (
    <section
      id="projects"
      className={`py-20 relative font-projects overflow-hidden min-h-[1000px] flex flex-col items-center justify-center bg-cover bg-center ${bgImage ? 'md:bg-fixed' : ''}`}
      style={bgImage ? { backgroundImage: bgImage } : { backgroundColor: '#0f172a' }}
    >
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <Doodles sectionName="projects" />
        <div className="absolute top-[80%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[300px] bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-cyan-500/20 via-cyan-900/5 to-transparent blur-[80px] rounded-[100%]"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full flex flex-col items-center">
        
        <motion.div 
          initial={{ opacity: 0, y: -30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="section-heading-container mb-12"
        >
          <h2 className="section-heading">
            <span className="text-cyan-400 capitalize">Projects</span>
          </h2>
          <div className="section-underline"></div>
        </motion.div>

        {/* Sorting Toggles */}
        <div className="flex bg-white/5 backdrop-blur-md p-1 rounded-2xl border border-white/10 mb-16">
            <button 
                onClick={() => setSortBy('default')}
                className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${sortBy === 'default' ? 'bg-cyan-500 text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
            >
                Latest
            </button>
            <button 
                onClick={() => setSortBy('stars')}
                className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${sortBy === 'stars' ? 'bg-cyan-500 text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
            >
                Most Starred
            </button>
            <button 
                onClick={() => setSortBy('updated')}
                className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${sortBy === 'updated' ? 'bg-cyan-500 text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
            >
                Recently Updated
            </button>
        </div>

        {loading ? (
          <div className="h-[400px] flex items-center justify-center">
            <div className="w-12 h-12 border-4 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin"></div>
          </div>
        ) : displayProjects.length > 0 ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 50 }}
            whileInView={{ opacity: 1, scale: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="flex justify-center items-center mt-10 mb-32" 
            style={{ perspective: '2000px', width: '300px', height: '360px' }}
          >
            <div 
              className={`relative w-full h-full animate-carousel-spin`}
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
                    id={`projects-${project.title ? project.title.toLowerCase().replace(/\s+/g, '-') : index}`}
                    className="absolute inset-0"
                    style={{
                      transform: `rotateY(${angle}deg) translateZ(${radius}px)`,
                      transformStyle: 'preserve-3d',
                      transition: 'transform 800ms cubic-bezier(0.4, 0, 0.2, 1)',
                    }}
                    onMouseEnter={() => setHoveredIndex(index)}
                    onMouseLeave={() => setHoveredIndex(null)}
                  >
                    <div
                      className="relative w-full h-full rounded-2xl cursor-pointer"
                      style={{
                        transformStyle: 'preserve-3d',
                        transition: 'transform 800ms cubic-bezier(0.4, 0, 0.2, 1)',
                        transform: isHovered ? 'scale(1.15) rotateY(180deg)' : 'scale(1) rotateY(0deg)',
                      }}
                    >
                      {/* Front Face */}
                      <div
                        className="absolute inset-0 rounded-2xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.6)] border border-white/10 group"
                        style={{ backfaceVisibility: 'hidden' }}
                      >
                        {project.image ? (
                           <img src={project.image} alt={project.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                        ) : (
                           <div className="w-full h-full bg-gradient-to-br from-gray-800 via-gray-900 to-black flex items-center justify-center flex-col gap-4">
                             <div className="w-20 h-20 rounded-full bg-cyan-500/10 flex items-center justify-center border border-cyan-500/20 shadow-[0_0_30px_rgba(6,182,212,0.1)]">
                                <span className="text-4xl font-black text-cyan-400">{project.title.charAt(0)}</span>
                             </div>
                             {project.githubId && <GithubIcon className="text-white/20" size={40} />}
                           </div>
                        )}
                        <div className="absolute inset-x-0 bottom-0 p-6 bg-gradient-to-t from-black/90 via-black/40 to-transparent backdrop-blur-[2px]">
                          <h3 className="text-2xl font-black text-white tracking-tight">{project.title}</h3>
                          {project.category && <p className="text-cyan-400 text-xs font-bold uppercase tracking-widest mt-1">{project.category}</p>}
                        </div>
                      </div>

                      {/* Back Face */}
                      <div
                        className="absolute inset-0 rounded-2xl overflow-hidden bg-gray-900/95 backdrop-blur-[20px] border border-white/20 p-6 flex flex-col shadow-[0_20px_60px_rgba(0,0,0,0.8)]"
                        style={{
                          backfaceVisibility: 'hidden',
                          transform: 'rotateY(180deg)',
                        }}
                      >
                        <div className="flex justify-between items-start mb-4">
                            <h3 className="text-lg font-black text-white leading-tight">{project.title}</h3>
                            {project.githubId && (
                                <div className="flex items-center gap-1 bg-yellow-500/10 text-yellow-500 px-2 py-1 rounded-lg border border-yellow-500/20 text-[10px] font-bold">
                                    <Star size={10} fill="currentColor" /> {project.stars}
                                </div>
                            )}
                        </div>

                        <p className="text-gray-300 text-[11px] md:text-xs leading-relaxed line-clamp-4 mb-4">
                          {project.description || "No description available for this project."}
                        </p>

                        {/* Extra GitHub Metrics */}
                        {project.githubId && (
                            <div className="grid grid-cols-2 gap-2 mb-4">
                                <div className="flex items-center gap-2 bg-white/5 p-2 rounded-xl border border-white/5">
                                    <Code size={14} className="text-cyan-400" />
                                    <span className="text-[10px] font-bold text-gray-400 uppercase">{project.language || 'Code'}</span>
                                </div>
                                <div className="flex items-center gap-2 bg-white/5 p-2 rounded-xl border border-white/5">
                                    <Clock size={14} className="text-purple-400" />
                                    <span className="text-[10px] font-bold text-gray-400">
                                        {project.lastUpdated ? new Date(project.lastUpdated).toLocaleDateString(undefined, { month: 'short', year: 'numeric' }) : 'Recent'}
                                    </span>
                                </div>
                            </div>
                        )}

                        <div className="flex flex-wrap gap-1.5 mb-6">
                          {(project.techStack || []).slice(0, 4).map(tech => (
                            <span key={tech} className="text-[9px] font-bold px-2 py-1 bg-cyan-500/10 text-cyan-300 rounded-md border border-cyan-500/10">
                              {tech}
                            </span>
                          ))}
                        </div>

                        <div className="flex gap-2 mt-auto">
                          {project.link && (
                            <button
                              onClick={(e) => { e.stopPropagation(); handleViewProject(project.link); }}
                              className="flex-1 flex items-center justify-center gap-2 bg-white text-black text-[11px] font-black py-2.5 rounded-xl transition-all hover:bg-cyan-500 hover:text-white"
                            >
                              <ExternalLink size={14} /> LIVE
                            </button>
                          )}
                          {project.repo && (
                            <button
                              onClick={(e) => { e.stopPropagation(); handleViewProject(project.repo); }}
                              className="flex-1 flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 text-white text-[11px] font-black py-2.5 rounded-xl border border-white/10 transition-all"
                            >
                              <GithubIcon size={14} /> REPO
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
          <div className="text-center py-20">
            <p className="text-gray-500 font-bold">No approved projects to show</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default Projects;