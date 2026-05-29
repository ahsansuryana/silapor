import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  Building2,
  Plus,
  ChevronRight,
  ChevronDown,
  ArrowLeft,
  Edit2,
  Trash2,
  Eye,
  X,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import api from "../../lib/api";
import ScreenHeader from "../../components/ui/ScreenHeader";
import BottomNav from "../../components/layout/BottomNav";

type LocationType = "UNIVERSITAS" | "FAKULTAS" | "JURUSAN" | "RUANGAN" | "AREA";

interface LocationNode {
  id: string;
  name: string;
  type: LocationType;
  parent_id: string | null;
  created_at: string;
  updated_at: string | null;
  children: LocationNode[];
}

interface BreadcrumbItem {
  id: string | null;
  name: string;
}

export default function FacilityManagement() {
  const navigate = useNavigate();
  
  // State for tree navigation
  const [locationTree, setLocationTree] = useState<LocationNode[]>([]);
  const [currentParent, setCurrentParent] = useState<string | null>(null);
  const [breadcrumb, setBreadcrumb] = useState<BreadcrumbItem[]>([
    { id: null, name: "All Locations" }
  ]);
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());
  
  // State for loading & search
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  
  // State for modals
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<LocationNode | null>(null);
  
  // Form state
  const [formData, setFormData] = useState({
    name: "",
    type: "AREA" as string,
    parent_id: "",
  });

  useEffect(() => {
    fetchLocationTree();
  }, []);

  const fetchLocationTree = async () => {
    try {
      const { data } = await api.get('/locations/tree');
      setLocationTree(data);
    } catch (err) {
      console.error('Failed to fetch locations:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchLocations = async (parentId: string | null) => {
    try {
      if (parentId === null) {
        // Fetch roots
        const { data } = await api.get('/locations');
        return data.filter((loc: LocationNode) => !loc.parent_id);
      } else {
        // Fetch children
        const { data } = await api.get('/locations');
        return data.filter((loc: LocationNode) => loc.parent_id === parentId);
      }
    } catch (err) {
      console.error('Failed to fetch locations:', err);
      return [];
    }
  };

  // Navigation functions
  const navigateTo = (item: BreadcrumbItem, index: number) => {
    // Truncate breadcrumb to current index
    const newBreadcrumb = breadcrumb.slice(0, index + 1);
    setBreadcrumb(newBreadcrumb);
    setCurrentParent(item.id);
    setExpandedIds(new Set());
  };

  const handleItemClick = async (location: LocationNode) => {
    // Add to breadcrumb
    const newBreadcrumb = [...breadcrumb, { id: location.id, name: location.name }];
    setBreadcrumb(newBreadcrumb);
    setCurrentParent(location.id);
    
    // Expand this item
    const newExpanded = new Set(expandedIds);
    newExpanded.add(location.id);
    setExpandedIds(newExpanded);
  };

  const goBack = () => {
    if (breadcrumb.length > 1) {
      const newBreadcrumb = breadcrumb.slice(0, -1);
      setBreadcrumb(newBreadcrumb);
      setCurrentParent(newBreadcrumb[newBreadcrumb.length - 1].id);
      setExpandedIds(new Set());
    }
  };

  const toggleExpand = (id: string) => {
    const newExpanded = new Set(expandedIds);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedIds(newExpanded);
  };

  // CRUD Functions
  const handleAdd = async () => {
    if (!formData.name) return;
    try {
      await api.post('/locations', {
        name: formData.name,
        type: formData.type,
        parent_id: currentParent || null,
      });
      setShowAddModal(false);
      setFormData({ name: "", type: "AREA", parent_id: "" });
      fetchLocationTree();
    } catch (err) {
      console.error('Failed to add location:', err);
      alert('Gagal menambah lokasi');
    }
  };

  const handleEdit = async () => {
    if (!selectedLocation || !formData.name) return;
    try {
      await api.patch(`/locations/${selectedLocation.id}`, {
        name: formData.name,
        type: formData.type,
      });
      setShowEditModal(false);
      setSelectedLocation(null);
      setFormData({ name: "", type: "AREA", parent_id: "" });
      fetchLocationTree();
    } catch (err) {
      console.error('Failed to edit location:', err);
      alert('Gagal mengedit lokasi');
    }
  };

  const handleDelete = async () => {
    if (!selectedLocation) return;
    try {
      await api.delete(`/locations/${selectedLocation.id}`);
      setShowDeleteModal(false);
      setSelectedLocation(null);
      fetchLocationTree();
    } catch (err) {
      console.error('Failed to delete location:', err);
      alert('Gagal menghapus lokasi');
    }
  };

  const openEditModal = (location: LocationNode) => {
    setSelectedLocation(location);
    setFormData({
      name: location.name,
      type: location.type,
      parent_id: location.parent_id || "",
    });
    setShowEditModal(true);
  };

  const openViewModal = (location: LocationNode) => {
    setSelectedLocation(location);
    setShowViewModal(true);
  };

  const openDeleteModal = (location: LocationNode) => {
    setSelectedLocation(location);
    setShowDeleteModal(true);
  };

  // Helper to find children
  const findChildren = (parentId: string): LocationNode[] => {
    const findInTree = (nodes: LocationNode[]): LocationNode[] => {
      for (const node of nodes) {
        if (node.id === parentId) {
          return node.children || [];
        }
        if (node.children) {
          const found = findInTree(node.children);
          if (found.length > 0) return found;
        }
      }
      return [];
    };
    return findInTree(locationTree);
  };

  // Get current locations to display
  const getCurrentLocations = (): LocationNode[] => {
    if (currentParent === null) {
      return locationTree;
    }
    return findChildren(currentParent);
  };

  const currentLocations = getCurrentLocations();
  const filteredLocations = currentLocations.filter((loc: LocationNode) =>
    !searchQuery || loc.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col min-h-screen bg-surface">
      <ScreenHeader
        title="Facility Management"
        onBack={() => navigate("/admin")}
        rightActions={
          <button 
            onClick={() => {
              setFormData({ name: "", type: "AREA", parent_id: currentParent || "" });
              setShowAddModal(true);
            }}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-xl text-sm font-bold shadow-lg hover:bg-primary/90 transition-all"
          >
            <Plus className="w-4 h-4" />
            Add Location
          </button>
        }
      />

      <div className="flex-1 overflow-y-auto">
        <main className="max-w-6xl mx-auto px-6 pt-6 pb-8 space-y-6">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm overflow-x-auto pb-2">
          <button
            onClick={() => navigateTo({ id: null, name: "All Locations" }, 0)}
            className="text-primary font-bold hover:underline whitespace-nowrap"
          >
            Home
          </button>
          {breadcrumb.slice(1).map((item, idx) => (
            <div key={idx} className="flex items-center gap-2">
              <ChevronRight className="w-4 h-4 text-on-surface-variant" />
              <button
                onClick={() => navigateTo(item, idx + 1)}
                className="text-on-surface-variant hover:text-primary hover:underline whitespace-nowrap"
              >
                {item.name}
              </button>
            </div>
          ))}
        </div>

        {/* Search */}
        <div className="relative group">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="w-5 h-5 text-on-surface-variant/40" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search locations..."
            className="w-full pl-12 pr-4 py-3.5 bg-surface-container-lowest border border-outline-variant/10 rounded-2xl font-body text-sm text-on-surface focus:ring-2 focus:ring-primary outline-none transition-all"
          />
        </div>

        {/* Back Button */}
        {breadcrumb.length > 1 && (
          <button
            onClick={goBack}
            className="flex items-center gap-2 text-sm text-on-surface-variant hover:text-primary"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to {breadcrumb[breadcrumb.length - 2].name}
          </button>
        )}

        {/* Location List */}
        {loading ? (
          <div className="text-center py-12 text-on-surface-variant">Loading...</div>
        ) : filteredLocations.length === 0 ? (
          <div className="text-center py-12 text-on-surface-variant">
            {searchQuery ? "No locations found" : "No locations yet. Add your first location!"}
          </div>
        ) : (
          <div className="space-y-3">
            {filteredLocations.map((location: LocationNode) => {
              const hasChildren = location.children && location.children.length > 0;
              const isExpanded = expandedIds.has(location.id);

              return (
                <motion.div
                  key={location.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-surface-container-lowest p-4 rounded-2xl border border-outline-variant/10 shadow-sm hover:border-primary/30 transition-all"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 flex-1">
                      {/* Expand Button */}
                      {hasChildren ? (
                        <button
                          onClick={() => toggleExpand(location.id)}
                          className="w-8 h-8 rounded-lg bg-surface-container-low flex items-center justify-center text-on-surface-variant hover:bg-surface-container-high transition-colors"
                        >
                          {isExpanded ? (
                            <ChevronDown className="w-4 h-4" />
                          ) : (
                            <ChevronRight className="w-4 h-4" />
                          )}
                        </button>
                      ) : (
                        <div className="w-8" />
                      )}

                      {/* Icon */}
                      <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                        <Building2 className="w-6 h-6" />
                      </div>

                      {/* Info */}
                      <div 
                        className="flex-1 cursor-pointer"
                        onClick={() => handleItemClick(location)}
                      >
                        <h3 className="font-headline font-bold text-on-surface">
                          {location.name}
                        </h3>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-[10px] font-bold text-on-surface-variant/40 uppercase tracking-widest">
                            {location.type}
                          </span>
                          {hasChildren && (
                            <>
                              <span className="text-on-surface-variant/20">•</span>
                              <span className="text-[10px] text-on-surface-variant/60">
                                {location.children?.length} children
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => openViewModal(location)}
                        className="w-8 h-8 rounded-lg flex items-center justify-center text-on-surface-variant hover:bg-surface-container-low transition-colors"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => openEditModal(location)}
                        className="w-8 h-8 rounded-lg flex items-center justify-center text-on-surface-variant hover:bg-surface-container-low transition-colors"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => openDeleteModal(location)}
                        className="w-8 h-8 rounded-lg flex items-center justify-center text-error hover:bg-error/10 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Expanded Children */}
                  <AnimatePresence>
                    {isExpanded && hasChildren && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="mt-4 pt-4 border-t border-outline-variant/10 space-y-2 pl-4"
                      >
                        {location.children?.map((child: LocationNode) => (
                          <div
                            key={child.id}
                            className="flex items-center gap-3 p-3 bg-surface-container-low rounded-xl hover:bg-surface-container-low/80 transition-colors cursor-pointer"
                            onClick={() => handleItemClick(child)}
                          >
                            <Building2 className="w-4 h-4 text-on-surface-variant" />
                            <span className="font-medium text-sm text-on-surface">{child.name}</span>
                            <span className="text-[10px] text-on-surface-variant/60 uppercase ml-auto">
                              {child.type}
                            </span>
                            <ChevronRight className="w-4 h-4 text-on-surface-variant" />
                          </div>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>
        )}
      </main>
        </div>

      {/* Add Modal */}
      {showAddModal && (
        <Modal onClose={() => setShowAddModal(false)} title="Add New Location">
          <div className="space-y-4">
            <div>
              <label className="text-sm font-bold text-on-surface-variant">Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full mt-1 p-3 bg-surface-container-lowest rounded-xl border border-outline-variant/20"
                placeholder="Location name"
              />
            </div>
            <div>
              <label className="text-sm font-bold text-on-surface-variant">Type</label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                className="w-full mt-1 p-3 bg-surface-container-lowest rounded-xl border border-outline-variant/20"
              >
                <option value="UNIVERSITAS">Universitas</option>
                <option value="FAKULTAS">Fakultas</option>
                <option value="JURUSAN">Jurusan</option>
                <option value="RUANGAN">Ruangan</option>
                <option value="AREA">Area</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-bold text-on-surface-variant">Parent</label>
              <select
                value={formData.parent_id}
                onChange={(e) => setFormData({ ...formData, parent_id: e.target.value })}
                className="w-full mt-1 p-3 bg-surface-container-lowest rounded-xl border border-outline-variant/20"
              >
                <option value="">None (Root)</option>
                {locationTree.map((loc: LocationNode) => (
                  <option key={loc.id} value={loc.id}>{loc.name}</option>
                ))}
              </select>
            </div>
            <div className="flex gap-4 pt-4">
              <button
                onClick={() => setShowAddModal(false)}
                className="flex-1 py-3 bg-surface-container-low text-on-surface font-bold rounded-xl"
              >
                Cancel
              </button>
              <button
                onClick={handleAdd}
                className="flex-1 py-3 bg-primary text-white font-bold rounded-xl"
              >
                Add
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Edit Modal */}
      {showEditModal && (
        <Modal onClose={() => setShowEditModal(false)} title="Edit Location">
          <div className="space-y-4">
            <div>
              <label className="text-sm font-bold text-on-surface-variant">Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full mt-1 p-3 bg-surface-container-lowest rounded-xl border border-outline-variant/20"
              />
            </div>
            <div>
              <label className="text-sm font-bold text-on-surface-variant">Type</label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                className="w-full mt-1 p-3 bg-surface-container-lowest rounded-xl border border-outline-variant/20"
              >
                <option value="UNIVERSITAS">Universitas</option>
                <option value="FAKULTAS">Fakultas</option>
                <option value="JURUSAN">Jurusan</option>
                <option value="RUANGAN">Ruagan</option>
                <option value="AREA">Area</option>
              </select>
            </div>
            <div className="flex gap-4 pt-4">
              <button
                onClick={() => setShowEditModal(false)}
                className="flex-1 py-3 bg-surface-container-low text-on-surface font-bold rounded-xl"
              >
                Cancel
              </button>
              <button
                onClick={handleEdit}
                className="flex-1 py-3 bg-primary text-white font-bold rounded-xl"
              >
                Save
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* View Modal */}
      {showViewModal && selectedLocation && (
        <Modal onClose={() => setShowViewModal(false)} title="Location Details">
          <div className="space-y-4">
            <div className="p-4 bg-surface-container-lowest rounded-xl">
              <h3 className="font-headline font-bold text-xl text-on-surface">{selectedLocation.name}</h3>
              <p className="text-sm text-on-surface-variant mt-1">{selectedLocation.type}</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-surface-container-lowest rounded-xl">
                <p className="text-[10px] font-bold text-on-surface-variant/40 uppercase">Created</p>
                <p className="text-sm font-medium text-on-surface">
                  {new Date(selectedLocation.created_at).toLocaleDateString()}
                </p>
              </div>
              <div className="p-4 bg-surface-container-lowest rounded-xl">
                <p className="text-[10px] font-bold text-on-surface-variant/40 uppercase">Updated</p>
                <p className="text-sm font-medium text-on-surface">
                  {selectedLocation.updated_at 
                    ? new Date(selectedLocation.updated_at).toLocaleDateString() 
                    : '-'}
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowViewModal(false)}
              className="w-full py-3 bg-surface-container-low text-on-surface font-bold rounded-xl"
            >
              Close
            </button>
          </div>
        </Modal>
      )}

      {/* Delete Modal */}
      {showDeleteModal && selectedLocation && (
        <Modal onClose={() => setShowDeleteModal(false)} title="Delete Location">
          <div className="space-y-4">
            <div className="p-4 bg-error/10 border border-error/20 rounded-xl">
              <p className="text-sm text-on-surface">
                Apakah Anda yakin ingin menghapus <strong>{selectedLocation.name}</strong>?
              </p>
              {(selectedLocation.children && selectedLocation.children.length > 0) && (
                <p className="text-sm text-error mt-2">
                  ⚠️ Lokasi ini memiliki {selectedLocation.children.length} anak yang juga akan dihapus.
                </p>
              )}
            </div>
            <div className="flex gap-4">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 py-3 bg-surface-container-low text-on-surface font-bold rounded-xl"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 py-3 bg-error text-white font-bold rounded-xl"
              >
                Delete
              </button>
            </div>
          </div>
        </Modal>
      )}
      
      <BottomNav />
    </div>
  );
}

// Modal Component
function Modal({ children, title, onClose }: { children: React.ReactNode; title: string; onClose: () => void }) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-surface p-6 rounded-2xl w-full max-w-md">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-headline font-bold text-xl">{title}</h2>
          <button onClick={onClose} className="w-8 h-8 rounded-lg hover:bg-surface-container-low">
            <X className="w-5 h-5" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}