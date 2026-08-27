import { useState } from 'react';
import { Navbar } from '../components/harlow/Navbar';
import { HeroSection } from '../components/harlow/HeroSection';
import { StatsBar } from '../components/harlow/StatsBar';
import { FeaturedListings } from '../components/harlow/FeaturedListings';
import { AboutSection } from '../components/harlow/AboutSection';
import { ProcessSection } from '../components/harlow/ProcessSection';
import { TestimonialsSection } from '../components/harlow/TestimonialsSection';
import { NeighborhoodsSection } from '../components/harlow/NeighborhoodsSection';
import { ContactSection } from '../components/harlow/ContactSection';
import { Footer } from '../components/harlow/Footer';
import { PropertyDetailModal } from '../components/harlow/PropertyDetailModal';
import { ScheduleCallModal } from '../components/harlow/ScheduleCallModal';
import { PropertyListing } from '../data/harlowData';
import { CheckCircle2, Heart } from 'lucide-react';

export function HarlowPage() {
  const [selectedProperty, setSelectedProperty] = useState<PropertyListing | null>(null);
  const [isScheduleOpen, setIsScheduleOpen] = useState(false);
  const [favorites, setFavorites] = useState<string[]>(['mulholland-2847']);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleToggleFavorite = (id: string) => {
    setFavorites((prev) => {
      const exists = prev.includes(id);
      if (exists) {
        showToast('Removed property from saved favorites');
        return prev.filter((item) => item !== id);
      } else {
        showToast('Saved property to your luxury favorites');
        return [...prev, id];
      }
    });
  };

  const handleScrollToListings = () => {
    const el = document.getElementById('properties');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#0b1222] text-[#f4ede0] font-sans selection:bg-[#c9a96e] selection:text-[#0b1222] relative">
      {/* Toast Notification Banner */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#111a2e] border border-[#c9a96e] px-5 py-3 rounded-md shadow-2xl flex items-center gap-3 animate-in slide-in-from-bottom-4 duration-300">
          <div className="w-6 h-6 rounded-full bg-[#c9a96e]/20 flex items-center justify-center text-[#c9a96e]">
            <CheckCircle2 className="w-4 h-4" />
          </div>
          <span className="text-xs font-sans text-[#f4ede0]">{toastMessage}</span>
        </div>
      )}

      {/* Floating Saved Favorites Counter Badge */}
      {favorites.length > 0 && (
        <button
          onClick={handleScrollToListings}
          className="fixed bottom-6 left-6 z-30 bg-[#111a2e]/90 backdrop-blur-md border border-[#c9a96e]/50 px-4 py-2.5 rounded-full shadow-2xl flex items-center gap-2 hover:border-[#c9a96e] transition-colors cursor-pointer group"
        >
          <Heart className="w-4 h-4 text-red-400 fill-current" />
          <span className="text-xs font-sans text-[#f4ede0] font-medium">
            {favorites.length} Saved {favorites.length === 1 ? 'Property' : 'Properties'}
          </span>
        </button>
      )}

      {/* 1. Header Navigation */}
      <Navbar onOpenSchedule={() => setIsScheduleOpen(true)} />

      {/* 2. Split-Panel Parallax Hero */}
      <HeroSection
        onViewListings={handleScrollToListings}
        onOpenSchedule={() => setIsScheduleOpen(true)}
      />

      {/* 3. Animated Counter Stats Bar */}
      <StatsBar />

      {/* 4. Featured Listings */}
      <FeaturedListings
        onSelectProperty={(prop) => setSelectedProperty(prop)}
        favorites={favorites}
        onToggleFavorite={handleToggleFavorite}
      />

      {/* 5. About Agent (Elena Harlow) */}
      <AboutSection onOpenSchedule={() => setIsScheduleOpen(true)} />

      {/* 6. Process Section */}
      <ProcessSection />

      {/* 7. Staggered Testimonials */}
      <TestimonialsSection />

      {/* 8. Neighborhoods Grid */}
      <NeighborhoodsSection />

      {/* 9. Contact Form & Direct Info */}
      <ContactSection />

      {/* 10. Footer */}
      <Footer />

      {/* Interactive Property Detail Modal */}
      <PropertyDetailModal
        property={selectedProperty}
        onClose={() => setSelectedProperty(null)}
        isFavorite={selectedProperty ? favorites.includes(selectedProperty.id) : false}
        onToggleFavorite={handleToggleFavorite}
        onBookShowing={(addr) => showToast(`Showing requested for ${addr}. We will contact you shortly.`)}
      />

      {/* Schedule Call / Consultation Modal */}
      <ScheduleCallModal
        isOpen={isScheduleOpen}
        onClose={() => setIsScheduleOpen(false)}
        onSuccessToast={showToast}
      />
    </div>
  );
}

export default HarlowPage;
