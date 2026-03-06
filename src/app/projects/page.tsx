'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { IoArrowBack } from 'react-icons/io5';
import Projects from '@/components/sections/Projects';
import AsciiCanvas from '@/components/ui/AsciiCanvas';

export default function ProjectsPage() {
  return (
    <motion.main
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="min-h-screen bg-background"
    >
      {/* Decorative ASCII header */}
      <div className="relative overflow-hidden">
        <AsciiCanvas variant="subtle" className="opacity-60" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background" />
      </div>

      <div className="mx-auto max-w-6xl px-6 -mt-8 relative z-10 pb-4">
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium border-2 border-primary/40 text-primary hover:bg-primary/10 hover:border-primary transition-all rounded-sm pixel-btn"
        >
          <IoArrowBack className="text-base" />
          <span>Back to Town</span>
        </Link>
      </div>
      <Projects />
    </motion.main>
  );
}
