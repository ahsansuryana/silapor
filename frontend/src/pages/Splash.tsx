import { motion } from "motion/react";
import LogoUin from "../assets/LOGO_UIN_SGD.png";
import LogoSilapor from "../assets/LOGO_SILAPOR.png";

export default function Splash() {
  return (
    <main className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-surface">
      <div className="absolute inset-0 z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary-fixed/20 blur-[120px]"></div>
        <div className="absolute bottom-[-5%] right-[-5%] w-[30%] h-[30%] rounded-full bg-secondary-fixed/30 blur-[100px]"></div>
      </div>

      <div className="relative z-10 flex flex-col items-center text-center px-6">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="mb-12 flex flex-col items-center"
        >
          <div className="w-24 h-24 mb-6 relative flex items-center justify-center bg-surface-container-low rounded-[2rem] shadow-xl shadow-primary/30">
            <img src={LogoSilapor} alt="SILAPOR" />
            <div className="absolute inset-[-8px] rounded-[2.5rem]"></div>
          </div>
          <h1 className="font-headline font-extrabold text-5xl tracking-tighter text-primary">
            SILAPOR
          </h1>
          <p className="mt-3 font-label text-on-surface-variant font-medium tracking-widest text-[10px] uppercase">
            Sistem Laporan Fasilitas Kampus
          </p>
        </motion.div>

        <div className="flex flex-col items-center gap-6">
          <div className="relative w-12 h-12">
            <div className="absolute inset-0 border-[3px] border-outline-variant/30 rounded-full"></div>
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
              className="absolute inset-0 border-[3px] border-t-primary border-r-transparent border-b-transparent border-l-transparent rounded-full"
            ></motion.div>
          </div>
          <div className="space-y-1">
            <span className="block text-sm font-semibold text-on-surface-variant">
              Mempersiapkan Akses Layanan
            </span>
            <span className="block text-xs text-on-surface-variant/60 font-medium">
              Silakan tunggu sebentar...
            </span>
          </div>
        </div>
      </div>

      <div className="absolute bottom-16 left-0 right-0 px-8 flex justify-center">
        <div className="bg-surface-container-low/60 backdrop-blur-2xl px-6 py-4 rounded-xl flex items-center gap-4 max-w-xs shadow-sm">
          <div className="w-10 overflow-hidden aspect-square">
            <img
              src={LogoUin}
              alt="Uin Sunan Gunung Djati Bandung"
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
          <div className="text-left">
            <p className="text-[11px] font-bold text-primary tracking-tight uppercase">
              UIN Sunan Gunung Djati Bandung
            </p>
            <p className="text-[10px] text-on-surface-variant leading-tight">
              Mewujudkan lingkungan kampus yang nyaman dan aman.
            </p>
          </div>
        </div>
      </div>

      <div className="absolute bottom-6 flex gap-4 opacity-40">
        <span className="text-[10px] font-label font-medium uppercase tracking-widest">
          v1.0.0
        </span>
        <span className="text-[10px] font-label font-medium uppercase tracking-widest">
          •
        </span>
        <span className="text-[10px] font-label font-medium uppercase tracking-widest">
          © 2024 UIN Sunan Gunung Djati Bandung
        </span>
      </div>
    </main>
  );
}
