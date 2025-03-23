
import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { Menu, X } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };
  
  const navbarClasses = `fixed top-0 left-0 right-0 z-50 px-4 md:px-6 py-3 transition-all duration-300 ${
    isScrolled 
      ? 'bg-white/80 backdrop-blur-md shadow-sm' 
      : 'bg-transparent'
  }`;
  
  const navLinkClasses = 'text-gray-700 hover:text-primary transition-colors duration-300';
  const activeNavLinkClasses = 'text-primary font-medium';
  
  return (
    <nav className={navbarClasses}>
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2">
          {/* <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="h-8 w-8 rounded-full bg-primary flex items-center justify-center"
          >
            <span className="text-white font-bold text-sm">FD</span>
          </motion.div> */}
          <motion.span 
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="font-semibold text-gray-500"
          >
            Transactify
          </motion.span>
        </Link>
        
        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-8">
          <Link 
            to="/" 
            className={location.pathname === '/' ? activeNavLinkClasses : navLinkClasses}
          >
            Home
          </Link>
          {user ? (
            <>
              <Link 
                to="/profile" 
                className={location.pathname === '/profile' ? activeNavLinkClasses : navLinkClasses}
              >
                Profile
              </Link>
              <Link 
                to="/ledger" 
                className={location.pathname === '/ledger' ? activeNavLinkClasses : navLinkClasses}
              >
                Ledger
              </Link>
              <Link 
                to="/createTransactions" 
                className={location.pathname === '/createTransactions' ? activeNavLinkClasses : navLinkClasses}
              >
                Create Transactions
              </Link>
              <Button 
                variant="ghost" 
                onClick={logout}
                className="text-gray-700 hover:text-primary hover:bg-transparent"
              >
                Logout
              </Button>
            </>
          ) : (
            <>
              <Link 
                to="/login" 
                className={location.pathname === '/login' ? activeNavLinkClasses : navLinkClasses}
              >
                Login
              </Link>
              <Link to="/register">
                <Button 
                  variant="default" 
                  className="glass-button"
                >
                  Register
                </Button>
              </Link>
            </>
          )}
        </div>
        
        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={toggleMobileMenu} 
            className="text-gray-700"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </Button>
        </div>
      </div>
      
      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="md:hidden absolute top-14 left-0 right-0 bg-white shadow-lg glass-panel py-4 px-6 flex flex-col space-y-4"
        >
          <Link 
            to="/" 
            className={location.pathname === '/' ? activeNavLinkClasses : navLinkClasses}
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Home
          </Link>
          {user ? (
            <>
              <Link 
                to="/profile" 
                className={location.pathname === '/profile' ? activeNavLinkClasses : navLinkClasses}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Profile
              </Link>
              <Link 
                to="/ledger" 
                className={location.pathname === '/ledger' ? activeNavLinkClasses : navLinkClasses}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Ledger
              </Link>
              <Link 
                to="/createTransactions" 
                className={location.pathname === '/createTransactions' ? activeNavLinkClasses : navLinkClasses}
              >
                Create Transactions
              </Link>
              <Button 
                variant="ghost" 
                onClick={() => {
                  logout();
                  setIsMobileMenuOpen(false);
                }}
                className="text-gray-700 hover:text-primary hover:bg-transparent justify-start p-0"
              >
                Logout
              </Button>
            </>
          ) : (
            <>
              <Link 
                to="/login" 
                className={location.pathname === '/login' ? activeNavLinkClasses : navLinkClasses}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Login
              </Link>
              <Link to="/register" onClick={() => setIsMobileMenuOpen(false)}>
                <Button 
                  variant="default" 
                  className="w-full glass-button"
                >
                  Register
                </Button>
              </Link>
            </>
          )}
        </motion.div>
      )}
    </nav>
  );
};

export default Navbar;
