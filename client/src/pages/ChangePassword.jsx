import { useState } from 'react';
import api from '../services/api';

export default function ChangePassword() {
  const [form, setForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [message, setMessage] = useState({ type: '', text: '' });
  const [saving, setSaving] = useState(false);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });

    if (form.newPassword !== form.confirmPassword) {
      return setMessage({ type: 'error', text: 'New passwords do not match' });
    }
    if (form.newPassword.length < 6) {
      return setMessage({
        type: 'error',
        text: 'New password must be at least 6 characters',
      });
    }

    setSaving(true);
    try {
      await api.put('/users/password', {
        currentPassword: form.currentPassword,
        newPassword: form.newPassword,
      });
      setMessage({ type: 'success', text: 'Password changed successfully' });
      setForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      setMessage({
        type: 'error',
        text: err.response?.data?.message || 'Change failed',
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto px-4 sm:px-5 py-6 lg:py-10">
      <div className="mb-6">
        <h1 className="text-3xl sm:text-4xl font-bold text-ink">Security</h1>
        <p className="text-muted mt-1 text-sm">
          Update the password used to sign in to your account.
        </p>
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

      <div className="card">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="label-text">Current Password</label>
            <input
              name="currentPassword"
              type="password"
              value={form.currentPassword}
              onChange={handleChange}
              required
              className="input-field"
            />
          </div>
          <div>
            <label className="label-text">New Password</label>
            <input
              name="newPassword"
              type="password"
              value={form.newPassword}
              onChange={handleChange}
              required
              minLength={6}
              className="input-field"
            />
          </div>
          <div>
            <label className="label-text">Confirm New Password</label>
            <input
              name="confirmPassword"
              type="password"
              value={form.confirmPassword}
              onChange={handleChange}
              required
              className="input-field"
            />
          </div>

          <button
            type="submit"
            disabled={saving}
            className="btn-primary w-full sm:w-auto text-sm"
          >
            {saving ? 'Updating…' : 'Change Password'}
          </button>
        </form>
      </div>
    </div>
  );
}