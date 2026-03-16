import React, { useState, useEffect, useRef } from 'react';
import { Award, ExternalLink, FileText, X, ChevronLeft, ChevronRight } from 'lucide-react';
import api from '../api';

const Certificates = () => {
  const [selectedCert, setSelectedCert] = useState(null);
  const [certifications, setCertifications] = useState([]);
  const scrollContainerRef = useRef(null);

  useEffect(() => {
    const fetchCertificates = async () => {
      try {
        const res = await api.get('/certificates');
        setCertifications(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchCertificates();
  }, []);

  const scroll = (direction) => {
    if (scrollContainerRef.current) {
      const scrollAmount = 300;
      scrollContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  return (
    <section
      id="certifications"
      className="py-20 relative border-t border-gray-800"
      style={{
        backgroundImage: "url('https://images.unsplash.com/photo-1496171367470-9ed9a125d8f6?auto=format&fit=crop&q=80')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed"
      }}
    >
      <div className="absolute inset-0 bg-gray-900/90"></div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-4 flex items-center justify-center gap-3">
            <Award className="text-cyan-400" size={40} />
            <span className="text-cyan-400">Certifications</span>
          </h2>
          <div className="w-32 h-1 bg-gradient-to-r from-cyan-500 to-cyan-900 mx-auto rounded-full"></div>
        </div>
        <div className="relative group">
          {/* Scroll Buttons */}
          <button
            onClick={() => scroll('left')}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-gray-800/80 p-3 rounded-full text-white shadow-lg hover:bg-cyan-600 transition-all opacity-0 group-hover:opacity-100 -ml-4"
          >
            <ChevronLeft size={24} />
          </button>

          <button
            onClick={() => scroll('right')}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-gray-800/80 p-3 rounded-full text-white shadow-lg hover:bg-cyan-600 transition-all opacity-0 group-hover:opacity-100 -mr-4"
          >
            <ChevronRight size={24} />
          </button>

          {/* Carousel Track */}
          <div
            ref={scrollContainerRef}
            className="flex overflow-x-auto gap-6 pb-8 hide-scrollbar snap-x snap-mandatory"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {certifications.map((cert) => (
              <div
                key={cert._id}
                className="flex-none w-80 bg-gray-800 rounded-xl overflow-hidden border border-gray-700 hover:border-cyan-500/50 transition-all duration-300 transform hover:-translate-y-2 hover:shadow-2xl hover:shadow-cyan-500/10 snap-center group/card"
              >
                <div className="h-40 bg-gray-800 relative overflow-hidden group">
                  {cert.image ? (
                    <img
                      src={cert.image}
                      alt={cert.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 opacity-70 group-hover:opacity-100"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center">
                      <Award size={48} className="text-cyan-400 opacity-50 group-hover:scale-110 transition-transform duration-300" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent"></div>
                  <span className="absolute bottom-3 right-3 text-xs font-bold bg-gray-900/90 text-cyan-300 px-2 py-1 rounded border border-cyan-500/30">
                    {cert.platform}
                  </span>
                </div>

                <div className="p-6">
                  <h3 className="text-lg font-bold text-white mb-2 line-clamp-2 h-14">
                    {cert.title}
                  </h3>
                  <div className="flex items-center justify-between mt-4">
                    <span className="text-xs text-white bg-gray-900 px-2 py-1 rounded">
                      {cert.category}
                    </span>
                    <button
                      onClick={() => setSelectedCert(cert)}
                      className="text-cyan-400 hover:text-white transition-colors flex items-center gap-1 text-sm font-medium"
                    >
                      View <ExternalLink size={14} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Modal - Modern Glassmorphism */}
      {selectedCert && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm animate-fade-in" onClick={() => setSelectedCert(null)}>
          <div
            className="bg-gray-900 border border-gray-700 rounded-2xl w-full max-w-4xl overflow-hidden shadow-2xl transform transition-all scale-100 relative flex flex-col max-h-[90vh]"
            onClick={e => e.stopPropagation()}
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-gray-800 to-gray-900 p-4 border-b border-gray-700 flex justify-between items-center flex-shrink-0">
              <div>
                <span className="text-cyan-400 text-xs font-bold tracking-wider uppercase mb-1 block">
                  {selectedCert.platform}
                </span>
                <h3 className="text-xl md:text-2xl font-bold text-white">
                  {selectedCert.title}
                </h3>
              </div>
              <button
                onClick={() => setSelectedCert(null)}
                className="text-gray-400 hover:text-white bg-gray-800 p-2 rounded-full hover:bg-gray-700 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Body - Scrollable */}
            <div className="p-4 md:p-8 bg-gray-900/50 flex-1 overflow-y-auto flex flex-col items-center">
              {/* Full Image Display */}
              {selectedCert.image ? (
                <div className="w-full max-w-3xl rounded-lg overflow-hidden border-4 border-gray-800 shadow-2xl mb-6">
                  <img
                    src={selectedCert.image}
                    alt={selectedCert.title}
                    className="w-full h-auto object-contain"
                  />
                </div>
              ) : (
                <div className="w-40 h-40 bg-gray-800 rounded-full flex items-center justify-center mb-6 border-4 border-gray-700 shadow-inner">
                  <FileText size={48} className="text-cyan-400" />
                </div>
              )}

              <p className="text-white mb-6 text-center">
                This certification was awarded by <strong>{selectedCert.platform}</strong> in the category of <span className="text-cyan-300">{selectedCert.category}</span>.
              </p>

              {selectedCert.pdfLink && selectedCert.pdfLink !== 'URL_TO_PDF_3' && (
                <a
                  href={selectedCert.pdfLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-cyan-600 to-cyan-500 text-white px-8 py-3 rounded-xl font-bold hover:shadow-lg hover:shadow-cyan-500/25 transition-all transform hover:-translate-y-1"
                >
                  <ExternalLink size={18} />
                  Verify Credential
                </a>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default Certificates;