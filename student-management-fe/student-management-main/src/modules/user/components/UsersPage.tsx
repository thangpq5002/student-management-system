'use client';

import { useCallback, useEffect, useState } from 'react';
import { apiRequest } from '@/lib/api/client';
import { API_ENDPOINTS } from '@/lib/api/endpoints';

interface UserAccount {
  id: string;
  name: string;
  email: string;
  role: string;
  title: string;
  teacherId: string | null;
  teacherName: string | null;
  enabled: boolean;
}

interface Teacher {
  id: string;
  fullName?: string;
  name?: string;
  teacherCode?: string;
}

export default function UsersPage() {
  const [users, setUsers] = useState<UserAccount[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [teacherId, setTeacherId] = useState('');

  const [selectedUser, setSelectedUser] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const loadData = useCallback(async () => {
    setLoading(true);
    setError('');

    try {
      const accounts = await apiRequest<UserAccount[]>(
        API_ENDPOINTS.users,
      );

      setUsers(accounts);

      try {
        const teacherData = await apiRequest<Teacher[]>(
          API_ENDPOINTS.teachers,
        );
        setTeachers(teacherData);
      } catch {
        setTeachers([]);
      }
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Không thể tải danh sách tài khoản.',
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadData();
  }, [loadData]);

  async function createAccount(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');
    setMessage('');

    if (!teacherId) {
      setError('Vui lòng chọn hồ sơ giáo viên.');
      return;
    }

    try {
      await apiRequest<UserAccount>(API_ENDPOINTS.users, {
        method: 'POST',
        body: {
          email,
          password,
          role: 'teacher',
          teacherId,
        },
      });

      setEmail('');
      setPassword('');
      setTeacherId('');
      setMessage('Tạo tài khoản giáo viên thành công.');
      await loadData();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Không thể tạo tài khoản.',
      );
    }
  }

  async function resetPassword(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');
    setMessage('');

    if (!selectedUser) {
      setError('Vui lòng chọn tài khoản cần đặt lại mật khẩu.');
      return;
    }

    try {
      await apiRequest<void>(
        `${API_ENDPOINTS.users}/${selectedUser}/password`,
        {
          method: 'PUT',
          body: { password: newPassword },
        },
      );

      setSelectedUser('');
      setNewPassword('');
      setMessage('Đặt lại mật khẩu thành công.');
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Không thể đặt lại mật khẩu.',
      );
    }
  }

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold text-on-surface">
          Quản lý tài khoản
        </h1>
        <p className="mt-1 text-sm text-on-surface-variant">
          Quản lý tài khoản đăng nhập của giáo viên.
        </p>
      </div>

      {error && (
        <div className="rounded-lg border border-error/30 bg-error-container p-3 text-sm text-on-error-container">
          {error}
        </div>
      )}

      {message && (
        <div className="rounded-lg border border-green-300 bg-green-50 p-3 text-sm text-green-800">
          {message}
        </div>
      )}

      <section className="rounded-xl border border-outline-variant/40 bg-surface-container-lowest p-5">
        <h2 className="mb-4 text-lg font-semibold text-on-surface">
          Tạo tài khoản giáo viên
        </h2>

        <form onSubmit={createAccount} className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium">
              Email đăng nhập
            </label>
            <input
              type="email"
              required
              maxLength={255}
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="w-full rounded-lg border border-outline-variant p-2.5"
              placeholder="giaovien@example.com"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">
              Mật khẩu ban đầu
            </label>
            <input
              type="password"
              required
              minLength={8}
              maxLength={72}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="w-full rounded-lg border border-outline-variant p-2.5"
              placeholder="Ít nhất 8 ký tự"
            />
          </div>

          <div className="md:col-span-2">
            <label className="mb-1 block text-sm font-medium">
              Hồ sơ giáo viên
            </label>
            <select
              required
              value={teacherId}
              onChange={(event) => setTeacherId(event.target.value)}
              className="w-full rounded-lg border border-outline-variant bg-white p-2.5"
            >
              <option value="">-- Chọn giáo viên --</option>
              {teachers.map((teacher) => (
                <option key={teacher.id} value={teacher.id}>
                  {teacher.fullName ?? teacher.name ?? `Giáo viên ${teacher.id}`}
                  {' '}(ID: {teacher.id})
                </option>
              ))}
            </select>
            {teachers.length === 0 && (
              <p className="mt-1 text-xs text-on-surface-variant">
                Chưa tải được danh sách giáo viên. Hãy kiểm tra API /api/teachers.
              </p>
            )}
          </div>

          <div className="md:col-span-2">
            <button
              type="submit"
              className="rounded-lg bg-primary px-5 py-2.5 font-medium text-on-primary hover:opacity-90"
            >
              Tạo tài khoản
            </button>
          </div>
        </form>
      </section>

      <section className="rounded-xl border border-outline-variant/40 bg-surface-container-lowest p-5">
        <h2 className="mb-4 text-lg font-semibold text-on-surface">
          Danh sách tài khoản
        </h2>

        {loading ? (
          <p>Đang tải danh sách tài khoản...</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-outline-variant/40">
                  <th className="p-3">Họ tên</th>
                  <th className="p-3">Email</th>
                  <th className="p-3">Vai trò</th>
                  <th className="p-3">Giáo viên liên kết</th>
                  <th className="p-3">Trạng thái</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr
                    key={user.id}
                    className="border-b border-outline-variant/20"
                  >
                    <td className="p-3">{user.name}</td>
                    <td className="p-3">{user.email}</td>
                    <td className="p-3">
                      {user.role === 'admin' ? 'Admin' : 'Giáo viên'}
                    </td>
                    <td className="p-3">
                      {user.teacherName || user.teacherId || '—'}
                    </td>
                    <td className="p-3">
                      {user.enabled ? 'Đang hoạt động' : 'Đã khóa'}
                    </td>
                  </tr>
                ))}

                {users.length === 0 && (
                  <tr>
                    <td colSpan={5} className="p-4 text-center">
                      Chưa có tài khoản nào.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <section className="rounded-xl border border-outline-variant/40 bg-surface-container-lowest p-5">
        <h2 className="mb-4 text-lg font-semibold text-on-surface">
          Đặt lại mật khẩu
        </h2>

        <form onSubmit={resetPassword} className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium">
              Tài khoản
            </label>
            <select
              required
              value={selectedUser}
              onChange={(event) => setSelectedUser(event.target.value)}
              className="w-full rounded-lg border border-outline-variant bg-white p-2.5"
            >
              <option value="">-- Chọn tài khoản --</option>
              {users.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.email} ({user.role})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">
              Mật khẩu mới
            </label>
            <input
              type="password"
              required
              minLength={8}
              maxLength={72}
              value={newPassword}
              onChange={(event) => setNewPassword(event.target.value)}
              className="w-full rounded-lg border border-outline-variant p-2.5"
              placeholder="Ít nhất 8 ký tự"
            />
          </div>

          <div className="md:col-span-2">
            <button
              type="submit"
              className="rounded-lg bg-primary px-5 py-2.5 font-medium text-on-primary hover:opacity-90"
            >
              Đặt lại mật khẩu
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}

