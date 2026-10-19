import React, { Suspense, lazy } from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import { RoyalLayout } from '../components/layout/RoyalLayout';
import { RoyalCrown } from '../components/common/RoyalCrown';

// Public Pages
import { HomePage } from '../pages/HomePage';
import { ExperiencesPage } from '../pages/ExperiencesPage';
import { ExperienceDetailPage } from '../pages/ExperienceDetailPage';
import { BookingPage } from '../pages/BookingPage';
import { OurStoryPage } from '../pages/OurStoryPage';
import { GalleryPage } from '../pages/GalleryPage';
import { ContactPage } from '../pages/ContactPage';
import { PrivacyPage } from '../pages/PrivacyPage';
import { TermsPage } from '../pages/TermsPage';
import { NotFoundPage } from '../pages/NotFoundPage';

// Admin Pages (Code Split)
const AdminLayout = lazy(() =>
  import('../components/layout/AdminLayout').then((m) => ({ default: m.AdminLayout }))
);
const AdminLoginPage = lazy(() =>
  import('../admin/AdminLoginPage').then((m) => ({ default: m.AdminLoginPage }))
);
const AdminDashboardPage = lazy(() =>
  import('../admin/AdminDashboardPage').then((m) => ({ default: m.AdminDashboardPage }))
);
const AdminEnquiriesPage = lazy(() =>
  import('../admin/AdminEnquiriesPage').then((m) => ({ default: m.AdminEnquiriesPage }))
);
const AdminEnquiryDetailPage = lazy(() =>
  import('../admin/AdminEnquiryDetailPage').then((m) => ({ default: m.AdminEnquiryDetailPage }))
);
const AdminServicesPage = lazy(() =>
  import('../admin/AdminServicesPage').then((m) => ({ default: m.AdminServicesPage }))
);
const AdminSettingsPage = lazy(() =>
  import('../admin/AdminSettingsPage').then((m) => ({ default: m.AdminSettingsPage }))
);
const AdminNotificationsPage = lazy(() =>
  import('../admin/AdminNotificationsPage').then((m) => ({ default: m.AdminNotificationsPage }))
);
const AdminAuditLogsPage = lazy(() =>
  import('../admin/AdminAuditLogsPage').then((m) => ({ default: m.AdminAuditLogsPage }))
);

const SuspenseLoader: React.FC = () => (
  <div className="min-h-screen bg-[#F7F1E5] flex items-center justify-center p-8">
    <div className="text-center space-y-3">
      <RoyalCrown size={32} color="#C8A45D" className="animate-spin mx-auto" />
      <p className="text-xs font-semibold tracking-widest uppercase text-[#16283D]">
        Preparing Royal View...
      </p>
    </div>
  </div>
);

export const router = createBrowserRouter([
  // Public Routes
  {
    element: <RoyalLayout />,
    children: [
      { path: '/', element: <HomePage /> },
      { path: '/experiences', element: <ExperiencesPage /> },
      { path: '/experiences/:slug', element: <ExperienceDetailPage /> },
      { path: '/book', element: <BookingPage /> },
      { path: '/our-story', element: <OurStoryPage /> },
      { path: '/gallery', element: <GalleryPage /> },
      { path: '/contact', element: <ContactPage /> },
      { path: '/privacy', element: <PrivacyPage /> },
      { path: '/terms', element: <TermsPage /> },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
  // Admin Login
  {
    path: '/admin/login',
    element: (
      <Suspense fallback={<SuspenseLoader />}>
        <AdminLoginPage />
      </Suspense>
    ),
  },
  // Admin Dashboard Protected Routes
  {
    path: '/admin',
    element: (
      <Suspense fallback={<SuspenseLoader />}>
        <AdminLayout />
      </Suspense>
    ),
    children: [
      { index: true, element: <Navigate to="/admin/dashboard" replace /> },
      { path: 'dashboard', element: <AdminDashboardPage /> },
      { path: 'enquiries', element: <AdminEnquiriesPage /> },
      { path: 'enquiries/:id', element: <AdminEnquiryDetailPage /> },
      { path: 'services', element: <AdminServicesPage /> },
      { path: 'settings', element: <AdminSettingsPage /> },
      { path: 'notifications', element: <AdminNotificationsPage /> },
      { path: 'audit-logs', element: <AdminAuditLogsPage /> },
    ],
  },
]);
