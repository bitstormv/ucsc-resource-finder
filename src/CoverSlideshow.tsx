import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';

const IMAGES = [
  "https://ucsc.cmb.ac.lk/wp-content/uploads/2021/11/IMG_20210907_130619-1024x577.jpg",
  "https://ucsc.cmb.ac.lk/wp-content/uploads/2021/11/8F1A1982-1024x576.jpg",
  "https://ucsc.cmb.ac.lk/wp-content/uploads/2021/11/8F1A0569-1024x683.jpg"
];

export default function CoverSlideshow() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % IMAGES.length);
    }, 5000); // Change image every 5 seconds

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden">
      <AnimatePresence mode="popLayout">
        <motion.img
          key={currentIndex}
          src={IMAGES[currentIndex]}
          alt="UCSC Cover"
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
          className="absolute inset-0 w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
      </AnimatePresence>
    </div>
  );
}
