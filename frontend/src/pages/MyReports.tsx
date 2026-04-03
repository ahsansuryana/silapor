import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  Search,
  Filter,
  ChevronRight,
  Calendar,
  AlertCircle,
} from "lucide-react";
import { motion } from "motion/react";
import ScreenHeader from "../components/ui/ScreenHeader";
import TabSelector from "../components/ui/TabSelector";
import StatusBadge from "../components/ui/StatusBadge";
import BottomNav from "../components/layout/BottomNav";

export default function MyReports() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("All");

  const tabs = ["All", "Pending", "In Progress", "Resolved"];

  const reports = [
    {
      id: "RPT-8821",
      title: "Broken AC in Room 302",
      status: "In Progress",
      date: "Mar 24, 2026",
      type: "Facility",
      location: "Building C",
    },
    {
      id: "RPT-8819",
      title: "Leaking Pipe - Library",
      status: "Resolved",
      date: "Mar 22, 2026",
      type: "Plumbing",
      location: "Central Library",
    },
    {
      id: "RPT-8815",
      title: "Flickering Lights - Hallway B",
      status: "Pending",
      date: "Mar 20, 2026",
      type: "Electrical",
      location: "Building A",
    },
    {
      id: "RPT-8798",
      title: "WiFi Connection Issues",
      status: "Resolved",
      date: "Mar 15, 2026",
      type: "IT",
      location: "Student Lounge",
    },
    {
      id: "RPT-8750",
      title: "Broken Chair in Auditorium",
      status: "Resolved",
      date: "Mar 10, 2026",
      type: "Furniture",
      location: "Main Auditorium",
    },
  ];

  const filteredReports =
    activeTab === "All"
      ? reports
      : reports.filter((r) => r.status === activeTab);

  return (
    <div className="min-h-screen bg-surface">
      <ScreenHeader
        title="My Reports"
        onBack={() => navigate("/home")}
        rightActions={
          <button className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-surface-container-low transition-colors">
            <Search className="w-5 h-5 text-on-surface-variant" />
          </button>
        }
      />

      <main className="max-w-3xl mx-auto px-6 pt-6 pb-12 space-y-6">
        <TabSelector
          options={tabs}
          active={activeTab}
          onChange={setActiveTab}
        />

        <div className="flex justify-between items-center">
          <p className="text-xs font-bold text-on-surface-variant/60 uppercase tracking-widest">
            Showing {filteredReports.length} Reports
          </p>
          <button className="flex items-center gap-2 px-3 py-1.5 bg-surface-container-low rounded-lg text-xs font-bold text-on-surface-variant">
            <Filter className="w-3.5 h-3.5" />
            Sort by Date
          </button>
        </div>

        <div className="space-y-4">
          {filteredReports.map((report, idx) => (
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
                      <span className="text-[10px] font-extrabold text-primary tracking-widest uppercase">
                        {report.id}
                      </span>
                      <span className="w-1 h-1 bg-outline-variant rounded-full"></span>
                      <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">
                        {report.type}
                      </span>
                    </div>
                    <h3 className="font-headline font-bold text-lg text-on-surface group-hover:text-primary transition-colors">
                      {report.title}
                    </h3>
                  </div>
                  <StatusBadge>{report.status}</StatusBadge>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-outline-variant/10">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1.5 text-xs text-on-surface-variant/60 font-medium">
                      <Calendar className="w-3.5 h-3.5" />
                      {report.date}
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-on-surface-variant/60 font-medium">
                      <AlertCircle className="w-3.5 h-3.5" />
                      {report.location}
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-outline-variant group-hover:text-primary group-hover:translate-x-1 transition-all" />
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {filteredReports.length === 0 && (
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

      <BottomNav />
    </div>
  );
}
