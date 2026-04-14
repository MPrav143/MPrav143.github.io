import React, { useState, useEffect, useRef } from 'react';
import { Award, ExternalLink, FileText, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../api';
import Doodles from './Doodles';

const fallbackCertificates = [
  { _id: 'fallback-1', title: 'React Masters Core', platform: 'Meta', category: 'Frontend', image: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&w=800', date: '2024', description: 'Advanced rendering, state management and hook flow controls.' },
  { _id: 'fallback-2', title: 'NodeJS Secure Flow', platform: 'IBM', category: 'Backend', image: 'https://images.unsplash.com/photo-1599507593499-a3f7d7d97667?auto=format&fit=crop&w=800', date: '2023', description: 'Restful API building with safe CORS handling.' },
  { _id: 'fallback-3', title: 'Deep Learning Domain', platform: 'Stanford', category: 'AI', image: 'https://images.unsplash.com/photo-1620712447376-76cd9708bfdb?auto=format&fit=crop&w=800', date: '2024', description: 'Neural network architecture modeling and sequential predictive cycles.' }
];

const Certificates = ({ manualCerts }) => {
  const [certifications, setCertifications] = useState([]);
  const [bgImage, setBgImage] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [selectedCert, setSelectedCert] = useState(null);

  const intervalRef = useRef(null);
  const resumeTimerRef = useRef(null);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (manualCerts) {
      setCertifications(manualCerts.length > 0 ? manualCerts : fallbackCertificates);
      return;
    }

    const fetchData = async () => {
      try {
        const [certRes, aboutRes] = await Promise.all([
          api.get('/certificates'),
          api.get('/about')
        ]);
        const certData = (certRes.data && certRes.data.length >= 3) ? certRes.data : fallbackCertificates;
        setCertifications(certData);

        if (aboutRes.data && aboutRes.data.length > 0 && aboutRes.data[0].sectionBackgrounds?.certificates) {
          setBgImage(`url('${aboutRes.data[0].sectionBackgrounds.certificates}')`);
        }
      } catch (err) {
        setCertifications(fallbackCertificates);
      }
    };
    fetchData();
  }, [manualCerts]);

  // SINGLETON INTERVAL FOR AUTO-PLAY ROTATION
  useEffect(() => {
    if (certifications.length === 0 || isPaused) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      return;
    }

    intervalRef.current = setInterval(() => {
      setCurrentIndex((prev) => prev + 1);
    }, 3500);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [certifications.length, isPaused]);

  const handleMouseEnter = () => {
    if (resumeTimerRef.current) clearTimeout(resumeTimerRef.current);
    setIsPaused(true);
  };

  const handleMouseLeave = () => {
    if (resumeTimerRef.current) clearTimeout(resumeTimerRef.current);
    // Smooth delay timer reset resume support continuous aligns loaded flawlessly
    resumeTimerRef.current = setTimeout(() => setIsPaused(false), 700);
  };

  const handleViewCertificate = (e, cert) => {
    e.stopPropagation();
    setSelectedCert(cert);
  };

  const getImageUrl = (url) => {
    if (!url) return '';
    if (url.includes('drive.google.com')) {
      const match = url.match(/(?:\/d\/|id=)([\w-]+)/);
      if (match && match[1]) {
        return `https://drive.google.com/thumbnail?id=${match[1]}&sz=w800`;
      }
    }
    return url;
  };

  const renderPreview = (url) => {
    if (!url) return null;
    
    if (url.includes('drive.google.com')) {
      let embedUrl = url;
      const match = url.match(/(?:\/d\/|id=)([\w-]+)/);
      if (match && match[1]) {
        embedUrl = `https://drive.google.com/file/d/${match[1]}/preview`;
      }
      // Wrapping iframe with negative top margin to aggressively clip the native Google Drive pop-out toolbar header
      return (
        <div className="w-full h-[65vh] rounded-lg shadow-xl border border-gray-800 bg-gray-900 overflow-hidden relative">
          <iframe 
            src={embedUrl} 
            className="absolute top-[-56px] left-0 w-full" 
            style={{ height: 'calc(100% + 56px)' }}
            title="Certificate Preview" 
            allow="autoplay" 
          />
        </div>
      );
    }
    
    if (url.toLowerCase().endsWith('.pdf')) {
      const pdfEmbedUrl = url.includes('#') ? url : `${url}#toolbar=0`;
      return <iframe src={pdfEmbedUrl} className="w-full h-[65vh] rounded-lg shadow-xl border border-gray-800 bg-gray-900" title="Certificate Preview" />;
    }
    
    return <img src={url} alt="Certificate Preview" className="w-full h-auto object-contain max-h-[65vh] rounded-lg shadow-xl border border-gray-800 bg-black/40" />;
  };

  const getPaddedCertificates = () => {
    if (certifications.length === 0) return [];
    if (certifications.length >= 5) return certifications;

    let padded = [...certifications];
    while (padded.length < 5 && certifications.length > 0) {
      padded = [...padded, ...certifications.map(c => ({ ...c, _id: `${c._id}-pad-${padded.length}` }))];
    }
    return padded;
  };

  const activeCertifications = getPaddedCertificates();

  const getVisibleCards = () => {
    if (activeCertifications.length === 0) return [];

    const offsets = [-2, -1, 0, 1, 2];
    return offsets.map(offset => {
      const absoluteIdx = currentIndex + offset;
      const idx = ((absoluteIdx % activeCertifications.length) + activeCertifications.length) % activeCertifications.length;
      return {
        ...activeCertifications[idx],
        offset,
        realIndex: idx % certifications.length
      };
    });
  };

  const getCardStyle = (offset) => {
    const baseStyle = {
      position: 'absolute',
      top: '50%',
      left: '50%',
      transformStyle: 'preserve-3d',
    };

    const offsetStyles = isMobile ? {
      '-2': { x: '-170%', y: '-50%', scale: 0.7, opacity: 0.1, zIndex: 5, filter: 'blur(6px)' },
      '-1': { x: '-110%', y: '-50%', scale: 0.85, opacity: 0.6, zIndex: 10, filter: 'blur(2px)' },
      '0': { x: '-50%', y: '-50%', scale: 1.15, opacity: 1, zIndex: 30, filter: 'blur(0px)' },
      '1': { x: '10%', y: '-50%', scale: 0.85, opacity: 0.6, zIndex: 10, filter: 'blur(2px)' },
      '2': { x: '70%', y: '-50%', scale: 0.7, opacity: 0.1, zIndex: 5, filter: 'blur(6px)' },
    } : {
      '-2': { x: '-210%', y: '-50%', scale: 0.75, opacity: 0.35, zIndex: 5, filter: 'blur(4px)' },
      '-1': { x: '-130%', y: '-50%', scale: 0.9, opacity: 0.7, zIndex: 20, filter: 'blur(1px)' },
      '0': { x: '-50%', y: '-50%', scale: 1.25, opacity: 1, zIndex: 40, filter: 'blur(0px)' },
      '1': { x: '30%', y: '-50%', scale: 0.9, opacity: 0.7, zIndex: 20, filter: 'blur(1px)' },
      '2': { x: '110%', y: '-50%', scale: 0.75, opacity: 0.35, zIndex: 5, filter: 'blur(4px)' },
    };

    return { ...baseStyle, ...(offsetStyles[offset] || {}) };
  };

  const handleCardClick = (offset) => {
    if (offset !== 0) {
      setCurrentIndex((prev) => prev + offset);
    }
  };

  return (
    <section
      id="certifications"
      className={`min-h-screen w-full relative border-t border-gray-950 font-sans bg-black overflow-hidden bg-cover bg-center flex justify-center items-center ${bgImage ? 'md:bg-fixed' : ''}`}
      style={bgImage ? { backgroundImage: bgImage } : {}}
    >
      <div className="absolute inset-0 bg-gradient-to-b from-black via-gray-950/90 to-black z-0"></div>
      <div className="absolute inset-0 z-1 bg-[linear-gradient(rgba(34,211,238,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(34,211,238,0.02)_1px,transparent_1px)] bg-[size:20px_20px] opacity-25"></div>
      <Doodles sectionName="certificates" />

      <div className="w-full max-w-5xl px-4 relative z-10 flex flex-col items-center">

        <motion.div
          className="text-center mb-12 relative"
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-gray-200 via-white to-gray-400 flex items-center justify-center gap-3 drop-shadow-[0_0_15px_rgba(34,211,238,0.15)]">
            <Award className="text-cyan-400 w-8 h-8 filter drop-shadow-[0_0_8px_#22d3ee]" />
            <span className="uppercase font-black text-gray-100">CERTIFICATIONS</span>
          </h2>
          <div className="w-40 h-[2px] bg-gradient-to-r from-transparent via-cyan-800 to-transparent mx-auto mt-3"></div>
        </motion.div>

        <div className="relative w-full h-[350px] flex items-center justify-center">
          <AnimatePresence>
            {getVisibleCards().map((cert) => {
              const isCenter = cert.offset === 0;

              return (
                <motion.div
                  key={cert._id}
                  id={`certificates-${cert.title ? cert.title.toLowerCase().replace(/\s+/g, '-') : cert._id}`}
                  layout
                  animate={getCardStyle(cert.offset)}
                  transition={{
                    x: { duration: 0.7, ease: "easeInOut" },
                    scale: { duration: 0.7, ease: "easeInOut" },
                    opacity: { duration: 0.7 },
                    filter: { duration: 0.7 }
                  }}
                  className="w-[280px] md:w-[320px] h-[180px] md:h-[200px] cursor-pointer"
                  onClick={() => handleCardClick(cert.offset)}
                  onMouseEnter={handleMouseEnter}
                  onMouseLeave={handleMouseLeave}
                >
                  <div className="w-full h-full relative">
                    <div
                      className={`absolute inset-0 rounded-lg overflow-hidden border ${isCenter ? 'border-cyan-500 shadow-[0_0_20px_rgba(34,211,238,0.25)]' : 'border-gray-800'} bg-gradient-to-br from-gray-950 via-zinc-950 to-gray-950 flex flex-col justify-between transition-all duration-300`}
                    >
                      {cert.image && (
                        <div className="h-full w-full absolute inset-0 z-0">
                          <img src={getImageUrl(cert.image)} alt={cert.title} className="w-full h-full object-cover opacity-35 object-center" />
                          <div className="absolute inset-0 bg-gradient-to-br from-black via-zinc-950/90 to-transparent"></div>
                        </div>
                      )}
                      <div className="p-4 flex flex-col justify-between h-full z-10 relative">
                        <div>
                          <div className="flex justify-between items-start mb-1">
                             <span className="text-[9px] font-mono tracking-widest text-cyan-400 font-bold uppercase border-b border-cyan-900/40 pb-1">{cert.category || 'Certification'}</span>
                             {cert.companyLogo && <img src={getImageUrl(cert.companyLogo)} alt={cert.platform} className="h-4 w-auto object-contain filter brightness-90" />}
                          </div>
                          <h3 className="text-md font-bold text-white leading-tight tracking-wide line-clamp-1">{cert.title}</h3>
                          <p className="text-[10px] text-gray-400 mt-1 line-clamp-2 leading-relaxed max-w-[85%]">
                            {cert.description ? (cert.description.length > 35 ? cert.description.slice(0, 35) + '...' : cert.description) : `Credentials by ${cert.platform}.`}
                          </p>
                        </div>
                        <div className="flex items-end justify-between border-t border-gray-900 pt-2 scale-95 origin-left">
                          <div className="flex flex-col">
                             <span className="text-xs font-semibold text-gray-300">{cert.platform}</span>
                             <span className="text-[9px] font-mono text-gray-500 mt-0.5">DATE: {cert.date || '2024'}</span>
                          </div>
                          
                          {(cert.image || cert.pdfLink) && (
                            <button onClick={(e) => handleViewCertificate(e, cert)} className="flex items-center justify-center gap-1 text-[10px] font-bold text-zinc-900 bg-cyan-400 hover:bg-cyan-300 px-3 py-1.5 rounded-md border border-cyan-300 transition-all absolute bottom-3 right-3 shadow-lg shadow-cyan-900/40 z-20">
                              VIEW
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>

      {/* Modal Popup */}
      <AnimatePresence>
        {selectedCert && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
            onClick={() => setSelectedCert(null)}
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="relative w-full max-w-4xl max-h-[90vh] bg-gray-900 border border-gray-700 rounded-2xl overflow-hidden flex flex-col shadow-2xl shadow-cyan-900/20"
              onClick={e => e.stopPropagation()}
            >
              <button 
                onClick={() => setSelectedCert(null)}
                className="absolute top-4 right-4 z-50 p-2 bg-black/60 hover:bg-red-500/90 text-white rounded-full transition-all border border-gray-600 hover:border-red-400 backdrop-blur-sm"
              >
                <X size={20} />
              </button>

              <div className="flex-1 w-full overflow-hidden p-2 md:p-6 bg-black/40 flex items-center justify-center min-h-[50vh]">
                {(selectedCert.image || selectedCert.pdfLink) ? (
                   renderPreview(selectedCert.image || selectedCert.pdfLink)
                ) : (
                   <div className="text-gray-500 flex flex-col items-center gap-2"><FileText size={48} /><span>No Preview Available</span></div>
                )}
              </div>

              <div className="p-5 bg-gray-950 border-t border-gray-800 flex justify-center items-center">
                 <a 
                   href={selectedCert.pdfLink || selectedCert.image} 
                   target="_blank" 
                   rel="noopener noreferrer" 
                   className="flex items-center gap-2 bg-cyan-600 hover:bg-cyan-500 text-white px-8 py-3 rounded-xl font-bold transition-all shadow-lg shadow-cyan-600/30"
                 >
                   OPEN <ExternalLink size={18} />
                 </a>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default Certificates;