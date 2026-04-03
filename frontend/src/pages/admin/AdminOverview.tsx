import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Shield,
  Users,
  AlertCircle,
  Settings,
  Database,
  Lock,
  ChevronRight,
} from "lucide-react";
import { motion } from "motion/react";

export default function AdminOverview() {
  const navigate = useNavigate();

  const systemStats = [
    { label: "Total Users", value: "12.4k", change: "+5%", icon: <Users className="w-5 h-5" />, color: "bg-primary/10 text-primary" },
    { label: "System Health", value: "99.9%", change: "Stable", icon: <Shield className="w-5 h-5" />, color: "bg-primary-fixed/20 text-on-primary-fixed-variant" },
    { label: "Storage Used", value: "42.5 GB", change: "65%", icon: <Database className="w-5 h-5" />, color: "bg-secondary-container/20 text-on-secondary-container" },
    { label: "Active Sessions", value: "842", change: "+12", icon: <Lock className="w-5 h-5" />, color: "bg-tertiary-container/20 text-on-tertiary-container" },
  ];

  const logs = [
    { event: "Database Backup", status: "Success", time: "2h ago", user: "System" },
    { event: "Security Patch v2.4.1", status: "Applied", time: "5h ago", user: "Admin" },
    { event: "New Staff Account", status: "Verified", time: "8h ago", user: "Ani W." },
    { event: "API Key Rotation", status: "Success", time: "12h ago", user: "System" },
  ];

  return (
    <div className="min-h-screen bg-surface pb-12">
      <header className="sticky top-0 z-50 glass-header border-b border-outline-variant/10 px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate("/staff")} className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-surface-container-low transition-colors">
              <ArrowLeft className="w-6 h-6 text-on-surface" />
            </button>
            <h1 className="font-headline font-bold text-xl text-on-surface">Super Admin Overview</h1>
          </div>
          <div className="flex items-center gap-2">
            <button className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-surface-container-low transition-colors">
              <Settings className="w-5 h-5 text-on-surface-variant" />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 pt-8 space-y-8">
        <section className="bg-on-surface p-8 rounded-[2.5rem] text-surface flex flex-col md:flex-row justify-between items-center gap-6 shadow-2xl shadow-on-surface/20">
          <div className="space-y-2 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-2">
              <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] opacity-60">System Status</span>
            </div>
            <h2 className="font-headline font-extrabold text-3xl tracking-tight">All Systems Operational</h2>
            <p className="text-sm opacity-60 max-w-md">The SILAPOR infrastructure is running optimally. No critical issues detected in the last 24 hours.</p>
          </div>
          <div className="flex gap-4">
            <div className="px-6 py-3 bg-white/10 backdrop-blur-md rounded-2xl text-center">
              <p className="text-2xl font-headline font-extrabold">24ms</p>
              <p className="text-[10px] font-bold uppercase tracking-widest opacity-60">Latency</p>
            </div>
            <div className="px-6 py-3 bg-white/10 backdrop-blur-md rounded-2xl text-center">
              <p className="text-2xl font-headline font-extrabold">0%</p>
              <p className="text-[10px] font-bold uppercase tracking-widest opacity-60">Error Rate</p>
            </div>
          </div>
        </section>

        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {systemStats.map((stat, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="bg-surface-container-lowest p-6 rounded-3xl border border-outline-variant/10 shadow-sm"
            >
              <div className="flex justify-between items-start mb-4">
                <div className={`p-2.5 rounded-xl ${stat.color}`}>
                  {stat.icon}
                </div>
                <span className="text-xs font-bold text-primary">{stat.change}</span>
              </div>
              <p className="text-2xl font-headline font-extrabold text-on-surface mb-1">{stat.value}</p>
              <p className="font-label text-xs font-bold text-on-surface-variant uppercase tracking-widest">{stat.label}</p>
            </motion.div>
          ))}
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <section className="lg:col-span-2 space-y-6">
            <div className="flex justify-between items-end">
              <h3 className="font-headline font-bold text-xl text-on-surface">System Logs</h3>
              <button className="text-xs font-bold text-primary hover:underline">View Full Logs</button>
            </div>
            <div className="bg-surface-container-lowest rounded-[2.5rem] border border-outline-variant/10 shadow-sm overflow-hidden">
              <div className="divide-y divide-outline-variant/5">
                {logs.map((log, idx) => (
                  <div key={idx} className="flex items-center justify-between p-6 hover:bg-surface-container-low/50 transition-colors group">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-surface-container-low flex items-center justify-center text-on-surface-variant">
                        <Database className="w-5 h-5" />
                      </div>
                      <div className="space-y-0.5">
                        <h4 className="font-headline font-bold text-on-surface">{log.event}</h4>
                        <p className="text-[10px] font-bold text-on-surface-variant/40 uppercase tracking-widest">By {log.user} • {log.time}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="px-3 py-1 bg-primary-fixed/20 text-on-primary-fixed-variant rounded-full text-[10px] font-bold uppercase tracking-widest">
                        {log.status}
                      </span>
                      <ChevronRight className="w-5 h-5 text-outline-variant group-hover:text-primary transition-all" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="space-y-6">
            <h3 className="font-headline font-bold text-xl text-on-surface">Quick Config</h3>
            <div className="space-y-4">
              <div className="bg-surface-container-lowest p-6 rounded-3xl border border-outline-variant/10 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-surface-container-low flex items-center justify-center text-on-surface-variant">
                      <Shield className="w-5 h-5" />
                    </div>
                    <span className="font-headline font-bold text-sm text-on-surface">Maintenance Mode</span>
                  </div>
                  <div className="w-12 h-6 bg-outline-variant/20 rounded-full relative cursor-pointer">
                    <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-all"></div>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-surface-container-low flex items-center justify-center text-on-surface-variant">
                      <AlertCircle className="w-5 h-5" />
                    </div>
                    <span className="font-headline font-bold text-sm text-on-surface">Public Reporting</span>
                  </div>
                  <div className="w-12 h-6 bg-primary rounded-full relative cursor-pointer">
                    <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full transition-all"></div>
                  </div>
                </div>
              </div>

              <div className="bg-primary/5 p-6 rounded-3xl border border-primary/10 space-y-4">
                <h4 className="font-headline font-bold text-primary text-sm">Security Alert</h4>
                <p className="text-xs text-on-surface-variant leading-relaxed">There have been 3 failed login attempts from an unknown IP address in the last hour.</p>
                <button className="w-full py-3 bg-primary text-white font-headline font-bold text-xs rounded-xl shadow-lg shadow-primary/10">
                  Review Security
                </button>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
