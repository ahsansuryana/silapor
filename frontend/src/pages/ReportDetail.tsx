import { useState, useEffect } from "react";
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
  XCircle,
  PlayCircle,
  Loader2,
} from "lucide-react";
import api from "../lib/api";
import LogoSilapor from "../assets/LOGO_SILAPOR.png";

interface Report {
  id: string;
  title: string;
  description: string;
  status: string;
  category_name: string;
  location_name: string;
  created_at: string;
  images: { id: string; url: string }[];
}

interface StatusHistory {
  id: string;
  old_status: string;
  new_status: string;
  change_by_name: string;
  notes: string | null;
  created_at: string;
}

export default function ReportDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [report, setReport] = useState<Report | null>(null);
  const [history, setHistory] = useState<StatusHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [user, setUser] = useState<{ role: string; id: string; name: string } | null>(null);

  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      setUser(JSON.parse(userStr));
    }
    fetchReport();
    fetchHistory();
  }, [id]);

  const fetchReport = async () => {
    try {
      const { data } = await api.get(`/reports/${id}`);
      setReport(data);
    } catch (err) {
      console.error('Failed to fetch report:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchHistory = async () => {
    try {
      const { data } = await api.get(`/reports/${id}/history`);
      setHistory(data);
    } catch (err) {
      console.error('Failed to fetch history:', err);
    }
  };

  const handleStatusUpdate = async (newStatus: string) => {
    if (!report) return;
    setUpdatingStatus(true);
    try {
      await api.patch(`/reports/${report.id}/status`, { status: newStatus });
      await fetchReport();
      await fetchHistory();
    } catch (err) {
      console.error('Failed to update status:', err);
    } finally {
      setUpdatingStatus(false);
    }
  };

  const isStaff = user?.role === 'STAFF' || user?.role === 'ADMIN';

  const mapStatus = (status: string) => {
    switch (status) {
      case 'menunggu': return 'Pending';
      case 'diproses': return 'In Progress';
      case 'selesai': return 'Resolved';
      case 'diterima': return 'Accepted';
      case 'ditolak': return 'Rejected';
      case 'Pending': return 'Pending';
      case 'In Progress': return 'In Progress';
      case 'Resolved': return 'Resolved';
      case 'Accepted': return 'Accepted';
      case 'Rejected': return 'Rejected';
      default: return status;
    }
  };

  const getStatusIcon = (status: string) => {
    const s = status?.toLowerCase();
    if (s === 'selesai' || s === 'resolved') return <CheckCircle2 className="w-4 h-4" />;
    if (s === 'diproses' || s === 'in progress') return <Clock className="w-4 h-4" />;
    return <AlertCircle className="w-4 h-4" />;
  };

  const getActionButtons = () => {
    if (!report || !isStaff) return null;
    const status = report.status?.toLowerCase();
    
    if (status === 'menunggu') {
      return (
        <button
          onClick={() => handleStatusUpdate('diterima')}
          disabled={updatingStatus}
          className="flex-1 py-3 bg-blue-600 text-white font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-blue-700 disabled:opacity-50"
        >
          {updatingStatus ? <Loader2 className="w-5 h-5 animate-spin" /> : <CheckCircle2 className="w-5 h-5" />}
          Accept Report
        </button>
      );
    }
    
    if (status === 'diterima') {
      return (
        <button
          onClick={() => handleStatusUpdate('diproses')}
          disabled={updatingStatus}
          className="flex-1 py-3 bg-yellow-600 text-white font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-yellow-700 disabled:opacity-50"
        >
          {updatingStatus ? <Loader2 className="w-5 h-5 animate-spin" /> : <PlayCircle className="w-5 h-5" />}
          Start Processing
        </button>
      );
    }
    
    if (status === 'diproses') {
      return (
        <button
          onClick={() => handleStatusUpdate('selesai')}
          disabled={updatingStatus}
          className="flex-1 py-3 bg-green-600 text-white font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-green-700 disabled:opacity-50"
        >
          {updatingStatus ? <Loader2 className="w-5 h-5 animate-spin" /> : <CheckCircle2 className="w-5 h-5" />}
          Mark as Resolved
        </button>
      );
    }
    
    return null;
  };

  const getStatusClass = (status: string) => {
    const s = status?.toLowerCase();
    if (s === 'selesai' || s === 'resolved') return 'bg-primary-fixed/20 text-on-primary-fixed-variant';
    if (s === 'diproses' || s === 'in progress') return 'bg-secondary-container/20 text-on-secondary-container';
    return 'bg-surface-container-highest text-on-surface-variant';
  };

  return (
    <div className="min-h-screen bg-surface pb-12">
      <header className="sticky top-0 z-50 glass-header border-b border-outline-variant/10 px-6 py-4">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate(-1)} className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-surface-container-low transition-colors">
              <ArrowLeft className="w-6 h-6 text-on-surface" />
            </button>
            <div className="relative w-10 h-10 flex items-center justify-center">
              <div className="absolute inset-0 bg-surface-container-low rounded-xl shadow-sm"></div>
              <img src={LogoSilapor} alt="SILAPOR" className="relative w-6 h-6 object-contain" />
            </div>
            <div className="space-y-0.5">
              <h1 className="font-headline font-bold text-lg text-on-surface">Report Details</h1>
              <p className="text-[10px] font-extrabold text-primary tracking-widest uppercase">
                {loading ? 'LOADING...' : (report?.title || '').toUpperCase()}
              </p>
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
        <div className={`p-6 rounded-[2rem] flex items-center justify-between ${getStatusClass(report?.status || '')}`}>
          <div className="space-y-1">
            <p className="text-[10px] font-bold uppercase tracking-widest opacity-60">Current Status</p>
            <h2 className="font-headline font-extrabold text-2xl tracking-tight">{report ? mapStatus(report.status) : 'Loading...'}</h2>
          </div>
          <div className="w-14 h-14 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center">
            {report?.status ? getStatusIcon(report.status) : <AlertCircle className="w-8 h-8" />}
          </div>
        </div>

        {isStaff && getActionButtons() && (
          <div className="flex gap-2">
            {getActionButtons()}
            {(report?.status === 'diterima' || report?.status === 'diproses') && (
              <button
                onClick={() => handleStatusUpdate('ditolak')}
                disabled={updatingStatus}
                className="flex-1 py-3 bg-red-600 text-white font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-red-700 disabled:opacity-50"
              >
                {updatingStatus ? <Loader2 className="w-5 h-5 animate-spin" /> : <XCircle className="w-5 h-5" />}
                Reject
              </button>
            )}
          </div>
        )}

        <section className="space-y-6">
          <div className="space-y-2">
            <h3 className="font-headline font-bold text-2xl text-on-surface tracking-tight">{report?.title || 'Loading...'}</h3>
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center gap-2 text-xs font-bold text-on-surface-variant/60 uppercase tracking-widest">
                <Calendar className="w-4 h-4" />
                {report ? new Date(report.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '-'}
              </div>
              <div className="flex items-center gap-2 text-xs font-bold text-on-surface-variant/60 uppercase tracking-widest">
                <MapPin className="w-4 h-4" />
                {report?.location_name || '-'}
              </div>
            </div>
          </div>

          <div className="p-6 bg-surface-container-lowest rounded-2xl border border-outline-variant/10 shadow-sm space-y-4">
            <h4 className="font-headline font-bold text-on-surface">Description</h4>
            <p className="font-body text-sm text-on-surface-variant leading-relaxed">
              {report?.description || '-'}
            </p>
          </div>

          <div className="space-y-4">
            <h4 className="font-headline font-bold text-on-surface">Evidence Photos</h4>
            <div className="grid grid-cols-2 gap-3">
              {report?.images?.length ? report.images.map((img: { id: string; url: string }, idx: number) => (
                <div key={idx} className="aspect-video rounded-2xl overflow-hidden border border-outline-variant/10 shadow-sm">
                  <img src={img.url} alt="Evidence" className="w-full h-full object-cover" />
                </div>
              )) : (
                <p className="col-span-2 text-sm text-on-surface-variant">No images</p>
              )}
            </div>
          </div>
        </section>

        <section className="space-y-6">
          <h4 className="font-headline font-bold text-xl text-on-surface">Tracking History</h4>
          {loading ? (
            <p className="text-on-surface-variant">Loading history...</p>
          ) : history.length > 0 ? (
            <div className="space-y-3">
              {history.map((item) => (
                <div key={item.id} className="flex gap-3 p-4 bg-surface-container-lowest rounded-xl">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    {item.new_status === 'selesai' ? <CheckCircle2 className="w-4 h-4 text-green-600" /> :
                     item.new_status === 'diproses' ? <PlayCircle className="w-4 h-4 text-yellow-600" /> :
                     item.new_status === 'diterima' ? <CheckCircle2 className="w-4 h-4 text-blue-600" /> :
                     <XCircle className="w-4 h-4 text-red-600" />}
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-sm text-on-surface">
                      {mapStatus(item.old_status)} → {mapStatus(item.new_status)}
                    </p>
                    <p className="text-xs text-on-surface-variant">By {item.change_by_name}</p>
                    {item.notes && <p className="text-xs text-on-surface-variant mt-1">{item.notes}</p>}
                    <p className="text-[10px] text-on-surface-variant/60 mt-1">
                      {new Date(item.created_at).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-on-surface-variant">No history available</p>
          )}
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
