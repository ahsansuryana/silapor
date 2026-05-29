import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Search,
  UserPlus,
  MoreVertical,
  Mail,
  Edit2,
  Trash2,
  X,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import LogoSilapor from "../../assets/LOGO_SILAPOR.png";
import BottomNav from "../../components/layout/BottomNav";
import api from "../../lib/api";

interface User {
  id: string;
  NIM: string;
  name: string;
  email: string | null;
  role: string;
  created_at: string;
}

export default function UserManagement() {
  const navigate = useNavigate();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  
  const [formData, setFormData] = useState({
    nim: "",
    name: "",
    password: "",
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const { data } = await api.get("/users");
      setUsers(data || []);
    } catch (err) {
      console.error("Failed to fetch users:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddUser = async () => {
    try {
      await api.post("/users", formData);
      setShowAddModal(false);
      setFormData({ nim: "", name: "", password: "" });
      fetchUsers();
    } catch (err) {
      console.error("Failed to add user:", err);
      alert("Gagal menambah user");
    }
  };

  const handleUpdateUser = async () => {
    if (!selectedUser) return;
    try {
      await api.put(`/users/${selectedUser.id}`, {
        name: formData.name,
        password: formData.password || undefined,
      });
      setShowEditModal(false);
      setSelectedUser(null);
      setFormData({ nim: "", name: "", password: "" });
      fetchUsers();
    } catch (err) {
      console.error("Failed to update user:", err);
      alert("Gagal update user");
    }
  };

  const handleDeleteUser = async () => {
    if (!selectedUser) return;
    try {
      await api.delete(`/users/${selectedUser.id}`);
      setShowDeleteModal(false);
      setSelectedUser(null);
      fetchUsers();
    } catch (err) {
      console.error("Failed to delete user:", err);
      alert("Gagal hapus user");
    }
  };

  const openEditModal = (user: User) => {
    setSelectedUser(user);
    setFormData({
      nim: user.NIM,
      name: user.name,
      password: "",
    });
    setShowEditModal(true);
  };

  const openDeleteModal = (user: User) => {
    setSelectedUser(user);
    setShowDeleteModal(true);
  };

  const filteredUsers = users.filter(u => {
    const matchesSearch = !searchQuery || 
      u.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.NIM?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

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
            <h1 className="font-headline font-bold text-xl text-on-surface">User Management</h1>
          </div>
          <button 
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-xl text-sm font-bold shadow-lg shadow-primary/20 hover:opacity-90 transition-all"
          >
            <UserPlus className="w-4 h-4" />
            Add User
          </button>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto">
        <main className="max-w-6xl mx-auto px-6 pt-6 pb-8 space-y-6">
          <section className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-surface-container-lowest p-6 rounded-3xl border border-outline-variant/10 shadow-sm">
              <p className="text-3xl font-headline font-extrabold text-on-surface leading-none mb-1">{users.length}</p>
              <p className="font-label text-xs font-bold text-on-surface-variant uppercase tracking-widest">Total Users</p>
            </div>
            <div className="bg-surface-container-lowest p-6 rounded-3xl border border-outline-variant/10 shadow-sm">
              <p className="text-3xl font-headline font-extrabold text-primary leading-none mb-1">{users.length}</p>
              <p className="font-label text-xs font-bold text-on-surface-variant uppercase tracking-widest">Active</p>
            </div>
            <div className="bg-surface-container-lowest p-6 rounded-3xl border border-outline-variant/10 shadow-sm">
              <p className="text-3xl font-headline font-extrabold text-secondary-container leading-none mb-1">0</p>
              <p className="font-label text-xs font-bold text-on-surface-variant uppercase tracking-widest">Inactive</p>
            </div>
          </section>

          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="w-5 h-5 text-on-surface-variant/40 group-focus-within:text-primary transition-colors" />
            </div>
            <input
              type="text"
              placeholder="Search users by name or NIM..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3.5 bg-surface-container-lowest border border-outline-variant/10 rounded-2xl font-body text-sm text-on-surface focus:ring-2 focus:ring-primary outline-none transition-all"
            />
          </div>

          {loading ? (
            <div className="text-center py-12 text-on-surface-variant">Loading...</div>
          ) : filteredUsers.length === 0 ? (
            <div className="text-center py-12 text-on-surface-variant">No users found</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredUsers.map((user, idx) => (
                <motion.div
                  key={user.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="bg-surface-container-lowest p-6 rounded-[2rem] border border-outline-variant/10 shadow-sm hover:border-primary/30 transition-all group relative"
                >
                  <div className="absolute top-6 right-6 flex gap-1">
                    <button 
                      onClick={() => openEditModal(user)}
                      className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-surface-container-low transition-colors"
                    >
                      <Edit2 className="w-4 h-4 text-on-surface-variant" />
                    </button>
                    <button 
                      onClick={() => openDeleteModal(user)}
                      className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-surface-container-low transition-colors"
                    >
                      <Trash2 className="w-4 h-4 text-error" />
                    </button>
                  </div>

                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-16 h-16 rounded-2xl bg-surface-container-highest overflow-hidden border-2 border-outline-variant/10">
                      <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`} alt={user.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="space-y-1">
                      <h3 className="font-headline font-bold text-lg text-on-surface group-hover:text-primary transition-colors">{user.name}</h3>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold text-on-surface-variant/40 uppercase tracking-widest">{user.NIM}</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3 pt-4 border-t border-outline-variant/5">
                    <div className="flex items-center gap-3 text-xs text-on-surface-variant font-medium">
                      <Mail className="w-4 h-4 opacity-40" />
                      {user.email || "-"}
                    </div>
                    <div className="flex items-center justify-between pt-2">
                      <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Mahasiswa</span>
                      <button className="text-[10px] font-extrabold text-primary uppercase tracking-widest hover:underline">View Details</button>
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
              className="bg-surface p-6 rounded-2xl w-full max-w-md"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-headline font-bold text-xl">Add New User</h2>
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
                
                <button
                  onClick={handleAddUser}
                  disabled={!formData.nim || !formData.name || !formData.password}
                  className="w-full py-3 bg-primary text-white font-bold rounded-xl disabled:opacity-50"
                >
                  Add User
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Edit Modal */}
      <AnimatePresence>
        {showEditModal && selectedUser && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          >
            <motion.div 
              initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }}
              className="bg-surface p-6 rounded-2xl w-full max-w-md"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-headline font-bold text-xl">Edit User</h2>
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
                    className="w-full px-4 py-3 bg-surface-container border border-outline-variant/10 rounded-xl text-sm opacity-50"
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
                
                <button
                  onClick={handleUpdateUser}
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
        {showDeleteModal && selectedUser && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          >
            <motion.div 
              initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }}
              className="bg-surface p-6 rounded-2xl w-full max-w-sm"
            >
              <h2 className="font-headline font-bold text-xl mb-2">Delete User?</h2>
              <p className="text-sm text-on-surface-variant mb-6">
                Are you sure you want to delete {selectedUser.name}? This action cannot be undone.
              </p>
              <div className="flex gap-4">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="flex-1 py-3 bg-surface-container-low text-on-surface font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteUser}
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