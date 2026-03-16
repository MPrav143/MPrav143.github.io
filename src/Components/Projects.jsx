import React, { useState, useEffect } from 'react';
import api from '../api';

const Projects = () => {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await api.get('/projects');
        setProjects(res.data);
      } catch (err) {
        console.error("Error fetching projects:", err);
      }
    };
    fetchProjects();
  }, []);

  const handleViewProject = (url) => {
    if (url) {
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <section
      id="projects"
      className="py-20 relative"
      style={{
        backgroundImage: "url('https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&q=80')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed"
      }}
    >
      <div className="absolute inset-0 bg-gray-900/90"></div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <h2 className="text-3xl font-bold mb-12 text-center">
          <span className="text-cyan-400">Projects</span>
          <div className="w-20 h-1 bg-gradient-to-r from-cyan-400 to-cyan-900 mx-auto rounded-full"></div>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project) => (
            <div
              key={project._id}
              className="bg-gray-800 rounded-xl overflow-hidden hover:shadow-lg hover:shadow-cyan-400/10 transition-all transform hover:-translate-y-1 flex flex-col"
            >
              {project.image ? (
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-48 object-cover rounded-t-xl"
                />
              ) : (
                <div className="w-full h-48 bg-gray-700 flex items-center justify-center text-cyan-400">
                  {project.title}
                </div>
              )}

              <div className="p-6 flex flex-col flex-grow">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-xl font-semibold text-cyan-400">
                    {project.title}
                  </h3>
                  <span className="text-sm text-white">{project.date}</span>
                </div>

                <p className="text-white mb-4 flex-grow">{project.description}</p>

                <div className="flex flex-wrap gap-2 mb-4">
                  {project.techStack && project.techStack.map((tech) => (
                    <span
                      key={tech}
                      className="bg-blue-400/10 text-cyan-400 px-3 py-1 rounded-full text-sm"
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                <div className="mt-auto flex gap-2">
                  {project.link && (
                    <button
                      onClick={() => handleViewProject(project.link)}
                      className="flex-1 bg-cyan-400/10 hover:bg-cyan-400/20 text-cyan-400 py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
                    >
                      View Project
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </button>
                  )}
                  {project.repo && (
                    <button
                      onClick={() => handleViewProject(project.repo)}
                      className="flex-1 bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
                    >
                      GitHub
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36 5-1.5 8 0 0 6 0 2.23-.07 4.35-1.5 5-2.64 0-1 0-3 1.5-2.64 3.72-2.37 5-2.64 12.36 0 16-1.5 3-1.5 6 0 6-5.5-.07-2.64 6-5.5 6-5.5a4.8 4.8 0 0 0-1 3.5v4"></path></svg>
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Projects;