import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';

const SECTIONS = [
  { id: 'hero', label: 'TOP', number: '01' },
  { id: 'about', label: 'ABOUT', number: '02' },
  { id: 'services', label: 'SERVICES', number: '03' },
  { id: 'philosophy', label: 'PHILOSOPHY', number: '04' },
  { id: 'perspective', label: 'PERSPECTIVE', number: '05' },
  { id: 'skills', label: 'SKILLS', number: '06' },
  { id: 'projects', label: 'PROJECTS', number: '07' },
  { id: 'personality', label: 'PERSONALITY', number: '08' },
  { id: 'contact', label: 'CONTACT', number: '09' },
];

export const Navigation: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');

  useEffect(() => {
    const handleScroll = () => {
      const vh = window.innerHeight;
      const scrollY = window.scrollY;
      const index = Math.min(Math.floor(scrollY / vh), SECTIONS.length - 1);
      setActiveSection(SECTIONS[Math.max(0, index)]?.id || 'hero');
    };

    let ticking = false;
    const throttled = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', throttled, { passive: true });
    return () => window.removeEventListener('scroll', throttled);
  }, []);

  const scrollToSection = useCallback((id: string) => {
    const index = SECTIONS.findIndex(s => s.id === id);
    if (index >= 0) {
      window.scrollTo({
        top: index * window.innerHeight,
        behavior: 'smooth',
      });
    }
    setIsOpen(false);
  }, []);

  return (
    <>
      {/* Mobile/Desktop menu toggle */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 right-4 md:top-8 md:right-12 z-[60] w-10 h-10 flex items-center justify-center text-white/70 hover:text-[#C5A265] transition-colors mix-blend-difference"
        aria-label={isOpen ? 'Close menu' : 'Open menu'}
      >
        {isOpen ? <X size={18} /> : <Menu size={18} />}
      </button>

      {/* Navigation overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[55] bg-black/90 backdrop-blur-md flex items-center justify-center"
          >
            <nav className="flex flex-col gap-1">
              {SECTIONS.map((section) => (
                <button
                  key={section.id}
                  onClick={() => scrollToSection(section.id)}
                  className={`group flex items-center gap-4 px-6 py-3 text-left transition-all duration-300 hover:bg-white/5 ${
                    activeSection === section.id ? 'text-[#C5A265]' : 'text-white/60 hover:text-white'
                  }`}
                >
                  <span className="text-[10px] font-mono tracking-widest w-6 opacity-50 group-hover:opacity-100">
                    {section.number}
                  </span>
                  <span className="text-sm md:text-lg tracking-[0.2em] font-light">
                    {section.label}
                  </span>
                  {activeSection === section.id && (
                    <motion.div
                      layoutId="nav-indicator"
                      className="w-8 h-[1px] bg-[#C5A265]"
                    />
                  )}
                </button>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
