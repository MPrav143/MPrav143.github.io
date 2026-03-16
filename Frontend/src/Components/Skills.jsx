import { useState, useEffect } from 'react';
import api from '../api';
import { Cpu, Globe, Database, Layout, Server, Code, Smartphone, Terminal, PenTool, Layers } from 'lucide-react';

const Skills = () => {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const res = await api.get('/skills');
        setSkills(res.data);
      } catch (err) {
        console.error("Error fetching skills:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchSkills();
  }, []);

  const getCategoryIcon = (category) => {
    const lower = category.toLowerCase();
    if (lower.includes('front')) return <Layout size={24} className="text-cyan-400" />;
    if (lower.includes('back')) return <Server size={24} className="text-green-400" />;
    if (lower.includes('database')) return <Database size={24} className="text-amber-400" />;
    if (lower.includes('lang')) return <Code size={24} className="text-purple-400" />;
    if (lower.includes('tool')) return <Terminal size={24} className="text-rose-400" />;
    if (lower.includes('mobile')) return <Smartphone size={24} className="text-blue-400" />;
    if (lower.includes('design')) return <PenTool size={24} className="text-pink-400" />;
    return <Layers size={24} className="text-gray-400" />;
  };

  const getCategoryColor = (category) => {
    const lower = category.toLowerCase();
    if (lower.includes('front')) return "border-cyan-500/30 hover:shadow-cyan-500/20";
    if (lower.includes('back')) return "border-green-500/30 hover:shadow-green-500/20";
    if (lower.includes('database')) return "border-amber-500/30 hover:shadow-amber-500/20";
    if (lower.includes('lang')) return "border-purple-500/30 hover:shadow-purple-500/20";
    return "border-gray-700 hover:shadow-gray-500/20";
  }

  if (loading) {
    return (
      <section id="skills" className="py-20 bg-gray-900 flex justify-center items-center">
        <div className="animate-pulse text-cyan-400">Loading Skills...</div>
      </section>
    )
  }

  return (
    <section
      id="skills"
      className="py-20 relative"
      style={{
        backgroundImage: "url('https://res.cloudinary.com/diwykgo1k/image/upload/v1765440818/Skills_byxtgn.avif')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed"
      }}
    >
      {/* Background decoration */}
      <div className="absolute top-1/4 left-0 w-64 h-64 bg-cyan-500/5 rounded-full blur-3xl -translate-x-1/2"></div>
      <div className="absolute bottom-1/4 right-0 w-64 h-64 bg-cyan-500/5 rounded-full blur-3xl translate-x-1/2"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-4 flex items-center justify-center gap-3">
            <Cpu className="text-cyan-400" size={40} />
            <span className="text-cyan-400">Skills</span>
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-cyan-500 to-blue-600 mx-auto rounded-full"></div>
          <p className="text-white mt-4 max-w-2xl mx-auto">
            A showcase of my technical expertise and the technologies I work with.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {skills.map((category) => (
            <div
              key={category._id}
              className={`bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${getCategoryColor(category.category)} group`}
            >
              <div className="flex items-center gap-3 mb-6 pb-4 border-b border-cyan-700">
                <div className="p-3 bg-gray-900 rounded-xl group-hover:scale-110 transition-transform duration-300">
                  {getCategoryIcon(category.category)}
                </div>
                <h3 className="text-xl font-bold text-white group-hover:text-cyan-400 transition-colors">
                  {category.category}
                </h3>
              </div>

              <div className="flex flex-wrap gap-2">
                {category.items.map((skillName, index) => (
                  <span
                    key={index}
                    className="px-3 py-1.5 bg-gray-900 text-white text-sm font-medium rounded-lg border border-gray-700 hover:border-cyan-500/50 hover:text-white hover:bg-gray-800 transition-colors cursor-default"
                  >
                    {skillName}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Skills;