import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  Bell,
  Search,
  Plus,
  ArrowRight,
  Clock,
  CheckCircle2,
  AlertCircle,
  LayoutGrid,
  X,
} from "lucide-react";
import { motion } from "motion/react";
import api from "../../lib/api";
import LogoSilapor from "../../assets/LOGO_SILAPOR.png";
import BottomNav from "../../components/layout/BottomNav";

interface Report {
  id: string;
  title: string;
  status: string;
  category_id?: string;
  location_id?: string;
  created_at: string;
}

const getStatusLabel = (status: string) => {
  switch (status) {
    case "diproses":
      return "In Progress";
    case "selesai":
      return "Resolved";
    case "menunggu":
      return "Pending";
    case "diterima":
      return "Accepted";
    case "ditolak":
      return "Rejected";
    default:
      return status;
  }
};

export default function UserHome() {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchInput, setSearchInput] = useState("");

  useEffect(() => {
    fetchReports();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchInput.trim()) {
        setSearchQuery(searchInput.trim());
      } else {
        setSearchQuery("");
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [searchInput]);

  const fetchReports = async () => {
    try {
      const { data } = await api.get("/reports/my");
      console.log("Fetched reports:", data);
      setReports(data);
    } catch (err) {
      console.error("Failed to fetch reports:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleClearSearch = () => {
    setSearchInput("");
    setSearchQuery("");
  };

  const filteredSearchResults = searchQuery
    ? reports
        .filter(
          (r) =>
            r.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
            r.title?.toLowerCase().includes(searchQuery.toLowerCase()),
        )
        .slice(0, 5)
    : [];

  const totalReports = reports.length;
  const inProgress = reports.filter((r) => r.status === "diproses").length;
  const resolved = reports.filter((r) => r.status === "selesai").length;

  const stats = [
    {
      label: "Total Reports",
      value: totalReports.toString(),
      icon: <LayoutGrid className="w-5 h-5" />,
      color: "bg-primary/10 text-primary",
    },
    {
      label: "In Progress",
      value: inProgress.toString().padStart(2, "0"),
      icon: <Clock className="w-5 h-5" />,
      color: "bg-secondary-container/20 text-on-secondary-container",
    },
    {
      label: "Resolved",
      value: resolved.toString().padStart(2, "0"),
      icon: <CheckCircle2 className="w-5 h-5" />,
      color: "bg-primary-fixed/20 text-on-primary-fixed-variant",
    },
  ];

  const recentReports = reports.slice(0, 3).map((report) => {
    const date = new Date(report.created_at);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);

    let dateStr =
      diffHours < 1
        ? "Just now"
        : diffHours < 24
          ? `${diffHours} hours ago`
          : diffDays === 1
            ? "Yesterday"
            : `${diffDays} days ago`;

    return {
      id: report.id,
      title: report.title,
      status: getStatusLabel(report.status),
      date: dateStr,
      type: "Report",
    };
  });

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-surface border-b border-outline-variant/10 px-6 py-4">
        <div className="max-w-5xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="relative w-12 h-12 flex items-center justify-center">
              <div className="absolute inset-0 bg-surface-container-low rounded-2xl shadow-lg shadow-primary/20"></div>
              <img
                src={LogoSilapor}
                alt="SILAPOR"
                className="relative w-8 h-8 object-contain"
              />
            </div>
            <div>
              <h1 className="font-headline font-extrabold text-lg text-on-surface leading-tight tracking-tight">
                SILAPOR
              </h1>
              <p className="font-body text-[10px] text-primary font-bold tracking-widest uppercase">
                Student Portal
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/notifications"
              className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-surface-container-low transition-colors"
            >
              <div className="relative">
                <Bell className="w-5 h-5 text-on-surface-variant" />
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-error rounded-full border border-surface"></span>
              </div>
            </Link>
            <Link
              to="/profile"
              className="w-10 h-10 rounded-full overflow-hidden border-2 border-primary/20 hover:border-primary transition-all"
            >
              <img
                src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix"
                alt="Profile"
                className="w-full h-full object-cover"
              />
            </Link>
          </div>
        </div>
      </header>

      <div className="flex-1 min-h-0 overflow-y-auto">
        <main className="max-w-5xl mx-auto px-6 pt-8 space-y-8 pb-8">
          {/* Welcome Section */}
          <section className="space-y-2">
            <h2 className="font-headline font-extrabold text-3xl text-on-surface tracking-tight">
              Welcome back!
            </h2>
            <p className="font-body text-on-surface-variant">
              How can we help you improve our campus today?
            </p>
          </section>

          {/* Quick Stats */}
          <section className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {loading ? (
              <div className="col-span-3 text-center py-8 text-on-surface-variant">
                Loading...
              </div>
            ) : (
              stats.map((stat, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="bg-surface-container-lowest p-5 rounded-2xl border border-outline-variant/10 shadow-sm"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className={`p-2.5 rounded-xl ${stat.color}`}>
                      {stat.icon}
                    </div>
                    <span className="text-2xl font-headline font-extrabold text-on-surface">
                      {stat.value}
                    </span>
                  </div>
                  <p className="font-label text-sm font-semibold text-on-surface-variant">
                    {stat.label}
                  </p>
                </motion.div>
              ))
            )}
          </section>

          {/* Action Cards */}
          <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Link
              to="/report/new"
              className="group relative overflow-hidden bg-primary p-8 rounded-[2rem] shadow-xl shadow-primary/20 flex flex-col justify-between min-h-[220px] transition-transform active:scale-[0.98]"
            >
              <div className="absolute top-[-20%] right-[-10%] w-48 h-48 bg-white/10 rounded-full blur-3xl group-hover:bg-white/20 transition-all"></div>
              <div className="relative z-10">
                <div className="w-14 h-14 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center mb-6">
                  <Plus className="w-8 h-8 text-white" />
                </div>
                <h3 className="font-headline font-bold text-2xl text-white mb-2">
                  Create New Report
                </h3>
                <p className="font-body text-white/80 text-sm max-w-[240px]">
                  Found a broken facility? Report it now and we'll fix it ASAP.
                </p>
              </div>
              <div className="relative z-10 flex items-center gap-2 text-white font-label font-bold text-sm">
                Start Reporting{" "}
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>

            <div className="bg-surface-container-high p-8 rounded-[2rem] flex flex-col justify-between min-h-[220px]">
              <div className="flex justify-between items-start">
                <div className="w-14 h-14 bg-surface-container-highest rounded-2xl flex items-center justify-center">
                  <Search className="w-7 h-7 text-on-surface-variant" />
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-bold text-primary tracking-widest uppercase mb-1">
                    Live Status
                  </p>
                  <div className="flex items-center gap-2 justify-end">
                    <span className="w-2 h-2 bg-primary rounded-full animate-pulse"></span>
                    <span className="text-xs font-bold text-on-surface">
                      System Online
                    </span>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <h3 className="font-headline font-bold text-2xl text-on-surface">
                  Track Facilities
                </h3>
                <div className="relative">
                  <div className="flex-1 h-10 bg-surface-container-lowest rounded-xl border border-outline-variant/20 flex items-center px-4">
                    <Search className="w-4 h-4 text-on-surface-variant/40 mr-2" />
                    <input
                      type="text"
                      placeholder="Search by Report ID..."
                      value={searchInput}
                      onChange={(e) => setSearchInput(e.target.value)}
                      className="w-full bg-transparent outline-none font-body text-xs text-on-surface placeholder:text-on-surface-variant/50"
                    />
                    {searchInput && (
                      <button
                        type="button"
                        onClick={handleClearSearch}
                        className="w-4 h-4 text-on-surface-variant/40 hover:text-on-surface"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
                {searchQuery && filteredSearchResults.length > 0 && (
                  <div className="space-y-2">
                    {filteredSearchResults.map((report) => (
                      <Link
                        key={report.id}
                        to={`/report/${report.id}`}
                        className="flex items-center gap-3 p-3 bg-surface-container-lowest rounded-xl border border-outline-variant/10 hover:border-primary/30 transition-all group"
                        onClick={handleClearSearch}
                      >
                        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                          <Search className="w-4 h-4 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-bold text-on-surface truncate">
                            {report.title}
                          </p>
                          <p className="text-[10px] text-on-surface-variant uppercase">
                            {report.id.slice(0, 8)}
                          </p>
                        </div>
                        <ArrowRight className="w-4 h-4 text-outline-variant" />
                      </Link>
                    ))}
                  </div>
                )}
                {searchQuery &&
                  filteredSearchResults.length === 0 &&
                  !loading && (
                    <p className="text-sm text-on-surface-variant text-center py-2">
                      No report found with that ID
                    </p>
                  )}
              </div>
            </div>
          </section>

          {/* Recent Reports - Show when not searching */}
          {!searchQuery && (
            <section className="space-y-4">
              <div className="flex justify-between items-end">
                <h3 className="font-headline font-bold text-xl text-on-surface">
                  Recent Reports
                </h3>
                <Link
                  to="/reports"
                  className="font-label text-sm font-bold text-primary hover:underline"
                >
                  View All
                </Link>
              </div>

              <div className="space-y-3">
                {loading ? null : recentReports.length === 0 ? (
                  <div className="text-center py-8 text-on-surface-variant">
                    No reports yet. Create your first report!
                  </div>
                ) : (
                  recentReports.map((report, idx) => (
                    <Link
                      key={idx}
                      to={`/report/${report.id}`}
                      className="flex items-center gap-4 p-4 bg-surface-container-lowest rounded-2xl border border-outline-variant/10 hover:border-primary/30 transition-all group"
                    >
                      <div
                        className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                          report.status === "Resolved"
                            ? "bg-primary-fixed/20 text-on-primary-fixed-variant"
                            : report.status === "In Progress"
                              ? "bg-secondary-container/20 text-on-secondary-container"
                              : "bg-surface-container-highest text-on-surface-variant"
                        }`}
                      >
                        {report.status === "Resolved" ? (
                          <CheckCircle2 className="w-6 h-6" />
                        ) : report.status === "In Progress" ? (
                          <Clock className="w-6 h-6" />
                        ) : (
                          <AlertCircle className="w-6 h-6" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start mb-0.5">
                          <h4 className="font-headline font-bold text-on-surface truncate pr-2">
                            {report.title}
                          </h4>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-xs font-medium text-on-surface-variant/60">
                            {report.type}
                          </span>
                          <span className="w-1 h-1 bg-outline-variant rounded-full"></span>
                          <span className="text-xs font-medium text-on-surface-variant/60">
                            {report.date}
                          </span>
                        </div>
                      </div>
                      <ArrowRight className="w-5 h-5 text-outline-variant group-hover:text-primary transition-colors" />
                    </Link>
                  ))
                )}
              </div>
            </section>
          )}
        </main>
      </div>

      <BottomNav />
    </div>
  );
}
