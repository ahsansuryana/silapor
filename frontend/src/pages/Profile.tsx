import { useNavigate } from "react-router-dom";
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
import LogoSilapor from "../assets/LOGO_SILAPOR.png";
import BottomNav from "../components/layout/BottomNav";

export default function Profile() {
  const navigate = useNavigate();

  const menuItems = [
    { label: "Personal Information", icon: <User className="w-5 h-5" />, color: "text-primary" },
    { label: "Notification Settings", icon: <Bell className="w-5 h-5" />, color: "text-secondary-container" },
    { label: "Security & Privacy", icon: <Shield className="w-5 h-5" />, color: "text-on-primary-fixed-variant" },
    { label: "Appearance", icon: <Moon className="w-5 h-5" />, color: "text-on-secondary-container" },
  ];

  const supportItems = [
    { label: "Help Center", icon: <HelpCircle className="w-5 h-5" /> },
    { label: "Terms of Service", icon: <FileText className="w-5 h-5" /> },
    { label: "Privacy Policy", icon: <Shield className="w-5 h-5" /> },
  ];

  return (
    <div className="min-h-screen bg-surface">
      <header className="sticky top-0 z-50 glass-header border-b border-outline-variant/10 px-6 py-4">
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

      <main className="max-w-2xl mx-auto px-6 pt-8 pb-28 space-y-8">
        <section className="flex flex-col items-center text-center space-y-4">
          <div className="relative">
            <div className="w-28 h-28 rounded-[2.5rem] overflow-hidden border-4 border-primary/10 shadow-xl">
              <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="Profile" className="w-full h-full object-cover" />
            </div>
            <button className="absolute bottom-0 right-0 w-10 h-10 bg-primary text-white rounded-2xl flex items-center justify-center shadow-lg border-4 border-surface active:scale-90 transition-transform">
              <Camera className="w-5 h-5" />
            </button>
          </div>
          <div className="space-y-1">
            <h2 className="font-headline font-extrabold text-2xl text-on-surface tracking-tight">Felix Alexander</h2>
            <p className="font-body text-sm text-on-surface-variant font-medium">Computer Science • 2022</p>
            <div className="flex items-center justify-center gap-2 pt-2">
              <span className="px-3 py-1 bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-widest rounded-full">Student</span>
              <span className="px-3 py-1 bg-surface-container-highest text-on-surface-variant text-[10px] font-bold uppercase tracking-widest rounded-full">Verified</span>
            </div>
          </div>
        </section>

        <section className="grid grid-cols-2 gap-4">
          <div className="bg-surface-container-lowest p-5 rounded-2xl border border-outline-variant/10 shadow-sm text-center">
            <p className="text-2xl font-headline font-extrabold text-on-surface">12</p>
            <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Total Reports</p>
          </div>
          <div className="bg-surface-container-lowest p-5 rounded-2xl border border-outline-variant/10 shadow-sm text-center">
            <p className="text-2xl font-headline font-extrabold text-primary">08</p>
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
              onClick={() => navigate("/login")}
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

      <BottomNav />
    </div>
  );
}
