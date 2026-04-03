import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  MapPin,
  Clock,
  CheckCircle2,
  AlertCircle,
  Share2,
  MoreVertical,
  Calendar,
  User,
  Send,
} from "lucide-react";

export default function ReportDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [messageInput, setMessageInput] = useState("");

  const report = {
    id: id || "RPT-8821",
    title: "Broken AC in Room 302",
    status: "In Progress",
    date: "Mar 24, 2026",
    time: "14:30",
    type: "Facility Maintenance",
    location: "Building C, 3rd Floor, Room 302",
    description:
      "The air conditioner in room 302 is making a loud grinding noise and is not cooling properly. It has been like this since this morning.",
    images: [
      "https://picsum.photos/seed/ac1/800/600",
      "https://picsum.photos/seed/ac2/800/600",
    ],
    timeline: [
      { status: "Report Submitted", date: "Mar 24, 2026", time: "14:30", description: "Report successfully submitted by Felix.", icon: <CheckCircle2 className="w-4 h-4" />, active: true },
      { status: "Under Review", date: "Mar 24, 2026", time: "15:45", description: "Staff is reviewing the report.", icon: <Clock className="w-4 h-4" />, active: true },
      { status: "Technician Assigned", date: "Mar 25, 2026", time: "09:00", description: "Technician Budi has been assigned to fix the issue.", icon: <User className="w-4 h-4" />, active: true },
      { status: "In Progress", date: "Mar 25, 2026", time: "10:30", description: "Repair is currently being performed.", icon: <Clock className="w-4 h-4" />, active: true },
      { status: "Resolved", date: "-", time: "-", description: "Issue has been fixed and verified.", icon: <CheckCircle2 className="w-4 h-4" />, active: false },
    ],
  };

  return (
    <div className="min-h-screen bg-surface pb-12">
      <header className="sticky top-0 z-50 glass-header border-b border-outline-variant/10 px-6 py-4">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate(-1)} className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-surface-container-low transition-colors">
              <ArrowLeft className="w-6 h-6 text-on-surface" />
            </button>
            <div className="space-y-0.5">
              <h1 className="font-headline font-bold text-lg text-on-surface">Report Details</h1>
              <p className="text-[10px] font-extrabold text-primary tracking-widest uppercase">{report.id}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-surface-container-low transition-colors">
              <Share2 className="w-5 h-5 text-on-surface-variant" />
            </button>
            <button className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-surface-container-low transition-colors">
              <MoreVertical className="w-5 h-5 text-on-surface-variant" />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 pt-6 space-y-8">
        <div className={`p-6 rounded-[2rem] flex items-center justify-between ${
          report.status === "Resolved" ? "bg-primary-fixed/20 text-on-primary-fixed-variant" :
          report.status === "In Progress" ? "bg-secondary-container/20 text-on-secondary-container" :
          "bg-surface-container-highest text-on-surface-variant"
        }`}>
          <div className="space-y-1">
            <p className="text-[10px] font-bold uppercase tracking-widest opacity-60">Current Status</p>
            <h2 className="font-headline font-extrabold text-2xl tracking-tight">{report.status}</h2>
          </div>
          <div className="w-14 h-14 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center">
            {report.status === "Resolved" ? <CheckCircle2 className="w-8 h-8" /> :
             report.status === "In Progress" ? <Clock className="w-8 h-8" /> :
             <AlertCircle className="w-8 h-8" />}
          </div>
        </div>

        <section className="space-y-6">
          <div className="space-y-2">
            <h3 className="font-headline font-bold text-2xl text-on-surface tracking-tight">{report.title}</h3>
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center gap-2 text-xs font-bold text-on-surface-variant/60 uppercase tracking-widest">
                <Calendar className="w-4 h-4" />
                {report.date} • {report.time}
              </div>
              <div className="flex items-center gap-2 text-xs font-bold text-on-surface-variant/60 uppercase tracking-widest">
                <MapPin className="w-4 h-4" />
                {report.location}
              </div>
            </div>
          </div>

          <div className="p-6 bg-surface-container-lowest rounded-2xl border border-outline-variant/10 shadow-sm space-y-4">
            <h4 className="font-headline font-bold text-on-surface">Description</h4>
            <p className="font-body text-sm text-on-surface-variant leading-relaxed">
              {report.description}
            </p>
          </div>

          <div className="space-y-4">
            <h4 className="font-headline font-bold text-on-surface">Evidence Photos</h4>
            <div className="grid grid-cols-2 gap-3">
              {report.images.map((img, idx) => (
                <div key={idx} className="aspect-video rounded-2xl overflow-hidden border border-outline-variant/10 shadow-sm">
                  <img src={img} alt="Evidence" className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="space-y-6">
          <h4 className="font-headline font-bold text-xl text-on-surface">Tracking History</h4>
          <div className="space-y-0 relative">
            <div className="absolute left-[19px] top-4 bottom-4 w-0.5 bg-outline-variant/20"></div>
            {report.timeline.map((item, idx) => (
              <div key={idx} className={`flex gap-6 pb-8 last:pb-0 relative ${!item.active ? "opacity-40" : ""}`}>
                <div className={`relative z-10 w-10 h-10 rounded-full flex items-center justify-center shadow-sm ${
                  item.active ? "bg-primary text-white" : "bg-surface-container-highest text-on-surface-variant"
                }`}>
                  {item.icon}
                </div>
                <div className="flex-1 pt-1">
                  <div className="flex justify-between items-start mb-1">
                    <h5 className="font-headline font-bold text-on-surface">{item.status}</h5>
                    <span className="text-[10px] font-bold text-on-surface-variant/60 uppercase tracking-widest">{item.date} • {item.time}</span>
                  </div>
                  <p className="font-body text-xs text-on-surface-variant leading-relaxed">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="space-y-4">
          <div className="flex justify-between items-center">
            <h4 className="font-headline font-bold text-xl text-on-surface">Discussion</h4>
            <span className="text-xs font-bold text-primary uppercase tracking-widest">2 Messages</span>
          </div>

          <div className="space-y-4">
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-surface-container-highest flex-shrink-0">
                <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Staff" alt="Staff" className="w-full h-full object-cover" />
              </div>
              <div className="bg-surface-container-low p-4 rounded-2xl rounded-tl-none space-y-1 max-w-[80%]">
                <p className="text-[10px] font-bold text-primary uppercase tracking-widest">Staff Admin</p>
                <p className="font-body text-sm text-on-surface-variant">Hello Felix, we have assigned a technician to look at the AC. They should be there within the hour.</p>
              </div>
            </div>

            <div className="flex gap-3 flex-row-reverse">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex-shrink-0">
                <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="User" className="w-full h-full object-cover" />
              </div>
              <div className="bg-primary p-4 rounded-2xl rounded-tr-none space-y-1 max-w-[80%]">
                <p className="text-[10px] font-bold text-white/60 uppercase tracking-widest">You</p>
                <p className="font-body text-sm text-white">Thank you for the quick response! I'll be in the room waiting.</p>
              </div>
            </div>
          </div>

          <div className="pt-4">
            <div className="flex gap-2">
              <div className="flex-1 h-12 bg-surface-container-lowest rounded-xl border border-outline-variant/20 flex items-center px-4">
                <input
                  type="text"
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  placeholder="Type a message..."
                  className="w-full bg-transparent outline-none font-body text-sm text-on-surface placeholder:text-on-surface-variant/40"
                />
              </div>
              <button className="w-12 h-12 bg-primary text-white rounded-xl flex items-center justify-center shadow-lg shadow-primary/10 active:scale-90 transition-transform">
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
        </section>

        <div className="pt-8 border-t border-outline-variant/10">
          <button className="w-full py-4 bg-surface-container-highest text-on-surface-variant font-headline font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-surface-container-highest/80 transition-all">
            <AlertCircle className="w-5 h-5" />
            Report an Issue with this Ticket
          </button>
        </div>
      </main>
    </div>
  );
}
