'use client';
import { useState, useRef } from 'react';
import api from '@/lib/api';
import { useAuth } from '@/lib/auth';
import { useToast } from '@/components/ui/Toaster';
import Image from 'next/image';

const UPLOADS_URL = process.env.NEXT_PUBLIC_UPLOADS_URL || 'http://localhost:5000';

export default function ProfilePage() {
  const { user, updateUser } = useAuth();
  const { showToast } = useToast();
  const fileRef = useRef<HTMLInputElement>(null);

  const [profileForm, setProfileForm] = useState({ name: user?.name || '', bio: user?.bio || '' });
  const [passwordForm, setPasswordForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [profileSaving, setProfileSaving] = useState(false);
  const [passwordSaving, setPasswordSaving] = useState(false);
  const [avatarUploading, setAvatarUploading] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setAvatarPreview(URL.createObjectURL(file));
    setAvatarUploading(true);
    try {
      const fd = new FormData();
      fd.append('avatar', file);
      const { data } = await api.post('/users/avatar', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      updateUser({ avatar: data.data.avatar });
      showToast('Avatar updated!');
    } catch { showToast('Failed to upload avatar', 'error'); setAvatarPreview(null); }
    finally { setAvatarUploading(false); }
  };

  const handleProfileSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileSaving(true);
    try {
      const { data } = await api.put('/users/me', profileForm);
      updateUser(data.data);
      showToast('Profile updated!');
    } catch { showToast('Failed to update profile', 'error'); }
    finally { setProfileSaving(false); }
  };

  const handlePasswordSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      showToast('Passwords do not match', 'error'); return;
    }
    if (passwordForm.newPassword.length < 6) {
      showToast('Password must be at least 6 characters', 'error'); return;
    }
    setPasswordSaving(true);
    try {
      await api.put('/users/me', { currentPassword: passwordForm.currentPassword, newPassword: passwordForm.newPassword });
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
      showToast('Password changed successfully!');
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Failed to change password';
      showToast(msg, 'error');
    } finally { setPasswordSaving(false); }
  };

  const avatarSrc = avatarPreview || (user?.avatar ? `${UPLOADS_URL}${user.avatar}` : null);

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-fade-in">
      {/* Avatar Card */}
      <div className="card p-6">
        <h2 className="text-base font-semibold mb-5" style={{ color: 'var(--text-primary)' }}>Profile Picture</h2>
        <div className="flex items-center gap-6">
          <div className="relative">
            <div className="w-24 h-24 rounded-full overflow-hidden" style={{ background: 'var(--accent-light)', border: '3px solid var(--border)' }}>
              {avatarSrc ? (
                <Image src={avatarSrc} alt={user?.name || ''} width={96} height={96} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-3xl font-bold" style={{ color: 'var(--accent)' }}>
                  {user?.name?.[0]?.toUpperCase()}
                </div>
              )}
            </div>
            {avatarUploading && (
              <div className="absolute inset-0 flex items-center justify-center rounded-full" style={{ background: 'rgba(0,0,0,0.6)' }}>
                <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              </div>
            )}
          </div>
          <div>
            <p className="text-lg font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>{user?.name}</p>
            <p className="text-sm mb-3" style={{ color: 'var(--text-muted)' }}>{user?.email}</p>
            <button id="upload-avatar-btn" className="btn btn-secondary btn-sm" onClick={() => fileRef.current?.click()} disabled={avatarUploading}>
              {avatarUploading ? 'Uploading…' : 'Change Avatar'}
            </button>
            <input ref={fileRef} id="avatar-input" type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
          </div>
        </div>
      </div>

      {/* Profile Info */}
      <div className="card p-6">
        <h2 className="text-base font-semibold mb-5" style={{ color: 'var(--text-primary)' }}>Profile Information</h2>
        <form onSubmit={handleProfileSave} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>Full Name</label>
            <input id="profile-name" className="input-base" value={profileForm.name}
              onChange={e => setProfileForm({ ...profileForm, name: e.target.value })} required />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>Email</label>
            <input className="input-base opacity-60 cursor-not-allowed" value={user?.email || ''} disabled />
            <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>Email cannot be changed.</p>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>Bio</label>
            <textarea id="profile-bio" className="input-base" rows={3} placeholder="Tell us about yourself…"
              value={profileForm.bio} onChange={e => setProfileForm({ ...profileForm, bio: e.target.value })}
              style={{ resize: 'vertical' }} />
          </div>
          <div className="flex justify-between items-center pt-1">
            <span className="badge badge-purple">{user?.role}</span>
            <button id="save-profile-btn" type="submit" className="btn btn-primary" disabled={profileSaving}>
              {profileSaving ? 'Saving…' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>

      {/* Change Password */}
      <div className="card p-6">
        <h2 className="text-base font-semibold mb-5" style={{ color: 'var(--text-primary)' }}>Change Password</h2>
        <form onSubmit={handlePasswordSave} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>Current Password</label>
            <input id="current-password" type="password" className="input-base" placeholder="••••••••"
              value={passwordForm.currentPassword} onChange={e => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })} required />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>New Password</label>
            <input id="new-password" type="password" className="input-base" placeholder="••••••••"
              value={passwordForm.newPassword} onChange={e => setPasswordForm({ ...passwordForm, newPassword: e.target.value })} required />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>Confirm New Password</label>
            <input id="confirm-new-password" type="password" className="input-base" placeholder="••••••••"
              value={passwordForm.confirmPassword} onChange={e => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })} required />
          </div>
          <div className="flex justify-end pt-1">
            <button id="change-password-btn" type="submit" className="btn btn-primary" disabled={passwordSaving}>
              {passwordSaving ? 'Changing…' : 'Change Password'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
