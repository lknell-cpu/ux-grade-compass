import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { LogOut, ChevronDown } from 'lucide-react';

export default function UserMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const { currentUser, logout } = useAuth();
  const menuRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Failed to log out:', error);
    }
  };

  // Get user initials for avatar
  const getInitials = () => {
    if (!currentUser) return '?';
    if (currentUser.displayName) {
      const names = currentUser.displayName.split(' ');
      return names.map(n => n[0]).join('').toUpperCase().slice(0, 2);
    }
    return currentUser.email?.[0]?.toUpperCase() || '?';
  };

  // Generate a consistent color based on email
  const getAvatarColor = () => {
    if (!currentUser?.email) return 'bg-blue-500';
    const colors = [
      'bg-blue-500',
      'bg-purple-500',
      'bg-pink-500',
      'bg-indigo-500',
      'bg-cyan-500',
      'bg-teal-500',
    ];
    const index = currentUser.email.charCodeAt(0) % colors.length;
    return colors[index];
  };

  if (!currentUser) return null;

  return (
    <div className="relative" ref={menuRef}>
      {/* Avatar Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-slate-100 transition-colors"
      >
        <div className={`w-8 h-8 ${getAvatarColor()} rounded-full flex items-center justify-center text-white font-semibold text-sm`}>
          {getInitials()}
        </div>
        <ChevronDown className={`w-4 h-4 text-slate-600 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-xl border border-slate-200 py-2 z-50">
          {/* User Info */}
          <div className="px-4 py-3 border-b border-slate-200">
            <p className="font-semibold text-slate-800 text-sm">
              {currentUser.displayName || 'User'}
            </p>
            <p className="text-xs text-slate-500 mt-1">
              {currentUser.email}
            </p>
          </div>

          {/* Sign Out Button */}
          <button
            onClick={handleLogout}
            className="w-full px-4 py-2 text-left text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      )}
    </div>
  );
}
