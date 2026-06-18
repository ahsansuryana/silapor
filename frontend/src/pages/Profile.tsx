import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  User,
  LogOut,
  X,
  Loader2,
  ChevronRight,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import api from "../lib/api";
import LogoSilapor from "../assets/LOGO_SILAPOR.png";
import BottomNav from "../components/layout/BottomNav";

interface UserData {
  id: string;
  name: string;
  role: string;
}

export default function Profile() {
  const navigate = useNavigate();
  const [user, setUser] = useState<UserData | null>(null);
  const [stats, setStats] = useState({ total: 0, resolved: 0 });
  const [showEditModal, setShowEditModal] = useState(false);
  const [editName, setEditName] = useState("");
  const [editPassword, setEditPassword] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchStats();
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const parsed = JSON.parse(storedUser);
      setUser(parsed);
      setEditName(parsed.name || "");
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
    localStorage.removeItem('fcm_token');
    navigate('/login');
  };

  const handleSaveProfile = async () => {
    if (!editName.trim()) return;
    setSaving(true);
    try {
      const body: any = { name: editName.trim() };
      if (editPassword) body.password = editPassword;
      const { data } = await api.put('/auth/profile', body);
      const updatedUser: UserData = { id: user!.id, name: data.user.name, role: user!.role };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setShowEditModal(false);
      setEditPassword("");
    } catch (err) {
      console.error('Failed to update profile:', err);
      alert("Gagal update profile");
    } finally {
      setSaving(false);
    }
  };

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
        </div>
      </header>

      <div className="flex-1 overflow-y-auto">
        <main className="max-w-2xl mx-auto px-6 pt-8 space-y-8 pb-8">
        <section className="flex flex-col items-center text-center space-y-4">
          <div className="relative">
            <div className="w-28 h-28 rounded-[2.5rem] overflow-hidden border-4 border-primary/10 shadow-xl">
              <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.name || 'User'}`} alt="Profile" className="w-full h-full object-cover" />
            </div>
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
            <h3 className="font-headline font-bold text-sm text-on-surface-variant/60 uppercase tracking-widest ml-1">Account</h3>
            <div className="bg-surface-container-lowest rounded-3xl border border-outline-variant/10 shadow-sm overflow-hidden">
              <button
                onClick={() => setShowEditModal(true)}
                className="w-full flex items-center justify-between p-5 hover:bg-surface-container-low transition-all group"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-surface-container-low flex items-center justify-center text-primary">
                    <User className="w-5 h-5" />
                  </div>
                  <span className="font-headline font-bold text-on-surface">Edit Profile</span>
                </div>
                <ChevronRight className="w-5 h-5 text-outline-variant group-hover:text-primary transition-all" />
              </button>
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

      <AnimatePresence>
        {showEditModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="bg-surface p-6 rounded-2xl w-full max-w-md"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-headline font-bold text-xl">Edit Profile</h2>
                <button onClick={() => setShowEditModal(false)} className="w-8 h-8 rounded-lg hover:bg-surface-container-low">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-2 block">Name</label>
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="w-full px-4 py-3 bg-surface-container-lowest border border-outline-variant/10 rounded-xl text-sm"
                    placeholder="Enter your name"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-2 block">New Password (optional)</label>
                  <input
                    type="password"
                    value={editPassword}
                    onChange={(e) => setEditPassword(e.target.value)}
                    className="w-full px-4 py-3 bg-surface-container-lowest border border-outline-variant/10 rounded-xl text-sm"
                    placeholder="Leave empty to keep current"
                  />
                </div>

                <button
                  onClick={handleSaveProfile}
                  disabled={saving || !editName.trim()}
                  className="w-full py-3 bg-primary text-white font-bold rounded-xl flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {saving && <Loader2 className="w-5 h-5 animate-spin" />}
                  Save Changes
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <BottomNav />
    </div>
  );
}


