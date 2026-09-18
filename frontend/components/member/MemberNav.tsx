'use client';

// MemberNav is now only used as a fallback mobile top-bar reference.
// The main navigation is handled by DashboardSidebar (desktop) and the
// inline mobile drawer in app/(member)/layout.tsx.
// This file is kept for backward-compatibility with any page that imports it
// but renders nothing — the layout provides the full nav shell.

export default function MemberNav() {
  return null;
}
