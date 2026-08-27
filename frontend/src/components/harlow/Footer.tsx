import { Instagram, Linkedin, Facebook, ArrowUp } from 'lucide-react';
import { HARLOW_BRAND } from '../../data/harlowData';

export function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#0b1222] border-t border-[#c9a96e]/30 text-[#f4ede0]/80">
      <div className="max-w-7xl mx-auto px-6 md:px-16 pt-16 pb-12">
        {/* Main 4-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 pb-16 border-b border-[#3d301d]">
          {/* Col 1: Wordmark & Tagline */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-sm border border-[#c9a96e] flex items-center justify-center bg-[#0b1222]">
                <span className="font-serif text-[#c9a96e] font-bold text-xs">
                  {HARLOW_BRAND.monogram}
                </span>
              </div>
              <span className="font-sans font-semibold text-xs tracking-[0.18em] uppercase text-[#f4ede0]">
                HARLOW PROPERTIES
              </span>
            </div>
            <p className="font-serif text-lg italic text-[#c9a96e]">
              &ldquo;{HARLOW_BRAND.tagline}&rdquo;
            </p>
            <p className="font-sans text-xs text-[#f4ede0]/60 font-light leading-relaxed">
              Boutique real estate representation for clients who prioritize discretion, expertise, and measurable results.
            </p>
          </div>

          {/* Col 2: Navigation Shortcuts */}
          <div className="space-y-4">
            <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.2em] text-[#c9a96e]">
              NAVIGATION
            </p>
            <ul className="space-y-2.5 text-xs font-sans font-medium">
              <li>
                <a href="#properties" className="hover:text-[#c9a96e] transition-colors">
                  Featured Properties
                </a>
              </li>
              <li>
                <a href="#about" className="hover:text-[#c9a96e] transition-colors">
                  About Elena Harlow
                </a>
              </li>
              <li>
                <a href="#process" className="hover:text-[#c9a96e] transition-colors">
                  How We Work
                </a>
              </li>
              <li>
                <a href="#neighborhoods" className="hover:text-[#c9a96e] transition-colors">
                  Neighborhood Expertise
                </a>
              </li>
              <li>
                <a href="#testimonials" className="hover:text-[#c9a96e] transition-colors">
                  Client Testimonials
                </a>
              </li>
              <li>
                <a href="#contact" className="hover:text-[#c9a96e] transition-colors">
                  Private Inquiry
                </a>
              </li>
            </ul>
          </div>

          {/* Col 3: Office & Contacts */}
          <div className="space-y-4">
            <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.2em] text-[#c9a96e]">
              BEVERLY HILLS OFFICE
            </p>
            <div className="text-xs font-sans space-y-2 text-[#f4ede0]/70 font-light">
              <p>{HARLOW_BRAND.office}</p>
              <p className="pt-1 font-medium text-[#f4ede0]">Phone: {HARLOW_BRAND.phoneDisplay}</p>
              <p className="font-medium text-[#f4ede0]">Email: {HARLOW_BRAND.email}</p>
              <p className="pt-2 text-[10px] text-[#c9a96e] uppercase tracking-widest font-semibold">
                {HARLOW_BRAND.dreNumber}
              </p>
            </div>
          </div>

          {/* Col 4: Socials & Back to Top */}
          <div className="space-y-4">
            <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.2em] text-[#c9a96e]">
              CONNECT
            </p>
            <div className="flex items-center gap-3">
              <a
                href="#"
                className="p-2.5 rounded-full border border-[#3d301d] bg-[#111a2e] text-[#f4ede0]/80 hover:text-[#c9a96e] hover:border-[#c9a96e] transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="#"
                className="p-2.5 rounded-full border border-[#3d301d] bg-[#111a2e] text-[#f4ede0]/80 hover:text-[#c9a96e] hover:border-[#c9a96e] transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-4 h-4" />
              </a>
              <a
                href="#"
                className="p-2.5 rounded-full border border-[#3d301d] bg-[#111a2e] text-[#f4ede0]/80 hover:text-[#c9a96e] hover:border-[#c9a96e] transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="w-4 h-4" />
              </a>
            </div>

            <div className="pt-4">
              <button
                onClick={scrollToTop}
                className="flex items-center gap-2 text-xs uppercase tracking-widest text-[#c9a96e] hover:text-[#f4ede0] transition-colors group"
              >
                <span>Back to top</span>
                <ArrowUp className="w-3.5 h-3.5 transition-transform group-hover:-translate-y-1" />
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Compliance */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between text-xs text-[#f4ede0]/50 font-sans gap-4">
          <div className="flex items-center gap-4">
            <span>&copy; {new Date().getFullYear()} Harlow Properties. All rights reserved.</span>
            <span className="hidden sm:inline">•</span>
            <span>{HARLOW_BRAND.dreNumber}</span>
          </div>

          <div className="flex items-center gap-4 text-[11px]">
            <a href="#" className="hover:text-[#c9a96e] transition-colors">
              Privacy Policy
            </a>
            <span>•</span>
            <a href="#" className="hover:text-[#c9a96e] transition-colors">
              Terms of Advisory
            </a>
            <span>•</span>
            <span className="flex items-center gap-1">
              <span className="font-serif">⌂</span> Equal Housing Opportunity
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
