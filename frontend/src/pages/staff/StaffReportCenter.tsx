import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Search,
  Filter,
  ChevronRight,
  MoreVertical,
  Download,
  MapPin,
} from "lucide-react";
import { motion } from "motion/react";
import api from "../../lib/api";
import LogoSilapor from "../../assets/LOGO_SILAPOR.png";
import BottomNav from "../../components/layout/BottomNav";

export default function StaffReportCenter() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("All");
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedReport, setSelectedReport] = useState<any>(null);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const { data } = await api.get('/assignments/my-tasks');
      setReports(data || []);
    } catch (err) {
      console.error('Failed to fetch reports:', err);
    } finally {
      setLoading(false);
    }
  };

  const mapStatus = (status: string) => {
    switch (status) {
      case 'menunggu': return 'New';
      case 'diproses': return 'In Progress';
      case 'selesai': return 'Resolved';
      case 'diterima': return 'Accepted';
      case 'ditolak': return 'Rejected';
      default: return status;
    }
  };

  const tabStatus: Record<string, string> = {
    'All': '',
    'New': 'menunggu',
    'In Progress': 'diproses',
    'Resolved': 'selesai',
  };

  const filteredReports = reports.filter((report: any) => {
    const matchesTab = !activeTab || activeTab === 'All' || report.status === tabStatus[activeTab];
    const matchesSearch = !searchQuery || 
      report.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      report.id?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const tabs = ["All", "New", "In Progress", "Resolved"];

  return (
    <div className="flex flex-col min-h-screen bg-surface">
      <header className="sticky top-0 z-40 bg-surface border-b border-outline-variant/10 px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate("/staff")} className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-surface-container-low transition-colors">
              <ArrowLeft className="w-6 h-6 text-on-surface" />
            </button>
            <div className="relative w-10 h-10 flex items-center justify-center">
              <div className="absolute inset-0 bg-surface-container-low rounded-xl shadow-sm"></div>
              <img src={LogoSilapor} alt="SILAPOR" className="relative w-6 h-6 object-contain" />
            </div>
            <h1 className="font-headline font-bold text-xl text-on-surface">Report Center</h1>
          </div>
          <div className="flex items-center gap-2">
            <button className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-surface-container-low transition-colors">
              <Download className="w-5 h-5 text-on-surface-variant" />
            </button>
            <button className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-surface-container-low transition-colors">
              <MoreVertical className="w-5 h-5 text-on-surface-variant" />
            </button>
          </div>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto">
        <main className="max-w-6xl mx-auto px-6 pt-6 pb-12 space-y-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="w-5 h-5 text-on-surface-variant/40 group-focus-within:text-primary transition-colors" />
            </div>
            <input
              type="text"
              placeholder="Search reports by ID, title, or reporter..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3.5 bg-surface-container-lowest border border-outline-variant/10 rounded-2xl font-body text-sm text-on-surface focus:ring-2 focus:ring-primary outline-none transition-all"
            />
          </div>
          <div className="flex gap-2">
            <button className="flex items-center gap-2 px-6 py-3.5 bg-surface-container-lowest border border-outline-variant/10 rounded-2xl text-sm font-bold text-on-surface-variant hover:bg-surface-container-low transition-all">
              <Filter className="w-4 h-4" />
              Filter
            </button>
            <button className="flex items-center gap-2 px-6 py-3.5 bg-on-surface text-surface rounded-2xl text-sm font-bold hover:opacity-90 transition-all">
              Export CSV
            </button>
          </div>
        </div>

        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
          {tabs.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-2.5 rounded-full font-label text-sm font-bold whitespace-nowrap transition-all ${
                activeTab === tab
                  ? "bg-primary text-white shadow-lg shadow-primary/20"
                  : "bg-surface-container-low text-on-surface-variant hover:bg-surface-container-high"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="bg-surface-container-lowest rounded-[2.5rem] border border-outline-variant/10 shadow-sm overflow-hidden">
          <div className="hidden md:grid grid-cols-12 gap-4 px-8 py-4 bg-surface-container-low border-b border-outline-variant/10">
            <div className="col-span-1 text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">ID</div>
            <div className="col-span-4 text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Report Title</div>
            <div className="col-span-2 text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Reporter</div>
            <div className="col-span-2 text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Location</div>
            <div className="col-span-2 text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Status</div>
            <div className="col-span-1"></div>
          </div>

          <div className="divide-y divide-outline-variant/5">
            {filteredReports.map((report, idx) => (
              <motion.div
                key={report.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: idx * 0.05 }}
                className="grid grid-cols-1 md:grid-cols-12 gap-4 px-8 py-6 hover:bg-surface-container-low/50 transition-colors group cursor-pointer"
                onClick={() => navigate(`/report/${report.id}`)}
              >
                <div className="col-span-1">
                  <span className="text-xs font-extrabold text-primary tracking-widest">{report.id}</span>
                </div>
                <div className="col-span-4 space-y-1">
                  <h3 className="font-headline font-bold text-on-surface group-hover:text-primary transition-colors">{report.title}</h3>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold text-on-surface-variant/40 uppercase tracking-widest">
                      {report.category_name || 'Report'}
                    </span>
                    <span className="w-1 h-1 bg-outline-variant/30 rounded-full"></span>
                    <span className="text-[10px] font-bold text-on-surface-variant/40 uppercase tracking-widest">
                      {new Date(report.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                <div className="col-span-2 flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-surface-container-highest overflow-hidden">
                    <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${report.reporter_id}`} alt="Reporter" />
                  </div>
                  <span className="text-xs font-medium text-on-surface-variant">User</span>
                </div>
                <div className="col-span-2 flex items-center gap-1.5 text-xs text-on-surface-variant">
                  <MapPin className="w-3.5 h-3.5 opacity-40" />
                  {report.location_name || 'Unknown'}
                </div>
                <div className="col-span-2 flex items-center">
                  <div className={`px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-widest ${
                    mapStatus(report.status) === "Resolved" ? "bg-primary-fixed/20 text-on-primary-fixed-variant" :
                    mapStatus(report.status) === "In Progress" ? "bg-secondary-container/20 text-on-secondary-container" :
                    mapStatus(report.status) === "New" ? "bg-error/10 text-error" :
                    "bg-surface-container-highest text-on-surface-variant"
                  }`}>
                    {mapStatus(report.status)}
                  </div>
                </div>
                <div className="col-span-1 flex justify-end items-center">
                  <ChevronRight className="w-5 h-5 text-outline-variant group-hover:text-primary group-hover:translate-x-1 transition-all" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {filteredReports.length === 0 && (
          <div className="py-20 text-center space-y-4">
            <div className="w-20 h-20 bg-surface-container-low rounded-full flex items-center justify-center mx-auto">
              <Search className="w-10 h-10 text-on-surface-variant/20" />
            </div>
            <h3 className="font-headline font-bold text-lg text-on-surface">No reports found matching your criteria</h3>
            <button onClick={() => setActiveTab("All")} className="text-primary font-bold hover:underline">Clear all filters</button>
          </div>
        )}
      </main>
        </div>

      <BottomNav />
    </div>
  );
}
