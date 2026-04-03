import { Bell } from 'lucide-react';
import BottomNav from '../../components/layout/BottomNav';

export default function Notifications() {
  return (
    <div className="min-h-screen bg-surface">
      <header className="sticky top-0 z-40 glass-header border-b border-outline-variant/10 px-6 py-4">
        <div className="max-w-3xl mx-auto">
          <h1 className="font-headline font-bold text-xl text-on-surface">Notifications</h1>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 pt-6 pb-28">
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-20 h-20 bg-surface-container-low rounded-full flex items-center justify-center mb-6">
            <Bell className="w-10 h-10 text-on-surface-variant/30" />
          </div>
          <h2 className="font-headline font-bold text-xl text-on-surface mb-2">
            No Notifications Yet
          </h2>
          <p className="font-body text-on-surface-variant text-sm max-w-xs">
            When you get notifications, they will appear here.
          </p>
        </div>
      </main>

      <BottomNav />
    </div>
  );
}
