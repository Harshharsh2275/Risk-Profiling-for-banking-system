
import { useEffect, useRef } from 'react';
import { motion, useInView, useAnimation } from 'framer-motion';
import { Shield, Database, Fingerprint, BarChart3, Webhook, Lock } from 'lucide-react';

interface FeatureCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  delay: number;
}

const FeatureCard = ({ title, description, icon, delay }: FeatureCardProps) => {
  const controls = useAnimation();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });
  
  useEffect(() => {
    if (isInView) {
      controls.start("visible");
    }
  }, [controls, isInView]);
  
  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={controls}
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: { 
          opacity: 1, 
          y: 0,
          transition: { duration: 0.6, ease: [0.4, 0, 0.2, 1], delay: delay * 0.1 }
        }
      }}
      className="glass-card p-6 rounded-xl flex flex-col h-full"
    >
      <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-5">
        {icon}
      </div>
      <h3 className="text-xl font-semibold mb-3">{title}</h3>
      <p className="text-gray-600 flex-grow">{description}</p>
    </motion.div>
  );
};

const Features = () => {
  const features = [
    {
      icon: <Shield className="h-6 w-6 text-primary" />,
      title: "Advanced Fraud Detection",
      description: "Real-time analysis of blockchain transactions to detect and prevent fraudulent activities before they occur."
    },
    {
      icon: <Database className="h-6 w-6 text-primary" />,
      title: "Distributed Ledger Verification",
      description: "Continuous scanning and verification of blockchain ledgers to ensure transaction integrity."
    },
    {
      icon: <Fingerprint className="h-6 w-6 text-primary" />,
      title: "Device Fingerprinting",
      description: "Unique device identification to prevent unauthorized access and ensure account security."
    },
    {
      icon: <BarChart3 className="h-6 w-6 text-primary" />,
      title: "Anomaly Detection",
      description: "Advanced algorithms to identify unusual transaction patterns that may indicate fraud attempts."
    },
    {
      icon: <Webhook className="h-6 w-6 text-primary" />,
      title: "Smart Contract Auditing",
      description: "Automated scanning of smart contracts to identify potential vulnerabilities and security risks."
    },
    {
      icon: <Lock className="h-6 w-6 text-primary" />,
      title: "Secure Authentication",
      description: "Multi-factor authentication and advanced encryption to keep your accounts protected."
    }
  ];
  
  const titleControls = useAnimation();
  const titleRef = useRef(null);
  const isTitleInView = useInView(titleRef, { once: true, amount: 0.5 });
  
  useEffect(() => {
    if (isTitleInView) {
      titleControls.start("visible");
    }
  }, [titleControls, isTitleInView]);
  
  return (
    <section className="py-24 px-4 sm:px-6 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute right-0 top-1/4 w-96 h-96 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30"></div>
        <div className="absolute left-0 bottom-1/4 w-96 h-96 bg-purple-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30"></div>
      </div>
      
      <div className="container mx-auto max-w-6xl relative z-10">
        <motion.div
          ref={titleRef}
          initial="hidden"
          animate={titleControls}
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: { 
              opacity: 1, 
              y: 0,
              transition: { duration: 0.6, ease: [0.4, 0, 0.2, 1] }
            }
          }}
          className="text-center mb-16"
        >
          <div className="inline-block px-3 py-1 mb-4 text-xs font-medium text-primary bg-primary/10 rounded-full">
            Core Features
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-500 mb-4">
            Comprehensive Blockchain Security
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Our platform combines advanced technologies to provide unparalleled protection for your blockchain transactions.
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
              delay={index}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
