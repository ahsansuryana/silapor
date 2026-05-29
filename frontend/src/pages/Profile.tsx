import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  ArrowLeft,
  User,
  Shield,
  Bell,
  Moon,
  LogOut,
  ChevronRight,
  Camera,
  Settings,
  HelpCircle,
  FileText,
} from "lucide-react";
import api from "../lib/api";
import LogoSilapor from "../assets/LOGO_SILAPOR.png";
import BottomNav from "../components/layout/BottomNav";

interface UserData {
  name: string;
  role: string;
}

export default function Profile() {
  const navigate = useNavigate();
  const [user, setUser] = useState<UserData | null>(null);
  const [stats, setStats] = useState({ total: 0, resolved: 0 });

  useEffect(() => {
    fetchStats();
    
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const fetchStats = async () => {
    try {
      const { data } = await api.get('/reports/my');
      const reports = data;
      const resolved = reports.filter((r: any) => r.status === 'selesai').length;
      setStats({ total: reports.length, resolved });
    } catch (err) {
      console.error('Failed to fetch stats:', err);
    }
  };

  const handleLogout = async () => {
    try {
      await api.post('/auth/logout');
    } catch (err) {
      console.error('Logout error:', err);
    }
    localStorage.removeItem('access_token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const menuItems = [
    { label: "Personal Information", icon: <User className="w-5 h-5" />, color: "text-primary" },
    { label: "Notification Settings", icon: <Bell className="w-5 h-5" />, color: "text-secondary-container" },
    { label: "Security & Privacy", icon: <Shield className="w-5 h-5" />, color: "text-on-primary-fixed-variant" },
  ];

  const supportItems = [
    { label: "Help Center", icon: <HelpCircle className="w-5 h-5" /> },
    { label: "Terms of Service", icon: <FileText className="w-5 h-5" /> },
    { label: "Privacy Policy", icon: <Shield className="w-5 h-5" /> },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-surface">
      <header className="sticky top-0 z-40 bg-surface border-b border-outline-variant/10 px-6 py-4">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate(-1)} className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-surface-container-low transition-colors">
              <ArrowLeft className="w-6 h-6 text-on-surface" />
            </button>
            <div className="relative w-10 h-10 flex items-center justify-center">
              <div className="absolute inset-0 bg-surface-container-low rounded-xl shadow-sm"></div>
              <img src={LogoSilapor} alt="SILAPOR" className="relative w-6 h-6 object-contain" />
            </div>
            <h1 className="font-headline font-bold text-xl text-on-surface">Profile</h1>
          </div>
          <button className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-surface-container-low transition-colors">
            <Settings className="w-5 h-5 text-on-surface-variant" />
          </button>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto">
        <main className="max-w-2xl mx-auto px-6 pt-8 space-y-8 pb-8">
        <section className="flex flex-col items-center text-center space-y-4">
          <div className="relative">
            <div className="w-28 h-28 rounded-[2.5rem] overflow-hidden border-4 border-primary/10 shadow-xl">
              <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=User" alt="Profile" className="w-full h-full object-cover" />
            </div>
            <button className="absolute bottom-0 right-0 w-10 h-10 bg-primary text-white rounded-2xl flex items-center justify-center shadow-lg border-4 border-surface active:scale-90 transition-transform">
              <Camera className="w-5 h-5" />
            </button>
          </div>
          <div className="space-y-1">
            <h2 className="font-headline font-extrabold text-2xl text-on-surface tracking-tight">{user?.name || 'User'}</h2>
            <p className="font-body text-sm text-on-surface-variant font-medium">{user?.role || 'Student'}</p>
            <div className="flex items-center justify-center gap-2 pt-2">
              <span className="px-3 py-1 bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-widest rounded-full">{user?.role || 'Student'}</span>
              <span className="px-3 py-1 bg-surface-container-highest text-on-surface-variant text-[10px] font-bold uppercase tracking-widest rounded-full">Verified</span>
            </div>
          </div>
        </section>

        <section className="grid grid-cols-2 gap-4">
          <div className="bg-surface-container-lowest p-5 rounded-2xl border border-outline-variant/10 shadow-sm text-center">
            <p className="text-2xl font-headline font-extrabold text-on-surface">{stats.total}</p>
            <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Total Reports</p>
          </div>
          <div className="bg-surface-container-lowest p-5 rounded-2xl border border-outline-variant/10 shadow-sm text-center">
            <p className="text-2xl font-headline font-extrabold text-primary">{stats.resolved}</p>
            <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Resolved</p>
          </div>
        </section>

        <div className="space-y-6">
          <section className="space-y-3">
            <h3 className="font-headline font-bold text-sm text-on-surface-variant/60 uppercase tracking-widest ml-1">Account Settings</h3>
            <div className="bg-surface-container-lowest rounded-3xl border border-outline-variant/10 shadow-sm overflow-hidden">
              {menuItems.map((item, idx) => (
                <button
                  key={idx}
                  className="w-full flex items-center justify-between p-5 hover:bg-surface-container-low transition-all group border-b border-outline-variant/5 last:border-0"
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-xl bg-surface-container-low flex items-center justify-center ${item.color}`}>
                      {item.icon}
                    </div>
                    <span className="font-headline font-bold text-on-surface">{item.label}</span>
                  </div>
                  <ChevronRight className="w-5 h-5 text-outline-variant group-hover:text-primary transition-all" />
                </button>
              ))}
            </div>
          </section>

          <section className="space-y-3">
            <h3 className="font-headline font-bold text-sm text-on-surface-variant/60 uppercase tracking-widest ml-1">Support</h3>
            <div className="bg-surface-container-lowest rounded-3xl border border-outline-variant/10 shadow-sm overflow-hidden">
              {supportItems.map((item, idx) => (
                <button
                  key={idx}
                  className="w-full flex items-center justify-between p-5 hover:bg-surface-container-low transition-all group border-b border-outline-variant/5 last:border-0"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-surface-container-low flex items-center justify-center text-on-surface-variant">
                      {item.icon}
                    </div>
                    <span className="font-headline font-bold text-on-surface">{item.label}</span>
                  </div>
                  <ChevronRight className="w-5 h-5 text-outline-variant group-hover:text-primary transition-all" />
                </button>
              ))}
            </div>
          </section>

          <section className="pt-4">
            <button
              onClick={handleLogout}
              className="w-full py-5 bg-error/10 text-error font-headline font-bold rounded-2xl flex items-center justify-center gap-3 hover:bg-error/20 transition-all active:scale-[0.98]"
            >
              <LogOut className="w-5 h-5" />
              Logout from SILAPOR
            </button>
            <p className="mt-6 text-center text-[10px] font-bold text-on-surface-variant/40 uppercase tracking-[0.2em]">
              SILAPOR v2.4.0 • Build 2026.03.26
            </p>
          </section>
        </div>
      </main>
        </div>

      <BottomNav />
    </div>
  );
}
