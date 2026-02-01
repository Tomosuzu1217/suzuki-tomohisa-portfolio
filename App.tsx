import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { motion, useScroll, useTransform, useMotionValue, useSpring, AnimatePresence, useInView } from 'framer-motion';
import { WaterBackground, WaterBackgroundHero } from './components/WaterBackground';
import { AdminEditor } from './components/AdminEditor';
import { LiquidText } from './components/LiquidText';
import { PageTransition } from './components/PageTransition';
import { ProjectShowcase, FeaturedProjects } from './components/ProjectShowcase';
import { ErrorBoundary } from './components/ErrorBoundary';
import { Navigation } from './components/Navigation';
import { SiteContent } from './types';
import { DEFAULT_CONTENT, NOISE_TEXTURE_SVG } from './constants';
import { useCursorTracker } from './hooks/useCursorTracker';
import { ArrowDown, ExternalLink, LayoutDashboard } from 'lucide-react';
import { Link } from 'react-router-dom';

// --- ANIMATION COMPONENTS ---

const RevealText: React.FC<{ children: React.ReactNode; className?: string; delay?: number; gold?: boolean }> = ({ children, className = "", delay = 0, gold = false }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-10%" });

  return (
    <div ref={ref} className={`relative overflow-hidden ${className} ${gold ? 'text-[#C5A265]' : ''}`}>
      <motion.div
        initial={{ y: "110%" }}
        animate={isInView ? { y: 0 } : { y: "110%" }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay }}
      >
        {children}
      </motion.div>
    </div>
  );
};

const RevealSection: React.FC<{ children: React.ReactNode; className?: string; delay?: number; zIndex?: string }> = ({ children, className = "", delay = 0, zIndex = "" }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10%" }}
      transition={{ duration: 0.5, delay, ease: "easeOut" }}
      className={`relative ${zIndex} ${className}`}
    >
      {children}
    </motion.div>
  );
};

// GLITCH IMAGE COMPONENT
const ParallaxImage: React.FC<{ src: string; alt?: string; className?: string }> = ({ src, alt = "", className = "" }) => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], ["-10%", "10%"]);
  const scale = useTransform(scrollYProgress, [0, 1], [1.15, 1.05]);
  const scaleRed = useTransform(scale, s => s * 1.02);
  const scaleBlue = useTransform(scale, s => s * 1.01);

  return (
    <div ref={ref} className={`group relative overflow-hidden bg-[#1c1c1c] ${className}`}>
      <motion.div style={{ y, scale, height: "125%" }} className="absolute inset-0 w-full">
        <img
          src={src}
          alt={alt}
          className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500 ease-out"
        />
      </motion.div>
      <div className="absolute inset-0 opacity-0 group-hover:opacity-60 mix-blend-screen pointer-events-none transition-opacity duration-100">
        <motion.div style={{ y, scale: scaleRed, height: "125%" }} className="absolute inset-0 translate-x-1">
          <img src={src} alt="" className="w-full h-full object-cover sepia hue-rotate-[-50deg] contrast-150 opacity-50" />
        </motion.div>
        <motion.div style={{ y, scale: scaleBlue, height: "125%" }} className="absolute inset-0 -translate-x-1">
          <img src={src} alt="" className="w-full h-full object-cover sepia hue-rotate-[50deg] contrast-150 opacity-50" />
        </motion.div>
      </div>
      <div className="absolute inset-0 opacity-20 mix-blend-overlay group-hover:opacity-40 transition-opacity pointer-events-none"
        style={{ backgroundImage: `url("${NOISE_TEXTURE_SVG}")` }}
      />
      <div className="absolute inset-4 border border-[#C5A265]/30 pointer-events-none z-20 group-hover:border-[#C5A265]/60 transition-colors duration-300"></div>
    </div>
  );
};

// --- SCROLL PROGRESS BAR ---
const ScrollProgressBar: React.FC = () => {
  const { scrollYProgress } = useScroll();
  const scaleY = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });

  return (
    <div className="fixed right-6 md:right-12 top-0 bottom-0 w-[1px] z-40 pointer-events-none hidden md:block">
      <div className="h-full w-full bg-white/5" />
      <motion.div
        className="absolute top-0 left-0 w-full bg-[#C5A265] origin-top"
        style={{ scaleY, height: '100%' }}
      />
      <motion.div
        className="absolute left-1/2 -translate-x-1/2 w-2 h-2 bg-[#C5A265] rounded-full shadow-[0_0_12px_rgba(197,162,101,0.8)]"
        style={{ top: useTransform(scaleY, v => `${v * 100}%`) }}
      />
    </div>
  );
};

// --- SECTION INDICATOR ---
const SECTION_NAMES = ['HERO', 'ABOUT', 'SERVICES', 'PHILOSOPHY', 'PERSPECTIVE', 'SKILLS', 'PROJECTS', 'PERSONALITY', 'CONTACT'];

const SectionIndicator: React.FC = () => {
  const [activeSection, setActiveSection] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const vh = window.innerHeight;
      const scrollY = window.scrollY;
      const section = Math.min(Math.floor(scrollY / vh), SECTION_NAMES.length - 1);
      setActiveSection(Math.max(0, section));
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

  return (
    <div className="fixed bottom-8 right-6 md:right-20 z-40 pointer-events-none hidden md:flex flex-col items-end gap-2 mix-blend-difference">
      <AnimatePresence mode="wait">
        <motion.span
          key={activeSection}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.3 }}
          className="text-[10px] font-mono tracking-[0.3em] text-[#C5A265]"
        >
          {SECTION_NAMES[activeSection]}
        </motion.span>
      </AnimatePresence>
      <span className="text-[10px] font-mono tracking-widest text-white/60">
        <span className="text-[#C5A265]">{String(activeSection + 1).padStart(2, '0')}</span>
        <span className="mx-1">/</span>
        {String(SECTION_NAMES.length).padStart(2, '0')}
      </span>
    </div>
  );
};

// --- MAGNETIC BUTTON ---
const MagneticButton: React.FC<{ children: React.ReactNode; className?: string; onClick?: () => void; as?: 'button' | 'div' }> = ({
  children, className = '', onClick, as: Tag = 'button'
}) => {
  const ref = useRef<HTMLElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 150, damping: 15 });
  const springY = useSpring(y, { stiffness: 150, damping: 15 });

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    x.set((e.clientX - centerX) * 0.3);
    y.set((e.clientY - centerY) * 0.3);
  }, [x, y]);

  const handleMouseLeave = useCallback(() => {
    x.set(0);
    y.set(0);
  }, [x, y]);

  return (
    <motion.div
      ref={ref as React.RefObject<HTMLDivElement>}
      style={{ x: springX, y: springY }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <Tag onClick={onClick} className={className}>
        {children}
      </Tag>
    </motion.div>
  );
};

// --- FLOATING GOLD PARTICLES (optimized) ---
const FloatingParticles: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    if (window.innerWidth < 768) return;

    let animationId: number;
    const particles: { x: number; y: number; size: number; speedY: number; speedX: number; opacity: number; life: number; maxLife: number }[] = [];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const createParticle = () => {
      particles.push({
        x: Math.random() * canvas.width,
        y: canvas.height + 10,
        size: Math.random() * 1.5 + 0.5,
        speedY: -(Math.random() * 0.3 + 0.1),
        speedX: (Math.random() - 0.5) * 0.2,
        opacity: 0,
        life: 0,
        maxLife: Math.random() * 600 + 300
      });
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      if (particles.length < 40 && Math.random() < 0.03) createParticle();

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.life++;
        p.x += p.speedX + Math.sin(p.life * 0.01) * 0.1;
        p.y += p.speedY;

        const lifeRatio = p.life / p.maxLife;
        if (lifeRatio < 0.1) p.opacity = lifeRatio / 0.1;
        else if (lifeRatio > 0.8) p.opacity = (1 - lifeRatio) / 0.2;
        else p.opacity = 1;

        if (p.life >= p.maxLife || p.y < -10) {
          // Swap-and-pop instead of splice for O(1)
          particles[i] = particles[particles.length - 1];
          particles.pop();
          continue;
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(197, 162, 101, ${p.opacity * 0.15})`;
        ctx.fill();
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * 3, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(197, 162, 101, ${p.opacity * 0.03})`;
        ctx.fill();
      }
      animationId = requestAnimationFrame(animate);
    };

    animate();
    return () => { cancelAnimationFrame(animationId); window.removeEventListener('resize', resize); };
  }, []);

  return <canvas ref={canvasRef} className="fixed inset-0 z-[5] pointer-events-none hidden md:block" style={{ mixBlendMode: 'screen' }} />;
};

// --- SPLIT TEXT CHARACTER ANIMATION ---
const SplitTextReveal: React.FC<{ text: string; className?: string; delay?: number }> = ({ text, className = '', delay = 0 }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-10%" });

  return (
    <div ref={ref} className={`inline-flex flex-wrap ${className}`}>
      {text.split('').map((char, i) => (
        <motion.span
          key={`${char}-${i}`}
          initial={{ opacity: 0, y: 40, rotateX: -90 }}
          animate={isInView ? { opacity: 1, y: 0, rotateX: 0 } : { opacity: 0, y: 40, rotateX: -90 }}
          transition={{ duration: 0.5, delay: delay + i * 0.04, ease: [0.16, 1, 0.3, 1] }}
          className="inline-block"
          style={{ perspective: '500px' }}
        >
          {char === ' ' ? '\u00A0' : char}
        </motion.span>
      ))}
    </div>
  );
};

// --- HORIZONTAL SCROLL TEXT MARQUEE ---
const MarqueeText: React.FC<{ text: string; className?: string }> = ({ text, className = '' }) => {
  return (
    <div className={`overflow-hidden whitespace-nowrap ${className}`}>
      <motion.div
        className="inline-flex gap-16"
        animate={{ x: ['0%', '-50%'] }}
        transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
      >
        {[...Array(4)].map((_, i) => (
          <span key={i} className="text-[8vw] font-serif text-white/[0.03] tracking-widest select-none">
            {text}
          </span>
        ))}
      </motion.div>
    </div>
  );
};

// --- STICKY CARD SECTION ---
interface StickySectionProps {
  children: React.ReactNode;
  className?: string;
  index: number;
  justify?: 'start' | 'center' | 'end' | 'between';
  bgColor?: string;
  isLast?: boolean;
  id?: string;
}

const CARD_COLORS = [
  '#141414', '#161616', '#141414', '#171717', '#000000',
  '#161616', '#141414', '#171717', '#141414',
];

const CARD_OFFSET = 32;

const StickySection: React.FC<StickySectionProps> = ({
  children, className = "", index, justify = 'center',
  bgColor, isLast = false, id
}) => {
  const justifyClass = {
    start: 'justify-start',
    center: 'justify-center',
    end: 'justify-end',
    between: 'justify-between'
  }[justify];

  const offset = (index - 1) * CARD_OFFSET;
  const bg = bgColor || CARD_COLORS[index - 1] || '#141414';

  return (
    <div
      id={id}
      className={`${isLast ? 'relative' : 'sticky'} isolate w-full flex flex-col ${justifyClass} ${className}`}
      style={{
        zIndex: index * 10 + 10,
        backgroundColor: bg,
        top: isLast ? 'auto' : `${offset}px`,
        minHeight: isLast ? '100dvh' : `calc(100dvh - ${offset}px)`,
        boxShadow: `0 -4px 20px rgba(0,0,0,0.9), inset 0 1px 0 rgba(197,162,101,0.25), inset 0 2px 0 rgba(255,255,255,0.04)`
      }}
    >
      <div className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{ backgroundImage: `url("${NOISE_TEXTURE_SVG}")` }}
      />
      <div className="absolute top-0 left-0 w-full z-50 pointer-events-none">
        <div className="h-[1px] w-full bg-[#C5A265]/40" />
        <div className="h-8 w-full bg-gradient-to-b from-white/[0.03] to-transparent" />
      </div>
      {!isLast && (
        <div className="absolute top-1.5 right-3 md:right-6 text-[8px] font-mono tracking-[0.3em] text-[#C5A265]/60 z-50 select-none">
          {String(index).padStart(2, '0')}
        </div>
      )}
      {children}
    </div>
  );
};


const App: React.FC = () => {
  const [content, setContent] = useState<SiteContent>(DEFAULT_CONTENT);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Name Animation
  const [nameIndex, setNameIndex] = useState(0);
  const nameVariations = useMemo(() => [
    content.hero.nameJa || "鈴木 智久",
    content.hero.nameEn || "SUZUKI TOMOHISA",
    "Data Scientist",
    "Decision Design"
  ], [content.hero.nameJa, content.hero.nameEn]);

  const containerRef = useRef<HTMLDivElement>(null);
  useCursorTracker(containerRef);

  useEffect(() => {
    const interval = setInterval(() => {
      setNameIndex(prev => (prev + 1) % nameVariations.length);
    }, 3500);
    return () => clearInterval(interval);
  }, [nameVariations.length]);

  useEffect(() => {
    const saved = localStorage.getItem('suzuki_portfolio_content');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setContent({ ...DEFAULT_CONTENT, ...parsed });
      } catch (e) {
        console.error("Failed to parse saved content", e);
      }
    }
    const timer = setTimeout(() => setIsLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  // Admin auth via environment variable or fallback
  const handleAdminAccess = useCallback(() => {
    const envPassword = import.meta.env.VITE_ADMIN_PASSWORD;
    if (!envPassword) {
      // No env password set — open admin directly (dev mode or no protection)
      setIsAuthenticated(true);
      setIsAdminOpen(true);
      return;
    }
    const input = prompt("管理者パスワードを入力してください:");
    if (input === envPassword) {
      setIsAuthenticated(true);
      setIsAdminOpen(true);
    }
  }, []);

  const handleSave = (newContent: SiteContent) => {
    setContent(newContent);
    localStorage.setItem('suzuki_portfolio_content', JSON.stringify(newContent));
    setIsAdminOpen(false);
  };

  const heroImg = content.hero.images[0] || "https://picsum.photos/1920/1080";
  const secondaryImg = content.hero.images[1] || heroImg;
  const tertiaryImg = content.hero.images[2] || heroImg;

  return (
    <div
      ref={containerRef}
      className={`relative min-h-screen text-[#e5e5e5] font-sans bg-[#141414] selection:bg-[#C5A265] selection:text-black ${isLoading ? 'overflow-hidden h-screen' : ''}`}
    >
      <AnimatePresence>
        {isLoading && <PageTransition key="loader" />}
      </AnimatePresence>

      <ErrorBoundary>
        <WaterBackground />
      </ErrorBoundary>
      <FloatingParticles />
      <ScrollProgressBar />
      <SectionIndicator />
      <Navigation />

      {/* Spotlight — desktop only, reduced intensity */}
      <div
        className="fixed inset-0 z-[20] pointer-events-none transition-all duration-300 ease-out hidden md:block"
        style={{
          WebkitMaskImage: 'radial-gradient(circle 250px at var(--x, 50%) var(--y, 50%), transparent 0%, black 100%)',
          maskImage: 'radial-gradient(circle 250px at var(--x, 50%) var(--y, 50%), transparent 0%, black 100%)',
          backdropFilter: 'grayscale(0.3)',
          WebkitBackdropFilter: 'grayscale(0.3)',
        }}
      />
      {/* Custom cursor — desktop only */}
      <div
        className="fixed z-[70] top-0 left-0 w-16 h-16 border-2 border-[#C5A265]/80 rounded-full pointer-events-none transform -translate-x-1/2 -translate-y-1/2 transition-transform duration-75 ease-out hidden md:block"
        style={{
          left: 'var(--x, 50%)',
          top: 'var(--y, 50%)',
          boxShadow: '0 0 20px rgba(197, 162, 101, 0.4), inset 0 0 20px rgba(197, 162, 101, 0.1)'
        }}
      >
        <div className="absolute top-1/2 left-1/2 w-2 h-2 bg-[#C5A265] rounded-full transform -translate-x-1/2 -translate-y-1/2 shadow-[0_0_10px_rgba(197,162,101,0.8)]"></div>
      </div>

      {/* HEADER */}
      <header className="fixed top-0 w-full z-50 px-4 py-4 md:px-12 md:py-8 flex justify-between items-start pointer-events-none mix-blend-difference">
        <div className="pointer-events-auto">
          <RevealText gold delay={0.3}>
            <h1 className="text-[10px] md:text-xs font-bold tracking-[0.2em] text-[#C5A265]">SUZUKI TOMOHISA</h1>
            <div className="h-[1px] w-8 bg-[#C5A265] my-1.5 md:my-2"></div>
            <p className="text-[9px] md:text-[10px] text-white/70 tracking-widest">PORTFOLIO</p>
          </RevealText>
        </div>
      </header>

      {/* LEFT LINE DECORATION — desktop only */}
      <div className="fixed left-12 bottom-0 top-0 w-[1px] hidden md:flex flex-col justify-center items-center z-40 pointer-events-none mix-blend-difference">
        <div className="h-full w-[1px] bg-white/10"></div>
      </div>

      <main className="relative w-full">

        {/* ========== 1. HERO ========== */}
        <StickySection index={1} className="pt-20 pb-8 md:py-24" id="hero">
          <section className="px-5 md:px-12 max-w-7xl mx-auto w-full md:pl-32 pb-16 md:pb-24">
            <RevealText delay={0.4}>
              <p className="font-serif text-sm md:text-base text-[#C5A265] tracking-wide mb-4 md:mb-6">
                {content.hero.subtitle}
              </p>
            </RevealText>

            <div className="relative h-[18vh] md:h-[30vh] flex items-center z-30">
              <ErrorBoundary fallback={<div className="absolute inset-0 bg-gradient-to-br from-[#0a0a0a] via-[#141414] to-[#1a1a1a]" />}>
                <WaterBackgroundHero />
              </ErrorBoundary>
              <AnimatePresence mode="wait">
                <motion.div
                  key={nameIndex}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0, transition: { delay: 0.15, duration: 0.6 } }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.6, ease: "easeInOut" }}
                  className="absolute w-full z-10"
                >
                  <LiquidText as="div" className="text-[7vw] md:text-6xl lg:text-7xl font-serif tracking-tight text-white leading-none">
                    <SplitTextReveal text={nameVariations[nameIndex]} delay={0} />
                  </LiquidText>
                </motion.div>
              </AnimatePresence>
            </div>

            <div className="mt-6 md:mt-16 max-w-xl">
              <RevealSection delay={0.6} className="h-[1px] w-24 bg-[#C5A265] mb-4 md:mb-6"><div /></RevealSection>
              <RevealText delay={0.7}>
                <p className="text-sm md:text-base text-white/90 leading-relaxed md:leading-loose font-serif tracking-wide">
                  {content.hero.title}
                </p>
              </RevealText>
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2, duration: 2 }}
              className="absolute bottom-6 md:bottom-12 right-5 md:right-12 flex flex-col items-center gap-3 z-30"
            >
              <span className="text-[10px] tracking-widest text-[#C5A265]">SCROLL</span>
              <div className="h-12 md:h-16 w-[1px] bg-[#C5A265]/30 relative overflow-hidden">
                <motion.div
                  className="absolute top-0 left-0 w-full bg-[#C5A265]"
                  animate={{ height: ['0%', '100%'], opacity: [1, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                />
              </div>
            </motion.div>
          </section>
        </StickySection>

        {/* ========== 2. INTRO / ABOUT ========== */}
        <StickySection index={2} id="about">
          <section className="px-5 md:px-12 w-full max-w-7xl mx-auto md:pl-24 flex items-center py-12 md:py-24 pb-16 md:pb-48">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-20 items-center w-full">
              <div className="md:col-span-6 relative">
                <RevealSection zIndex="z-0">
                  <div className="aspect-[3/4] md:aspect-[4/5] w-full max-w-sm md:max-w-none mx-auto relative border border-[#C5A265]/30 p-1.5 md:p-2">
                    <ParallaxImage src={heroImg} className="w-full h-full" />
                  </div>
                </RevealSection>
                <div className="absolute top-0 left-0 w-full h-full pointer-events-none z-30">
                  <RevealSection>
                    <div className="absolute -top-4 left-1 md:-top-10 md:-left-10 text-[50px] md:text-[120px] leading-none font-serif text-[#C5A265] opacity-30">
                      01
                    </div>
                  </RevealSection>
                </div>
              </div>

              <div className="md:col-span-6 flex flex-col justify-center">
                <RevealText className="mb-5 md:mb-8" gold>
                  <span className="text-xs font-mono tracking-widest block mb-3 md:mb-4 border-l-2 border-[#C5A265] pl-4">ABOUT ME</span>
                </RevealText>
                <RevealText className="mb-6 md:mb-10">
                  <h2 className="text-xl md:text-4xl font-serif font-medium leading-tight text-white">{content.intro.title}</h2>
                </RevealText>

                <div className="space-y-5 md:space-y-8">
                  <RevealSection delay={0.2}>
                    <div className="text-[13px] md:text-base text-white/80 leading-loose whitespace-pre-line">
                      {content.intro.body}
                    </div>
                  </RevealSection>
                  <RevealSection delay={0.4} className="bg-[#C5A265]/[0.07] p-4 md:p-8 border-l-2 border-[#C5A265]">
                    <p className="text-sm md:text-xl font-serif text-[#C5A265]">
                      {content.intro.highlight}
                    </p>
                  </RevealSection>

                  <RevealSection delay={0.6}>
                    <div className="pt-5 md:pt-8 border-t border-white/20">
                      <p className="text-xs font-mono tracking-widest text-[#C5A265] mb-4">FEATURED PROJECTS</p>
                      <FeaturedProjects />
                    </div>
                  </RevealSection>
                </div>
              </div>
            </div>
          </section>
        </StickySection>

        {/* ========== 3. SERVICES ========== */}
        <StickySection index={3} justify="start" id="services">
          <section className="px-5 md:px-12 w-full max-w-7xl mx-auto md:pl-24 py-12 md:py-24 pb-16 md:pb-48 flex flex-col justify-center" style={{ minHeight: 'inherit' }}>
            <div className="flex flex-col md:flex-row items-start md:items-baseline justify-between border-b border-white/20 pb-4 md:pb-6 mb-8 md:mb-16 relative z-30 gap-2 md:gap-4">
              <RevealText>
                <h2 className="text-xl md:text-5xl font-serif text-white">{content.whatIDo.title}</h2>
              </RevealText>
              <RevealText delay={0.2} gold>
                <span className="text-[10px] md:text-xs font-mono tracking-[0.2em] text-[#C5A265]">02 — SERVICES</span>
              </RevealText>
            </div>

            <div className="space-y-[1px] bg-white/10 relative z-30">
              {content.whatIDo.items.map((item, i) => (
                <RevealSection key={i} delay={i * 0.1} className="bg-[#1a1a1a] group hover:bg-[#222] transition-colors duration-500">
                  <div className="p-4 md:p-12 flex flex-row gap-3 md:gap-8 items-start md:items-center relative overflow-hidden">
                    <div className="text-[#C5A265] font-serif text-base md:text-2xl opacity-60 group-hover:opacity-100 transition-opacity w-8 md:w-12 shrink-0 pt-0.5 md:pt-0">
                      0{i + 1}
                    </div>
                    <h3 className="text-[13px] md:text-xl font-serif font-light leading-relaxed group-hover:text-white transition-colors text-white/90 flex-1 z-10">
                      {item}
                    </h3>
                    <div className="hidden md:block opacity-0 group-hover:opacity-100 transition-opacity transform translate-x-4 group-hover:translate-x-0 duration-500 text-[#C5A265]">
                      <ArrowDown className="-rotate-90" size={24} />
                    </div>
                    <div className="absolute bottom-0 left-0 h-[2px] w-0 group-hover:w-full bg-gradient-to-r from-[#C5A265] to-transparent transition-all duration-700 ease-out" />
                  </div>
                </RevealSection>
              ))}
            </div>

            <RevealSection className="mt-8 md:mt-16 text-center">
              <p className="text-[#C5A265] font-serif text-xs md:text-sm tracking-widest border border-[#C5A265]/40 inline-block px-5 md:px-8 py-2.5 md:py-3">
                {content.whatIDo.note}
              </p>
            </RevealSection>
          </section>
        </StickySection>

        {/* ========== 4. PHILOSOPHY ========== */}
        <StickySection index={4} justify="start" id="philosophy">
          <section className="px-5 md:px-12 w-full max-w-6xl mx-auto relative z-10 py-12 md:py-24 pb-16 md:pb-48 flex flex-col justify-center" style={{ minHeight: 'inherit' }}>
            <div className="flex flex-col items-center gap-10 md:gap-20">
              <RevealText>
                <div className="flex flex-col items-center gap-3 md:gap-4">
                  <span className="text-[10px] md:text-xs font-mono tracking-[0.3em] text-[#C5A265]">03 — PHILOSOPHY</span>
                  <h2 className="text-xl md:text-4xl font-serif text-center text-white">{content.stance.title}</h2>
                </div>
              </RevealText>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-12 w-full">
                {content.stance.items.map((item, i) => (
                  <RevealSection key={i} delay={i * 0.15} className="flex flex-col items-center text-center">
                    <div className="h-10 w-[1px] bg-[#C5A265]/50 mb-4 hidden md:block"></div>
                    <LiquidText className="text-sm md:text-xl font-serif text-white leading-loose md:writing-vertical-rl md:h-64 flex justify-center items-center">
                      {item}
                    </LiquidText>
                    <div className="h-6 w-[1px] bg-[#C5A265]/40 mt-3 md:hidden"></div>
                  </RevealSection>
                ))}
              </div>

              <RevealSection>
                <div className="text-center max-w-2xl mx-auto border-t border-b border-[#C5A265]/30 py-5 md:py-8">
                  <p className="text-[13px] md:text-base font-serif tracking-widest text-white/90 leading-loose">
                    {content.stance.conclusion}
                  </p>
                </div>
              </RevealSection>
            </div>
          </section>
        </StickySection>

        {/* ========== 5. PERSPECTIVE ========== */}
        <StickySection index={5} bgColor="#000000" id="perspective">
          <section className="w-full flex-1 relative overflow-hidden flex items-center justify-center bg-black" style={{ minHeight: 'inherit' }}>
            <div className="absolute inset-0 z-0 bg-black">
              <div className="absolute inset-0 opacity-60">
                <ParallaxImage src={secondaryImg} className="w-full h-full" />
              </div>
            </div>
            <div className="absolute inset-0 z-10 flex items-center overflow-hidden pointer-events-none">
              <MarqueeText text="DATA SCIENCE   DECISION DESIGN   ANALYSIS   STRATEGY" />
            </div>
            <div className="relative z-30 max-w-3xl mx-auto px-5 text-center">
              <RevealSection>
                <div className="border border-white/30 p-5 md:p-12 backdrop-blur-sm bg-black/50">
                  <h2 className="text-xl md:text-5xl font-serif text-white tracking-widest mb-4 md:mb-6">
                    PERSPECTIVE
                  </h2>
                  <div className="space-y-3 md:space-y-4">
                    {content.copy.sub.map((line, i) => (
                      <p key={i} className="text-xs md:text-sm text-white/80 font-serif leading-relaxed tracking-wide">
                        {line}
                      </p>
                    ))}
                  </div>
                </div>
              </RevealSection>
            </div>
          </section>
        </StickySection>

        {/* ========== 6. SKILLS & VALUES ========== */}
        <StickySection index={6} id="skills">
          <section className="px-5 md:px-12 w-full max-w-7xl mx-auto md:pl-24 flex items-center py-12 md:py-24 pb-16 md:pb-48">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-24 w-full">
              <div>
                <RevealSection className="border-b-2 border-[#C5A265] mb-5 md:mb-8 pb-3 md:pb-4 flex justify-between items-end">
                  <h2 className="text-base md:text-xl font-serif text-white">{content.skills.title}</h2>
                  <span className="text-[10px] text-[#C5A265]">04</span>
                </RevealSection>
                <ul className="space-y-4 md:space-y-6">
                  {content.skills.items.map((item, i) => (
                    <RevealSection key={i} delay={i * 0.1}>
                      <li className="flex items-baseline gap-3 text-white/80 hover:text-white transition-colors duration-300">
                        <span className="w-1.5 h-1.5 bg-[#C5A265] rounded-full shrink-0 mt-1.5"></span>
                        <span className="text-[13px] md:text-base leading-relaxed">{item}</span>
                      </li>
                    </RevealSection>
                  ))}
                </ul>
              </div>
              <div>
                <RevealSection className="border-b-2 border-[#C5A265] mb-5 md:mb-8 pb-3 md:pb-4 flex justify-between items-end">
                  <h2 className="text-base md:text-xl font-serif text-white">{content.values.title}</h2>
                  <span className="text-[10px] text-[#C5A265]">05</span>
                </RevealSection>
                <ul className="space-y-4 md:space-y-6">
                  {content.values.items.map((item, i) => (
                    <RevealSection key={i} delay={i * 0.1}>
                      <li className="flex items-baseline gap-3 text-white/80 hover:text-white transition-colors duration-300">
                        <span className="w-1.5 h-1.5 bg-[#C5A265] rounded-full shrink-0 mt-1.5"></span>
                        <span className="text-[13px] md:text-base leading-relaxed">{item}</span>
                      </li>
                    </RevealSection>
                  ))}
                </ul>
              </div>
            </div>
          </section>
        </StickySection>

        {/* ========== 7. PROJECTS ========== */}
        <StickySection index={7} justify="center" id="projects">
          <div className="w-full min-h-[100dvh] flex flex-col items-center justify-center bg-[#141414] overflow-hidden">
            <ProjectShowcase />
            <div className="mt-4 mb-8">
              <Link
                to="/dashboard"
                className="inline-flex items-center gap-2 px-6 py-3 border border-[#C5A265]/40 text-[#C5A265] text-xs tracking-[0.2em] hover:bg-[#C5A265] hover:text-black transition-all duration-300"
              >
                <LayoutDashboard size={14} />
                全プロジェクトを見る
              </Link>
            </div>
          </div>
        </StickySection>

        {/* ========== 8. PERSONALITY ========== */}
        <StickySection index={8} id="personality">
          <section className="px-4 md:px-12 w-full max-w-6xl mx-auto flex items-center justify-center py-12 md:py-24 bg-[#171717]" style={{ minHeight: 'inherit' }}>
            <div className="border border-[#C5A265]/40 bg-[#1a1a1a] p-5 md:p-20 relative w-full">
              <div className="absolute top-0 left-0 w-10 h-10 md:w-20 md:h-20 border-t-2 border-l-2 border-[#C5A265] z-30"></div>
              <div className="absolute bottom-0 right-0 w-10 h-10 md:w-20 md:h-20 border-b-2 border-r-2 border-[#C5A265] z-30"></div>

              <div className="relative z-10 flex flex-col md:flex-row gap-6 md:gap-12 items-center">
                <RevealSection zIndex="z-0" className="w-28 h-28 md:w-56 md:h-56 shrink-0 border-4 border-[#2a2a2a] shadow-2xl">
                  <img src={tertiaryImg} alt="" className="w-full h-full object-cover grayscale contrast-125" />
                </RevealSection>

                <div className="flex-1 text-center md:text-left">
                  <RevealText className="mb-5 md:mb-8" gold>
                    <h2 className="text-[10px] md:text-xs font-mono tracking-[0.3em] text-[#C5A265] mb-2">06 — PERSONALITY</h2>
                  </RevealText>
                  <div className="space-y-4 md:space-y-6">
                    {content.personality.items.map((item, i) => (
                      <RevealSection key={i} delay={i * 0.1}>
                        <p className="text-[13px] md:text-lg font-serif text-white/90">
                          {item}
                        </p>
                      </RevealSection>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section>
        </StickySection>

        {/* ========== 9. FOOTER ========== */}
        <StickySection index={9} justify="between" isLast id="contact">
          <div className="w-full min-h-[100dvh] flex flex-col justify-between py-12 md:py-24 px-5 md:px-12 bg-[#141414]">
            <div className="flex-1 flex flex-col items-center justify-center z-10">
              <RevealSection>
                <h2 className="text-lg md:text-3xl lg:text-4xl font-serif font-medium leading-relaxed mb-6 md:mb-12 text-white tracking-wide text-center max-w-4xl mx-auto px-2">
                  {content.copy.main}
                </h2>
              </RevealSection>

              <RevealSection delay={0.2}>
                <div className="flex flex-col sm:flex-row gap-3 md:gap-4 items-center">
                  <MagneticButton
                    onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                    className="group relative px-5 md:px-8 py-3 md:py-4 border border-[#C5A265] text-[#C5A265] text-[10px] md:text-xs tracking-[0.2em] hover:bg-[#C5A265] hover:text-black transition-all duration-500"
                  >
                    BACK TO TOP
                  </MagneticButton>
                  <MagneticButton as="div">
                    <Link
                      to="/dashboard"
                      className="flex items-center gap-2 px-5 md:px-8 py-3 md:py-4 border border-white/40 text-white/80 text-[10px] md:text-xs tracking-[0.2em] hover:border-[#C5A265] hover:text-[#C5A265] transition-all duration-500"
                    >
                      <LayoutDashboard size={14} /> DASHBOARD
                    </Link>
                  </MagneticButton>
                </div>
              </RevealSection>
            </div>

            <div className="w-full flex flex-col justify-end items-center pt-8 md:pt-16">
              <RevealSection delay={0.4} className="w-full flex flex-col items-center">
                {content.footer.message && (
                  <p className="text-xs md:text-sm text-white/70 text-center mb-5 md:mb-8 whitespace-pre-line font-serif leading-loose max-w-2xl px-2">
                    {content.footer.message}
                  </p>
                )}
                <div className="w-full h-[1px] bg-white/15 max-w-7xl mb-5 md:mb-8"></div>
                <span className="text-[9px] md:text-[10px] font-mono tracking-widest text-white/60">&copy; {new Date().getFullYear()} SUZUKI TOMOHISA</span>
              </RevealSection>
            </div>
          </div>
        </StickySection>

      </main>

      {/* ADMIN (hidden access via keyboard shortcut: Ctrl+Shift+E) */}
      <AdminKeyboardShortcut onTrigger={handleAdminAccess} />

      {/* ADMIN EDITOR */}
      {isAdminOpen && isAuthenticated && (
        <div className="cursor-auto relative z-[150]">
          <AdminEditor
            content={content}
            onSave={handleSave}
            onClose={() => setIsAdminOpen(false)}
          />
        </div>
      )}
    </div>
  );
};

// Hidden admin access via keyboard shortcut
const AdminKeyboardShortcut: React.FC<{ onTrigger: () => void }> = ({ onTrigger }) => {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'E') {
        e.preventDefault();
        onTrigger();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onTrigger]);

  return null;
};

export default App;
