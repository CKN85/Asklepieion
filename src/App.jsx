import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import Home from '@/pages/Home';
import HallPage from '@/pages/HallPage';
import ChapterPage from '@/pages/ChapterPage';
import Archive from '@/pages/Archive';

import AdminRoute from '@/components/AdminRoute';
import AdminLogin from '@/pages/AdminLogin';
import AdminDashboard from '@/pages/AdminDashboard';
import AdminHalls from '@/pages/AdminHalls';
import AdminChapters from '@/pages/AdminChapters';
import AdminChapterEditor from '@/pages/AdminChapterEditor';

export default function App() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/" element={<Home />} />
      <Route path="/hall/:hallSlug" element={<HallPage />} />
      <Route path="/chapter/:chapterId" element={<ChapterPage />} />
      <Route path="/archive" element={<Archive />} />

      {/* Admin — login is open, everything under AdminRoute requires a session */}
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route element={<AdminRoute />}>
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/halls" element={<AdminHalls />} />
        <Route path="/admin/chapters" element={<AdminChapters />} />
        <Route path="/admin/chapters/:chapterId/edit" element={<AdminChapterEditor />} />
        <Route path="/admin/chapters/new" element={<AdminChapterEditor />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
