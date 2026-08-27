import { useState } from 'react';
import { Phone, Mail, MapPin, Send, CheckCircle2, ShieldCheck, Clock } from 'lucide-react';
import { HARLOW_BRAND } from '../../data/harlowData';

export function ContactSection() {
  const [intent, setIntent] = useState<'Buy' | 'Sell' | 'Both' | 'Invest'>('Buy');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !email) return;
    setSubmitted(true);
    setTimeout(() => {
      // Keep state clean for optional repeat
    }, 4000);
  };

  return (
    <section id="contact" className="py-24 px-6 md:px-16 bg-[#0b1222] border-t border-[#3d301d]">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          {/* Left Column: Form (7 Cols) */}
          <div className="lg:col-span-7 bg-[#111a2e]/60 border border-[#3d301d] p-8 md:p-12 rounded-lg relative">
            <div className="flex items-center gap-2 mb-3">
              <span className="w-5 h-[1px] bg-[#c9a96e]" />
              <span className="font-sans text-[11px] font-medium tracking-[0.2em] uppercase text-[#c9a96e]">
                GET IN TOUCH
              </span>
            </div>

            <h2 className="font-serif text-3xl sm:text-4xl text-[#f4ede0] font-normal mb-8">
              Let&apos;s Find What You&apos;ve Been Looking For
            </h2>

            {submitted ? (
              <div className="py-12 text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-[#c9a96e]/20 border border-[#c9a96e] mx-auto flex items-center justify-center text-[#c9a96e]">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="font-serif text-2xl text-[#f4ede0] not-italic">
                  Message Received
                </h3>
                <p className="font-sans text-sm text-[#f4ede0]/80 max-w-md mx-auto font-light">
                  Thank you, {fullName}. Elena Harlow and our advisory team will review your inquiry and reach out within 2 hours.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="text-xs uppercase font-sans tracking-widest text-[#c9a96e] hover:underline pt-4 block mx-auto"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Intent Radio Pill Buttons */}
                <div>
                  <label className="block text-xs font-sans uppercase tracking-[0.18em] text-[#c9a96e] font-medium mb-3">
                    I&apos;m looking to:
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {(['Buy', 'Sell', 'Both', 'Invest'] as const).map((option) => (
                      <button
                        type="button"
                        key={option}
                        onClick={() => setIntent(option)}
                        className={`py-2.5 px-3 text-xs font-sans font-medium tracking-wider uppercase rounded-sm border transition-all ${
                          intent === option
                            ? 'bg-[#c9a96e] text-[#0b1222] border-[#c9a96e] font-semibold'
                            : 'bg-[#0b1222] text-[#f4ede0]/70 border-[#3d301d] hover:border-[#c9a96e]/50'
                        }`}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Name & Email Row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-sans uppercase tracking-widest text-[#f4ede0]/70 mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Victoria Sterling"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full bg-[#0b1222] border border-[#3d301d] focus:border-[#c9a96e] rounded-sm px-4 py-3 text-sm text-[#f4ede0] placeholder-[#f4ede0]/30 outline-none transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-sans uppercase tracking-widest text-[#f4ede0]/70 mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="victoria@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-[#0b1222] border border-[#3d301d] focus:border-[#c9a96e] rounded-sm px-4 py-3 text-sm text-[#f4ede0] placeholder-[#f4ede0]/30 outline-none transition-colors"
                    />
                  </div>
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-xs font-sans uppercase tracking-widest text-[#f4ede0]/70 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    placeholder="+1 (310) 000-0000"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-[#0b1222] border border-[#3d301d] focus:border-[#c9a96e] rounded-sm px-4 py-3 text-sm text-[#f4ede0] placeholder-[#f4ede0]/30 outline-none transition-colors"
                  />
                </div>

                {/* Message */}
                <div>
                  <label className="block text-xs font-sans uppercase tracking-widest text-[#f4ede0]/70 mb-2">
                    Message
                  </label>
                  <textarea
                    rows={4}
                    placeholder="Tell us about your property goals, preferred neighborhoods, or timing..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full bg-[#0b1222] border border-[#3d301d] focus:border-[#c9a96e] rounded-sm px-4 py-3 text-sm text-[#f4ede0] placeholder-[#f4ede0]/30 outline-none transition-colors resize-none"
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  className="w-full btn-gold py-4 cursor-pointer text-sm tracking-[0.12em]"
                >
                  <Send className="w-4 h-4" />
                  <span>Send Message</span>
                </button>

                <div className="flex items-center justify-center gap-6 pt-2 text-[11px] text-[#f4ede0]/50 font-sans">
                  <span className="flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#c9a96e]" /> Strict Confidentiality
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-[#c9a96e]" /> 2-Hour Response Time
                  </span>
                </div>
              </form>
            )}
          </div>

          {/* Right Column: Direct Contact Info & Map Placeholder (5 Cols) */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-8">
            <div className="space-y-6">
              <div>
                <h3 className="font-serif text-2xl text-[#f4ede0] font-normal mb-2 not-italic">
                  Or Reach Us Directly
                </h3>
                <p className="font-sans text-xs text-[#f4ede0]/70 font-light">
                  We welcome private inquiries, phone consultations, and in-office appointments at our Beverly Hills headquarters.
                </p>
              </div>

              {/* Direct Info List */}
              <div className="space-y-4 pt-2">
                <a
                  href={`tel:${HARLOW_BRAND.phone}`}
                  className="flex items-start gap-4 p-4 rounded bg-[#111a2e]/80 border border-[#3d301d] hover:border-[#c9a96e]/50 transition-colors group"
                >
                  <div className="p-3 rounded bg-[#0b1222] border border-[#3d301d] text-[#c9a96e] group-hover:border-[#c9a96e]">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-sans tracking-widest text-[#f4ede0]/60 block">
                      Direct Line
                    </span>
                    <span className="font-sans text-sm font-semibold text-[#f4ede0] group-hover:text-[#c9a96e] transition-colors">
                      {HARLOW_BRAND.phoneDisplay}
                    </span>
                  </div>
                </a>

                <a
                  href={`mailto:${HARLOW_BRAND.email}`}
                  className="flex items-start gap-4 p-4 rounded bg-[#111a2e]/80 border border-[#3d301d] hover:border-[#c9a96e]/50 transition-colors group"
                >
                  <div className="p-3 rounded bg-[#0b1222] border border-[#3d301d] text-[#c9a96e] group-hover:border-[#c9a96e]">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-sans tracking-widest text-[#f4ede0]/60 block">
                      Private Email
                    </span>
                    <span className="font-sans text-sm font-semibold text-[#f4ede0] group-hover:text-[#c9a96e] transition-colors">
                      {HARLOW_BRAND.email}
                    </span>
                  </div>
                </a>

                <div className="flex items-start gap-4 p-4 rounded bg-[#111a2e]/80 border border-[#3d301d]">
                  <div className="p-3 rounded bg-[#0b1222] border border-[#3d301d] text-[#c9a96e]">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-sans tracking-widest text-[#f4ede0]/60 block">
                      Beverly Hills Headquarters
                    </span>
                    <span className="font-sans text-xs text-[#f4ede0]/90 font-light leading-relaxed block">
                      {HARLOW_BRAND.office}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Stylized Dark Map Embed Placeholder */}
            <div className="relative aspect-[16/9] rounded-md overflow-hidden border border-[#3d301d] bg-[#111a2e] group">
              <img
                src="https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?auto=format&fit=crop&w=800&q=80"
                alt="Beverly Hills Office Location Map"
                className="w-full h-full object-cover opacity-40 group-hover:scale-105 transition-transform duration-700 filter contrast-125 saturate-50"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0b1222] via-transparent to-[#0b1222]/40" />

              <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center">
                <div className="w-10 h-10 rounded-full bg-[#c9a96e] text-[#0b1222] flex items-center justify-center mb-2 shadow-[0_0_20px_rgba(201,169,110,0.5)]">
                  <MapPin className="w-5 h-5" />
                </div>
                <p className="font-serif text-sm text-[#f4ede0]">Wilshire Boulevard Office</p>
                <p className="text-[10px] font-sans uppercase tracking-widest text-[#c9a96e]">
                  Beverly Hills, CA 90212
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
