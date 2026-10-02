import { useState, useRef } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import Avatar from '../components/Avatar';
import Loader from '../components/Loader';

export default function Profile() {
  const { user, updateUser, refreshUser } = useAuth();
  const fileRef = useRef(null);

  const [form, setForm] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    phone: user?.phone || '',
    bio: user?.bio || '',
    city: user?.location?.city || '',
    area: user?.location?.area || '',
  });

  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const flash = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: '', text: '' }), 3500);
  };

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const { data } = await api.put('/users/profile', form);
      updateUser(data.user);
      flash('success', 'Profile updated successfully');
    } catch (err) {
      flash('error', err.response?.data?.message || 'Update failed');
    } finally {
      setSaving(false);
    }
  };

  const handleImage = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const fd = new FormData();
    fd.append('image', file);

    setUploading(true);
    try {
      const { data } = await api.put('/users/profile/picture', fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      updateUser(data.user);
      flash('success', 'Picture updated');
    } catch (err) {
      flash('error', err.response?.data?.message || 'Upload failed');
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = '';
    }
  };

  if (!user) return <Loader />;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-5 py-6 lg:py-10">
      <div className="mb-6">
        <h1 className="text-3xl sm:text-4xl font-bold text-ink">My Profile</h1>
        <p className="text-muted mt-1 text-sm">Manage your account information.</p>
      </div>

      {message.text && (
        <div
          className={`mb-5 p-3.5 rounded-xl text-sm font-medium border ${
            message.type === 'success'
              ? 'bg-teal-50 text-teal-700 border-teal-200'
              : 'bg-brand-50 text-brand-700 border-brand-200'
          }`}
        >
          {message.text}
        </div>
      )}

      <div className="grid lg:grid-cols-3 gap-6">
        {/* ---------- Avatar card ---------- */}
        <div className="card text-center lg:col-span-1">
          <div className="flex justify-center mb-4">
            <Avatar user={user} size="xl" />
          </div>
          <h2 className="text-lg font-bold text-ink">
            {user.firstName} {user.lastName}
          </h2>
          <span className="inline-block mt-1 px-3 py-0.5 rounded-full text-xs font-semibold capitalize bg-teal-50 text-teal-700 border border-teal-100">
            {user.role}
          </span>

          <input
            ref={fileRef}
            type="file"
            accept="image/png,image/jpeg,image/webp"
            className="hidden"
            onChange={handleImage}
          />

          <button
            onClick={() => fileRef.current?.click()}
            disabled={uploading}
            className="btn-ghost mt-5 w-full text-sm"
          >
            {uploading ? 'Uploading…' : 'Change Picture'}
          </button>
          <p className="text-xs text-muted mt-2">JPG, PNG or WEBP · max 2 MB</p>
        </div>

        {/* ---------- Edit form ---------- */}
        <div className="card lg:col-span-2">
          <h2 className="text-lg font-bold text-ink mb-5">Personal Information</h2>

          <form onSubmit={handleSave} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="label-text">First Name</label>
                <input
                  name="firstName"
                  value={form.firstName}
                  onChange={handleChange}
                  className="input-field"
                />
              </div>
              <div>
                <label className="label-text">Last Name</label>
                <input
                  name="lastName"
                  value={form.lastName}
                  onChange={handleChange}
                  className="input-field"
                />
              </div>
            </div>

            <div>
              <label className="label-text">Email (cannot be changed)</label>
              <input
                value={user.email}
                disabled
                className="input-field bg-cream/70 cursor-not-allowed"
              />
            </div>

            <div>
              <label className="label-text">Phone Number</label>
              <input
                name="phone"
                value={form.phone}
                onChange={handleChange}
                className="input-field"
              />
            </div>

            <div>
              <label className="label-text">Bio</label>
              <textarea
                name="bio"
                rows={3}
                maxLength={300}
                placeholder="Tell the community a little about yourself…"
                value={form.bio}
                onChange={handleChange}
                className="input-field resize-none"
              />
              <p className="text-xs text-muted mt-1">{form.bio.length}/300</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="label-text">City</label>
                <input
                  name="city"
                  value={form.city}
                  onChange={handleChange}
                  className="input-field"
                />
              </div>
              <div>
                <label className="label-text">Area / Locality</label>
                <input
                  name="area"
                  value={form.area}
                  onChange={handleChange}
                  className="input-field"
                />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row sm:justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={async () => {
                  await refreshUser();
                  flash('success', 'Reset to saved values');
                }}
                className="btn-ghost text-sm order-2 sm:order-1"
              >
                Reset
              </button>
              <button
                type="submit"
                disabled={saving}
                className="btn-primary text-sm order-1 sm:order-2"
              >
                {saving ? 'Saving…' : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}