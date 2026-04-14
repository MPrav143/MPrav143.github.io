import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MessageSquare, Linkedin, Github, Globe, Briefcase, Award, Laptop } from 'lucide-react';
import api from '../api';
import Doodles from './Doodles';

const Contact = () => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  const [bgImage, setBgImage] = useState("");
  const [socials, setSocials] = useState([]);
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [aboutRes, socialsRes] = await Promise.all([
          api.get('/about'),
          api.get('/sociallinks')
        ]);
        if (aboutRes.data && aboutRes.data.length > 0) {
          const prof = aboutRes.data[0];
          setProfile(prof);
          if (prof.sectionBackgrounds?.contact) {
            setBgImage(`url('${prof.sectionBackgrounds.contact}')`);
          }
        }
        setSocials(socialsRes.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      await api.post('/contact', formData);
      setSubmitStatus('success');
      setFormData({ name: '', email: '', message: '' });
    } catch (error) {
      console.error('Submission failed:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section
      id="contact"
      className={`py-20 relative font-contact bg-cover bg-center ${bgImage ? 'md:bg-fixed' : ''}`}
      style={bgImage ? { backgroundImage: bgImage } : {}}
    >
      <div className={`absolute inset-0 ${bgImage ? 'bg-gray-900/60' : 'bg-gray-900/90'} z-0`}></div>
      <Doodles sectionName="contact" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full flex flex-col items-center">
        
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="section-heading-container mb-12"
        >
          <h2 className="section-heading">
            <span className="text-cyan-400 capitalize">Contact Me</span>
          </h2>
          <div className="section-underline"></div>
        </motion.div>

        <div className="flex flex-col lg:flex-row gap-12 w-full max-w-5xl">
          {/* Left Panel */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="lg:w-1/2 bg-gray-900/40 backdrop-blur-sm p-6 rounded-2xl border border-gray-800"
          >
            <h3 className="text-2xl font-bold mb-6 text-cyan-400 tracking-wide">Get in Touch</h3>

            <div className="space-y-5">
              {(() => {
                const staticItems = [];
                if (profile?.email) {
                  staticItems.push({ 
                    platform: 'Email', 
                    url: `mailto:${profile.email}?subject=${encodeURIComponent("Getting in touch")}&body=${encodeURIComponent("Hello! I saw your portfolio and wanted to get in touch.")}`, 
                    label: profile.email 
                  });
                }
                if (profile?.phone) staticItems.push({ platform: 'Phone', url: `tel:${profile.phone}`, label: profile.phone });
                
                const allItems = [
                  ...staticItems, 
                  ...socials.map(s => {
                    let finalUrl = s.url;
                    if (s.platform.toLowerCase().includes('whatsapp') && !finalUrl.startsWith('http')) {
                      finalUrl = `whatsapp://send?phone=${finalUrl.replace(/[^0-9]/g, '')}&text=${encodeURIComponent("Hello! I saw your portfolio and wanted to get in touch.")}`;
                    }
                    return { _id: s._id, platform: s.platform, url: finalUrl, label: s.platform };
                  })
                ];

                return allItems.map((item, index) => {
                  const getIcon = (platform) => {
                    const lower = platform.toLowerCase();
                    if (lower.includes('mail') || lower.includes('email')) return <Mail size={24} />;
                    if (lower.includes('phone')) return <Phone size={24} />;
                    if (lower.includes('whatsapp')) return <MessageSquare size={24} />;
                    if (lower.includes('linkedin')) return <Linkedin size={24} />;
                    if (lower.includes('github')) return <Github size={24} />;
                    if (lower.includes('naukri')) return <Briefcase size={24} />;
                    if (lower.includes('unstop')) return <Award size={24} />;
                    if (lower.includes('freelancer')) return <Laptop size={24} />;
                    return <Globe size={24} />;
                  };
                  
                  return (
                    <motion.div 
                      key={item._id || index}
                      whileHover={{ x: 8 }}
                      className="flex items-center group cursor-pointer"
                    >
                      <div className="text-cyan-400 mr-4 transition-transform group-hover:scale-110">
                        {getIcon(item.platform)}
                      </div>
                      <a href={item.url} target="_blank" rel="noopener noreferrer" className="text-gray-200 group-hover:text-cyan-400 transition-colors text-sm font-medium">
                        {item.label}
                      </a>
                    </motion.div>
                  );
                });
              })()}
              {(!profile?.email && !profile?.phone && socials.length === 0) && (
                <p className="text-gray-500 italic text-sm">No contact links added yet.</p>
              )}
            </div>
          </motion.div>

          {/* Right Panel (Form) */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="lg:w-1/2 bg-gray-900/40 backdrop-blur-sm p-6 rounded-2xl border border-gray-800"
          >
            <h3 className="text-2xl font-bold mb-6 text-cyan-400 tracking-wide">Send a Message</h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-gray-300 mb-1 text-sm font-medium">Name</label>
                <input
                  type="text" id="name" name="name" value={formData.name} onChange={handleChange} required
                  className="w-full bg-gray-800/80 border border-gray-700/50 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:ring-1 focus:ring-cyan-500 transition-all font-sans"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-gray-300 mb-1 text-sm font-medium">Email</label>
                <input
                  type="email" id="email" name="email" value={formData.email} onChange={handleChange} required
                  className="w-full bg-gray-800/80 border border-gray-700/50 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:ring-1 focus:ring-cyan-500 transition-all font-sans"
                />
              </div>
              <div>
                <label htmlFor="message" className="block text-gray-300 mb-1 text-sm font-medium">Message</label>
                <textarea
                  id="message" name="message" rows="4" value={formData.message} onChange={handleChange} required
                  className="w-full bg-gray-800/80 border border-gray-700/50 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:ring-1 focus:ring-cyan-500 transition-all font-sans resize-none"
                ></textarea>
              </div>
              
              <motion.button
                type="submit"
                disabled={isSubmitting}
                whileHover={{ scale: 1.02, boxShadow: "0 0 15px rgba(34,211,238,0.2)" }}
                whileTap={{ scale: 0.98 }}
                className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-2.5 rounded-lg transition-all disabled:opacity-60 text-sm shadow-md"
              >
                {isSubmitting ? 'Sending...' : 'Send Message'}
              </motion.button>

              {submitStatus === 'success' && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-4 p-3 bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 rounded-lg text-xs font-semibold text-center">
                  Message sent successfully!
                </motion.div>
              )}
              {submitStatus === 'error' && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-4 p-3 bg-red-500/10 border border-red-500/30 text-red-400 rounded-lg text-xs font-semibold text-center">
                  Failed to send message. Please try again.
                </motion.div>
              )}
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Contact;