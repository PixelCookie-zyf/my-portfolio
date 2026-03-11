"use client";

import { motion } from "framer-motion";
import { FaEnvelope } from "react-icons/fa6";
import SectionTitle from "@/components/ui/SectionTitle";
import ScrollReveal from "@/components/ui/ScrollReveal";
import { personalInfo } from "@/data/personal";

export default function Contact() {
  return (
    <section id="contact" className="py-24 px-6">
      <div className="mx-auto max-w-3xl text-center">
        <SectionTitle title="Contact" subtitle="Get in touch" />

        <ScrollReveal>
          <div className="flex justify-center gap-4">
            {/* Email icon */}
            <motion.a
              href={`mailto:${personalInfo.email}`}
              aria-label="Email"
              className="flex h-10 w-10 items-center justify-center rounded-full bg-card-bg text-muted hover:bg-accent hover:text-white transition-all"
              whileHover={{ scale: 1.15, rotate: 5 }}
              whileTap={{ scale: 0.95 }}
            >
              <FaEnvelope className="text-lg" />
            </motion.a>

            {/* Social icons */}
            {personalInfo.socials.map((social) => {
              const Icon = social.icon;
              return (
                <motion.a
                  key={social.name}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.name}
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-card-bg text-muted hover:bg-accent hover:text-white transition-all"
                  whileHover={{ scale: 1.15, rotate: 5 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Icon className="text-lg" />
                </motion.a>
              );
            })}
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
