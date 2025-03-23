
import { useEffect } from 'react';
import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import Features from '@/components/Features';
import { Link } from 'react-router-dom';

const Index = () => {
  useEffect(() => {
    // Function to handle intersection observer callbacks
    const handleIntersect = (entries: IntersectionObserverEntry[]) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('show');
        }
      });
    };

    // Set up intersection observer
    const observer = new IntersectionObserver(handleIntersect, {
      root: null,
      rootMargin: '0px',
      threshold: 0.1
    });

    // Observe all elements with the animate-on-scroll class
    document.querySelectorAll('.animate-on-scroll').forEach(element => {
      observer.observe(element);
    });

    return () => {
      // Clean up
      document.querySelectorAll('.animate-on-scroll').forEach(element => {
        observer.unobserve(element);
      });
    };
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-[#121212] text-white">
      <Navbar />
      
      <main className="flex-grow">
        {/* <Hero /> */}
        <Features />
  
        {/* CTA Section */}
        <section className="py-20 px-4 sm:px-6 relative overflow-hidden">
          <div className="absolute inset-0 z-0 bg-gradient-to-r from-[#0f172a] to-[#1e293b] opacity-70"></div>
          
          <div className="container mx-auto max-w-6xl relative z-10">
            <div className="glass-panel rounded-2xl p-8 md:p-12 text-center bg-white/10 backdrop-blur-md shadow-lg border border-primary/30">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
                viewport={{ once: true }}
                className="max-w-3xl mx-auto"
              >
                <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-6">
                  Fortify Your Digital Fortress
                </h2>
                <p className="text-lg text-gray-400 mb-8">
                  Join thousands of users who trust Blockchain Sentry to keep their assets safe.
                </p>
                <Link to="/register">
                  <motion.button
                    whileHover={{ scale: 1.05, boxShadow: "0 4px 20px rgba(255, 255, 255, 0.4)" }}
                    whileTap={{ scale: 0.98 }}
                    className="glass-button px-8 py-3 text-white font-semibold rounded-lg text-lg bg-gradient-to-br from-[#4f46e5] to-[#9333ea] shadow-lg"
                  >
                    Start Protecting Now
                  </motion.button>
                </Link>
              </motion.div>
            </div>
          </div>
        </section>
      </main>
      
      {/* Footer */}
      <footer className="bg-[#1A1A1A] py-12 px-4 sm:px-6 text-gray-400">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-6 md:mb-0">
              <div className="flex items-center space-x-2">
                {/* <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center">
                  <span className="text-white font-bold text-sm">FD</span>
                </div> */}
                <span className="font-semibold text-white">Transactify</span>
              </div>
              <p className="text-gray-500 text-sm mt-2">
                Securing digital assets since 2023
              </p>
            </div>
  
            <div className="flex space-x-8">
              <Link to="/" className="text-gray-400 hover:text-primary transition-colors">
                Home
              </Link>
              <Link to="/login" className="text-gray-400 hover:text-primary transition-colors">
                Login
              </Link>
              <Link to="/register" className="text-gray-400 hover:text-primary transition-colors">
                Register
              </Link>
            </div>
          </div>
  
          <div className="mt-8 pt-8 border-t border-gray-700 text-center text-gray-500 text-sm">
            <p>&copy; {new Date().getFullYear()} Transactify. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
  
};

export default Index;
