import { useState } from 'react';
import { X, Bed, Bath, Maximize2, MapPin, Calendar, Heart, Shield, Check, DollarSign, Send } from 'lucide-react';
import { PropertyListing, HARLOW_BRAND } from '../../data/harlowData';

interface PropertyDetailModalProps {
  property: PropertyListing | null;
  onClose: () => void;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
  onBookShowing: (propertyAddress: string) => void;
}

export function PropertyDetailModal({
  property,
  onClose,
  isFavorite,
  onToggleFavorite,
  onBookShowing,
}: PropertyDetailModalProps) {
  if (!property) return null;

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [downPayment, setDownPayment] = useState(20); // 20%
  const [interestRate, setInterestRate] = useState(6.5); // 6.5%
  const [loanTerm, setLoanTerm] = useState(30); // 30 years
  const [inquiryName, setInquiryName] = useState('');
  const [inquiryEmail, setInquiryEmail] = useState('');
  const [inquiryPhone, setInquiryPhone] = useState('');
  const [inquirySent, setInquirySent] = useState(false);

  // Calculate estimated monthly payment
  const loanAmount = property.price * (1 - downPayment / 100);
  const monthlyRate = interestRate / 100 / 12;
  const totalPayments = loanTerm * 12;
  const monthlyPrincipalInterest =
    (loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, totalPayments))) /
    (Math.pow(1 + monthlyRate, totalPayments) - 1);
  const estimatedMonthlyPropertyTax = (property.price * 0.0125) / 12;
  const estimatedInsurance = 450;
  const totalMonthlyEstimate = Math.round(
    monthlyPrincipalInterest + estimatedMonthlyPropertyTax + estimatedInsurance
  );

  const handleSendInquiry = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inquiryName || !inquiryEmail) return;
    setInquirySent(true);
    setTimeout(() => {
      setInquirySent(false);
      onBookShowing(property.address);
      onClose();
    }, 1800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-8 bg-[#0b1222]/90 backdrop-blur-md overflow-y-auto animate-in fade-in duration-300">
      <div className="relative w-full max-w-5xl bg-[#0b1222] border border-[#c9a96e]/30 rounded-lg shadow-2xl overflow-hidden my-auto max-h-[90vh] flex flex-col">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#3d301d] bg-[#111a2e]">
          <div className="flex items-center gap-3">
            <span className="px-2.5 py-1 text-[10px] uppercase tracking-widest font-semibold rounded bg-[#c9a96e]/15 text-[#c9a96e] border border-[#c9a96e]/30">
              {property.status}
            </span>
            <span className="text-xs uppercase font-sans tracking-widest text-[#f4ede0]/70">
              {property.neighborhood}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onToggleFavorite(property.id)}
              className={`p-2 rounded-full border transition-colors ${
                isFavorite
                  ? 'border-red-500/50 bg-red-500/10 text-red-400'
                  : 'border-[#3d301d] text-[#f4ede0]/70 hover:text-[#c9a96e]'
              }`}
              title={isFavorite ? 'Remove from saved' : 'Save listing'}
            >
              <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
            </button>
            <button
              onClick={onClose}
              className="p-2 text-[#f4ede0]/70 hover:text-[#c9a96e] rounded-full hover:bg-[#111a2e] transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="overflow-y-auto p-6 md:p-8 space-y-8 flex-1">
          {/* Main Gallery Viewer */}
          <div>
            <div className="relative aspect-[16/9] sm:aspect-[21/9] rounded-md overflow-hidden bg-black mb-3">
              <img
                src={property.gallery[activeImageIndex] || property.image}
                alt={property.address}
                className="w-full h-full object-cover transition-all duration-500"
              />
              <div className="absolute bottom-4 right-4 bg-[#0b1222]/80 backdrop-blur-md px-3 py-1 rounded text-xs text-[#f4ede0] font-sans">
                {activeImageIndex + 1} / {property.gallery.length} Photos
              </div>
            </div>

            {/* Thumbnail Strip */}
            <div className="flex items-center gap-3 overflow-x-auto pb-2">
              {property.gallery.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImageIndex(i)}
                  className={`relative flex-shrink-0 w-20 h-14 rounded overflow-hidden border-2 transition-all ${
                    activeImageIndex === i ? 'border-[#c9a96e] scale-105' : 'border-transparent opacity-60 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="Thumbnail" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Title & Key Stats */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-[#3d301d]">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-[#c9a96e] font-sans font-medium mb-1">
                {property.neighborhood} · {property.cityStateZip}
              </p>
              <h2 className="font-serif text-3xl sm:text-4xl text-[#f4ede0] font-normal">
                {property.address}
              </h2>
            </div>
            <div className="text-left md:text-right">
              <span className="text-xs uppercase tracking-widest text-[#f4ede0]/60 block font-sans">
                Offered At
              </span>
              <span className="font-sans text-3xl sm:text-4xl font-semibold text-[#c9a96e]">
                {property.priceFormatted}
              </span>
            </div>
          </div>

          {/* Quick Specs Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded bg-[#111a2e] border border-[#3d301d]">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded bg-[#0b1222] text-[#c9a96e] border border-[#3d301d]">
                <Bed className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs text-[#f4ede0]/60 uppercase tracking-wider block font-sans">Bedrooms</span>
                <span className="text-lg font-serif text-[#f4ede0] font-bold">{property.beds} Beds</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded bg-[#0b1222] text-[#c9a96e] border border-[#3d301d]">
                <Bath className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs text-[#f4ede0]/60 uppercase tracking-wider block font-sans">Bathrooms</span>
                <span className="text-lg font-serif text-[#f4ede0] font-bold">{property.baths} Baths</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded bg-[#0b1222] text-[#c9a96e] border border-[#3d301d]">
                <Maximize2 className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs text-[#f4ede0]/60 uppercase tracking-wider block font-sans">Living Area</span>
                <span className="text-lg font-serif text-[#f4ede0] font-bold">{property.sqftFormatted} sq ft</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded bg-[#0b1222] text-[#c9a96e] border border-[#3d301d]">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs text-[#f4ede0]/60 uppercase tracking-wider block font-sans">Lot Size</span>
                <span className="text-lg font-serif text-[#f4ede0] font-bold">{property.lotSizeSqFt}</span>
              </div>
            </div>
          </div>

          {/* Description & Features */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <div>
                <h3 className="font-serif text-xl text-[#f4ede0] mb-3 not-italic">
                  Architectural Description
                </h3>
                <p className="text-sm font-sans font-light text-[#f4ede0]/80 leading-relaxed">
                  {property.description}
                </p>
              </div>

              <div>
                <h3 className="font-serif text-xl text-[#f4ede0] mb-4 not-italic">
                  Key Residence Highlights
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {property.features.map((feat, i) => (
                    <div key={i} className="flex items-center gap-2.5 text-xs text-[#f4ede0]/90 font-sans">
                      <div className="w-4 h-4 rounded-full bg-[#c9a96e]/20 border border-[#c9a96e] flex items-center justify-center text-[#c9a96e] flex-shrink-0">
                        <Check className="w-2.5 h-2.5" />
                      </div>
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Financial & Mortgage Estimation Preview */}
              <div className="p-5 rounded border border-[#3d301d] bg-[#111a2e]/60 space-y-4">
                <div className="flex items-center justify-between border-b border-[#3d301d] pb-3">
                  <div className="flex items-center gap-2 text-[#c9a96e]">
                    <DollarSign className="w-4 h-4" />
                    <span className="text-xs uppercase font-sans font-semibold tracking-wider">
                      Estimated Monthly Ownership
                    </span>
                  </div>
                  <span className="font-serif text-xl text-[#c9a96e]">
                    ${totalMonthlyEstimate.toLocaleString()}/mo
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-3 text-xs">
                  <div>
                    <label className="text-[#f4ede0]/60 block mb-1">Down Payment ({downPayment}%)</label>
                    <input
                      type="range"
                      min="10"
                      max="50"
                      step="5"
                      value={downPayment}
                      onChange={(e) => setDownPayment(Number(e.target.value))}
                      className="w-full accent-[#c9a96e]"
                    />
                  </div>
                  <div>
                    <label className="text-[#f4ede0]/60 block mb-1">Interest Rate ({interestRate}%)</label>
                    <input
                      type="range"
                      min="4"
                      max="10"
                      step="0.25"
                      value={interestRate}
                      onChange={(e) => setInterestRate(Number(e.target.value))}
                      className="w-full accent-[#c9a96e]"
                    />
                  </div>
                  <div>
                    <label className="text-[#f4ede0]/60 block mb-1">Term ({loanTerm} yrs)</label>
                    <select
                      value={loanTerm}
                      onChange={(e) => setLoanTerm(Number(e.target.value))}
                      className="bg-[#0b1222] border border-[#3d301d] text-[#f4ede0] rounded px-2 py-1 text-xs w-full"
                    >
                      <option value={15}>15 Years</option>
                      <option value={30}>30 Years</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Private Showing Request Form */}
            <div className="p-6 rounded border border-[#c9a96e]/30 bg-[#111a2e] space-y-4">
              <div className="flex items-center gap-3 border-b border-[#3d301d] pb-4">
                <img
                  src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80"
                  alt="Elena Harlow"
                  className="w-12 h-12 rounded-full object-cover border border-[#c9a96e]"
                />
                <div>
                  <h4 className="font-serif text-sm text-[#f4ede0]">Elena Harlow</h4>
                  <p className="text-[10px] uppercase tracking-widest text-[#c9a96e]">Listing Advisor</p>
                </div>
              </div>

              {inquirySent ? (
                <div className="py-8 text-center space-y-3">
                  <div className="w-12 h-12 rounded-full bg-[#c9a96e]/20 border border-[#c9a96e] mx-auto flex items-center justify-center text-[#c9a96e]">
                    <Check className="w-6 h-6" />
                  </div>
                  <p className="font-serif text-base text-[#f4ede0]">Inquiry Submitted</p>
                  <p className="text-xs text-[#f4ede0]/70">
                    Elena Harlow will contact you discretely within 2 hours.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSendInquiry} className="space-y-3">
                  <p className="text-xs font-serif text-[#f4ede0] italic">
                    Request Private Viewing or Prospectus
                  </p>

                  <div>
                    <input
                      type="text"
                      placeholder="Your Full Name"
                      required
                      value={inquiryName}
                      onChange={(e) => setInquiryName(e.target.value)}
                      className="w-full bg-[#0b1222] border border-[#3d301d] rounded px-3 py-2 text-xs text-[#f4ede0] placeholder-[#f4ede0]/40 focus:border-[#c9a96e] outline-none"
                    />
                  </div>

                  <div>
                    <input
                      type="email"
                      placeholder="Email Address"
                      required
                      value={inquiryEmail}
                      onChange={(e) => setInquiryEmail(e.target.value)}
                      className="w-full bg-[#0b1222] border border-[#3d301d] rounded px-3 py-2 text-xs text-[#f4ede0] placeholder-[#f4ede0]/40 focus:border-[#c9a96e] outline-none"
                    />
                  </div>

                  <div>
                    <input
                      type="tel"
                      placeholder="Phone Number (Optional)"
                      value={inquiryPhone}
                      onChange={(e) => setInquiryPhone(e.target.value)}
                      className="w-full bg-[#0b1222] border border-[#3d301d] rounded px-3 py-2 text-xs text-[#f4ede0] placeholder-[#f4ede0]/40 focus:border-[#c9a96e] outline-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 bg-[#c9a96e] text-[#0b1222] font-semibold text-xs tracking-wider uppercase rounded hover:bg-[#d6b87e] transition-colors flex items-center justify-center gap-2"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Request Private Showing</span>
                  </button>

                  <p className="text-[10px] text-center text-[#f4ede0]/40 flex items-center justify-center gap-1">
                    <Shield className="w-3 h-3 text-[#c9a96e]" />
                    <span>100% Confidential Representation</span>
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
