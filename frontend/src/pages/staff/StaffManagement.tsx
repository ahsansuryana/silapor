import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Search,
  UserPlus,
  MoreVertical,
  Mail,
  Phone,
} from "lucide-react";
import { motion } from "motion/react";
import LogoSilapor from "../../assets/LOGO_SILAPOR.png";

export default function StaffManagement() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("All");

  const tabs = ["All", "Admin", "Staff", "Technician"];

  const staff = [
    { id: "STF-001", name: "Ani Wijaya", role: "Admin", email: "ani.w@university.ac.id", status: "Active", phone: "+62 812-3456-7890" },
    { id: "STF-002", name: "Budi Santoso", role: "Technician", email: "budi.s@university.ac.id", status: "Active", phone: "+62 812-3456-7891" },
    { id: "STF-003", name: "Citra Lestari", role: "Staff", email: "citra.l@university.ac.id", status: "On Leave", phone: "+62 812-3456-7892" },
    { id: "STF-004", name: "Dedi Kurniawan", role: "Technician", email: "dedi.k@university.ac.id", status: "Active", phone: "+62 812-3456-7893" },
    { id: "STF-005", name: "Eka Putri", role: "Admin", email: "eka.p@university.ac.id", status: "Inactive", phone: "+62 812-3456-7894" },
  ];

  const filteredStaff = activeTab === "All"
    ? staff
    : staff.filter(s => s.role === activeTab);

  return (
    <div className="min-h-screen bg-surface">
      <header className="sticky top-0 z-50 glass-header border-b border-outline-variant/10 px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate("/staff")} className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-surface-container-low transition-colors">
              <ArrowLeft className="w-6 h-6 text-on-surface" />
            </button>
            <div className="relative w-10 h-10 flex items-center justify-center">
              <div className="absolute inset-0 bg-surface-container-low rounded-xl shadow-sm"></div>
              <img src={LogoSilapor} alt="SILAPOR" className="relative w-6 h-6 object-contain" />
            </div>
            <h1 className="font-headline font-bold text-xl text-on-surface">Staff Management</h1>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-xl text-sm font-bold shadow-lg shadow-primary/20 hover:opacity-90 transition-all">
            <UserPlus className="w-4 h-4" />
            Add Member
          </button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 pt-6 pb-12 space-y-6">
        <section className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-surface-container-lowest p-6 rounded-3xl border border-outline-variant/10 shadow-sm">
            <p className="text-3xl font-headline font-extrabold text-on-surface leading-none mb-1">24</p>
            <p className="font-label text-xs font-bold text-on-surface-variant uppercase tracking-widest">Total Staff</p>
          </div>
          <div className="bg-surface-container-lowest p-6 rounded-3xl border border-outline-variant/10 shadow-sm">
            <p className="text-3xl font-headline font-extrabold text-primary leading-none mb-1">18</p>
            <p className="font-label text-xs font-bold text-on-surface-variant uppercase tracking-widest">Currently Active</p>
          </div>
          <div className="bg-surface-container-lowest p-6 rounded-3xl border border-outline-variant/10 shadow-sm">
            <p className="text-3xl font-headline font-extrabold text-secondary-container leading-none mb-1">06</p>
            <p className="font-label text-xs font-bold text-on-surface-variant uppercase tracking-widest">On Leave / Inactive</p>
          </div>
        </section>

        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="w-5 h-5 text-on-surface-variant/40 group-focus-within:text-primary transition-colors" />
            </div>
            <input
              type="text"
              placeholder="Search staff by name, email, or ID..."
              className="w-full pl-12 pr-4 py-3.5 bg-surface-container-lowest border border-outline-variant/10 rounded-2xl font-body text-sm text-on-surface focus:ring-2 focus:ring-primary outline-none transition-all"
            />
          </div>
          <div className="flex gap-2">
            {tabs.map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-3.5 rounded-2xl font-label text-sm font-bold whitespace-nowrap transition-all ${
                  activeTab === tab
                    ? "bg-on-surface text-surface shadow-lg"
                    : "bg-surface-container-lowest border border-outline-variant/10 text-on-surface-variant hover:bg-surface-container-low"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredStaff.map((member, idx) => (
            <motion.div
              key={member.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="bg-surface-container-lowest p-6 rounded-[2rem] border border-outline-variant/10 shadow-sm hover:border-primary/30 transition-all group relative"
            >
              <button className="absolute top-6 right-6 w-8 h-8 rounded-full flex items-center justify-center hover:bg-surface-container-low transition-colors">
                <MoreVertical className="w-5 h-5 text-on-surface-variant" />
              </button>

              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 rounded-2xl bg-surface-container-highest overflow-hidden border-2 border-outline-variant/10">
                  <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${member.name}`} alt={member.name} className="w-full h-full object-cover" />
                </div>
                <div className="space-y-1">
                  <h3 className="font-headline font-bold text-lg text-on-surface group-hover:text-primary transition-colors">{member.name}</h3>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold text-on-surface-variant/40 uppercase tracking-widest">{member.id}</span>
                    <span className="w-1 h-1 bg-outline-variant/30 rounded-full"></span>
                    <span className={`text-[10px] font-extrabold uppercase tracking-widest ${
                      member.role === "Admin" ? "text-primary" :
                      member.role === "Technician" ? "text-on-secondary-container" :
                      "text-on-tertiary-container"
                    }`}>{member.role}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3 pt-4 border-t border-outline-variant/5">
                <div className="flex items-center gap-3 text-xs text-on-surface-variant font-medium">
                  <Mail className="w-4 h-4 opacity-40" />
                  {member.email}
                </div>
                <div className="flex items-center gap-3 text-xs text-on-surface-variant font-medium">
                  <Phone className="w-4 h-4 opacity-40" />
                  {member.phone}
                </div>
                <div className="flex items-center justify-between pt-2">
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${
                      member.status === "Active" ? "bg-primary" :
                      member.status === "On Leave" ? "bg-secondary-container" :
                      "bg-error"
                    }`}></div>
                    <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">{member.status}</span>
                  </div>
                  <button className="text-[10px] font-extrabold text-primary uppercase tracking-widest hover:underline">Edit Profile</button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </main>
    </div>
  );
}
