'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Facebook, Instagram, Twitter } from 'lucide-react';
import Logo from './Logo';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    quickLinks: [
      { name: 'Home', href: '/' },
      { name: 'Products', href: '/products' },
      { name: 'About Us', href: '/about' },
      { name: 'Contact', href: '/contact' },
    ],
    customerService: [
      { name: 'FAQ', href: '/faq' },
      { name: 'Shipping Info', href: '/shipping' },
      { name: 'Returns & Refunds', href: '/returns' },
      { name: 'Privacy Policy', href: '/privacy' },
      { name: 'Terms of Service', href: '/terms' },
    ],
  };

  const socialLinks = [
    { name: 'Facebook', icon: Facebook, href: '#' },
    { name: 'Instagram', icon: Instagram, href: '#' },
    { name: 'Twitter', icon: Twitter, href: '#' },
  ];

  return (
    <footer className="relative bg-[#F3F4F6] border-t border-[#E5E7EB] overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand Block */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-1"
          >
            <div className="mb-6">
              <Logo variant="wordmark" tone="mono" className="h-8 mb-3" />
              <p className="text-sm text-[#6B7280]">Your trusted source for premium supplements</p>
            </div>
            <p className="text-[#6B7280] mb-6 leading-relaxed text-sm">
              Premium supplements and vitamins imported from trusted global brands for your health and wellness.
            </p>
            
            {/* Contact Info */}
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Phone className="w-4 h-4 text-[#6B7280]" />
                <span className="text-[#111827] text-sm">+212 5 22 123 456</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="w-4 h-4 text-[#6B7280]" />
                <span className="text-[#111827] text-sm">info@vitaflow.ma</span>
              </div>
              <div className="flex items-center space-x-3">
                <MapPin className="w-4 h-4 text-[#6B7280]" />
                <span className="text-[#111827] text-sm">Casablanca, Morocco</span>
              </div>
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <h3 className="text-base font-semibold mb-6 text-[#111827]">Quick Links</h3>
            <ul className="space-y-3">
              {footerLinks.quickLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-[#6B7280] hover:text-[#11998E] transition-colors duration-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#11998E] focus:ring-offset-2 rounded"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Customer Service */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h3 className="text-base font-semibold mb-6 text-[#111827]">Customer Service</h3>
            <ul className="space-y-3">
              {footerLinks.customerService.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-[#6B7280] hover:text-[#11998E] transition-colors duration-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#11998E] focus:ring-offset-2 rounded"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Newsletter + Social */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <h3 className="text-base font-semibold mb-6 text-[#111827]">Newsletter</h3>
            <p className="text-[#6B7280] mb-4 text-sm">
              Stay updated with our latest products and health tips
            </p>
            <form 
              onSubmit={(e) => {
                e.preventDefault();
              }}
              className="space-y-3"
            >
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full px-4 py-3 bg-white border border-[#E5E7EB] rounded-full focus:outline-none focus:ring-2 focus:ring-[#11998E] focus:border-[#11998E] text-[#111827] placeholder:text-[#6B7280] text-sm"
                required
              />
              <button
                type="submit"
                className="w-full bg-gradient-to-br from-[#11998E] to-[#38EF7D] hover:from-[#1AB99A] hover:to-[#4DFF8F] text-white font-medium py-3 px-6 rounded-full text-sm transition-all duration-200"
              >
                Subscribe
              </button>
            </form>

            {/* Social Links */}
            <div className="mt-6">
              <h4 className="text-sm font-semibold mb-3 text-[#111827]">Follow Us</h4>
              <div className="flex space-x-3">
                {socialLinks.map((social) => (
                  <Link
                    key={social.name}
                    href={social.href}
                    className="w-10 h-10 border border-[#E5E7EB] hover:border-[#11998E] hover:text-[#11998E] rounded-full flex items-center justify-center transition-all duration-200 text-[#6B7280] bg-white focus:outline-none focus:ring-2 focus:ring-[#11998E] focus:ring-offset-2"
                    aria-label={`Follow us on ${social.name}`}
                  >
                    <social.icon className="w-5 h-5" />
                  </Link>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Bottom Bar */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="border-t border-[#E5E7EB] mt-12 pt-8"
        >
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-[#6B7280] text-sm">
              © {currentYear} TAQA. All rights reserved.
            </p>
            <p className="text-[#6B7280] text-sm mt-4 md:mt-0">
              Made with ❤️ in Morocco
            </p>
          </div>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer; 