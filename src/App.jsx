import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ScrollToTop from '@/components/ScrollToTop';

import Home from '@/pages/Home';
import HallPage from '@/pages/HallPage';
import TabletPage from '@/pages/TabletPage';
import Archive from '@/pages/Archive';
import About from '@/pages/About';

import AdminRoute from '@/components/AdminRoute';
import AdminLogin from '@/pages/AdminLogin';
import AdminDashboard from '@/pages/AdminDashboard';
import AdminHalls from '@/pages/AdminHalls';
import AdminTablets from '@/pages/AdminTablets';
import AdminTabletEditor from '@/pages/AdminTabletEditor';
import AdminAboutEditor from '@/pages/AdminAboutEditor';

export default function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
      {/* Public */}
      <Route path="/" element={<Home />} />
      <Route path="/hall/:hallSlug" element={<HallPage />} />
      <Route path="/tablet/:tabletId" element={<TabletPage />} />
      <Route path="/archive" element={<Archive />} />
      <Route path="/about" element={<About />} />

      {/* Admin — login is open, everything under AdminRoute requires a session */}
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route element={<AdminRoute />}>
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/halls" element={<AdminHalls />} />
        <Route path="/admin/tablets" element={<AdminTablets />} />
        <Route path="/admin/tablets/:tabletId/edit" element={<AdminTabletEditor />} />
        <Route path="/admin/tablets/new" element={<AdminTabletEditor />} />
        <Route path="/admin/about" element={<AdminAboutEditor />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}
