
import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t py-4 px-6 text-center text-sm text-gray-500">
      <div className="flex flex-col md:flex-row items-center justify-center gap-4">
        <p>© {new Date().getFullYear()} Mastercard Travel Assistant</p>
        <div className="flex gap-4">
          <a href="#" className="hover:text-gray-700 transition-colors">Privacy</a>
          <a href="#" className="hover:text-gray-700 transition-colors">Terms</a>
          <a href="#" className="hover:text-gray-700 transition-colors">Help</a>
        </div>
      </div>
      <div className="mt-2 text-xs">
        Prototype for demonstration purposes only
      </div>
    </footer>
  );
};
