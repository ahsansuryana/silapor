import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  Search,
  ChevronRight,
  Calendar,
  AlertCircle,
} from "lucide-react";
import { motion } from "motion/react";
import api from "../lib/api";
import ScreenHeader from "../components/ui/ScreenHeader";
import TabSelector from "../components/ui/TabSelector";
import StatusBadge from "../components/ui/StatusBadge";
import BottomNav from "../components/layout/BottomNav";

interface Report {
  id: string;
  title: string;
  status: string;
  category_name: string;
  location_name: string;
  created_at: string;
}

export default function MyReports() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("All");
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const tabs = ["All", "Pending", "In Progress", "Resolved"];

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const { data } = await api.get("/reports/my");
      setReports(data);
    } catch (err) {
      console.error("Failed to fetch reports:", err);
    } finally {
      setLoading(false);
    }
  };

  const mapStatus = (status: string) => {
    switch (status) {
      case "menunggu":
        return "Pending";
      case "diproses":
        return "In Progress";
      case "selesai":
        return "Resolved";
      case "diterima":
        return "Accepted";
      case "ditolak":
        return "Rejected";
      default:
        return status;
    }
  };

  const formatDate = (dateStr: string) => {
    try {
      return new Date(dateStr).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    } catch {
      return dateStr;
    }
  };

  const filteredReports = reports.filter((r) => {
    const matchesTab = activeTab === "All" || mapStatus(r.status) === activeTab;
    const matchesSearch =
      !searchQuery ||
      r.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.id?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  return (
    <div className="flex flex-col min-h-screen bg-surface">
      <ScreenHeader
        title="My Reports"
        onBack={() => navigate("/home")}
        rightActions={
          <button
            onClick={() => {
              const input = document.getElementById("search-input");
              input?.focus();
            }}
            className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-surface-container-low transition-colors"
          >
            <Search className="w-5 h-5 text-on-surface-variant" />
          </button>
        }
      />

      <div className="flex-1 overflow-y-auto">
        <main className="max-w-3xl mx-auto px-6 pt-6 pb-8 space-y-6">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-on-surface-variant/40" />
          <input
            id="search-input"
            type="text"
            placeholder="Search reports..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-surface-container-lowest border border-outline-variant/10 rounded-2xl font-body text-sm text-on-surface focus:ring-2 focus:ring-primary outline-none transition-all"
          />
        </div>

        <TabSelector
          options={tabs}
          active={activeTab}
          onChange={setActiveTab}
        />

          <div className="flex justify-between items-center">
          <p className="text-xs font-bold text-on-surface-variant/60 uppercase tracking-widest">
            Showing {filteredReports.length} Reports
          </p>
        </div>

        <div className="space-y-4">
          {loading ? (
            <div className="py-20 text-center text-on-surface-variant">
              Loading...
            </div>
          ) : (
            filteredReports.map((report, idx) => (
              <motion.div
                key={report.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
              >
                <Link
                  to={`/report/${report.id}`}
                  className="block p-5 bg-surface-container-lowest rounded-[1.5rem] border border-outline-variant/10 hover:border-primary/30 transition-all shadow-sm group"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        {/* <span className="text-[10px] font-extrabold text-primary tracking-widest uppercase">
                        {(report.id || '').toUpperCase()}
                      </span> */}
                        <span className="w-1 h-1 bg-outline-variant rounded-full"></span>
                        <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">
                          Report
                        </span>
                      </div>
                      <h3 className="font-headline font-bold text-lg text-on-surface group-hover:text-primary transition-colors">
                        {report.title}
                      </h3>
                    </div>
                    <StatusBadge>{mapStatus(report.status)}</StatusBadge>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-outline-variant/10">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1.5 text-xs text-on-surface-variant/60 font-medium">
                        <Calendar className="w-3.5 h-3.5" />
                        {formatDate(report.created_at)}
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-on-surface-variant/60 font-medium">
                        <AlertCircle className="w-3.5 h-3.5" />
                        {report.location_name}
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-outline-variant group-hover:text-primary group-hover:translate-x-1 transition-all" />
                  </div>
                </Link>
              </motion.div>
            ))
          )}
        </div>

        {!loading && filteredReports.length === 0 && (
          <div className="py-20 text-center space-y-4">
            <div className="w-20 h-20 bg-surface-container-low rounded-full flex items-center justify-center mx-auto">
              <Search className="w-10 h-10 text-on-surface-variant/20" />
            </div>
            <div className="space-y-1">
              <h3 className="font-headline font-bold text-lg text-on-surface">
                No reports found
              </h3>
              <p className="font-body text-sm text-on-surface-variant">
                Try changing your filter or create a new report.
              </p>
            </div>
            <Link
              to="/report/new"
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white font-headline font-bold rounded-xl shadow-lg shadow-primary/20"
            >
              Create New Report
            </Link>
          </div>
        )}
      </main>
        </div>

      <BottomNav />
    </div>
  );
}
