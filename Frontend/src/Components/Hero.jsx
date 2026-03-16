import { Download } from 'lucide-react';
import { Typewriter } from 'react-simple-typewriter';
import { useState, useEffect, useCallback } from 'react';
import Particles from "react-tsparticles";
import { loadSlim } from "tsparticles-slim";
import api from '../api';

const Hero = ({ scrollToSection }) => {
  const [profile, setProfile] = useState(null);

  const particlesInit = useCallback(async engine => {
    await loadSlim(engine);
  }, []);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get('/about');
        if (res.data && res.data.length > 0) {
          setProfile(res.data[0]);
        }
      } catch (err) {
        console.error("Error fetching profile:", err);
      }
    };
    fetchProfile();
  }, []);

  const handleDownloadResume = () => {
    if (profile?.resume) {
      window.open(profile.resume, '_blank');
    } else {
      alert("Resume not available yet.");
    }
  };

  return (
    <section
      id="home"
      className="min-h-screen flex items-center justify-center pt-16 text-white relative bg-gray-900 border-b border-gray-800/60 overflow-hidden"
    >
      <Particles
        id="tsparticles"
        init={particlesInit}
        options={{
          background: {
            color: {
              value: "transparent",
            },
          },
          fpsLimit: 120,
          interactivity: {
            events: {
              onClick: {
                enable: true,
                mode: "push",
              },
              onHover: {
                enable: true,
                mode: "repulse",
              },
              resize: true,
            },
            modes: {
              push: {
                quantity: 4,
              },
              repulse: {
                distance: 200,
                duration: 0.4,
              },
            },
          },
          particles: {
            color: {
              value: "#22d3ee",
            },
            links: {
              color: "#22d3ee",
              distance: 150,
              enable: true,
              opacity: 0.5,
              width: 1,
            },
            move: {
              direction: "none",
              enable: true,
              outModes: {
                default: "bounce",
              },
              random: false,
              speed: 2,
              straight: false,
            },
            number: {
              density: {
                enable: true,
                area: 800,
              },
              value: 80,
            },
            opacity: {
              value: 0.5,
            },
            shape: {
              type: "circle",
            },
            size: {
              value: { min: 1, max: 5 },
            },
          },
          detectRetina: true,
        }}
        className="absolute inset-0 z-0"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 flex flex-col-reverse md:flex-row items-center gap-10 relative z-10">

        {/* Left Content */}
        <div className="md:w-1/2 text-center md:text-left md:mb-0">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            Hi, I'm <span className="text-cyan-400">{profile?.name || 'Praveen M'}</span>
          </h1>

          <h2 className="text-xl md:text-2xl text-cyan-400 drop-shadow-md font-semibold mb-6 min-h-[2.5rem]">
            <Typewriter
              words={[
                'Aspiring Developer',
                'Problem Solver',
                'Tech Enthusiast',
                'Open Source Contributor',
                'Cloud Explorer',
                'Full Stack Learner',
                'Data Scientist',
                'Data Analyst',
                'Machine Learning Enthusiast'
              ]}
              loop={0}
              cursor
              cursorStyle="|"
              typeSpeed={70}
              deleteSpeed={50}
              delaySpeed={1000}
            />
          </h2>

          <p className="text-white mb-8 max-w-lg">
            {profile?.title || 'Passionate about building efficient, modern tech solutions.'}
          </p>

          <div className="flex flex-col gap-4 justify-center md:justify-start">
            {/* First row - Projects & Contact buttons */}
            {/* <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => scrollToSection('projects')}
                className="bg-cyan-600 hover:bg-cyan-700 text-white px-6 py-3 rounded-lg font-medium transition-all transform hover:scale-105"
              >
                View Projects
              </button>
              <button
                onClick={() => scrollToSection('contact')}
                className="border border-cyan-400 text-cyan-400 hover:bg-cyan-400/10 px-6 py-3 rounded-lg font-medium transition-all transform hover:scale-105"
              >
                Contact Me
              </button>
            </div> */}
            {/* Second row - Resume button (full width) */}
            <button
              onClick={handleDownloadResume}
              className="w-[100%] max-w-[400px] flex border border-cyan-400 text-cyan-400 items-center justify-center gap-1 bg-gray-800 hover:bg-gray-700 text-white px-10 py-3 rounded-lg font-medium transition-all transform hover:scale-205"
            >
              <Download size={20} />
              Download Resume
            </button>
          </div>
        </div>

        {/* Right Image */}
        <div className="md:w-1/2 flex justify-center">
          <div className="relative">
            <img
              src={profile?.profileImage || "https://res.cloudinary.com/diwykgo1k/image/upload/v1748762972/PRAVEEN_tby3sa.jpg"}
              alt={profile?.name || "Praveen M"}
              className="w-64 h-64 md:w-80 md:h-80 rounded-full border-4 border-cyan-400/30 object-cover shadow-xl"
            />
            <div className="absolute inset-0 rounded-full border-4 border-transparent animate-pulse shadow-[0_0_20px_5px_rgba(34,211,238,0.5)] -z-10"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
