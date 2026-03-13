import React, { useState } from 'react';
import { AnimatedSection } from '../components/AnimatedSection';
import { Instagram } from 'lucide-react';

export function Contact() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    subject: 'Purchase Inquiry',
    message: '',
    subscribe: false
  });
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('submitting');

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setStatus('success');
        setFormData({
          firstName: '',
          lastName: '',
          email: '',
          phone: '',
          subject: 'Purchase Inquiry',
          message: '',
          subscribe: false
        });
      } else {
        setStatus('error');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      setStatus('error');
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-20">
      <AnimatedSection className="text-center mb-16">
        <h1 className="text-5xl md:text-6xl font-serif text-[#93312A] mb-6">Get in Touch</h1>
        <p className="text-lg text-[#2D1F1C]/80 max-w-2xl mx-auto">
          Interested in working together? Looking to purchase or commission a painting? Send a message and I will get back to you shortly.
        </p>
      </AnimatedSection>

      <AnimatedSection delay={0.2}>
        <div className="bg-[#EAE6DF] rounded-3xl p-8 md:p-12 shadow-sm border border-[#93312A]/10">
          <h2 className="text-3xl font-serif text-[#93312A] text-center mb-8">Contact Form</h2>

          {status === 'success' ? (
            <div className="bg-[#779C91]/20 text-[#2D1F1C] p-6 rounded-xl text-center">
              <h3 className="text-xl font-serif mb-2">Thank you!</h3>
              <p>Your message has been sent successfully. I will get back to you shortly.</p>
              <button
                onClick={() => setStatus('idle')}
                className="mt-6 text-[#93312A] font-medium hover:underline"
              >
                Send another message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="firstName" className="block text-[#2D1F1C] font-medium mb-2">First Name</label>
                  <input type="text" id="firstName" name="firstName" value={formData.firstName} onChange={handleChange} required className="w-full bg-transparent border border-[#93312A]/30 rounded-lg px-4 py-3 focus:outline-none focus:border-[#93312A] focus:ring-1 focus:ring-[#93312A] transition-colors"/>
                </div>
                <div>
                  <label htmlFor="lastName" className="block text-[#2D1F1C] font-medium mb-2">Last Name</label>
                  <input type="text" id="lastName" name="lastName" value={formData.lastName} onChange={handleChange} required className="w-full bg-transparent border border-[#93312A]/30 rounded-lg px-4 py-3 focus:outline-none focus:border-[#93312A] focus:ring-1 focus:ring-[#93312A] transition-colors"/>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="email" className="block text-[#2D1F1C] font-medium mb-2">Email</label>
                  <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required className="w-full bg-transparent border border-[#93312A]/30 rounded-lg px-4 py-3 focus:outline-none focus:border-[#93312A] focus:ring-1 focus:ring-[#93312A] transition-colors"/>
                </div>
                <div>
                  <label htmlFor="phone" className="block text-[#2D1F1C] font-medium mb-2">Phone / WhatsApp</label>
                  <input type="tel" id="phone" name="phone" value={formData.phone} onChange={handleChange} className="w-full bg-transparent border border-[#93312A]/30 rounded-lg px-4 py-3 focus:outline-none focus:border-[#93312A] focus:ring-1 focus:ring-[#93312A] transition-colors"/>
                </div>
              </div>

              <div>
                <label htmlFor="subject" className="block text-[#2D1F1C] font-medium mb-2">What is this about?</label>
                <select id="subject" name="subject" value={formData.subject} onChange={handleChange} className="w-full bg-transparent border border-[#93312A]/30 rounded-lg px-4 py-3 focus:outline-none focus:border-[#93312A] focus:ring-1 focus:ring-[#93312A] transition-colors appearance-none">
                  <option value="Purchase Inquiry">Purchase Inquiry</option>
                  <option value="Commission Request">Commission Request</option>
                  <option value="Collaboration">Collaboration</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label htmlFor="message" className="block text-[#2D1F1C] font-medium mb-2">Message</label>
                <textarea id="message" name="message" value={formData.message} onChange={handleChange} required rows={5} className="w-full bg-transparent border border-[#93312A]/30 rounded-lg px-4 py-3 focus:outline-none focus:border-[#93312A] focus:ring-1 focus:ring-[#93312A] transition-colors resize-none"></textarea>
              </div>

              <div className="flex items-center gap-3">
                <input type="checkbox" id="subscribe" name="subscribe" checked={formData.subscribe} onChange={handleChange} className="w-5 h-5 rounded border-[#93312A]/30 text-[#779C91] focus:ring-[#779C91] bg-transparent"/>
                <label htmlFor="subscribe" className="text-[#2D1F1C]/80">
                  Keep me updated on new work and exhibitions
                </label>
              </div>

              {status === 'error' && (
                <div className="text-red-600 text-sm">
                  There was an error sending your message. Please try again later.
                </div>
              )}

              <button type="submit" disabled={status === 'submitting'} className="w-full bg-[#779C91] hover:bg-[#5E857A] text-white py-4 rounded-full font-medium transition-colors text-lg disabled:opacity-70">
                {status === 'submitting' ? 'Sending...' : 'Send Message'}
              </button>
            </form>
          )}
        </div>
      </AnimatedSection>

      <AnimatedSection delay={0.4} className="mt-20 text-center">
        <p className="text-[#2D1F1C] font-medium mb-4">Based in Phnom Penh, Cambodia</p>
        <a href="https://instagram.com/rachagold.art" target="_blank" rel="noopener noreferrer" className="inline-flex flex-col items-center gap-2 text-[#2D1F1C] hover:text-[#93312A] transition-colors">
          <Instagram className="w-8 h-8"/>
          <span>@rachagold.art</span>
        </a>
      </AnimatedSection>
    </div>
  );
}
