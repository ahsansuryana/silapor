import { Link } from 'react-router-dom';
import { LayoutGrid, History, Plus, Bell, User } from 'lucide-react';
import { useLocation } from 'react-router-dom';

export default function BottomNav() {
  const location = useLocation();

  const isActive = (path: string) => {
    if (path === '/home') return location.pathname === '/home';
    if (path === '/reports') return location.pathname === '/reports';
    if (path === '/notifications') return location.pathname === '/notifications';
    if (path === '/profile') return location.pathname === '/profile';
    return false;
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-surface/80 backdrop-blur-2xl border-t border-outline-variant/10 px-4 py-3">
      <div className="max-w-md mx-auto flex justify-between items-center">
        <Link to="/home" className={`w-[72px] flex flex-col items-center gap-1 py-1 ${isActive('/home') ? 'text-primary' : 'text-on-surface-variant hover:text-primary'} transition-colors`}>
          <div className={`p-1.5 rounded-xl ${isActive('/home') ? 'bg-primary/10' : ''}`}>
            <LayoutGrid className="w-5 h-5" />
          </div>
          <span className="text-[10px] font-bold uppercase tracking-wider">Home</span>
        </Link>
        <Link to="/reports" className={`w-[72px] flex flex-col items-center gap-1 py-1 ${isActive('/reports') ? 'text-primary' : 'text-on-surface-variant hover:text-primary'} transition-colors`}>
          <div className={`p-1.5 rounded-xl ${isActive('/reports') ? 'bg-primary/10' : ''}`}>
            <History className="w-5 h-5" />
          </div>
          <span className="text-[10px] font-bold uppercase tracking-wider">History</span>
        </Link>
        <div className="relative -top-6">
          <Link to="/report/new" className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center shadow-xl shadow-primary/30 text-white active:scale-90 transition-transform">
            <Plus className="w-6 h-6" />
          </Link>
        </div>
        <Link to="/notifications" className={`w-[72px] flex flex-col items-center gap-1 py-1 ${isActive('/notifications') ? 'text-primary' : 'text-on-surface-variant hover:text-primary'} transition-colors`}>
          <div className={`p-1.5 rounded-xl ${isActive('/notifications') ? 'bg-primary/10' : ''}`}>
            <div className="relative">
              <Bell className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-error rounded-full border border-surface"></span>
            </div>
          </div>
          <span className="text-[10px] font-bold uppercase tracking-wider">Notification</span>
        </Link>
        <Link to="/profile" className={`w-[72px] flex flex-col items-center gap-1 py-1 ${isActive('/profile') ? 'text-primary' : 'text-on-surface-variant hover:text-primary'} transition-colors`}>
          <div className={`p-1.5 rounded-xl ${isActive('/profile') ? 'bg-primary/10' : ''}`}>
            <User className="w-5 h-5" />
          </div>
          <span className="text-[10px] font-bold uppercase tracking-wider">Profile</span>
        </Link>
      </div>
    </nav>
  );
}
