import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Clock,
  CheckCircle2,
  AlertCircle,
  LayoutGrid,
  ArrowRight,
} from "lucide-react";
import { motion } from "motion/react";
import api from "../../lib/api";
import ScreenHeader from "../../components/ui/ScreenHeader";
import { getRoleFromToken } from "../../lib/jwt";
import BottomNav from "../../components/layout/BottomNav";

export default function StaffDashboard() {
  const [stats, setStats] = useState({
    active: 0,
    pending: 0,
    resolved: 0,
  });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const role = getRoleFromToken();
  const isAdmin = role === "ADMIN";

  const fetchDashboardData = async () => {
    try {
      const { data: tasks } = await api.get('/assignments/my-tasks');
      const assignments = tasks || [];

      const active = assignments.filter((a: any) => a.status === 'diproses' || a.report?.status === 'diproses').length;
      const pending = assignments.filter((a: any) => a.status === 'menunggu' || a.report?.status === 'menunggu').length;
      const resolved = assignments.filter((a: any) => a.status === 'selesai' || a.report?.status === 'selesai').length;

      setStats({ active, pending, resolved });
    } catch (err) {
      console.error('Failed to fetch dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      label: "Active Reports",
      value: stats.active.toString(),
      icon: <Clock className="w-5 h-5" />,
      color: "bg-secondary-container/20 text-on-secondary-container",
    },
    {
      label: "Pending Tasks",
      value: stats.pending.toString().padStart(2, '0'),
      icon: <AlertCircle className="w-5 h-5" />,
      color: "bg-tertiary-container/20 text-on-tertiary-container",
    },
    {
      label: "Resolved Today",
      value: stats.resolved.toString(),
      icon: <CheckCircle2 className="w-5 h-5" />,
      color: "bg-primary/10 text-primary",
    },
  ];

  const quickActions = [
    {
      label: "Report Center",
      icon: <LayoutGrid className="w-6 h-6" />,
      path: "/staff/reports",
      color: "bg-primary text-white",
    },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-surface">
      <ScreenHeader
        title="SILAPOR STAFF"
        subTitle="Admin Control Panel"
        rightActions={
          <Link
            to="/profile"
            className="w-10 h-10 rounded-full overflow-hidden border-2 border-on-surface/20 hover:border-on-surface transition-all"
          >
            <img
              src="https://api.dicebear.com/7.x/avataaars/svg?seed=Staff"
              alt="Profile"
              className="w-full h-full object-cover"
            />
          </Link>
        }
      />

      <div className="flex-1 overflow-y-auto">
        <main className="max-w-6xl mx-auto px-6 pt-8 space-y-8 pb-8">
        <section className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-2">
            <h2 className="font-headline font-extrabold text-3xl text-on-surface tracking-tight">
              System Overview
            </h2>
            <p className="font-body text-on-surface-variant">
              Monitoring campus facilities and staff performance.
            </p>
          </div>
        </section>

        <section className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {loading ? (
            <div className="col-span-3 text-center py-8 text-on-surface-variant">Loading...</div>
          ) : (
            statCards.map((stat, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.1 }}
                className="bg-surface-container-lowest p-6 rounded-3xl border border-outline-variant/10 shadow-sm flex items-center gap-6"
              >
                <div
                  className={`w-14 h-14 rounded-2xl flex items-center justify-center ${stat.color}`}
                >
                  {stat.icon}
                </div>
                <div>
                  <p className="text-3xl font-headline font-extrabold text-on-surface leading-none mb-1">
                    {stat.value}
                  </p>
                  <p className="font-label text-xs font-bold text-on-surface-variant uppercase tracking-widest">
                    {stat.label}
                  </p>
                </div>
              </motion.div>
            ))
          )}
        </section>

        <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {quickActions.map((action, idx) => (
            <Link
              key={idx}
              to={action.path}
              className={`p-6 rounded-3xl flex flex-col items-center justify-center gap-4 transition-all hover:scale-[1.02] active:scale-[0.98] shadow-sm ${action.color}`}
            >
              <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center">
                {action.icon}
              </div>
              <span className="font-headline font-bold text-sm tracking-tight">
                {action.label}
              </span>
            </Link>
          ))}
        </section>

        {isAdmin && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-primary/10 border border-primary/20 p-6 rounded-3xl flex items-center justify-between"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-primary/20 flex items-center justify-center">
                <LayoutGrid className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="font-headline font-bold text-on-surface">Admin Panel</h3>
                <p className="text-xs text-on-surface-variant">Access staff management and facility configuration</p>
              </div>
            </div>
            <button
              onClick={() => navigate("/admin")}
              className="px-4 py-2 bg-primary text-white font-headline font-bold text-sm rounded-xl flex items-center gap-2"
            >
              Open Panel <ArrowRight className="w-4 h-4" />
            </button>
          </motion.section>
        )}
        </main>
      </div>

      <BottomNav />
    </div>
  );
}
