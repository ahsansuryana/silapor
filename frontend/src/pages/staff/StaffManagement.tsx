import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Search,
  UserPlus,
  MoreVertical,
  Mail,
  Phone,
  Edit2,
  Trash2,
  X,
  MapPin,
  ChevronDown,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import LogoSilapor from "../../assets/LOGO_SILAPOR.png";
import BottomNav from "../../components/layout/BottomNav";
import api from "../../lib/api";

interface LocationNode {
  id: string;
  name: string;
  type: string;
  parent_id: string | null;
  children?: LocationNode[];
}

interface StaffMember {
  id: string;
  NIM: string;
  name: string;
  email: string | null;
  role: string;
  locations: { id: string; name: string; type: string }[];
}

export default function StaffManagement() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("All");
  const [staff, setStaff] = useState<StaffMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [locationTree, setLocationTree] = useState<LocationNode[]>([]);
  
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState<StaffMember | null>(null);
  
  const [formData, setFormData] = useState({
    nim: "",
    name: "",
    password: "",
    locations: [] as string[],
  });

  const [locationPath, setLocationPath] = useState<string[]>([]);
  const [tempSelectedLocation, setTempSelectedLocation] = useState<{id: string, name: string} | null>(null);

  const tabs = ["All", "Active", "Inactive"];

  useEffect(() => {
    fetchStaff();
    fetchLocations();
  }, []);

  const fetchStaff = async () => {
    try {
      const { data } = await api.get("/staff");
      setStaff(data || []);
    } catch (err) {
      console.error("Failed to fetch staff:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchLocations = async () => {
    try {
      const { data } = await api.get("/locations/tree");
      setLocationTree(data || []);
    } catch (err) {
      console.error("Failed to fetch locations:", err);
    }
  };

  const getAllLocations = () => {
    const collect = (nodes: LocationNode[], result: LocationNode[] = []) => {
      nodes.forEach(node => {
        result.push(node);
        if (node.children) collect(node.children, result);
      });
      return result;
    };
    return collect(locationTree);
  };

  const handleAddStaff = async () => {
    try {
      await api.post("/auth/register/staff", formData);
      setShowAddModal(false);
      setFormData({ nim: "", name: "", password: "", locations: [] });
      fetchStaff();
    } catch (err) {
      console.error("Failed to add staff:", err);
      alert("Gagal menambah staff");
    }
  };

  const handleUpdateStaff = async () => {
    if (!selectedStaff) return;
    try {
      await api.put(`/staff/${selectedStaff.id}`, {
        name: formData.name,
        locations: formData.locations,
      });
      setShowEditModal(false);
      setSelectedStaff(null);
      fetchStaff();
    } catch (err) {
      console.error("Failed to update staff:", err);
      alert("Gagal update staff");
    }
  };

  const handleDeleteStaff = async () => {
    if (!selectedStaff) return;
    try {
      await api.delete(`/staff/${selectedStaff.id}`);
      setShowDeleteModal(false);
      setSelectedStaff(null);
      fetchStaff();
    } catch (err) {
      console.error("Failed to delete staff:", err);
      alert("Gagal hapus staff");
    }
  };

  const openEditModal = (member: StaffMember) => {
    setSelectedStaff(member);
    setFormData({
      nim: member.NIM,
      name: member.name,
      password: "",
      locations: member.locations?.map(l => l.id) || [],
    });
    setLocationPath([]);
    setTempSelectedLocation(null);
    setShowEditModal(true);
  };

  const openDeleteModal = (member: StaffMember) => {
    setSelectedStaff(member);
    setShowDeleteModal(true);
  };

  const filteredStaff = staff.filter(s => {
    const matchesSearch = !searchQuery || 
      s.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.NIM?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  const allLocations = getAllLocations();

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

    const locName = index === 0 
      ? getFirstLevelLocations().find(l => l.id === locId)?.name || ''
      : getChildLocations(newPath[index-1]).find(l => l.id === locId)?.name || '';
    
    setTempSelectedLocation({ id: locId, name: locName });
  };

  const addLocation = () => {
    if (tempSelectedLocation && !formData.locations.includes(tempSelectedLocation.id)) {
      setFormData({...formData, locations: [...formData.locations, tempSelectedLocation.id]});
      setLocationPath([]);
      setTempSelectedLocation(null);
    }
  };

  const removeLocation = (locId: string) => {
    setFormData({...formData, locations: formData.locations.filter(id => id !== locId)});
  };

  const getLocationName = (locId: string) => {
    const findInTree = (nodes: LocationNode[]): string => {
      for (const node of nodes) {
        if (node.id === locId) return node.name;
        if (node.children) {
          const found = findInTree(node.children);
          if (found) return found;
        }
      }
      return '';
    };
    return findInTree(locationTree);
  };

  return (
    <div className="flex flex-col min-h-screen bg-surface">
      <header className="sticky top-0 z-40 bg-surface border-b border-outline-variant/10 px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate("/admin")} className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-surface-container-low transition-colors">
              <ArrowLeft className="w-6 h-6 text-on-surface" />
            </button>
            <div className="relative w-10 h-10 flex items-center justify-center">
              <div className="absolute inset-0 bg-surface-container-low rounded-xl shadow-sm"></div>
              <img src={LogoSilapor} alt="SILAPOR" className="relative w-6 h-6 object-contain" />
            </div>
            <h1 className="font-headline font-bold text-xl text-on-surface">Staff Management</h1>
          </div>
          <button 
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-xl text-sm font-bold shadow-lg shadow-primary/20 hover:opacity-90 transition-all"
          >
            <UserPlus className="w-4 h-4" />
            Add Staff
          </button>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto">
        <main className="max-w-6xl mx-auto px-6 pt-6 pb-12 space-y-6">
        <section className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-surface-container-lowest p-6 rounded-3xl border border-outline-variant/10 shadow-sm">
            <p className="text-3xl font-headline font-extrabold text-on-surface leading-none mb-1">{staff.length}</p>
            <p className="font-label text-xs font-bold text-on-surface-variant uppercase tracking-widest">Total Staff</p>
          </div>
          <div className="bg-surface-container-lowest p-6 rounded-3xl border border-outline-variant/10 shadow-sm">
            <p className="text-3xl font-headline font-extrabold text-primary leading-none mb-1">
              {staff.filter(s => s.locations?.length > 0).length}
            </p>
            <p className="font-label text-xs font-bold text-on-surface-variant uppercase tracking-widest">Assigned</p>
          </div>
          <div className="bg-surface-container-lowest p-6 rounded-3xl border border-outline-variant/10 shadow-sm">
            <p className="text-3xl font-headline font-extrabold text-secondary-container leading-none mb-1">
              {staff.filter(s => !s.locations?.length).length}
            </p>
            <p className="font-label text-xs font-bold text-on-surface-variant uppercase tracking-widest">Unassigned</p>
          </div>
        </section>

        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="w-5 h-5 text-on-surface-variant/40 group-focus-within:text-primary transition-colors" />
            </div>
            <input
              type="text"
              placeholder="Search staff by name or NIM..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3.5 bg-surface-container-lowest border border-outline-variant/10 rounded-2xl font-body text-sm text-on-surface focus:ring-2 focus:ring-primary outline-none transition-all"
            />
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12 text-on-surface-variant">Loading...</div>
        ) : filteredStaff.length === 0 ? (
          <div className="text-center py-12 text-on-surface-variant">No staff found</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredStaff.map((member, idx) => (
              <motion.div
                key={member.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="bg-surface-container-lowest p-6 rounded-[2rem] border border-outline-variant/10 shadow-sm hover:border-primary/30 transition-all group relative"
              >
                <div className="absolute top-6 right-6 flex gap-1">
                  <button 
                    onClick={() => openEditModal(member)}
                    className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-surface-container-low transition-colors"
                  >
                    <Edit2 className="w-4 h-4 text-on-surface-variant" />
                  </button>
                  <button 
                    onClick={() => openDeleteModal(member)}
                    className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-surface-container-low transition-colors"
                  >
                    <Trash2 className="w-4 h-4 text-error" />
                  </button>
                </div>

                <div className="flex items-center gap-4 mb-4">
                  <div className="w-16 h-16 rounded-2xl bg-surface-container-highest overflow-hidden border-2 border-outline-variant/10">
                    <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${member.name}`} alt={member.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-headline font-bold text-lg text-on-surface group-hover:text-primary transition-colors">{member.name}</h3>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold text-on-surface-variant/40 uppercase tracking-widest">{member.NIM}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3 pt-4 border-t border-outline-variant/5">
                  <div className="flex items-center gap-3 text-xs text-on-surface-variant font-medium">
                    <Mail className="w-4 h-4 opacity-40" />
                    {member.email || "-"}
                  </div>
                  <div className="flex items-start gap-3 text-xs text-on-surface-variant font-medium">
                    <MapPin className="w-4 h-4 opacity-40 mt-0.5" />
                    <div className="flex flex-wrap gap-1">
                      {member.locations?.length > 0 ? (
                        member.locations.slice(0, 2).map(loc => (
                          <span key={loc.id} className="px-2 py-0.5 bg-surface-container-low rounded text-[10px]">
                            {loc.name}
                          </span>
                        ))
                      ) : (
                        <span className="text-on-surface-variant/40">No location assigned</span>
                      )}
                      {member.locations?.length > 2 && (
                        <span className="text-[10px] text-primary">+{member.locations.length - 2} more</span>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
</div>
        )}
      </main>
        </div>

      <BottomNav />

      {/* Add Modal */}
      <AnimatePresence>
        {showAddModal && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          >
            <motion.div 
              initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }}
              className="bg-surface p-6 rounded-2xl w-full max-w-md max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-headline font-bold text-xl">Add New Staff</h2>
                <button onClick={() => setShowAddModal(false)} className="w-8 h-8 rounded-lg hover:bg-surface-container-low">
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-2 block">NIM</label>
                  <input
                    type="text"
                    value={formData.nim}
                    onChange={(e) => setFormData({...formData, nim: e.target.value})}
                    className="w-full px-4 py-3 bg-surface-container-lowest border border-outline-variant/10 rounded-xl text-sm"
                    placeholder="Enter NIM"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-2 block">Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full px-4 py-3 bg-surface-container-lowest border border-outline-variant/10 rounded-xl text-sm"
                    placeholder="Enter name"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-2 block">Password</label>
                  <input
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                    className="w-full px-4 py-3 bg-surface-container-lowest border border-outline-variant/10 rounded-xl text-sm"
                    placeholder="Enter password"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-2 block">Assigned Locations</label>
                  
                  {formData.locations.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {formData.locations.map(locId => (
                        <div key={locId} className="flex items-center gap-2 px-3 py-1.5 bg-surface-container-low rounded-full">
                          <span className="text-xs font-medium">{getLocationName(locId)}</span>
                          <button 
                            type="button"
                            onClick={() => removeLocation(locId)}
                            className="w-4 h-4 rounded-full bg-error/20 text-error flex items-center justify-center hover:bg-error/30"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="space-y-3 p-4 bg-surface-container-low rounded-xl">
                    <div className="relative">
                      <select
                        value={locationPath[0] || ""}
                        onChange={(e) => handleLocationSelect(0, e.target.value)}
                        className="w-full appearance-none bg-surface-container-lowest border border-outline-variant/20 rounded-xl px-4 py-3 text-sm"
                      >
                        <option value="">Pilih lokasi...</option>
                        {getFirstLevelLocations().map(loc => (
                          <option key={loc.id} value={loc.id}>{loc.name}</option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant pointer-events-none" />
                    </div>

                    {locationPath[0] && getChildLocations(locationPath[0]).length > 0 && (
                      <div className="relative">
                        <select
                          value={locationPath[1] || ""}
                          onChange={(e) => { if (e.target.value) handleLocationSelect(1, e.target.value); }}
                          className="w-full appearance-none bg-surface-container-lowest border border-outline-variant/20 rounded-xl px-4 py-3 text-sm"
                        >
                          <option value="">Pilih sub lokasi...</option>
                          {getChildLocations(locationPath[0]).map(loc => (
                            <option key={loc.id} value={loc.id}>{loc.name}</option>
                          ))}
                        </select>
                        <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant pointer-events-none" />
                      </div>
                    )}

                    {locationPath[1] && getChildLocations(locationPath[1]).length > 0 && (
                      <div className="relative">
                        <select
                          value={locationPath[2] || ""}
                          onChange={(e) => { if (e.target.value) handleLocationSelect(2, e.target.value); }}
                          className="w-full appearance-none bg-surface-container-lowest border border-outline-variant/20 rounded-xl px-4 py-3 text-sm"
                        >
                          <option value="">Pilih sub lokasi...</option>
                          {getChildLocations(locationPath[1]).map(loc => (
                            <option key={loc.id} value={loc.id}>{loc.name}</option>
                          ))}
                        </select>
                        <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant pointer-events-none" />
                      </div>
                    )}

                    {tempSelectedLocation && (
                      <button
                        type="button"
                        onClick={addLocation}
                        className="w-full py-2 bg-primary/10 text-primary text-sm font-bold rounded-lg hover:bg-primary/20"
                      >
                        + Tambah Lokasi
                      </button>
                    )}
                  </div>
                </div>
                
                <button
                  onClick={handleAddStaff}
                  disabled={!formData.nim || !formData.name || !formData.password}
                  className="w-full py-3 bg-primary text-white font-bold rounded-xl disabled:opacity-50"
                >
                  Add Staff
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Edit Modal */}
      <AnimatePresence>
        {showEditModal && selectedStaff && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          >
            <motion.div 
              initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }}
              className="bg-surface p-6 rounded-2xl w-full max-w-md max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-headline font-bold text-xl">Edit Staff</h2>
                <button onClick={() => setShowEditModal(false)} className="w-8 h-8 rounded-lg hover:bg-surface-container-low">
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-2 block">NIM</label>
                  <input
                    type="text"
                    value={formData.nim}
                    disabled
                    className="w-full px-4 py-3 bg-surface-container-low border border-outline-variant/10 rounded-xl text-sm opacity-50"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-2 block">Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full px-4 py-3 bg-surface-container-lowest border border-outline-variant/10 rounded-xl text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-2 block">New Password (optional)</label>
                  <input
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                    className="w-full px-4 py-3 bg-surface-container-lowest border border-outline-variant/10 rounded-xl text-sm"
                    placeholder="Leave empty to keep current"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-2 block">Assigned Locations</label>
                  
                  {formData.locations.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {formData.locations.map(locId => (
                        <div key={locId} className="flex items-center gap-2 px-3 py-1.5 bg-surface-container-low rounded-full">
                          <span className="text-xs font-medium">{getLocationName(locId)}</span>
                          <button 
                            type="button"
                            onClick={() => removeLocation(locId)}
                            className="w-4 h-4 rounded-full bg-error/20 text-error flex items-center justify-center hover:bg-error/30"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="space-y-3 p-4 bg-surface-container-low rounded-xl">
                    <div className="relative">
                      <select
                        value={locationPath[0] || ""}
                        onChange={(e) => handleLocationSelect(0, e.target.value)}
                        className="w-full appearance-none bg-surface-container-lowest border border-outline-variant/20 rounded-xl px-4 py-3 text-sm"
                      >
                        <option value="">Pilih lokasi...</option>
                        {getFirstLevelLocations().map(loc => (
                          <option key={loc.id} value={loc.id}>{loc.name}</option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant pointer-events-none" />
                    </div>

                    {locationPath[0] && getChildLocations(locationPath[0]).length > 0 && (
                      <div className="relative">
                        <select
                          value={locationPath[1] || ""}
                          onChange={(e) => { if (e.target.value) handleLocationSelect(1, e.target.value); }}
                          className="w-full appearance-none bg-surface-container-lowest border border-outline-variant/20 rounded-xl px-4 py-3 text-sm"
                        >
                          <option value="">Pilih sub lokasi...</option>
                          {getChildLocations(locationPath[0]).map(loc => (
                            <option key={loc.id} value={loc.id}>{loc.name}</option>
                          ))}
                        </select>
                        <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant pointer-events-none" />
                      </div>
                    )}

                    {locationPath[1] && getChildLocations(locationPath[1]).length > 0 && (
                      <div className="relative">
                        <select
                          value={locationPath[2] || ""}
                          onChange={(e) => { if (e.target.value) handleLocationSelect(2, e.target.value); }}
                          className="w-full appearance-none bg-surface-container-lowest border border-outline-variant/20 rounded-xl px-4 py-3 text-sm"
                        >
                          <option value="">Pilih sub lokasi...</option>
                          {getChildLocations(locationPath[1]).map(loc => (
                            <option key={loc.id} value={loc.id}>{loc.name}</option>
                          ))}
                        </select>
                        <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant pointer-events-none" />
                      </div>
                    )}

                    {tempSelectedLocation && (
                      <button
                        type="button"
                        onClick={addLocation}
                        className="w-full py-2 bg-primary/10 text-primary text-sm font-bold rounded-lg hover:bg-primary/20"
                      >
                        + Tambah Lokasi
                      </button>
                    )}
                  </div>
                </div>
                
                <button
                  onClick={handleUpdateStaff}
                  className="w-full py-3 bg-primary text-white font-bold rounded-xl"
                >
                  Save Changes
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Modal */}
      <AnimatePresence>
        {showDeleteModal && selectedStaff && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          >
            <motion.div 
              initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }}
              className="bg-surface p-6 rounded-2xl w-full max-w-sm"
            >
              <h2 className="font-headline font-bold text-xl mb-2">Delete Staff?</h2>
              <p className="text-sm text-on-surface-variant mb-6">
                Are you sure you want to delete {selectedStaff.name}? This action cannot be undone.
              </p>
              <div className="flex gap-4">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="flex-1 py-3 bg-surface-container-low text-on-surface font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteStaff}
                  className="flex-1 py-3 bg-error text-white font-bold rounded-xl"
                >
                  Delete
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}