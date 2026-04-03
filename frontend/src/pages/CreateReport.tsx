import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  Camera,
  MapPin,
  ChevronDown,
  Info,
  Send,
  X,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import ScreenHeader from "../components/ui/ScreenHeader";

export default function CreateReport() {
  const navigate = useNavigate();
  const [category, setCategory] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [images, setImages] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const categories = [
    "Facility Maintenance",
    "Electrical Issue",
    "Plumbing & Water",
    "IT & Connectivity",
    "Security & Safety",
    "Janitorial Services",
    "Other",
  ];

  const handleImageUpload = () => {
    const mockImage = `https://picsum.photos/seed/${Math.random()}/400/300`;
    setImages([...images, mockImage]);
  };

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      navigate("/reports");
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-surface pb-12">
      <ScreenHeader title="New Report" onBack={() => navigate(-1)} />

      <main className="max-w-2xl mx-auto px-6 pt-8">
        <form onSubmit={handleSubmit} className="space-y-8">
          <section className="space-y-4">
            <div className="flex justify-between items-end">
              <h3 className="font-headline font-bold text-lg text-on-surface">
                Evidence Photos
              </h3>
              <span className="text-xs font-bold text-on-surface-variant/40 uppercase tracking-widest">
                {images.length}/5 Photos
              </span>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <AnimatePresence>
                {images.map((img, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.8, opacity: 0 }}
                    className="relative aspect-square rounded-2xl overflow-hidden border border-outline-variant/10 shadow-sm"
                  >
                    <img
                      src={img}
                      alt="Evidence"
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(idx)}
                      className="absolute top-1.5 right-1.5 w-6 h-6 bg-black/50 backdrop-blur-md text-white rounded-full flex items-center justify-center hover:bg-black/70 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </motion.div>
                ))}
              </AnimatePresence>

              {images.length < 5 && (
                <button
                  type="button"
                  onClick={handleImageUpload}
                  className="aspect-square rounded-2xl border-2 border-dashed border-outline-variant/30 flex flex-col items-center justify-center gap-2 hover:bg-surface-container-low hover:border-primary/30 transition-all group"
                >
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Camera className="w-5 h-5 text-primary" />
                  </div>
                  <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">
                    Add Photo
                  </span>
                </button>
              )}
            </div>
            <p className="text-[11px] text-on-surface-variant/60 flex items-center gap-1.5">
              <Info className="w-3.5 h-3.5" />
              Upload clear photos of the issue to help us identify it faster.
            </p>
          </section>

          <section className="space-y-6">
            <div className="space-y-1.5">
              <label className="font-label text-sm font-bold text-on-surface-variant ml-1">
                Category
              </label>
              <div className="relative">
                <select
                  required
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full appearance-none bg-surface-container-lowest border border-outline-variant/20 rounded-2xl px-5 py-4 font-body text-on-surface focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                >
                  <option value="" disabled>
                    Select a category
                  </option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 w-5 h-5 text-on-surface-variant pointer-events-none" />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="font-label text-sm font-bold text-on-surface-variant ml-1">
                Location
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                  <MapPin className="w-5 h-5 text-on-surface-variant/40 group-focus-within:text-primary transition-colors" />
                </div>
                <input
                  required
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g. Building A, 3rd Floor, Room 302"
                  className="w-full bg-surface-container-lowest border border-outline-variant/20 rounded-2xl pl-12 pr-5 py-4 font-body text-on-surface focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="font-label text-sm font-bold text-on-surface-variant ml-1">
                Description
              </label>
              <textarea
                required
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe the issue in detail..."
                className="w-full bg-surface-container-lowest border border-outline-variant/20 rounded-2xl px-5 py-4 font-body text-on-surface focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all resize-none"
              ></textarea>
            </div>
          </section>

          <div className="pt-4">
            <button
              disabled={isSubmitting}
              className="w-full py-5 bg-primary text-white font-headline font-bold rounded-2xl shadow-xl shadow-primary/20 hover:shadow-primary/30 active:scale-[0.98] transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:pointer-events-none"
            >
              {isSubmitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Submitting Report...
                </>
              ) : (
                <>
                  Submit Report
                  <Send className="w-5 h-5" />
                </>
              )}
            </button>
            <p className="mt-4 text-center text-[11px] text-on-surface-variant/60 font-medium">
              By submitting, you agree to our{" "}
              <Link to="#" className="text-primary underline">
                Reporting Guidelines
              </Link>
              .
            </p>
          </div>
        </form>
      </main>
    </div>
  );
}
