import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Megaphone,
  Users,
  Send,
  Info,
  History,
  ChevronRight,
} from "lucide-react";

export default function Broadcast() {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [target, setTarget] = useState("All Students");
  const [isSending, setIsSending] = useState(false);

  const targets = ["All Students", "All Staff", "Building A Residents", "Building B Residents", "Building C Residents", "Faculty Members"];

  const pastBroadcasts = [
    { id: "BC-001", title: "Water Maintenance Notice", target: "Building C", date: "Today, 09:00", status: "Delivered" },
    { id: "BC-002", title: "New Facility Reporting System", target: "All Students", date: "Yesterday, 14:30", status: "Delivered" },
    { id: "BC-003", title: "Library Closing Early", target: "All Students", date: "Mar 24, 2026", status: "Delivered" },
  ];

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSending(true);
    setTimeout(() => {
      setIsSending(false);
      setTitle("");
      setMessage("");
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-surface pb-12">
      <header className="sticky top-0 z-50 glass-header border-b border-outline-variant/10 px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate("/staff")} className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-surface-container-low transition-colors">
              <ArrowLeft className="w-6 h-6 text-on-surface" />
            </button>
            <h1 className="font-headline font-bold text-xl text-on-surface">Broadcast Notification</h1>
          </div>
          <button className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-surface-container-low transition-colors">
            <History className="w-5 h-5 text-on-surface-variant" />
          </button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 pt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        <section className="lg:col-span-2 space-y-6">
          <div className="bg-surface-container-lowest p-8 rounded-[2.5rem] border border-outline-variant/10 shadow-sm space-y-8">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center">
                <Megaphone className="w-7 h-7 text-primary" />
              </div>
              <div className="space-y-1">
                <h2 className="font-headline font-bold text-xl text-on-surface">Compose Broadcast</h2>
                <p className="text-xs text-on-surface-variant">Send real-time notifications to campus members.</p>
              </div>
            </div>

            <form onSubmit={handleSend} className="space-y-6">
              <div className="space-y-1.5">
                <label className="font-label text-sm font-bold text-on-surface-variant ml-1">Target Audience</label>
                <div className="flex flex-wrap gap-2">
                  {targets.map(t => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setTarget(t)}
                      className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                        target === t
                          ? "bg-primary text-white shadow-md"
                          : "bg-surface-container-low text-on-surface-variant hover:bg-surface-container-high"
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="font-label text-sm font-bold text-on-surface-variant ml-1">Broadcast Title</label>
                <input
                  required
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Emergency Maintenance Notice"
                  className="w-full bg-surface-container-low border-0 rounded-2xl px-5 py-4 font-body text-on-surface focus:ring-2 focus:ring-primary outline-none transition-all"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-label text-sm font-bold text-on-surface-variant ml-1">Message Content</label>
                <textarea
                  required
                  rows={6}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Type your message here..."
                  className="w-full bg-surface-container-low border-0 rounded-2xl px-5 py-4 font-body text-on-surface focus:ring-2 focus:ring-primary outline-none transition-all resize-none"
                ></textarea>
              </div>

              <div className="p-4 bg-surface-container-low rounded-2xl flex items-start gap-3">
                <Info className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <p className="text-[11px] text-on-surface-variant leading-relaxed">
                  This message will be sent as a push notification and will appear in the recipient's notification center. Please ensure all information is accurate.
                </p>
              </div>

              <button
                disabled={isSending || !title || !message}
                className="w-full py-5 bg-primary text-white font-headline font-bold rounded-2xl shadow-xl shadow-primary/20 hover:shadow-primary/30 active:scale-[0.98] transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:pointer-events-none"
              >
                {isSending ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Sending Broadcast...
                  </>
                ) : (
                  <>
                    Send Broadcast Now
                    <Send className="w-5 h-5" />
                  </>
                )}
              </button>
            </form>
          </div>
        </section>

        <section className="space-y-6">
          <div className="flex justify-between items-end">
            <h3 className="font-headline font-bold text-lg text-on-surface">Recent History</h3>
            <button className="text-xs font-bold text-primary hover:underline">Clear</button>
          </div>

          <div className="space-y-4">
            {pastBroadcasts.map((bc, idx) => (
              <div key={idx} className="bg-surface-container-lowest p-5 rounded-3xl border border-outline-variant/10 shadow-sm space-y-3 group">
                <div className="flex justify-between items-start">
                  <div className="space-y-0.5">
                    <h4 className="font-headline font-bold text-on-surface group-hover:text-primary transition-colors">{bc.title}</h4>
                    <p className="text-[10px] font-bold text-on-surface-variant/60 uppercase tracking-widest">To: {bc.target}</p>
                  </div>
                  <div className="px-2 py-1 bg-primary-fixed/20 text-on-primary-fixed-variant rounded-lg text-[10px] font-bold uppercase tracking-widest">
                    {bc.status}
                  </div>
                </div>
                <div className="flex items-center justify-between pt-3 border-t border-outline-variant/5">
                  <span className="text-[10px] font-bold text-on-surface-variant/40 uppercase tracking-widest">{bc.date}</span>
                  <button className="text-[10px] font-extrabold text-primary uppercase tracking-widest flex items-center gap-1 hover:underline">
                    Details
                    <ChevronRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-surface-container-high p-6 rounded-3xl text-center space-y-2">
            <Users className="w-8 h-8 text-on-surface-variant/20 mx-auto" />
            <p className="text-xs font-bold text-on-surface-variant">Total Audience Reach</p>
            <p className="text-2xl font-headline font-extrabold text-on-surface">12,482</p>
            <p className="text-[10px] text-on-surface-variant/60 uppercase tracking-widest font-medium">Active Users Across Campus</p>
          </div>
        </section>
      </main>
    </div>
  );
}
