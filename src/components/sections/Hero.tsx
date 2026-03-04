"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { FaLocationDot } from "react-icons/fa6";
import { personalInfo } from "@/data/personal";

export default function Hero() {
  return (
    <section
      id="home"
      className="relative flex min-h-screen items-center justify-center overflow-hidden px-6"
    >
      {/* Decorative circles */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -right-32 -top-32 h-[500px] w-[500px] rounded-full bg-gray-100/80" />
        <div className="absolute -left-20 top-1/3 h-[300px] w-[300px] rounded-full bg-gray-100/60" />
        <div className="absolute bottom-20 right-1/4 h-[200px] w-[200px] rounded-full bg-blue-50/50" />
      </div>

      <div className="relative z-10 mx-auto max-w-3xl text-center">
        {/* Avatar */}
        <motion.div
          className="mb-8 flex justify-center"
          initial={{ opacity: 0, scale: 0, rotate: -180 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 200, damping: 18 }}
        >
          <motion.div
            className="relative cursor-pointer"
            animate={{ y: [0, -6, 0], scale: [1, 1.02, 1] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            whileHover={{ scale: 1.1, rotate: 3 }}
            whileTap={{ scale: 0.95 }}
          >
            {/* Rotating dashed ring */}
            <div
              className="absolute -inset-3 rounded-full border-2 border-dashed border-emerald-400/30 transition-all duration-500 hover:border-emerald-400/60"
              style={{ animation: "avatar-ring-spin 20s linear infinite" }}
            />

            {/* Glow wrapper with gradient border */}
            <motion.div
              className="relative rounded-full bg-gradient-to-br from-emerald-400 via-cyan-400 to-blue-500 p-[3px]"
              animate={{
                boxShadow: [
                  "0 0 20px rgba(52,211,153,0.3), 0 0 40px rgba(59,130,246,0.15)",
                  "0 0 30px rgba(52,211,153,0.5), 0 0 60px rgba(59,130,246,0.3)",
                  "0 0 20px rgba(52,211,153,0.3), 0 0 40px rgba(59,130,246,0.15)",
                ],
              }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            >
              <div className="overflow-hidden rounded-full bg-white p-[2px]">
                <Image
                  src={personalInfo.avatar}
                  alt={personalInfo.name}
                  width={160}
                  height={160}
                  priority
                  className="h-32 w-32 rounded-full object-cover sm:h-40 sm:w-40"
                />
              </div>
            </motion.div>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <div className="mb-4 flex items-center justify-center gap-2 text-sm text-muted">
            <FaLocationDot className="text-accent" />
            <span>{personalInfo.city}</span>
          </div>

          <h1 className="text-5xl font-bold tracking-tight text-foreground sm:text-7xl">
            {personalInfo.name}
          </h1>

          <p className="mt-6 text-lg text-muted leading-relaxed">
            {personalInfo.bio}
          </p>
        </motion.div>

        {/* Role tags */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-8 flex flex-wrap items-center justify-center gap-3"
        >
          {personalInfo.roles.map((role) => (
            <span
              key={role}
              className="rounded-full border border-border bg-white/80 px-4 py-1.5 text-sm text-muted backdrop-blur-sm"
            >
              {role}
            </span>
          ))}
        </motion.div>

        {/* Social links */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="mt-8 flex items-center justify-center gap-4"
        >
          {personalInfo.socials.map((social) => {
            const Icon = social.icon;
            return (
              <a
                key={social.name}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={social.name}
                className="flex h-11 w-11 items-center justify-center rounded-full border border-border bg-white text-muted shadow-sm hover:text-accent hover:border-accent/30 hover:shadow-md transition-all"
              >
                <Icon className="text-xl" />
              </a>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
