import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter, MemoryRouter } from 'react-router-dom';
import { MomeraLogo } from '../src/components/common/MomeraLogo';
import { RoyalNavbar } from '../src/components/layout/RoyalNavbar';
import { RoyalFooter } from '../src/components/layout/RoyalFooter';
import { ExperienceCard } from '../src/components/experience/ExperienceCard';
import { HomePage } from '../src/pages/HomePage';
import { BookingPage } from '../src/pages/BookingPage';
import { AdminLoginPage } from '../src/admin/AdminLoginPage';
import { AdminServicesPage } from '../src/admin/AdminServicesPage';
import { api } from '../src/services/api';
import { OFFICIAL_SERVICES } from '@momera/shared';

describe('MIRSTOERA Brand Logo & Design System', () => {
  it('renders official SVG logo in full variant', () => {
    render(<MomeraLogo variant="full" size={50} alt="MIRSTOERA Brand Logo" />);
    const img = screen.getByAltText('MIRSTOERA Brand Logo');
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute('src', '/logo.svg');
    expect(img).toHaveStyle({ height: '50px' });
  });

  it('renders official SVG emblem variant', () => {
    render(<MomeraLogo variant="emblem" size={32} alt="MIRSTOERA Emblem" />);
    const img = screen.getByAltText('MIRSTOERA Emblem');
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute('src', '/logo-emblem.svg');
    expect(img).toHaveStyle({ height: '32px' });
  });
});

describe('RoyalNavbar Component', () => {
  it('renders brand emblem, name and navigation links', () => {
    render(
      <BrowserRouter>
        <RoyalNavbar />
      </BrowserRouter>
    );

    expect(screen.getByText('MIRSTOERA')).toBeInTheDocument();
    expect(screen.getByText('Royal Moments')).toBeInTheDocument();
    expect(screen.getByAltText('MIRSTOERA Royal Crest')).toBeInTheDocument();
    expect(screen.getByText('Experiences')).toBeInTheDocument();
    expect(screen.getByText('Our Story')).toBeInTheDocument();
    expect(screen.getByText('Gallery')).toBeInTheDocument();
    expect(screen.getByText('Contact')).toBeInTheDocument();
  });
});

describe('RoyalFooter Component', () => {
  it('renders official tagline, emblem, Coimbatore address and service links', () => {
    render(
      <BrowserRouter>
        <RoyalFooter />
      </BrowserRouter>
    );

    expect(screen.getByText('Every Moment Deserves a Crown.')).toBeInTheDocument();
    expect(screen.getByText('Coimbatore, Tamil Nadu, India')).toBeInTheDocument();
    expect(screen.getByText('Secret Gift Delivery (₹799)')).toBeInTheDocument();
    expect(screen.getByText('Mini Movie Proposal (₹1,499)')).toBeInTheDocument();
    expect(screen.getByText('Cinematic Birthday Surprise (₹1,799)')).toBeInTheDocument();
    expect(screen.getByText('Cinematic Hero Entry (₹1,299)')).toBeInTheDocument();
  });
});

describe('ExperienceCard Component', () => {
  it('renders starting price and service metadata with emblem', () => {
    const service = OFFICIAL_SERVICES['secret-gift'];
    render(
      <BrowserRouter>
        <ExperienceCard service={service} />
      </BrowserRouter>
    );

    expect(screen.getByText('Secret Gift Delivery')).toBeInTheDocument();
    expect(screen.getByText('₹799')).toBeInTheDocument();
    expect(screen.getByAltText('MIRSTOERA Experience Crest')).toBeInTheDocument();
  });
});

describe('HomePage Component', () => {
  it('renders hero section, master headline, and all 4 curated experiences', () => {
    render(
      <BrowserRouter>
        <HomePage />
      </BrowserRouter>
    );

    expect(screen.getByText(/Your Story Deserves a/i)).toBeInTheDocument();
    expect(screen.getAllByText(/Royal Moment/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText('Secret Gift Delivery')).toBeInTheDocument();
    expect(screen.getByText('Mini Movie Proposal')).toBeInTheDocument();
    expect(screen.getByText('Cinematic Birthday Surprise')).toBeInTheDocument();
    expect(screen.getByText('Cinematic Hero Entry')).toBeInTheDocument();
  });
});

describe('BookingPage Component', () => {
  it('renders form and validates required fields on empty submit', async () => {
    render(
      <MemoryRouter initialEntries={['/book']}>
        <BookingPage />
      </MemoryRouter>
    );

    expect(screen.getByText('Book Your Royal Moment')).toBeInTheDocument();

    const submitBtn = screen.getByRole('button', { name: /Send My Royal Request/i });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(screen.getByText(/Name must be at least 2 characters/i)).toBeInTheDocument();
    });
  });
});

describe('AdminLoginPage Component', () => {
  it('renders admin login form with staff email and password inputs', () => {
    render(
      <BrowserRouter>
        <AdminLoginPage />
      </BrowserRouter>
    );

    expect(screen.getByText('MIRSTOERA Concierge')).toBeInTheDocument();
    expect(screen.getByLabelText(/Staff Email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Sign In to Concierge Portal/i })).toBeInTheDocument();
  });
});

describe('AdminServicesPage Component', () => {
  it('renders royal catalog header, Add New Event button, and opens modal on click', async () => {
    vi.spyOn(api, 'adminGetServices').mockResolvedValueOnce([
      {
        id: 1,
        slug: 'secret-gift',
        title: 'Secret Gift Delivery',
        tagline: 'An unexpected knock, an unforgettable smile.',
        description: 'Personalized surprise gift experiences for lovers and friends.',
        starting_price_paise: 79900,
        starting_price_inr: 799,
        is_active: true,
        display_order: 1,
        created_at: '2026-10-19 06:14:00',
        updated_at: '2026-10-19 06:14:00',
      },
    ]);

    render(
      <BrowserRouter>
        <AdminServicesPage />
      </BrowserRouter>
    );

    // Verify page header
    expect(await screen.findByText('Experiences, Events & Relic Pricing')).toBeInTheDocument();
    expect(screen.getByText('Secret Gift Delivery')).toBeInTheDocument();
    expect(screen.getByText('₹799')).toBeInTheDocument();

    // Verify Add New Event button is present
    const addBtn = screen.getByRole('button', { name: /Add New Event/i });
    expect(addBtn).toBeInTheDocument();

    // Click Add New Event button
    fireEvent.click(addBtn);

    // Verify modal appears
    expect(screen.getByText('Introduce New Royal Event')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Create Royal Event/i })).toBeInTheDocument();
  });
});
