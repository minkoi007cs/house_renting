import { useState } from 'react';
import { X, Calendar as CalendarIcon, Clock, User, Phone, Mail, CheckCircle2, Shield } from 'lucide-react';
import { HARLOW_BRAND } from '../../data/harlowData';

interface ScheduleCallModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccessToast: (msg: string) => void;
}

export function ScheduleCallModal({ isOpen, onClose, onSuccessToast }: ScheduleCallModalProps) {
  if (!isOpen) return null;

  const [date, setDate] = useState('');
  const [time, setTime] = useState('10:00 AM');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [topic, setTopic] = useState('Buying Luxury Residence');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !date) return;
    setSubmitted(true);
    setTimeout(() => {
      onSuccessToast(`Consultation requested for ${name} on ${date} at ${time}.`);
      setSubmitted(false);
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0b1222]/90 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-[#0b1222] border border-[#c9a96e]/40 rounded-lg shadow-2xl overflow-hidden p-6 md:p-8">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-[#f4ede0]/70 hover:text-[#c9a96e] rounded-full hover:bg-[#111a2e]"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="flex items-center gap-2 text-[#c9a96e] mb-2">
          <CalendarIcon className="w-4 h-4" />
          <span className="text-xs uppercase font-sans tracking-[0.2em] font-medium">
            BOUTIQUE ADVISORY
          </span>
        </div>

        <h3 className="font-serif text-2xl text-[#f4ede0] font-normal mb-1 not-italic">
          Schedule a Private Call
        </h3>
        <p className="font-sans text-xs text-[#f4ede0]/70 font-light mb-6">
          Direct 1-on-1 consultation with Elena Harlow regarding high-value acquisitions or property sales.
        </p>

        {submitted ? (
          <div className="py-8 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-[#c9a96e]/20 border border-[#c9a96e] mx-auto flex items-center justify-center text-[#c9a96e]">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <p className="font-serif text-lg text-[#f4ede0]">Consultation Confirmed</p>
            <p className="text-xs text-[#f4ede0]/70 font-sans">
              A calendar invite and private Zoom line have been dispatched to your email.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-sans uppercase tracking-widest text-[#f4ede0]/70 mb-1">
                Consultation Focus
              </label>
              <select
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                className="w-full bg-[#111a2e] border border-[#3d301d] focus:border-[#c9a96e] rounded px-3 py-2.5 text-xs text-[#f4ede0] outline-none"
              >
                <option value="Buying Luxury Residence">Acquisition — Buying Luxury Residence</option>
                <option value="Listing & Selling Estate">Representation — Listing & Selling Estate</option>
                <option value="Off-Market Portfolio Inquiry">Discretionary — Off-Market Portfolio</option>
                <option value="Market Valuation Review">Advisory — Portfolio Valuation Review</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-sans uppercase tracking-widest text-[#f4ede0]/70 mb-1">
                  Preferred Date *
                </label>
                <input
                  type="date"
                  required
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full bg-[#111a2e] border border-[#3d301d] focus:border-[#c9a96e] rounded px-3 py-2 text-xs text-[#f4ede0] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-sans uppercase tracking-widest text-[#f4ede0]/70 mb-1">
                  Preferred Time *
                </label>
                <select
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="w-full bg-[#111a2e] border border-[#3d301d] focus:border-[#c9a96e] rounded px-3 py-2 text-xs text-[#f4ede0] outline-none"
                >
                  <option value="09:00 AM">09:00 AM PST</option>
                  <option value="10:00 AM">10:00 AM PST</option>
                  <option value="01:30 PM">01:30 PM PST</option>
                  <option value="04:00 PM">04:00 PM PST</option>
                  <option value="06:00 PM">06:00 PM PST</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-sans uppercase tracking-widest text-[#f4ede0]/70 mb-1">
                Your Full Name *
              </label>
              <input
                type="text"
                required
                placeholder="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-[#111a2e] border border-[#3d301d] focus:border-[#c9a96e] rounded px-3 py-2 text-xs text-[#f4ede0] placeholder-[#f4ede0]/30 outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-sans uppercase tracking-widest text-[#f4ede0]/70 mb-1">
                  Email *
                </label>
                <input
                  type="email"
                  required
                  placeholder="name@domain.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[#111a2e] border border-[#3d301d] focus:border-[#c9a96e] rounded px-3 py-2 text-xs text-[#f4ede0] placeholder-[#f4ede0]/30 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-sans uppercase tracking-widest text-[#f4ede0]/70 mb-1">
                  Phone
                </label>
                <input
                  type="tel"
                  placeholder="+1 (310) 000-0000"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-[#111a2e] border border-[#3d301d] focus:border-[#c9a96e] rounded px-3 py-2 text-xs text-[#f4ede0] placeholder-[#f4ede0]/30 outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full btn-gold py-3 cursor-pointer text-xs mt-2"
            >
              <span>Confirm Consultation Request</span>
            </button>

            <p className="text-[10px] text-center text-[#f4ede0]/50 flex items-center justify-center gap-1">
              <Shield className="w-3 h-3 text-[#c9a96e]" />
              <span>Strict Non-Disclosure Guarantee</span>
            </p>
          </form>
        )}
      </div>
    </div>
  );
}
