import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  Building2,
  Plus,
  MoreVertical,
  ChevronRight,
  Settings2,
  Clock,
} from "lucide-react";
import { motion } from "motion/react";
import ScreenHeader from "../../components/ui/ScreenHeader";
import TabSelector from "../../components/ui/TabSelector";
import StatusBadge from "../../components/ui/StatusBadge";

export default function FacilityManagement() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("All");

  const tabs = [
    "All",
    "Building A",
    "Building B",
    "Building C",
    "Library",
    "Sports Center",
  ];

  const facilities = [
    {
      id: "FAC-001",
      name: "Room 302 - AC Unit",
      location: "Building C",
      status: "Maintenance",
      lastChecked: "2 days ago",
      condition: "Fair",
    },
    {
      id: "FAC-002",
      name: "Main Elevator",
      location: "Building A",
      status: "Operational",
      lastChecked: "Today",
      condition: "Good",
    },
    {
      id: "FAC-003",
      name: "Library WiFi Router",
      location: "Central Library",
      status: "Operational",
      lastChecked: "Yesterday",
      condition: "Excellent",
    },
    {
      id: "FAC-004",
      name: "Basketball Court Lights",
      location: "Sports Center",
      status: "Broken",
      lastChecked: "3 days ago",
      condition: "Poor",
    },
    {
      id: "FAC-005",
      name: "Auditorium Sound System",
      location: "Building B",
      status: "Operational",
      lastChecked: "1 week ago",
      condition: "Good",
    },
  ];

  const filteredFacilities =
    activeTab === "All"
      ? facilities
      : facilities.filter((f) => f.location === activeTab);

  return (
    <div className="min-h-screen bg-surface">
      <ScreenHeader
        title="Facility Management"
        onBack={() => navigate("/staff")}
        rightActions={
          <button className="flex items-center gap-2 px-4 py-2 bg-on-surface text-surface rounded-xl text-sm font-bold shadow-lg hover:opacity-90 transition-all">
            <Plus className="w-4 h-4" />
            New Facility
          </button>
        }
      />

      <main className="max-w-6xl mx-auto px-6 pt-6 pb-12 space-y-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="w-5 h-5 text-on-surface-variant/40 group-focus-within:text-primary transition-colors" />
            </div>
            <input
              type="text"
              placeholder="Search facilities by name, ID, or location..."
              className="w-full pl-12 pr-4 py-3.5 bg-surface-container-lowest border border-outline-variant/10 rounded-2xl font-body text-sm text-on-surface focus:ring-2 focus:ring-primary outline-none transition-all"
            />
          </div>
          <div className="flex gap-2">
            <button className="flex items-center gap-2 px-6 py-3.5 bg-surface-container-lowest border border-outline-variant/10 rounded-2xl text-sm font-bold text-on-surface-variant hover:bg-surface-container-low transition-all">
              <Settings2 className="w-4 h-4" />
              Manage Types
            </button>
          </div>
        </div>

        <TabSelector
          options={tabs}
          active={activeTab}
          onChange={setActiveTab}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredFacilities.map((facility, idx) => (
            <motion.div
              key={facility.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="bg-surface-container-lowest p-6 rounded-[2rem] border border-outline-variant/10 shadow-sm hover:border-primary/30 transition-all group relative"
            >
              <button className="absolute top-6 right-6 w-8 h-8 rounded-full flex items-center justify-center hover:bg-surface-container-low transition-colors">
                <MoreVertical className="w-5 h-5 text-on-surface-variant" />
              </button>

              <div className="flex items-center gap-4 mb-6">
                <div
                  className={`w-14 h-14 rounded-2xl flex items-center justify-center ${
                    facility.status === "Operational"
                      ? "bg-primary/10 text-primary"
                      : facility.status === "Maintenance"
                        ? "bg-secondary-container/20 text-on-secondary-container"
                        : "bg-error/10 text-error"
                  }`}
                >
                  <Building2 className="w-7 h-7" />
                </div>
                <div className="space-y-1">
                  <h3 className="font-headline font-bold text-lg text-on-surface group-hover:text-primary transition-colors">
                    {facility.name}
                  </h3>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold text-on-surface-variant/40 uppercase tracking-widest">
                      {facility.id}
                    </span>
                    <span className="w-1 h-1 bg-outline-variant/30 rounded-full"></span>
                    <span className="text-[10px] font-bold text-on-surface-variant/40 uppercase tracking-widest">
                      {facility.location}
                    </span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-outline-variant/5">
                <div className="space-y-1">
                  <p className="text-[10px] font-bold text-on-surface-variant/40 uppercase tracking-widest">
                    Status
                  </p>
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-2 h-2 rounded-full ${
                        facility.status === "Operational"
                          ? "bg-primary"
                          : facility.status === "Maintenance"
                            ? "bg-secondary-container"
                            : "bg-error"
                      }`}
                    ></div>
                    <StatusBadge>{facility.status}</StatusBadge>
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-bold text-on-surface-variant/40 uppercase tracking-widest">
                    Condition
                  </p>
                  <StatusBadge variant="condition">
                    {facility.condition}
                  </StatusBadge>
                </div>
              </div>

              <div className="mt-6 flex items-center justify-between pt-4 border-t border-outline-variant/5">
                <div className="flex items-center gap-1.5 text-[10px] font-bold text-on-surface-variant/60 uppercase tracking-widest">
                  <Clock className="w-3.5 h-3.5" />
                  Checked {facility.lastChecked}
                </div>
                <button className="flex items-center gap-1 text-[10px] font-extrabold text-primary uppercase tracking-widest hover:underline">
                  View Logs
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </main>
    </div>
  );
}
