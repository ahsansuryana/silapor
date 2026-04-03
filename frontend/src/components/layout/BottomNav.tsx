import { Link, useLocation } from 'react-router-dom';
import { Bell, Home, History, User } from 'lucide-react';

interface NavItem {
  path: string;
  label: string;
  icon: React.ReactNode;
  isFab?: boolean;
  showBadge?: boolean;
}

export default function BottomNav() {
  const location = useLocation();

  const navItems: NavItem[] = [
    {
      path: '/home',
      label: 'Home',
      icon: <Home className="w-6 h-6" />,
    },
    {
      path: '/reports',
      label: 'History',
      icon: <History className="w-6 h-6" />,
    },
    {
      path: '/report/new',
      label: 'Add',
      icon: (
        <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center shadow-xl shadow-primary/30 -mt-4">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
        </div>
      ),
      isFab: true,
    },
    {
      path: '/notifications',
      label: 'Notification',
      icon: (
        <div className="relative">
          <Bell className="w-6 h-6" />
          <span className="absolute -top-1 -right-1 w-2 h-2 bg-error rounded-full border border-surface"></span>
        </div>
      ),
      showBadge: true,
    },
    {
      path: '/profile',
      label: 'Profile',
      icon: <User className="w-6 h-6" />,
    },
  ];

  const isActive = (path: string) => {
    if (path === '/home') {
      return location.pathname === '/home';
    }
    if (path === '/reports') {
      return location.pathname === '/reports';
    }
    if (path === '/report/new') {
      return location.pathname === '/report/new';
    }
    if (path === '/notifications') {
      return location.pathname === '/notifications';
    }
    if (path === '/profile') {
      return location.pathname === '/profile';
    }
    return false;
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-surface/95 backdrop-blur-2xl border-t border-outline-variant/20 safe-area-bottom">
      <div className="max-w-md mx-auto flex justify-around items-end px-2 pt-2 pb-1">
        {navItems.map((item) => {
          const active = isActive(item.path);

          if (item.isFab) {
            return (
              <Link
                key={item.path}
                to={item.path}
                className="flex items-center justify-center"
              >
                {item.icon}
              </Link>
            );
          }

          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center justify-center gap-0.5 px-3 py-2 rounded-xl transition-all duration-200 ${
                active
                  ? 'text-primary'
                  : 'text-on-surface-variant hover:text-primary/70'
              }`}
            >
              {item.icon}
              <span className={`text-[9px] font-bold uppercase tracking-wider transition-all duration-200 ${
                active ? 'opacity-100' : 'opacity-60'
              }`}>
                {item.label}
              </span>
              {active && (
                <div className="absolute bottom-1 w-1 h-1 bg-primary rounded-full" />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
