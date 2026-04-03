import { Link } from "react-router-dom";
import {
  Bell,
  Clock,
  CheckCircle2,
  AlertCircle,
  LayoutGrid,
  Users,
  Building2,
  Megaphone,
  TrendingUp,
  BarChart3,
  Calendar,
} from "lucide-react";
import { motion } from "motion/react";
import ScreenHeader from "../../components/ui/ScreenHeader";

export default function StaffDashboard() {

  const stats = [
    {
      label: "Active Reports",
      value: "42",
      icon: <Clock className="w-5 h-5" />,
      color: "bg-secondary-container/20 text-on-secondary-container",
    },
    {
      label: "Staff Online",
      value: "18",
      icon: <Users className="w-5 h-5" />,
      color: "bg-primary/10 text-primary",
    },
    {
      label: "Pending Tasks",
      value: "07",
      icon: <AlertCircle className="w-5 h-5" />,
      color: "bg-tertiary-container/20 text-on-tertiary-container",
    },
  ];

  const quickActions = [
    {
      label: "Report Center",
      icon: <LayoutGrid className="w-6 h-6" />,
      path: "/staff/reports",
      color: "bg-primary text-white",
    },
    {
      label: "Management",
      icon: <Users className="w-6 h-6" />,
      path: "/staff/management",
      color: "bg-surface-container-highest text-on-surface",
    },
    {
      label: "Facility Info",
      icon: <Building2 className="w-6 h-6" />,
      path: "/staff/facility",
      color: "bg-surface-container-highest text-on-surface",
    },
    {
      label: "Broadcast",
      icon: <Megaphone className="w-6 h-6" />,
      path: "/staff/broadcast",
      color: "bg-surface-container-highest text-on-surface",
    },
  ];

  return (
    <div className="min-h-screen bg-surface pb-24">
      <ScreenHeader
        title="SILAPOR STAFF"
        subTitle="Admin Control Panel"
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
                src="https://api.dicebear.com/7.x/avataaars/svg?seed=Staff"
                alt="Profile"
                className="w-full h-full object-cover"
              />
            </Link>
          </>
        }
      />

      <main className="max-w-6xl mx-auto px-6 pt-8 space-y-8">
        <section className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-2">
            <h2 className="font-headline font-extrabold text-3xl text-on-surface tracking-tight">
              System Overview
            </h2>
            <p className="font-body text-on-surface-variant">
              Monitoring campus facilities and staff performance.
            </p>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-surface-container-low rounded-xl text-xs font-bold text-on-surface-variant">
            <Calendar className="w-4 h-4" />
            March 26, 2026
          </div>
        </section>

        <section className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {stats.map((stat, idx) => (
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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <section className="lg:col-span-2 bg-surface-container-lowest p-8 rounded-[2.5rem] border border-outline-variant/10 shadow-sm space-y-6">
            <div className="flex justify-between items-center">
              <div className="space-y-1">
                <h3 className="font-headline font-bold text-xl text-on-surface">
                  Report Trends
                </h3>
                <p className="text-xs text-on-surface-variant">
                  Weekly report activity overview
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="flex items-center gap-1 text-xs font-bold text-primary">
                  <TrendingUp className="w-4 h-4" />
                  +12%
                </span>
                <select className="bg-surface-container-low border-0 rounded-lg px-2 py-1 text-[10px] font-bold uppercase tracking-widest outline-none">
                  <option>Last 7 Days</option>
                  <option>Last 30 Days</option>
                </select>
              </div>
            </div>

            <div className="aspect-[2/1] bg-surface-container-low rounded-2xl flex items-center justify-center relative overflow-hidden">
              <div className="absolute inset-0 flex items-end justify-between px-8 pb-4">
                {[40, 70, 45, 90, 65, 80, 55].map((h, i) => (
                  <div
                    key={i}
                    className="w-8 bg-primary/20 rounded-t-lg relative group transition-all hover:bg-primary/40"
                    style={{ height: `${h}%` }}
                  >
                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-on-surface text-surface text-[10px] font-bold px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                      {h}
                    </div>
                  </div>
                ))}
              </div>
              <div className="absolute inset-x-0 bottom-0 h-[1px] bg-outline-variant/20"></div>
              <BarChart3 className="w-12 h-12 text-on-surface-variant/10" />
            </div>
          </section>

          <section className="bg-surface-container-lowest p-8 rounded-[2.5rem] border border-outline-variant/10 shadow-sm space-y-6">
            <h3 className="font-headline font-bold text-xl text-on-surface">
              Recent Activity
            </h3>
            <div className="space-y-6">
              {[
                {
                  user: "Budi (Tech)",
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
                {
                  user: "System",
                  action: "Broadcast sent to all",
                  time: "1h ago",
                  icon: <Megaphone className="w-4 h-4" />,
                  color:
                    "bg-secondary-container/20 text-on-secondary-container",
                },
              ].map((activity, idx) => (
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
        </div>
      </main>
    </div>
  );
}
