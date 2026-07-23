import React from 'react';
import Contact from '../components/Contact';

export default function ContactPage({ settings }) {
  return (
    <div className="pt-8">
      <Contact settings={settings} />
    </div>
  );
}
