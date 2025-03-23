
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { ShieldCheck, Lock, ArrowRight } from 'lucide-react';

const Hero = () => {
  const { user } = useAuth();
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.4, 0, 0.2, 1] } }
  };
  
  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden py-24 px-4 sm:px-6 lg:pt-32">
      {/* Background effects */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-blue-50 to-white opacity-70"></div>
        <div className="absolute top-1/4 right-1/4 w-64 h-64 rounded-full bg-blue-300 mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute bottom-1/3 left-1/3 w-72 h-72 rounded-full bg-purple-300 mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      <div className="relative z-10 container mx-auto max-w-6xl">
        <motion.div
          className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Left column: Text content */}
          <motion.div className="space-y-8 text-center lg:text-left">
            <motion.div variants={itemVariants}>
              <div className="inline-block px-3 py-1 mb-4 text-xs font-medium text-primary bg-primary/10 rounded-full">
                Advanced Blockchain Security
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-gray-900 leading-tight">
                Securing the Future of <span className="text-primary">Digital Transactions</span>
              </h1>
            </motion.div>
            
            <motion.p variants={itemVariants} className="text-lg text-gray-600 max-w-2xl mx-auto lg:mx-0">
              Our advanced fraud detection system protects blockchain transactions with cutting-edge technology, ensuring your digital assets remain secure in an ever-evolving threat landscape.
            </motion.p>
            
            <motion.div variants={itemVariants} className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 justify-center lg:justify-start">
              {user ? (
                <Link to="/profile">
                  <Button size="lg" className="glass-button w-full sm:w-auto">
                    View Profile <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              ) : (
                <>
                  <Link to="/register">
                    <Button size="lg" className="glass-button w-full sm:w-auto">
                      Get Started <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                  <Link to="/login">
                    <Button size="lg" variant="outline" className="w-full sm:w-auto">
                      Sign In
                    </Button>
                  </Link>
                </>
              )}
            </motion.div>
            
            <motion.div variants={itemVariants} className="flex flex-wrap justify-center lg:justify-start gap-6 pt-4">
              <div className="flex items-center space-x-2">
                <ShieldCheck className="h-5 w-5 text-primary" />
                <span className="text-sm text-gray-600">Real-time Protection</span>
              </div>
              <div className="flex items-center space-x-2">
                <Lock className="h-5 w-5 text-primary" />
                <span className="text-sm text-gray-600">End-to-End Encryption</span>
              </div>
            </motion.div>
          </motion.div>
          
          {/* Right column: Image */}
          <motion.div 
            variants={itemVariants} 
            className="relative h-[400px] md:h-[500px] flex items-center justify-center"
          >
            <div className="relative w-full h-full max-w-md mx-auto">
              <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 to-purple-100 rounded-2xl transform rotate-3"></div>
              <div className="absolute inset-0 backdrop-blur-sm bg-white/60 border border-white/20 shadow-xl rounded-2xl transform -rotate-3 transition-transform hover:rotate-0 duration-700"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="grid grid-cols-3 gap-4 p-8 w-full">
                  {Array(9).fill(0).map((_, i) => (
                    <div 
                      key={i} 
                      className="aspect-square rounded-lg glass-card flex items-center justify-center p-2"
                    >
                      <div className={`w-full h-full rounded ${i % 2 === 0 ? 'bg-primary/10' : 'bg-purple-100/50'} flex items-center justify-center`}>
                        <div className="w-2/3 h-2/3 rounded-sm bg-white/70 shadow-sm"></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
