import React, { useState, useEffect, useRef } from "react";
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
import api from "../lib/api";
import ScreenHeader from "../components/ui/ScreenHeader";

interface Category {
  id: string;
  name: string;
}

interface LocationNode {
  id: string;
  name: string;
  type: string;
  parent_id: string | null;
  children?: LocationNode[];
}

export default function CreateReport() {
  const navigate = useNavigate();
  const [categoryId, setCategoryId] = useState("");
  const [locationPath, setLocationPath] = useState<string[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [images, setImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [locationTree, setLocationTree] = useState<LocationNode[]>([]);
  const [selectedLocations, setSelectedLocations] = useState<LocationNode[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchCategories();
    fetchLocationTree();
  }, []);

  const fetchCategories = async () => {
    try {
      const { data } = await api.get('/categories');
      setCategories(data);
    } catch (err) {
      console.error('Failed to fetch categories:', err);
    }
  };

  const fetchLocationTree = async () => {
    try {
      const { data } = await api.get('/locations/tree');
      setLocationTree(data);
    } catch (err) {
      console.error('Failed to fetch locations:', err);
    }
  };

  const getFirstLevelLocations = () => {
    return locationTree.map(loc => ({ id: loc.id, name: loc.name, type: loc.type }));
  };

  const getChildLocations = (parentId: string) => {
    const findChildren = (nodes: LocationNode[]): LocationNode[] => {
      for (const node of nodes) {
        if (node.id === parentId) return node.children || [];
        if (node.children) {
          const found = findChildren(node.children);
          if (found.length > 0) return found;
        }
      }
      return [];
    };
    return findChildren(locationTree);
  };

  const handleLocationSelect = (index: number, locId: string) => {
    const newPath = [...locationPath];
    newPath[index] = locId;
    newPath.length = index + 1;
    setLocationPath(newPath);

    const newSelected = [...selectedLocations];
    if (index === 0) {
      newSelected.length = 0;
    }
    newSelected[index] = {
      id: locId,
      name: getFirstLevelLocations().find(l => l.id === locId)?.name || '',
      type: getFirstLevelLocations().find(l => l.id === locId)?.type || '',
      parent_id: null
    };
    
    const children = getChildLocations(locId);
    if (children.length > 0) {
      newSelected[index + 1] = {
        id: '',
        name: 'Pilih lokasi...',
        type: '',
        parent_id: locId
      };
    }
    newSelected.length = index + 1 + (children.length > 0 ? 1 : 0);
    setSelectedLocations(newSelected);
  };

  const handleImageUpload = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    
    const newImages = Array.from(files).slice(0, 5 - images.length);
    setImages([...images, ...newImages]);
    
    newImages.forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreviews(prev => [...prev, e.target?.result as string].slice(0, 5));
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
    setImagePreviews(imagePreviews.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const getSelectedLocationId = () => {
    const lastSelected = locationPath.filter(id => id);
    return lastSelected[lastSelected.length - 1] || locationPath[0];
  };

  if (!categoryId || !getSelectedLocationId() || !title || !description) {
    alert('Mohon lengkapi semua form');
    return;
  }
    
    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('description', description);
      formData.append('category_id', categoryId);
      formData.append('location_id', getSelectedLocationId());
      
      images.forEach(img => {
        formData.append('file', img);
      });

      await api.post('/reports', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      navigate("/reports");
    } catch (err) {
      console.error('Failed to submit report:', err);
      alert('Gagal mengirim laporan');
    } finally {
      setIsSubmitting(false);
    }
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
                {imagePreviews.map((img, idx) => (
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
                <>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleFileChange}
                    className="hidden"
                  />
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
                </>
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
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  className="w-full appearance-none bg-surface-container-lowest border border-outline-variant/20 rounded-2xl px-5 py-4 font-body text-on-surface focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                >
                  <option value="" disabled>
                    Select a category
                  </option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 w-5 h-5 text-on-surface-variant pointer-events-none" />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="font-label text-sm font-bold text-on-surface-variant ml-1">
                Lokasi
              </label>
              
              <div className="space-y-3">
                {selectedLocations.map((loc, idx) => (
                  <div key={idx} className="relative">
                    <select
                      value={locationPath[idx] || ""}
                      onChange={(e) => {
                        if (e.target.value) handleLocationSelect(idx, e.target.value);
                      }}
                      className="w-full appearance-none bg-surface-container-lowest border border-outline-variant/20 rounded-2xl px-5 py-4 font-body text-on-surface focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                    >
                      <option value="">
                        {idx === 0 ? "Pilih lokasi..." : "Pilih sub lokasi..."}
                      </option>
                      {(idx === 0
                        ? getFirstLevelLocations()
                        : getChildLocations(selectedLocations[idx - 1].id)
                      ).map((child) => (
                        <option key={child.id} value={child.id}>
                          {child.name}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 w-5 h-5 text-on-surface-variant pointer-events-none" />
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="font-label text-sm font-bold text-on-surface-variant ml-1">
                Title
              </label>
              <input
                required
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. AC tidak dingin"
                className="w-full bg-surface-container-lowest border border-outline-variant/20 rounded-2xl px-5 py-4 font-body text-on-surface focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
              />
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
