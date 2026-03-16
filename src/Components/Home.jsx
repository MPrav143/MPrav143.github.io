import { useState, useEffect } from 'react';
import Navbar from './Navbar';
import Hero from './Hero';
import About from './About';
import Skills from './Skills';
import Projects from './Projects';
import Certificate from './Certificates';
import Leetcode from './Leetcode';
import Experience from './Experience';
import Contact from './Contact';
import Achievements from './Achievements';
import Education from './Education';
import ChatBot from './ChatBot';

function Home() {
    const [activeSection, setActiveSection] = useState('home');
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setActiveSection(entry.target.id);
                    }
                });
            },
            { threshold: 0.5 }
        );

        const sections = document.querySelectorAll('section');
        sections.forEach((section) => observer.observe(section));

        return () => {
            sections.forEach((section) => observer.unobserve(section));
        };
    }, []);

    const scrollToSection = (sectionId) => {
        const section = document.getElementById(sectionId);
        if (section) {
            section.scrollIntoView({ behavior: 'smooth' });
            setMobileMenuOpen(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-900 text-gray-100 font-sans scroll-smooth">
            <Navbar
                activeSection={activeSection}
                mobileMenuOpen={mobileMenuOpen}
                setMobileMenuOpen={setMobileMenuOpen}
                scrollToSection={scrollToSection}
            />

            {/* Ensure each section has an id that matches scroll target */}
            <section id="home"><Hero scrollToSection={scrollToSection} /></section>
            <section id="about"><About /></section>
            <section id="education"><Education /></section>
            <section id="skills"><Skills /></section>
            <section id="projects"><Projects /></section>
            <section id="leetcode"><Leetcode /></section>
            <section id="experience"><Experience /></section>
            <section id="certificates"><Certificate /></section>
            <section id="achievements"><Achievements /></section>
            <section id="contact"><Contact /></section>

            <ChatBot />
        </div>
    );
}

export default Home;
