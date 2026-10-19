import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { RoyalLayout } from '../src/components/layout/RoyalLayout';
import { HomePage } from '../src/pages/HomePage';
import { ExperiencesPage } from '../src/pages/ExperiencesPage';
import { ExperienceDetailPage } from '../src/pages/ExperienceDetailPage';
import { BookingPage } from '../src/pages/BookingPage';
import { OurStoryPage } from '../src/pages/OurStoryPage';
import { GalleryPage } from '../src/pages/GalleryPage';
import { ContactPage } from '../src/pages/ContactPage';
import { PrivacyPage } from '../src/pages/PrivacyPage';
import { TermsPage } from '../src/pages/TermsPage';
import { NotFoundPage } from '../src/pages/NotFoundPage';
import { OFFICIAL_SERVICES, BRAND_CONSTANTS } from '@momera/shared';
import { api } from '../src/services/api';

describe('Agent 1 — ARJUN: Customer Experience Inspection Suite', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  // TEST SUITE 1: Approved Experiences & Pricing
  describe('1. Signature Experiences & Approved Pricing Verification', () => {
    it('verifies all 4 experiences have approved starting prices in INR', () => {
      expect(OFFICIAL_SERVICES['secret-gift'].starting_price_inr).toBe(799);
      expect(OFFICIAL_SERVICES['mini-proposal'].starting_price_inr).toBe(1499);
      expect(OFFICIAL_SERVICES['birthday-surprise'].starting_price_inr).toBe(1799);
      expect(OFFICIAL_SERVICES['hero-entry'].starting_price_inr).toBe(1299);
    });

    it('verifies all 4 experience titles match MIRSTOERA catalog standards', () => {
      expect(OFFICIAL_SERVICES['secret-gift'].title).toBe('Secret Gift Delivery');
      expect(OFFICIAL_SERVICES['mini-proposal'].title).toBe('Mini Movie Proposal');
      expect(OFFICIAL_SERVICES['birthday-surprise'].title).toBe('Cinematic Birthday Surprise');
      expect(OFFICIAL_SERVICES['hero-entry'].title).toBe('Cinematic Hero Entry');
    });
  });

  // TEST SUITE 2: All Public Pages Render Flawlessly
  describe('2. Public Pages Inspection', () => {
    const renderRoute = (initialPath: string) => {
      return render(
        <MemoryRouter initialEntries={[initialPath]}>
          <Routes>
            <Route element={<RoyalLayout />}>
              <Route path="/" element={<HomePage />} />
              <Route path="/experiences" element={<ExperiencesPage />} />
              <Route path="/experiences/:slug" element={<ExperienceDetailPage />} />
              <Route path="/book" element={<BookingPage />} />
              <Route path="/our-story" element={<OurStoryPage />} />
              <Route path="/gallery" element={<GalleryPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/privacy" element={<PrivacyPage />} />
              <Route path="/terms" element={<TermsPage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Route>
          </Routes>
        </MemoryRouter>
      );
    };

    it('renders Homepage with brand tagline and all 4 experiences', () => {
      renderRoute('/');
      expect(screen.getByText('Your Story Deserves a')).toBeInTheDocument();
      expect(screen.getAllByText('Every Moment Deserves a Crown.').length).toBeGreaterThanOrEqual(1);
      expect(screen.getByText('Secret Gift Delivery')).toBeInTheDocument();
      expect(screen.getByText('Mini Movie Proposal')).toBeInTheDocument();
      expect(screen.getByText('Cinematic Birthday Surprise')).toBeInTheDocument();
      expect(screen.getByText('Cinematic Hero Entry')).toBeInTheDocument();
    });

    it('renders Experiences catalog page with filters and pricing', () => {
      renderRoute('/experiences');
      expect(screen.getByText('Royal Moments Experiences')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /All Experiences/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Romantic Proposals/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Birthdays & Entries/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Secret Doorstep Gifting/i })).toBeInTheDocument();
    });

    it('renders Secret Gift Delivery detail page (₹799)', () => {
      renderRoute('/experiences/secret-gift');
      expect(screen.getByRole('heading', { level: 1, name: 'Secret Gift Delivery' })).toBeInTheDocument();
      expect(screen.getByText('₹799')).toBeInTheDocument();
      expect(screen.getByText(/What’s Included in The Royal Package/i)).toBeInTheDocument();
    });

    it('renders Mini Movie Proposal detail page (₹1,499)', () => {
      renderRoute('/experiences/mini-proposal');
      expect(screen.getByRole('heading', { level: 1, name: 'Mini Movie Proposal' })).toBeInTheDocument();
      expect(screen.getByText('₹1,499')).toBeInTheDocument();
      expect(screen.getByText(/Three long-stem premium red roses/i)).toBeInTheDocument();
    });

    it('renders Cinematic Birthday Surprise detail page (₹1,799)', () => {
      renderRoute('/experiences/birthday-surprise');
      expect(screen.getByRole('heading', { level: 1, name: 'Cinematic Birthday Surprise' })).toBeInTheDocument();
      expect(screen.getByText('₹1,799')).toBeInTheDocument();
      expect(screen.getByText(/Surprise countdown & reveal coordination/i)).toBeInTheDocument();
    });

    it('renders Cinematic Hero Entry detail page (₹1,299)', () => {
      renderRoute('/experiences/hero-entry');
      expect(screen.getByRole('heading', { level: 1, name: 'Cinematic Hero Entry' })).toBeInTheDocument();
      expect(screen.getByText('₹1,299')).toBeInTheDocument();
      expect(screen.getByText(/Conditions & Safety Standards/i)).toBeInTheDocument();
    });

    it('renders Our Story page with philosophy and Coimbatore roots', () => {
      renderRoute('/our-story');
      expect(screen.getByRole('heading', { level: 1, name: 'Our Story' })).toBeInTheDocument();
      expect(screen.getByText(/Why MIRSTOERA Exists/i)).toBeInTheDocument();
      expect(screen.getByText(/Handcrafted in Coimbatore/i)).toBeInTheDocument();
    });

    it('renders Visual Gallery page and opens concept modal', () => {
      renderRoute('/gallery');
      expect(screen.getByRole('heading', { level: 1, name: 'The MIRSTOERA Gallery' })).toBeInTheDocument();
      expect(screen.getByText('Wax-Sealed Royal Love Letter')).toBeInTheDocument();

      // Click card to open modal
      fireEvent.click(screen.getByText('Wax-Sealed Royal Love Letter'));
      expect(screen.getByRole('dialog')).toBeInTheDocument();
      expect(screen.getByText('Execution Notes:')).toBeInTheDocument();
    });

    it('renders Contact page with Coimbatore phone and coverage localities', () => {
      renderRoute('/contact');
      expect(screen.getByRole('heading', { level: 1, name: 'Contact MIRSTOERA' })).toBeInTheDocument();
      expect(screen.getAllByText('+91 98765 43210').length).toBeGreaterThanOrEqual(1);
      expect(screen.getAllByText('concierge@mirstoera.in').length).toBeGreaterThanOrEqual(1);
      expect(screen.getByText('RS Puram')).toBeInTheDocument();
      expect(screen.getByText('Race Course')).toBeInTheDocument();
    });

    it('renders Privacy Policy page', () => {
      renderRoute('/privacy');
      expect(screen.getByText('Privacy Policy & Data Notice')).toBeInTheDocument();
      expect(screen.getByText(/Client Photography & Video Privacy/i)).toBeInTheDocument();
    });

    it('renders Terms and Conditions page', () => {
      renderRoute('/terms');
      expect(screen.getByText('Booking Conditions & Terms of Service')).toBeInTheDocument();
      expect(screen.getByText(/Nature of Website Enquiries/i)).toBeInTheDocument();
    });

    it('renders 404 Not Found page for invalid routes', () => {
      renderRoute('/non-existent-page-url');
      expect(screen.getByText('404 — Page Not Found')).toBeInTheDocument();
      expect(screen.getByText('This Moment Is Elsewhere')).toBeInTheDocument();
      expect(screen.getByText('Return to MIRSTOERA Homepage')).toBeInTheDocument();
    });
  });

  // TEST SUITE 3: Booking Form Preselection & Customer Journey
  describe('3. Booking Form Preselection & Validation Flow', () => {
    it('syncs preselected service from URL query parameter', async () => {
      render(
        <MemoryRouter initialEntries={['/book?service=secret-gift']}>
          <BookingPage />
        </MemoryRouter>
      );

      const serviceSelect = screen.getByLabelText(/Select Royal Experience/i) as HTMLSelectElement;
      expect(serviceSelect.value).toBe('secret-gift');
      expect(screen.getByText(/Package from ₹799/i)).toBeInTheDocument();
    });

    it('syncs hero-entry preselection and updates dynamic preview card', async () => {
      render(
        <MemoryRouter initialEntries={['/book?service=hero-entry']}>
          <BookingPage />
        </MemoryRouter>
      );

      const serviceSelect = screen.getByLabelText(/Select Royal Experience/i) as HTMLSelectElement;
      expect(serviceSelect.value).toBe('hero-entry');
      expect(screen.getByText(/Package from ₹1,299/i)).toBeInTheDocument();
    });

    it('displays validation errors when mandatory fields are omitted', async () => {
      render(
        <MemoryRouter initialEntries={['/book']}>
          <BookingPage />
        </MemoryRouter>
      );

      const submitButton = screen.getByRole('button', { name: /Send My Royal Request/i });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/Name must be at least 2 characters/i)).toBeInTheDocument();
      });
    });

    it('submits valid enquiry, renders royal reference code and direct WhatsApp link', async () => {
      vi.spyOn(api, 'submitEnquiry').mockResolvedValueOnce({
        id: 'mock-uuid-1',
        reference_code: 'MST-202610-ABCD',
        status: 'NEW',
        created_at: new Date().toISOString(),
      });

      render(
        <MemoryRouter initialEntries={['/book?service=birthday-surprise']}>
          <BookingPage />
        </MemoryRouter>
      );

      fireEvent.change(screen.getByLabelText(/Your Full Name/i), {
        target: { value: 'Deepika Krishnan' },
      });
      fireEvent.change(screen.getByLabelText(/WhatsApp Phone Number/i), {
        target: { value: '9840123456' },
      });
      fireEvent.change(screen.getByLabelText(/Describe Your Surprise Vision/i), {
        target: { value: 'Grand 25th birthday surprise with customized acoustic song reveal.' },
      });

      const submitButton = screen.getByRole('button', { name: /Send My Royal Request/i });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText('Your Royal Request Has Been Received!')).toBeInTheDocument();
        expect(screen.getByText('MST-202610-ABCD')).toBeInTheDocument();
        expect(screen.getByText(/Please Note: Booking Is Not Yet Confirmed/i)).toBeInTheDocument();
        expect(screen.getByText(/Connect on WhatsApp Now/i)).toBeInTheDocument();
      });

      // Verify WhatsApp URL generation
      const waAnchor = screen.getByRole('link', { name: /Connect on WhatsApp Now/i });
      expect(waAnchor).toHaveAttribute(
        'href',
        expect.stringContaining('MST-202610-ABCD')
      );
      expect(waAnchor).toHaveAttribute(
        'href',
        expect.stringContaining('Deepika%20Krishnan')
      );
    });
  });

  // TEST SUITE 4: WhatsApp Concierge Links Consistency
  describe('4. WhatsApp Concierge Links & Branding Verification', () => {
    it('verifies all WhatsApp links use official concierge number and MIRSTOERA brand', () => {
      render(
        <MemoryRouter initialEntries={['/']}>
          <RoyalLayout />
        </MemoryRouter>
      );

      const waLinks = screen.getAllByRole('link').filter((el) => {
        const href = el.getAttribute('href') || '';
        return href.includes('wa.me');
      });

      expect(waLinks.length).toBeGreaterThanOrEqual(1);

      for (const link of waLinks) {
        const href = link.getAttribute('href')!;
        expect(href).toContain('919876543210');
        expect(href).toContain('MIRSTOERA');
        expect(href).not.toContain('MOM%C3%89RA');
      }
    });
  });

  // TEST SUITE 5: Mobile Navbar Toggle
  describe('5. Mobile Navbar Interaction', () => {
    it('toggles mobile menu drawer on hamburger click', () => {
      render(
        <MemoryRouter initialEntries={['/']}>
          <RoyalLayout />
        </MemoryRouter>
      );

      const toggleButton = screen.getByRole('button', { name: /Toggle navigation menu/i });
      expect(screen.queryByLabelText('Mobile Navigation')).not.toBeInTheDocument();

      fireEvent.click(toggleButton);
      expect(screen.getByLabelText('Mobile Navigation')).toBeInTheDocument();

      fireEvent.click(toggleButton);
      expect(screen.queryByLabelText('Mobile Navigation')).not.toBeInTheDocument();
    });
  });
});
