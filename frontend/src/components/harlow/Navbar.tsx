import { useState, useEffect } from 'react';
import { Phone, Menu, X, Calendar } from 'lucide-react';
import { HARLOW_BRAND } from '../../data/harlowData';

interface NavbarProps {
  onOpenSchedule: () => void;
  activeSection?: string;
}

export function Navbar({ onOpenSchedule }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 60) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Properties', href: '#properties' },
    { name: 'About', href: '#about' },
    { name: 'Process', href: '#process' },
    { name: 'Neighborhoods', href: '#neighborhoods' },
    { name: 'Testimonials', href: '#testimonials' },
    { name: 'Contact', href: '#contact' },
  ];

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 ${
          scrolled
            ? 'h-[76px] bg-[#0b1222]/95 backdrop-blur-md border-b border-[#c9a96e]/20 shadow-2xl'
            : 'h-[88px] bg-gradient-to-b from-[#0b1222]/80 to-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto h-full px-6 md:px-12 flex items-center justify-between">
          {/* Left: Brand Monogram & Name */}
          <a
            href="#"
            className="flex items-center gap-3 group focus:outline-none focus:ring-1 focus:ring-[#c9a96e]/50 rounded-sm"
          >
            <div className="w-10 h-10 rounded-sm border border-[#c9a96e]/40 flex items-center justify-center bg-[#0b1222]/80 group-hover:border-[#c9a96e] transition-colors">
              <span className="font-serif text-[#c9a96e] font-bold text-sm tracking-tighter">
                {HARLOW_BRAND.monogram}
              </span>
            </div>
            <div className="flex flex-col">
              <span className="font-sans font-semibold text-xs md:text-sm tracking-[0.18em] uppercase text-[#f4ede0] group-hover:text-[#c9a96e] transition-colors">
                HARLOW PROPERTIES
              </span>
              <span className="text-[10px] tracking-[0.2em] text-[#c9a96e]/70 uppercase hidden sm:block">
                LUXURY REAL ESTATE
              </span>
            </div>
          </a>

          {/* Center: Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="font-sans text-[13px] font-medium tracking-[0.08em] uppercase text-[#f4ede0]/80 hover:text-[#c9a96e] transition-colors relative py-1 group"
              >
                {link.name}
                <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-[#c9a96e] group-hover:w-full transition-all duration-300" />
              </a>
            ))}
          </nav>

          {/* Right: Phone & Schedule Button */}
          <div className="hidden md:flex items-center gap-6">
            <a
              href={`tel:${HARLOW_BRAND.phone}`}
              className="flex items-center gap-2 text-xs font-semibold tracking-[0.06em] text-[#c9a96e] hover:text-[#e0c79b] transition-colors"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>{HARLOW_BRAND.phone}</span>
            </a>

            <button
              onClick={onOpenSchedule}
              className="px-5 py-2.5 rounded-sm border border-[#c9a96e]/60 text-[#c9a96e] hover:bg-[#c9a96e] hover:text-[#0b1222] text-xs font-semibold tracking-[0.08em] uppercase transition-all duration-300 flex items-center gap-2 shadow-sm hover:shadow-[0_0_20px_rgba(201,169,110,0.3)]"
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Schedule a Call</span>
            </button>
          </div>

          {/* Mobile Hamburger Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-[#f4ede0] hover:text-[#c9a96e] focus:outline-none"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </header>

      {/* Mobile Menu Fullscreen Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 bg-[#0b1222]/98 backdrop-blur-xl flex flex-col justify-between p-8 lg:hidden animate-in fade-in duration-300">
          <div className="flex items-center justify-between border-b border-[#c9a96e]/20 pb-6">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-sm border border-[#c9a96e] flex items-center justify-center">
                <span className="font-serif text-[#c9a96e] font-bold text-xs">
                  {HARLOW_BRAND.monogram}
                </span>
              </div>
              <span className="font-sans font-semibold text-xs tracking-[0.18em] text-[#f4ede0]">
                HARLOW PROPERTIES
              </span>
            </div>
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="p-2 text-[#f4ede0] hover:text-[#c9a96e]"
            >
              <X className="w-7 h-7" />
            </button>
          </div>

          <nav className="flex flex-col items-center gap-6 py-8">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="font-serif text-2xl text-[#f4ede0] hover:text-[#c9a96e] transition-colors"
              >
                {link.name}
              </a>
            ))}
          </nav>

          <div className="border-t border-[#c9a96e]/20 pt-6 flex flex-col items-center gap-4">
            <a
              href={`tel:${HARLOW_BRAND.phone}`}
              className="flex items-center gap-3 text-base font-semibold text-[#c9a96e]"
            >
              <Phone className="w-5 h-5" />
              <span>{HARLOW_BRAND.phone}</span>
            </a>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenSchedule();
              }}
              className="w-full py-3 bg-[#c9a96e] text-[#0b1222] font-semibold text-xs tracking-[0.1em] uppercase rounded-sm flex items-center justify-center gap-2"
            >
              <Calendar className="w-4 h-4" />
              <span>Schedule a Consultation</span>
            </button>
          </div>
        </div>
      )}
    </>
  );
}
