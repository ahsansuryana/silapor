import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { LayoutGrid, History, Plus, Bell, User, Shield, Building2, Users, FileText } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { getRoleFromToken } from '../../lib/jwt';
import api from '../../lib/api';

export default function BottomNav() {
  const location = useLocation();
  const role = getRoleFromToken();
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    fetchUnreadCount();
    const interval = setInterval(fetchUnreadCount, 30000);
    const onFcm = () => fetchUnreadCount();
    window.addEventListener('fcm-message', onFcm);
    return () => {
      clearInterval(interval);
      window.removeEventListener('fcm-message', onFcm);
    };
  }, []);

  const fetchUnreadCount = async () => {
    try {
      const { data } = await api.get('/notifications/unread-count');
      setUnreadCount(data.count || 0);
    } catch {
      // Ignore
    }
  };

  const isActive = (path: string) => {
    if (path === '/home') return location.pathname === '/home';
    if (path === '/reports') return location.pathname === '/reports';
    if (path === '/notifications') return location.pathname === '/notifications';
    if (path === '/profile') return location.pathname === '/profile';
    if (path === '/staff') return location.pathname.startsWith('/staff');
    if (path === '/staff/reports') return location.pathname === '/staff/reports';
    if (path === '/staff/notifications') return location.pathname === '/staff/notifications';
    if (path === '/admin') return location.pathname === '/admin';
    if (path === '/admin/reports') return location.pathname === '/admin/reports';
    if (path === '/admin/management') return location.pathname === '/admin/management';
    if (path === '/admin/facility') return location.pathname === '/admin/facility';
    return false;
  };

  const NotificationBadge = ({ count }: { count: number }) => {
    if (count === 0) return null;
    return (
      <span className="absolute -top-2 -right-2 min-w-[18px] h-[18px] flex items-center justify-center bg-error text-white text-[9px] font-extrabold rounded-full px-1 leading-none">
        {count > 99 ? '99+' : count}
      </span>
    );
  };

  const NotificationIcon = ({ to, label }: { to: string; label: string }) => (
    <Link to={to} className={`w-[56px] flex flex-col items-center gap-1 py-1 ${isActive(to) ? 'text-primary' : 'text-on-surface-variant hover:text-primary'} transition-colors`}>
      <div className={`p-1.5 rounded-xl ${isActive(to) ? 'bg-primary/10' : ''}`}>
        <div className="relative">
          <Bell className="w-5 h-5" />
          <NotificationBadge count={unreadCount} />
        </div>
      </div>
      <span className="text-[9px] font-bold uppercase tracking-wider">{label}</span>
    </Link>
  );

  // Admin menu - 6 items: Admin, Reports, Notif, Manage, Facility, Profile
  if (role === 'ADMIN') {
    return (
      <nav className="sticky bottom-0 z-50 bg-surface border-t border-outline-variant/10 px-1 py-3">
        <div className="max-w-md mx-auto flex justify-around items-center">
          <Link to="/admin" className={`w-[56px] flex flex-col items-center gap-1 py-1 ${isActive('/admin') ? 'text-primary' : 'text-on-surface-variant hover:text-primary'} transition-colors`}>
            <div className={`p-1.5 rounded-xl ${isActive('/admin') ? 'bg-primary/10' : ''}`}>
              <Shield className="w-5 h-5" />
            </div>
            <span className="text-[9px] font-bold uppercase tracking-wider">Admin</span>
          </Link>
          <Link to="/admin/reports" className={`w-[56px] flex flex-col items-center gap-1 py-1 ${isActive('/admin/reports') ? 'text-primary' : 'text-on-surface-variant hover:text-primary'} transition-colors`}>
            <div className={`p-1.5 rounded-xl ${isActive('/admin/reports') ? 'bg-primary/10' : ''}`}>
              <FileText className="w-5 h-5" />
            </div>
            <span className="text-[9px] font-bold uppercase tracking-wider">Reports</span>
          </Link>
          <NotificationIcon to="/notifications" label="Notif" />
          <Link to="/admin/management" className={`w-[56px] flex flex-col items-center gap-1 py-1 ${isActive('/admin/management') ? 'text-primary' : 'text-on-surface-variant hover:text-primary'} transition-colors`}>
            <div className={`p-1.5 rounded-xl ${isActive('/admin/management') ? 'bg-primary/10' : ''}`}>
              <Users className="w-5 h-5" />
            </div>
            <span className="text-[9px] font-bold uppercase tracking-wider">Manage</span>
          </Link>
          <Link to="/admin/facility" className={`w-[56px] flex flex-col items-center gap-1 py-1 ${isActive('/admin/facility') ? 'text-primary' : 'text-on-surface-variant hover:text-primary'} transition-colors`}>
            <div className={`p-1.5 rounded-xl ${isActive('/admin/facility') ? 'bg-primary/10' : ''}`}>
              <Building2 className="w-5 h-5" />
            </div>
            <span className="text-[9px] font-bold uppercase tracking-wider">Facility</span>
          </Link>
          <Link to="/profile" className={`w-[56px] flex flex-col items-center gap-1 py-1 ${isActive('/profile') ? 'text-primary' : 'text-on-surface-variant hover:text-primary'} transition-colors`}>
            <div className={`p-1.5 rounded-xl ${isActive('/profile') ? 'bg-primary/10' : ''}`}>
              <User className="w-5 h-5" />
            </div>
            <span className="text-[9px] font-bold uppercase tracking-wider">Profile</span>
          </Link>
        </div>
      </nav>
    );
  }

  // Staff menu - 4 items: Dashboard, Reports, Notif, Profile
  if (role === 'STAFF') {
    return (
      <nav className="sticky bottom-0 z-50 bg-surface border-t border-outline-variant/10 px-4 py-3">
        <div className="max-w-md mx-auto flex justify-around items-center">
          <Link to="/staff" className={`w-[72px] flex flex-col items-center gap-1 py-1 ${isActive('/staff') && !isActive('/staff/reports') ? 'text-primary' : 'text-on-surface-variant hover:text-primary'} transition-colors`}>
            <div className={`p-1.5 rounded-xl ${isActive('/staff') && !isActive('/staff/reports') ? 'bg-primary/10' : ''}`}>
              <LayoutGrid className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-wider">Dashboard</span>
          </Link>
          <Link to="/staff/reports" className={`w-[72px] flex flex-col items-center gap-1 py-1 ${isActive('/staff/reports') ? 'text-primary' : 'text-on-surface-variant hover:text-primary'} transition-colors`}>
            <div className={`p-1.5 rounded-xl ${isActive('/staff/reports') ? 'bg-primary/10' : ''}`}>
              <FileText className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-wider">Reports</span>
          </Link>
          <Link to="/notifications" className={`w-[72px] flex flex-col items-center gap-1 py-1 ${isActive('/notifications') ? 'text-primary' : 'text-on-surface-variant hover:text-primary'} transition-colors`}>
            <div className={`p-1.5 rounded-xl ${isActive('/notifications') ? 'bg-primary/10' : ''}`}>
              <div className="relative">
                <Bell className="w-5 h-5" />
                <NotificationBadge count={unreadCount} />
              </div>
            </div>
            <span className="text-[10px] font-bold uppercase tracking-wider">Notif</span>
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

  // Default menu (MAHASISWA)
  return (
    <nav className="sticky bottom-0 z-50 bg-surface border-t border-outline-variant/10 px-4 py-3">
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
          <Link to="/report/new" className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center shadow-lg shadow-primary/30 text-white active:scale-90 transition-transform">
            <Plus className="w-6 h-6" />
          </Link>
        </div>
        <Link to="/notifications" className={`w-[72px] flex flex-col items-center gap-1 py-1 ${isActive('/notifications') ? 'text-primary' : 'text-on-surface-variant hover:text-primary'} transition-colors`}>
          <div className={`p-1.5 rounded-xl ${isActive('/notifications') ? 'bg-primary/10' : ''}`}>
            <div className="relative">
              <Bell className="w-5 h-5" />
              <NotificationBadge count={unreadCount} />
            </div>
          </div>
          <span className="text-[10px] font-bold uppercase tracking-wider">Notif</span>
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
