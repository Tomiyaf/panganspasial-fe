import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Plus,
  Edit,
  Trash2,
  UserCheck,
  UserX,
} from 'lucide-react';
import { adminUsersApi } from '../../../services/api';
import { useAuth } from '../../../context/AuthContext';
import { useToast } from '../../../context/ToastContext';
import Modal from '../../../components/ui/Modal';
import ConfirmDialog from '../../../components/ui/ConfirmDialog';
import { TableSkeleton } from '../../../components/ui/LoadingSkeleton';
import ErrorState from '../../../components/ui/ErrorState';

export default function AdminUsersPage() {
  const { user: currentUser } = useAuth();
  const queryClient = useQueryClient();
  const { success, error: showError } = useToast();

  const [userModalOpen, setUserModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState({ isOpen: false, id: null, name: '' });

  // Fetch Users List
  const {
    data: users = [],
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ['admin', 'users'],
    queryFn: async () => {
      const res = await adminUsersApi.getUsers();
      return res.data || [];
    },
  });

  // Delete User Mutation
  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      return await adminUsersApi.deleteUser(id);
    },
    onSuccess: () => {
      success('Akun administrator berhasil dihapus');
      queryClient.invalidateQueries({ queryKey: ['admin', 'users'] });
      setDeleteConfirm({ isOpen: false, id: null, name: '' });
    },
    onError: (err) => showError(err.message || 'Gagal menghapus user'),
  });

  return (
    <div className="space-y-6 font-body text-slate-800">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-heading text-slate-900 tracking-tight">
            Manajemen Akun Administrator
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Kelola hak akses operator survei, petugas dinas, dan super administrator.
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            setEditingUser(null);
            setUserModalOpen(true);
          }}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#2E7D32] hover:bg-[#236327] active:scale-[0.98] text-white text-xs font-bold font-heading shadow-xs transition-colors shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Admin Baru</span>
        </button>
      </div>

      {/* Users Table Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-6 text-xs">
        {isLoading ? (
          <TableSkeleton rows={4} cols={5} />
        ) : isError ? (
          <ErrorState onRetry={refetch} />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-50 text-slate-500 uppercase font-heading text-[10px] tracking-wider border-b border-slate-200">
                <tr>
                  <th className="py-3.5 px-4">Nama Lengkap</th>
                  <th className="py-3.5 px-4">Email Login</th>
                  <th className="py-3.5 px-4 text-center">Peran (Role)</th>
                  <th className="py-3.5 px-4 text-center">Status Akun</th>
                  <th className="py-3.5 px-4">Waktu Terdaftar</th>
                  <th className="py-3.5 px-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {users.map((u) => {
                  const roleName = typeof u.role === 'object' && u.role !== null
                    ? (u.role.name || 'Admin')
                    : (u.role || 'Admin');

                  return (
                    <tr key={u.id} className="hover:bg-slate-50/80">
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded-full bg-emerald-100 text-[#2E7D32] font-bold text-xs font-heading flex items-center justify-center">
                            {u.name?.charAt(0) || 'U'}
                          </div>
                          <div>
                            <span className="font-bold text-slate-900 font-heading block">
                              {u.name}
                            </span>
                            {String(u.id) === String(currentUser?.id) && (
                              <span className="text-[10px] text-emerald-600 font-medium">
                                (Akun Anda Saat Ini)
                              </span>
                            )}
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-4 text-slate-600 font-mono text-[11px]">
                        {u.email}
                      </td>

                      <td className="py-3.5 px-4 text-center">
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold font-heading bg-slate-100 text-slate-700">
                          {roleName}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-center">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold ${
                          u.is_active ? 'bg-emerald-50 text-[#2E7D32]' : 'bg-red-50 text-red-700'
                        }`}>
                          {u.is_active ? <UserCheck className="w-3 h-3" /> : <UserX className="w-3 h-3" />}
                          <span>{u.is_active ? 'Aktif' : 'Nonaktif'}</span>
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-slate-500 font-mono text-[11px]">
                        {u.created_at ? new Date(u.created_at).toLocaleDateString('id-ID', { dateStyle: 'medium' }) : '-'}
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            type="button"
                            onClick={() => {
                              setEditingUser(u);
                              setUserModalOpen(true);
                            }}
                            className="p-1.5 text-slate-400 hover:text-blue-600 transition-colors"
                            title="Edit Admin"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>

                          {String(u.id) !== String(currentUser?.id) && (
                            <button
                              type="button"
                              onClick={() =>
                                setDeleteConfirm({
                                  isOpen: true,
                                  id: u.id,
                                  name: u.name,
                                })
                              }
                              className="p-1.5 text-slate-400 hover:text-red-600 transition-colors"
                              title="Hapus Admin"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* MODAL: ADD / EDIT USER */}
      {userModalOpen && (
        <UserFormModal
          key={editingUser ? String(editingUser.id) : 'new-user'}
          isOpen={userModalOpen}
          onClose={() => {
            setUserModalOpen(false);
            setEditingUser(null);
          }}
          initialData={editingUser}
          onSuccess={() => {
            setUserModalOpen(false);
            setEditingUser(null);
            refetch();
          }}
        />
      )}

      {/* CONFIRM DELETE MODAL */}
      <ConfirmDialog
        isOpen={deleteConfirm.isOpen}
        onClose={() => setDeleteConfirm({ isOpen: false, id: null, name: '' })}
        onConfirm={() => deleteMutation.mutate(deleteConfirm.id)}
        title="Hapus Akun Administrator"
        message={`Apakah Anda yakin ingin menghapus akun "${deleteConfirm.name}"? Pengguna ini tidak akan dapat login kembali.`}
        confirmLabel="Ya, Hapus Akun"
        isLoading={deleteMutation.isPending}
      />

    </div>
  );
}

// Sub-component: User Form Modal
function UserFormModal({ isOpen, onClose, initialData, onSuccess }) {
  const { success, error: showError } = useToast();
  const [name, setName] = useState(() => initialData?.name || '');
  const [email, setEmail] = useState(() => initialData?.email || '');
  const [password, setPassword] = useState('');
  const [roleId, setRoleId] = useState(() => initialData?.role?.id || initialData?.role_id || 1);
  const [isActive, setIsActive] = useState(() => (initialData?.is_active !== undefined ? initialData.is_active : true));
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email) {
      showError('Nama dan email wajib diisi');
      return;
    }
    if (!initialData && (!password || password.length < 6)) {
      showError('Kata sandi minimal 6 karakter');
      return;
    }

    setIsSubmitting(true);
    try {
      if (initialData) {
        const payload = {
          name,
          email,
          role_id: parseInt(roleId, 10),
          is_active: isActive,
        };
        if (password && password.trim().length > 0) {
          payload.password = password.trim();
        }
        await adminUsersApi.updateUser(initialData.id, payload);
        success('Akun admin berhasil diperbarui');
      } else {
        await adminUsersApi.createUser({
          name,
          email,
          password: password.trim(),
          role_id: parseInt(roleId, 10),
        });
        success('Akun administrator baru berhasil dibuat');
      }
      onSuccess();
    } catch (err) {
      showError(err.message || 'Gagal menyimpan user admin');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialData ? 'Edit Akun Administrator' : 'Tambah Akun Administrator Baru'}
      maxWidth="max-w-md"
    >
      <form onSubmit={handleSubmit} className="space-y-4 text-xs font-body">
        
        <div className="space-y-1">
          <label className="font-semibold text-slate-700 block">Nama Lengkap *</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Contoh: Budi Gunawan"
            className="w-full px-3 py-2 bg-slate-50 rounded-xl border border-slate-200 text-slate-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#2E7D32]"
            required
          />
        </div>

        <div className="space-y-1">
          <label className="font-semibold text-slate-700 block">Alamat Email *</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="nama@panganspasial.id"
            className="w-full px-3 py-2 bg-slate-50 rounded-xl border border-slate-200 text-slate-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#2E7D32]"
            required
          />
        </div>

        <div className="space-y-1">
          <label className="font-semibold text-slate-700 block">
            {initialData ? 'Kata Sandi Baru (Kosongkan jika tidak diubah)' : 'Kata Sandi (Password) *'}
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className="w-full px-3 py-2 bg-slate-50 rounded-xl border border-slate-200 text-slate-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#2E7D32]"
            required={!initialData}
          />
        </div>

        <div className="space-y-1">
          <label className="font-semibold text-slate-700 block">Peran (Role) *</label>
          <select
            value={roleId}
            onChange={(e) => setRoleId(e.target.value)}
            className="w-full px-3 py-2 bg-slate-50 rounded-xl border border-slate-200 text-slate-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#2E7D32]"
          >
            <option value={1}>Administrator (Akses Penuh)</option>
          </select>
        </div>

        {initialData && (
          <label className="flex items-center gap-2 cursor-pointer pt-1">
            <input
              type="checkbox"
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
              className="rounded border-slate-300 text-[#2E7D32] focus:ring-[#2E7D32] w-4 h-4"
            />
            <span className="text-slate-700 font-medium">Akun Aktif (Dapat Login)</span>
          </label>
        )}

        <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-semibold"
          >
            Batal
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-5 py-2 rounded-lg bg-[#2E7D32] hover:bg-[#236327] text-white text-xs font-bold font-heading disabled:opacity-50"
          >
            {isSubmitting ? 'Menyimpan...' : 'Simpan Akun'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
