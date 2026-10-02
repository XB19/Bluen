import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import { useRef } from 'react';

export default function PageHero({ eyebrow, title, text, image, crumb }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], [0, 140]);
  const scale = useTransform(scrollYProgress, [0, 1], [1.05, 1.18]);

  return (
    <section className="page-hero" ref={ref}>
      <motion.div className="page-hero-bg" style={{ y, scale }}>
        <img src={image} alt="" />
      </motion.div>
      <div className="wrap">
        <motion.div
          className="breadcrumb"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Link to="/">Accueil</Link>
          <ChevronRight size={14} />
          <span>{crumb}</span>
        </motion.div>
        {eyebrow && (
          <motion.div className="eyebrow" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }}>
            {eyebrow}
          </motion.div>
        )}
        <motion.h1 initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, delay: 0.18, ease: [0.22, 1, 0.36, 1] }}>
          {title}
        </motion.h1>
        {text && (
          <motion.p initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}>
            {text}
          </motion.p>
        )}
      </div>
    </section>
  );
}
