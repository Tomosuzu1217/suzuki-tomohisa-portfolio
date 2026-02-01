import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const NotFound: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#141414] text-white flex flex-col items-center justify-center px-4">
      <p className="text-[10px] font-mono tracking-[0.3em] text-[#C5A265] mb-4">ERROR 404</p>
      <h1 className="text-4xl md:text-6xl font-serif text-white mb-4">Page Not Found</h1>
      <p className="text-white/60 text-sm mb-8">
        お探しのページが見つかりませんでした。
      </p>
      <Link
        to="/"
        className="flex items-center gap-2 px-6 py-3 border border-[#C5A265] text-[#C5A265] text-xs tracking-[0.2em] hover:bg-[#C5A265] hover:text-black transition-all duration-300"
      >
        <ArrowLeft size={14} />
        BACK TO TOP
      </Link>
    </div>
  );
};

export default NotFound;
