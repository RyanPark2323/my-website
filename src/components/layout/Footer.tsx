import { Heart } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-bg-elevated border-t border-border py-8 px-6">
      <div className="max-w-7xl mx-auto text-center">
        <p className="text-text-secondary flex items-center justify-center gap-2">
          Built with React, TypeScript & <Heart size={16} className="text-accent-primary fill-accent-primary" /> by Ryan Park
        </p>
        <p className="text-text-secondary text-sm mt-2">
          © {currentYear} Ryan Park. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
