import { motion } from "framer-motion";

const FloatingOrbs = () => {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0 bg-gradient-to-br from-[#F9FAFB] via-white to-[#F3F4F6]">
      {/* Light blue pastel orb */}
      <motion.div
        className="absolute w-[500px] h-[500px] rounded-full blur-3xl opacity-60"
        style={{ background: 'radial-gradient(circle, rgba(191,219,254,0.6) 0%, rgba(191,219,254,0.2) 50%, transparent 70%)' }}
        initial={{ x: -150, y: -100 }}
        animate={{
          x: [-150, -100, -150],
          y: [-100, -50, -100],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      
      {/* Lavender pastel orb */}
      <motion.div
        className="absolute right-0 top-1/4 w-[450px] h-[450px] rounded-full blur-3xl opacity-50"
        style={{ background: 'radial-gradient(circle, rgba(221,214,254,0.6) 0%, rgba(221,214,254,0.2) 50%, transparent 70%)' }}
        initial={{ x: 100, y: 0 }}
        animate={{
          x: [100, 150, 100],
          y: [0, 50, 0],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      
      {/* Peach pastel orb */}
      <motion.div
        className="absolute bottom-0 left-1/4 w-[400px] h-[400px] rounded-full blur-3xl opacity-50"
        style={{ background: 'radial-gradient(circle, rgba(254,215,195,0.6) 0%, rgba(254,215,195,0.2) 50%, transparent 70%)' }}
        initial={{ x: 0, y: 100 }}
        animate={{
          x: [0, 50, 0],
          y: [100, 50, 100],
        }}
        transition={{
          duration: 22,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Mint pastel orb */}
      <motion.div
        className="absolute top-1/2 right-1/3 w-[300px] h-[300px] rounded-full blur-3xl opacity-40"
        style={{ background: 'radial-gradient(circle, rgba(167,243,208,0.5) 0%, rgba(167,243,208,0.15) 50%, transparent 70%)' }}
        initial={{ x: 0, y: 0 }}
        animate={{
          x: [0, -40, 0],
          y: [0, -40, 0],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Light pink accent orb */}
      <motion.div
        className="absolute top-1/3 left-1/2 w-[250px] h-[250px] rounded-full blur-3xl opacity-35"
        style={{ background: 'radial-gradient(circle, rgba(252,231,243,0.6) 0%, rgba(252,231,243,0.2) 50%, transparent 70%)' }}
        initial={{ x: -100, y: -50 }}
        animate={{
          x: [-100, -60, -100],
          y: [-50, -20, -50],
        }}
        transition={{
          duration: 16,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Floating soft particles */}
      {[...Array(8)].map((_, i) => {
        const colors = [
          'rgba(191,219,254,0.7)', // light blue
          'rgba(221,214,254,0.7)', // lavender
          'rgba(254,215,195,0.7)', // peach
          'rgba(167,243,208,0.7)', // mint
        ];
        return (
          <motion.div
            key={i}
            className="absolute w-2 h-2 rounded-full"
            style={{
              left: `${15 + i * 10}%`,
              top: `${25 + (i % 4) * 15}%`,
              background: colors[i % colors.length],
              boxShadow: `0 0 10px ${colors[i % colors.length]}`,
            }}
            animate={{
              y: [0, -25, 0],
              opacity: [0.4, 0.8, 0.4],
            }}
            transition={{
              duration: 5 + i * 0.5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.3,
            }}
          />
        );
      })}
    </div>
  );
};

export default FloatingOrbs;
