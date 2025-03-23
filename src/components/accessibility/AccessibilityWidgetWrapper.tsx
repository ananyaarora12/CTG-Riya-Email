'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';

// Dynamically import the AccessibilityWidget with ssr: false
const AccessibilityWidget = dynamic(
  () => import('./AccessibilityWidget'),
  { ssr: false }
);

export default function AccessibilityWidgetWrapper() {
  const [mounted, setMounted] = useState(false);

  // Only show the widget after the component is mounted on the client
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return <AccessibilityWidget />;
} 