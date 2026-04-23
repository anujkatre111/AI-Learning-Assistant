import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import authService from '../../services/authService';
import { useAuth } from '../../context/AuthContext';

const ProfilePage = () => {
  const { updateUser } = useAuth();
  const [form, setForm] = useState({ username: '', email: '' });
  const [passwords, setPasswords] = useState({ currentPassword: '', newPassword: '' });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      try {
        const response = await authService.getProfile();
        const userData = response.data;
        setForm({ username: userData.username || '', email: userData.email || '' });
      } catch (error) {
        toast.error(error.message || 'Failed to load profile');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleUpdateProfile = async (event) => {
    event.preventDefault();
    setSaving(true);
    try {
      const response = await authService.updateProfile(form);
      updateUser(response.data);
      toast.success('Profile updated');
    } catch (error) {
      toast.error(error.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordChange = async (event) => {
    event.preventDefault();
    setSaving(true);
    try {
      await authService.changePassword(passwords);
      setPasswords({ currentPassword: '', newPassword: '' });
      toast.success('Password changed');
    } catch (error) {
      toast.error(error.message || 'Failed to change password');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="rounded-xl border border-slate-200 bg-white p-4">Loading profile...</div>;

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Profile</h1>

      <form onSubmit={handleUpdateProfile} className="rounded-xl border border-slate-200 bg-white p-4">
        <h2 className="mb-3 font-medium">Update profile</h2>
        <div className="grid gap-3 md:grid-cols-2">
          <input
            type="text"
            value={form.username}
            onChange={(e) => setForm((prev) => ({ ...prev, username: e.target.value }))}
            placeholder="Username"
            className="rounded-md border border-slate-300 px-3 py-2 text-sm"
          />
          <input
            type="email"
            value={form.email}
            onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))}
            placeholder="Email"
            className="rounded-md border border-slate-300 px-3 py-2 text-sm"
          />
        </div>
        <button type="submit" disabled={saving} className="mt-3 rounded-md bg-emerald-600 px-4 py-2 text-sm text-white disabled:opacity-70">
          Save profile
        </button>
      </form>

      <form onSubmit={handlePasswordChange} className="rounded-xl border border-slate-200 bg-white p-4">
        <h2 className="mb-3 font-medium">Change password</h2>
        <div className="grid gap-3 md:grid-cols-2">
          <input
            type="password"
            value={passwords.currentPassword}
            onChange={(e) => setPasswords((prev) => ({ ...prev, currentPassword: e.target.value }))}
            placeholder="Current password"
            className="rounded-md border border-slate-300 px-3 py-2 text-sm"
          />
          <input
            type="password"
            value={passwords.newPassword}
            onChange={(e) => setPasswords((prev) => ({ ...prev, newPassword: e.target.value }))}
            placeholder="New password"
            className="rounded-md border border-slate-300 px-3 py-2 text-sm"
          />
        </div>
        <button type="submit" disabled={saving} className="mt-3 rounded-md border border-slate-300 px-4 py-2 text-sm hover:bg-slate-100 disabled:opacity-70">
          Update password
        </button>
      </form>
    </div>
  );
};

export default ProfilePage;
