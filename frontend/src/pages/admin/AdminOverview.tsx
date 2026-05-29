import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  Bell,
  Clock,
  CheckCircle2,
  AlertCircle,
  LayoutGrid,
  Users,
  User,
  Building2,
  TrendingUp,
  Calendar,
  ArrowRight,
} from "lucide-react";
import { motion } from "motion/react";
import api from "../../lib/api";
import ScreenHeader from "../../components/ui/ScreenHeader";
import BottomNav from "../../components/layout/BottomNav";

interface Stats {
  total: number;
  pending: number;
  inProgress: number;
  resolved: number;
  percentage: number;
}

export default function AdminOverview() {
  const [stats, setStats] = useState<Stats>({ total: 0, pending: 0, inProgress: 0, resolved: 0, percentage: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const { data } = await api.get("/reports/stats");
      setStats(data);
    } catch (err) {
      console.error("Failed to fetch stats:", err);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      label: "Total Reports",
      value: stats.total.toString(),
      icon: <LayoutGrid className="w-5 h-5" />,
      color: "bg-secondary-container/20 text-on-secondary-container",
    },
    {
      label: "Pending",
      value: (stats.pending + stats.inProgress).toString(),
      icon: <Clock className="w-5 h-5" />,
      color: "bg-tertiary-container/20 text-on-tertiary-container",
    },
    {
      label: "Resolved",
      value: stats.resolved.toString(),
      icon: <CheckCircle2 className="w-5 h-5" />,
      color: "bg-primary/10 text-primary",
    },
  ];

  const quickActions = [
    {
      label: "Staff Reports",
      icon: <LayoutGrid className="w-6 h-6" />,
      path: "/admin/reports",
      color: "bg-primary text-white",
    },
    {
      label: "Users",
      icon: <User className="w-6 h-6" />,
      path: "/admin/users",
      color: "bg-surface-container-highest text-on-surface",
    },
    {
      label: "Staff",
      icon: <Users className="w-6 h-6" />,
      path: "/admin/management",
      color: "bg-surface-container-highest text-on-surface",
    },
    {
      label: "Facility",
      icon: <Building2 className="w-6 h-6" />,
      path: "/admin/facility",
      color: "bg-surface-container-highest text-on-surface",
    },
  ];

  const recentActivity = [
    {
      user: "Budi (Staff)",
      action: "Assigned to RPT-8821",
      time: "5m ago",
      icon: <Users className="w-4 h-4" />,
      color: "bg-primary/10 text-primary",
    },
    {
      user: "System",
      action: "New report RPT-8825",
      time: "12m ago",
      icon: <AlertCircle className="w-4 h-4" />,
      color: "bg-error/10 text-error",
    },
    {
      user: "Ani (Staff)",
      action: "Resolved RPT-8810",
      time: "45m ago",
      icon: <CheckCircle2 className="w-4 h-4" />,
      color: "bg-primary-fixed/20 text-on-primary-fixed-variant",
    },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-surface">
      <ScreenHeader
        title="ADMIN PANEL"
        subTitle="Super Administrator"
        rightActions={
          <>
            <button className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-surface-container-low transition-colors relative">
              <Bell className="w-5 h-5 text-on-surface-variant" />
              <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-error rounded-full border-2 border-surface"></span>
            </button>
            <Link
              to="/profile"
              className="w-10 h-10 rounded-full overflow-hidden border-2 border-on-surface/20 hover:border-on-surface transition-all"
            >
              <img
                src="https://api.dicebear.com/7.x/avataaars/svg?seed=Admin"
                alt="Profile"
                className="w-full h-full object-cover"
              />
            </Link>
          </>
        }
      />

      <div className="flex-1 overflow-y-auto">
        <main className="max-w-6xl mx-auto px-6 pt-8 pb-8 space-y-8">
          <section className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="space-y-2">
              <h2 className="font-headline font-extrabold text-3xl text-on-surface tracking-tight">
                System Overview
              </h2>
              <p className="font-body text-on-surface-variant">
                Manage users, facilities, and system configuration.
              </p>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-surface-container-low rounded-xl text-xs font-bold text-on-surface-variant">
              <Calendar className="w-4 h-4" />
              May 4, 2026
            </div>
          </section>

          <section className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {statCards.map((stat, idx) => (
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
            ))}
          </section>

          <section className="grid grid-cols-4 gap-4">
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

          <section className="bg-surface-container-lowest p-8 rounded-[2.5rem] border border-outline-variant/10 shadow-sm space-y-6">
            <h3 className="font-headline font-bold text-xl text-on-surface">
              Recent Activity
            </h3>
            <div className="space-y-6">
              {recentActivity.map((activity, idx) => (
                <div key={idx} className="flex gap-4">
                  <div
                    className={`w-10 h-10 rounded-xl flex-shrink-0 flex items-center justify-center ${activity.color}`}
                  >
                    {activity.icon}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-on-surface leading-tight">
                      {activity.user}
                    </p>
                    <p className="text-xs text-on-surface-variant truncate">
                      {activity.action}
                    </p>
                    <p className="text-[10px] font-bold text-on-surface-variant/40 uppercase tracking-widest mt-1">
                      {activity.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <button className="w-full py-3 bg-surface-container-low text-on-surface-variant font-headline font-bold text-sm rounded-xl hover:bg-surface-container-high transition-all">
              View All Activity
            </button>
          </section>
        </main>
      </div>

      <BottomNav />
    </div>
  );
}