import { Link } from 'react-router-dom';
import { 
  Bell, 
  Search, 
  Plus, 
  ArrowRight, 
  Clock, 
  CheckCircle2, 
  AlertCircle,
  LayoutGrid,
  History,
  User
} from 'lucide-react';
import { motion } from 'motion/react';
import LogoSilapor from '../../assets/LOGO_SILAPOR.png';

export default function UserHome() {

  const stats = [
    { label: 'Total Reports', value: '12', icon: <LayoutGrid className="w-5 h-5" />, color: 'bg-primary/10 text-primary' },
    { label: 'In Progress', value: '03', icon: <Clock className="w-5 h-5" />, color: 'bg-secondary-container/20 text-on-secondary-container' },
    { label: 'Resolved', value: '08', icon: <CheckCircle2 className="w-5 h-5" />, color: 'bg-primary-fixed/20 text-on-primary-fixed-variant' },
  ];

  const recentReports = [
    { id: 'RPT-8821', title: 'Broken AC in Room 302', status: 'In Progress', date: '2 hours ago', type: 'Facility' },
    { id: 'RPT-8819', title: 'Leaking Pipe - Library', status: 'Resolved', date: 'Yesterday', type: 'Plumbing' },
    { id: 'RPT-8815', title: 'Flickering Lights - Hallway B', status: 'Pending', date: '2 days ago', type: 'Electrical' },
  ];

  return (
    <div className="min-h-screen bg-surface pb-24">
      {/* Header */}
      <header className="sticky top-0 z-50 glass-header border-b border-outline-variant/10 px-6 py-4">
        <div className="max-w-5xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="relative w-12 h-12 flex items-center justify-center">
              <div className="absolute inset-0 bg-surface-container-low rounded-2xl shadow-lg shadow-primary/20"></div>
              <img src={LogoSilapor} alt="SILAPOR" className="relative w-8 h-8 object-contain" />
            </div>
            <div>
              <h1 className="font-headline font-extrabold text-lg text-on-surface leading-tight tracking-tight">SILAPOR</h1>
              <p className="font-body text-[10px] text-primary font-bold tracking-widest uppercase">Student Portal</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <Link to="/notifications" className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-surface-container-low transition-colors">
              <div className="relative">
                <Bell className="w-5 h-5 text-on-surface-variant" />
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-error rounded-full border border-surface"></span>
              </div>
            </Link>
            <Link to="/profile" className="w-10 h-10 rounded-full overflow-hidden border-2 border-primary/20 hover:border-primary transition-all">
              <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="Profile" className="w-full h-full object-cover" />
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 pt-8 space-y-8">
        {/* Welcome Section */}
        <section className="space-y-2">
          <h2 className="font-headline font-extrabold text-3xl text-on-surface tracking-tight">Welcome back, Felix!</h2>
          <p className="font-body text-on-surface-variant">How can we help you improve our campus today?</p>
        </section>

        {/* Quick Stats */}
        <section className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {stats.map((stat, idx) => (
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
                <span className="text-2xl font-headline font-extrabold text-on-surface">{stat.value}</span>
              </div>
              <p className="font-label text-sm font-semibold text-on-surface-variant">{stat.label}</p>
            </motion.div>
          ))}
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
              <h3 className="font-headline font-bold text-2xl text-white mb-2">Create New Report</h3>
              <p className="font-body text-white/80 text-sm max-w-[240px]">Found a broken facility? Report it now and we'll fix it ASAP.</p>
            </div>
            <div className="relative z-10 flex items-center gap-2 text-white font-label font-bold text-sm">
              Start Reporting <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          <div className="bg-surface-container-high p-8 rounded-[2rem] flex flex-col justify-between min-h-[220px]">
             <div className="flex justify-between items-start">
               <div className="w-14 h-14 bg-surface-container-highest rounded-2xl flex items-center justify-center">
                 <Search className="w-7 h-7 text-on-surface-variant" />
               </div>
               <div className="text-right">
                 <p className="text-[10px] font-bold text-primary tracking-widest uppercase mb-1">Live Status</p>
                 <div className="flex items-center gap-2 justify-end">
                   <span className="w-2 h-2 bg-primary rounded-full animate-pulse"></span>
                   <span className="text-xs font-bold text-on-surface">System Online</span>
                 </div>
               </div>
             </div>
             <div className="space-y-4">
               <h3 className="font-headline font-bold text-2xl text-on-surface">Track Facilities</h3>
               <div className="flex gap-2">
                 <div className="flex-1 h-10 bg-surface-container-lowest rounded-xl border border-outline-variant/20 flex items-center px-4">
                   <span className="text-xs text-on-surface-variant/50 font-medium">Search by Report ID...</span>
                 </div>
                 <button className="w-10 h-10 bg-on-surface text-surface rounded-xl flex items-center justify-center">
                   <ArrowRight className="w-5 h-5" />
                 </button>
               </div>
             </div>
          </div>
        </section>

        {/* Recent Reports */}
        <section className="space-y-4">
          <div className="flex justify-between items-end">
            <h3 className="font-headline font-bold text-xl text-on-surface">Recent Reports</h3>
            <Link to="/reports" className="font-label text-sm font-bold text-primary hover:underline">View All</Link>
          </div>
          
          <div className="space-y-3">
            {recentReports.map((report, idx) => (
              <Link 
                key={idx}
                to={`/report/${report.id}`}
                className="flex items-center gap-4 p-4 bg-surface-container-lowest rounded-2xl border border-outline-variant/10 hover:border-primary/30 transition-all group"
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                  report.status === 'Resolved' ? 'bg-primary-fixed/20 text-on-primary-fixed-variant' : 
                  report.status === 'In Progress' ? 'bg-secondary-container/20 text-on-secondary-container' : 
                  'bg-surface-container-highest text-on-surface-variant'
                }`}>
                  {report.status === 'Resolved' ? <CheckCircle2 className="w-6 h-6" /> : 
                   report.status === 'In Progress' ? <Clock className="w-6 h-6" /> : 
                   <AlertCircle className="w-6 h-6" />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start mb-0.5">
                    <h4 className="font-headline font-bold text-on-surface truncate pr-2">{report.title}</h4>
                    <span className="text-[10px] font-bold text-on-surface-variant/40 uppercase tracking-tighter whitespace-nowrap">{report.id}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-medium text-on-surface-variant/60">{report.type}</span>
                    <span className="w-1 h-1 bg-outline-variant rounded-full"></span>
                    <span className="text-xs font-medium text-on-surface-variant/60">{report.date}</span>
                  </div>
                </div>
                <ArrowRight className="w-5 h-5 text-outline-variant group-hover:text-primary transition-colors" />
              </Link>
            ))}
          </div>
        </section>
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-surface/80 backdrop-blur-2xl border-t border-outline-variant/10 px-4 py-3">
        <div className="max-w-md mx-auto flex justify-between items-center">
          <Link to="/home" className="w-[72px] flex flex-col items-center gap-1 text-primary py-1">
            <div className="p-1.5 rounded-xl bg-primary/10">
              <LayoutGrid className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-wider">Home</span>
          </Link>
          <Link to="/reports" className="w-[72px] flex flex-col items-center gap-1 text-on-surface-variant hover:text-primary transition-colors py-1">
            <History className="w-5 h-5" />
            <span className="text-[10px] font-bold uppercase tracking-wider">History</span>
          </Link>
          <div className="relative -top-6">
            <Link to="/report/new" className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center shadow-xl shadow-primary/30 text-white active:scale-90 transition-transform">
              <Plus className="w-6 h-6" />
            </Link>
          </div>
          <Link to="/notifications" className="w-[72px] flex flex-col items-center gap-1 text-on-surface-variant hover:text-primary transition-colors py-1">
            <div className="relative">
              <Bell className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-error rounded-full border border-surface"></span>
            </div>
            <span className="text-[10px] font-bold uppercase tracking-wider">Notification</span>
          </Link>
          <Link to="/profile" className="w-[72px] flex flex-col items-center gap-1 text-on-surface-variant hover:text-primary transition-colors py-1">
            <User className="w-5 h-5" />
            <span className="text-[10px] font-bold uppercase tracking-wider">Profile</span>
          </Link>
        </div>
      </nav>
    </div>
  );
}
