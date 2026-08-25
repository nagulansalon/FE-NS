import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import SearchBar from '../components/SearchBar';
import Pagination from '../components/Pagination';
import ConfirmModal from '../components/ConfirmModal';
import {
  Users,
  Plus,
  Edit2,
  Trash2,
  Calendar,
  CheckCircle2,
  XCircle,
  Clock,
  DollarSign,
  UserCheck,
  X,
  FileSpreadsheet,
} from 'lucide-react';
import * as XLSX from 'xlsx';
import toast from 'react-hot-toast';

export const AttendantsPage = () => {
  const { isSuperAdmin, isAdmin } = useAuth();

  const [attendants, setAttendants] = useState([]);
  const [chairs, setChairs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0, limit: 15 });

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  // Attendant Add/Edit Modal
  const [modalOpen, setModalOpen] = useState(false);
  const [editingAttendant, setEditingAttendant] = useState(null);
  const [formData, setFormData] = useState({
    attendantId: '',
    fullName: '',
    mobile: '',
    email: '',
    address: '',
    specialization: 'Hair Cut, Beard Styling',
    assignedChair: '',
    shiftTiming: '9:00 AM - 6:00 PM',
    commissionPercentage: 10,
    status: 'active',
  });

  // Attendance Marking Modal
  const [attendanceModalOpen, setAttendanceModalOpen] = useState(false);
  const [selectedAttendantForAttendance, setSelectedAttendantForAttendance] = useState(null);
  const [attendanceForm, setAttendanceForm] = useState({
    date: new Date().toISOString().slice(0, 10),
    status: 'Present',
    notes: '',
  });

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [attendantToDelete, setAttendantToDelete] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const fetchAttendants = async (page = 1) => {
    try {
      setLoading(true);
      const [attRes, chrRes] = await Promise.all([
        api.get(`/attendants?page=${page}&limit=15&search=${search}&status=${statusFilter}`),
        api.get('/chairs'),
      ]);
      if (attRes.data.success) {
        setAttendants(attRes.data.attendants);
        setPagination(attRes.data.pagination);
      }
      if (chrRes.data.success) setChairs(chrRes.data.chairs);
    } catch (err) {
      console.error('Failed to load attendants:', err);
      toast.error('Failed to load attendants');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAttendants(1);
  }, [search, statusFilter]);

  const openCreateModal = () => {
    setEditingAttendant(null);
    setFormData({
      attendantId: `ATT-${String(100 + attendants.length + 1)}`,
      fullName: '',
      mobile: '',
      email: '',
      address: '',
      specialization: 'Hair Cut, Beard Styling',
      assignedChair: '',
      shiftTiming: '9:00 AM - 6:00 PM',
      commissionPercentage: 10,
      status: 'active',
    });
    setModalOpen(true);
  };

  const openEditModal = (att) => {
    setEditingAttendant(att);
    setFormData({
      attendantId: att.attendantId,
      fullName: att.fullName,
      mobile: att.mobile,
      email: att.email || '',
      address: att.address || '',
      specialization: Array.isArray(att.specialization) ? att.specialization.join(', ') : att.specialization,
      assignedChair: att.assignedChair?._id || '',
      shiftTiming: att.shiftTiming || '9:00 AM - 6:00 PM',
      commissionPercentage: att.commissionPercentage || 10,
      status: att.status,
    });
    setModalOpen(true);
  };

  const handleSaveAttendant = async (e) => {
    e.preventDefault();
    if (!formData.fullName.trim() || !formData.mobile.trim() || !formData.attendantId.trim()) {
      toast.error('Name, mobile, and Attendant ID are required');
      return;
    }

    try {
      setIsProcessing(true);
      const payload = {
        ...formData,
        specialization: formData.specialization.split(',').map((s) => s.trim()).filter(Boolean),
        assignedChair: formData.assignedChair || null,
      };

      if (editingAttendant) {
        await api.put(`/attendants/${editingAttendant._id}`, payload);
        toast.success('Attendant updated successfully');
      } else {
        await api.post('/attendants', payload);
        toast.success('Attendant added to salon staff');
      }
      setModalOpen(false);
      fetchAttendants(pagination.page);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save attendant');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleMarkAttendance = async (e) => {
    e.preventDefault();
    if (!selectedAttendantForAttendance) return;

    try {
      setIsProcessing(true);
      await api.post('/attendants/attendance', {
        attendantId: selectedAttendantForAttendance._id,
        ...attendanceForm,
      });
      toast.success(`Attendance logged for ${selectedAttendantForAttendance.fullName}`);
      setAttendanceModalOpen(false);
      setSelectedAttendantForAttendance(null);
    } catch (err) {
      toast.error('Failed to log attendance');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDelete = async () => {
    if (!attendantToDelete) return;
    try {
      setIsProcessing(true);
      await api.delete(`/attendants/${attendantToDelete._id}`);
      toast.success('Attendant removed');
      setDeleteModalOpen(false);
      setAttendantToDelete(null);
      fetchAttendants(pagination.page);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to remove attendant');
    } finally {
      setIsProcessing(false);
    }
  };

  const exportToExcel = () => {
    if (attendants.length === 0) return;
    const data = attendants.map((a) => ({
      'Attendant ID': a.attendantId,
      'Full Name': a.fullName,
      Mobile: a.mobile,
      Email: a.email,
      Specialization: Array.isArray(a.specialization) ? a.specialization.join(', ') : a.specialization,
      'Shift Timing': a.shiftTiming,
      'Commission %': a.commissionPercentage,
      'Services Completed': a.servicesCompleted,
      'Total Sales Generated (₹)': a.totalSalesGenerated,
      Status: a.status,
    }));
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Attendants');
    XLSX.writeFile(workbook, `Nagulan_Attendants_${new Date().toISOString().slice(0, 10)}.xlsx`);
    toast.success('Attendant list exported!');
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2 font-serif">
            <Users className="w-6 h-6 text-gold-500" />
            Attendants & Stylists Roster
          </h2>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
            Manage salon attendants, commissions, assigned chairs, and attendance records
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={exportToExcel}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-300 dark:border-charcoal-700 bg-white dark:bg-charcoal-900 hover:bg-gray-50 dark:hover:bg-charcoal-800 text-xs font-semibold text-gray-700 dark:text-gray-300 shadow-sm"
          >
            <FileSpreadsheet className="w-4 h-4 text-green-600" />
            <span>Export Roster</span>
          </button>

          <button
            onClick={openCreateModal}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-black text-white dark:bg-gold-500 dark:text-black hover:bg-charcoal-800 dark:hover:bg-gold-400 font-bold text-xs shadow-md transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Add Attendant</span>
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white dark:bg-charcoal-900 p-4 rounded-2xl border border-gray-200 dark:border-charcoal-800 shadow-sm space-y-3">
        <SearchBar
          value={search}
          onChange={setSearch}
          placeholder="Search by ID, name, mobile, specialization..."
          onClear={() => setSearch('')}
        />
      </div>

      {/* Attendants Table */}
      <div className="bg-white dark:bg-charcoal-900 rounded-2xl border border-gray-200 dark:border-charcoal-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-gray-50 dark:bg-charcoal-950/70 text-gray-500 uppercase tracking-wider font-semibold border-b border-gray-200 dark:border-charcoal-800">
                <th className="py-3.5 px-4">Attendant ID</th>
                <th className="py-3.5 px-4">Full Name</th>
                <th className="py-3.5 px-4">Specialization</th>
                <th className="py-3.5 px-4">Station / Chair</th>
                <th className="py-3.5 px-4">Shift Timing</th>
                <th className="py-3.5 px-4 text-right">Commission</th>
                <th className="py-3.5 px-4 text-right">Completed Services</th>
                <th className="py-3.5 px-4 text-right">Total Revenue</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100 dark:divide-charcoal-800 text-gray-700 dark:text-gray-300">
              {loading ? (
                <tr>
                  <td colSpan={10} className="py-12 text-center text-gray-400">Loading attendants...</td>
                </tr>
              ) : attendants.length === 0 ? (
                <tr>
                  <td colSpan={10} className="py-12 text-center text-gray-400">No attendants found.</td>
                </tr>
              ) : (
                attendants.map((att) => (
                  <tr key={att._id} className="hover:bg-gray-50 dark:hover:bg-charcoal-800/40 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-gray-900 dark:text-white whitespace-nowrap">
                      {att.attendantId}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="font-bold text-gray-900 dark:text-white block">{att.fullName}</span>
                      <span className="text-[10px] text-gray-500 font-mono">{att.mobile}</span>
                    </td>
                    <td className="py-3.5 px-4 max-w-xs truncate">
                      {Array.isArray(att.specialization) ? att.specialization.join(', ') : att.specialization}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-gray-100 dark:bg-charcoal-800 text-gray-800 dark:text-gray-300">
                        {att.assignedChair?.name || att.assignedChair?.chairNumber || 'Floating'}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap text-gray-500">{att.shiftTiming}</td>
                    <td className="py-3.5 px-4 text-right font-mono font-bold text-gold-600 dark:text-gold-400">
                      {att.commissionPercentage}%
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono font-semibold">
                      {att.servicesCompleted || 0}
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono font-bold text-gray-900 dark:text-white">
                      ₹ {Number(att.totalSalesGenerated || 0).toLocaleString('en-IN')}
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold ${
                          att.status === 'active'
                            ? 'bg-green-500/10 text-green-600 dark:text-green-400'
                            : 'bg-red-500/10 text-red-500'
                        }`}
                      >
                        {att.status === 'active' ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => {
                            setSelectedAttendantForAttendance(att);
                            setAttendanceModalOpen(true);
                          }}
                          className="px-2 py-1 bg-gray-100 dark:bg-charcoal-800 hover:bg-gold-500 hover:text-black rounded text-[11px] font-semibold transition-all"
                          title="Mark Attendance"
                        >
                          Attendance
                        </button>

                        <button
                          onClick={() => openEditModal(att)}
                          className="p-1.5 text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white hover:bg-gray-100 dark:hover:bg-charcoal-800 rounded-lg"
                          title="Edit Attendant"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>

                        {isAdmin && (
                          <button
                            onClick={() => {
                              setAttendantToDelete(att);
                              setDeleteModalOpen(true);
                            }}
                            className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-500/10 rounded-lg"
                            title="Remove Attendant"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <Pagination pagination={pagination} onPageChange={(page) => fetchAttendants(page)} />
      </div>

      {/* Add / Edit Attendant Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-charcoal-900 w-full max-w-lg rounded-2xl shadow-2xl border border-gray-200 dark:border-charcoal-800 p-6">
            <div className="flex items-center justify-between pb-4 border-b border-gray-200 dark:border-charcoal-800">
              <h3 className="font-bold text-base text-gray-900 dark:text-white flex items-center gap-2">
                <Users className="w-5 h-5 text-gold-500" />
                {editingAttendant ? 'Edit Attendant Profile' : 'Add New Attendant'}
              </h3>
              <button onClick={() => setModalOpen(false)} className="text-gray-400 hover:text-gray-600 p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveAttendant} className="mt-4 space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-gray-700 dark:text-gray-300 mb-1">Attendant ID *</label>
                  <input
                    type="text"
                    value={formData.attendantId}
                    onChange={(e) => setFormData({ ...formData, attendantId: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 dark:border-charcoal-700 bg-white dark:bg-charcoal-950 text-gray-900 dark:text-white font-mono uppercase"
                    required
                  />
                </div>

                <div>
                  <label className="block font-semibold text-gray-700 dark:text-gray-300 mb-1">Full Name *</label>
                  <input
                    type="text"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 dark:border-charcoal-700 bg-white dark:bg-charcoal-950 text-gray-900 dark:text-white"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-gray-700 dark:text-gray-300 mb-1">Mobile Number *</label>
                  <input
                    type="tel"
                    value={formData.mobile}
                    onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                    maxLength={10}
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 dark:border-charcoal-700 bg-white dark:bg-charcoal-950 text-gray-900 dark:text-white font-mono"
                    required
                  />
                </div>

                <div>
                  <label className="block font-semibold text-gray-700 dark:text-gray-300 mb-1">Email</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 dark:border-charcoal-700 bg-white dark:bg-charcoal-950 text-gray-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-gray-700 dark:text-gray-300 mb-1">Assigned Chair / Station</label>
                  <select
                    value={formData.assignedChair}
                    onChange={(e) => setFormData({ ...formData, assignedChair: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 dark:border-charcoal-700 bg-white dark:bg-charcoal-950 text-gray-900 dark:text-white"
                  >
                    <option value="">-- No Fixed Chair --</option>
                    {chairs.map((c) => (
                      <option key={c._id} value={c._id}>{c.chairNumber} - {c.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-gray-700 dark:text-gray-300 mb-1">Commission %</label>
                  <input
                    type="number"
                    value={formData.commissionPercentage}
                    onChange={(e) => setFormData({ ...formData, commissionPercentage: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 dark:border-charcoal-700 bg-white dark:bg-charcoal-950 text-gray-900 dark:text-white font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-gray-700 dark:text-gray-300 mb-1">Specialization (Comma separated)</label>
                <input
                  type="text"
                  value={formData.specialization}
                  onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
                  placeholder="e.g., Hair Cut, Beard Trim, Gold Facial, Hair Colouring"
                  className="w-full px-3 py-2 rounded-xl border border-gray-300 dark:border-charcoal-700 bg-white dark:bg-charcoal-950 text-gray-900 dark:text-white"
                />
              </div>

              <div className="flex justify-end gap-2.5 pt-4 border-t border-gray-200 dark:border-charcoal-800">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-charcoal-800 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isProcessing}
                  className="px-5 py-2 rounded-lg bg-black text-white dark:bg-gold-500 dark:text-black hover:bg-charcoal-800 dark:hover:bg-gold-400 font-bold shadow-md"
                >
                  {isProcessing ? 'Saving...' : 'Save Attendant'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Attendance Logging Modal */}
      {attendanceModalOpen && selectedAttendantForAttendance && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-charcoal-900 w-full max-w-md rounded-2xl shadow-2xl border border-gray-200 dark:border-charcoal-800 p-6">
            <div className="flex items-center justify-between pb-4 border-b border-gray-200 dark:border-charcoal-800">
              <h3 className="font-bold text-base text-gray-900 dark:text-white">
                Log Attendance: {selectedAttendantForAttendance.fullName}
              </h3>
              <button onClick={() => setAttendanceModalOpen(false)} className="text-gray-400 hover:text-gray-600 p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleMarkAttendance} className="mt-4 space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-gray-700 dark:text-gray-300 mb-1">Date</label>
                <input
                  type="date"
                  value={attendanceForm.date}
                  onChange={(e) => setAttendanceForm({ ...attendanceForm, date: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-gray-300 dark:border-charcoal-700 bg-white dark:bg-charcoal-950 text-gray-900 dark:text-white"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 dark:text-gray-300 mb-1">Attendance Status</label>
                <select
                  value={attendanceForm.status}
                  onChange={(e) => setAttendanceForm({ ...attendanceForm, status: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-gray-300 dark:border-charcoal-700 bg-white dark:bg-charcoal-950 text-gray-900 dark:text-white font-bold"
                >
                  <option value="Present">Present (Full Day)</option>
                  <option value="Half-day">Half Day</option>
                  <option value="Leave">Leave / Casual Off</option>
                  <option value="Absent">Absent (Unannounced)</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-gray-700 dark:text-gray-300 mb-1">Notes</label>
                <input
                  type="text"
                  value={attendanceForm.notes}
                  onChange={(e) => setAttendanceForm({ ...attendanceForm, notes: e.target.value })}
                  placeholder="Optional check-in comments"
                  className="w-full px-3 py-2 rounded-xl border border-gray-300 dark:border-charcoal-700 bg-white dark:bg-charcoal-950 text-gray-900 dark:text-white"
                />
              </div>

              <div className="flex justify-end gap-2.5 pt-4 border-t border-gray-200 dark:border-charcoal-800">
                <button
                  type="button"
                  onClick={() => setAttendanceModalOpen(false)}
                  className="px-4 py-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-charcoal-800 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isProcessing}
                  className="px-5 py-2 rounded-lg bg-black text-white dark:bg-gold-500 dark:text-black hover:bg-charcoal-800 dark:hover:bg-gold-400 font-bold shadow-md"
                >
                  {isProcessing ? 'Saving...' : 'Record Attendance'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteModalOpen && attendantToDelete && (
        <ConfirmModal
          isOpen={deleteModalOpen}
          onClose={() => {
            setDeleteModalOpen(false);
            setAttendantToDelete(null);
          }}
          onConfirm={handleDelete}
          title="Remove Attendant"
          message={`Are you sure you want to remove attendant "${attendantToDelete.fullName}"?`}
          confirmText="Yes, Remove"
          isDanger={true}
          loading={isProcessing}
        />
      )}
    </div>
  );
};

export default AttendantsPage;
