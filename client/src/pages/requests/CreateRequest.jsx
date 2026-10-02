import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Upload, X, Save, AlertCircle } from 'lucide-react';
import api from '../../services/api';
import CategoryIcon, { CATEGORY_LIST } from '../../components/CategoryIcon';
import FormField from '../../components/FormField';
import { validateForm } from '../../utils/validators';

const URGENCIES = ['Low', 'Medium', 'High', 'Urgent'];

export default function CreateRequest() {
  const navigate = useNavigate();
  const FIELDS = [
  'title', 'description', 'category', 'urgency',
  'location', 'contactName', 'contactPhone', 'requiredDate',
];
  const [form, setForm] = useState({
    title: '',
    description: '',
    category: 'Food',
    urgency: 'Medium',
    location: '',
    contactName: '',
    contactPhone: '',
    requiredDate: '',
  });
  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState('');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const handleChange = (e) => {
  const { name, value } = e.target;
  setForm((f) => ({ ...f, [name]: value }));
  if (touched[name]) {
    const msg = validateForm({ ...form, [name]: value }, [name])[name] || '';
    setErrors((prev) => ({ ...prev, [name]: msg }));
  }
};

    const handleBlur = (e) => {
      const { name, value } = e.target;
      setTouched((t) => ({ ...t, [name]: true }));
      const msg = validateForm({ ...form, [name]: value }, [name])[name] || '';
      setErrors((prev) => ({ ...prev, [name]: msg }));
    };

  const handleImage = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setImageFile(f);
    setPreview(URL.createObjectURL(f));
  };

const handleSubmit = async (e) => {
  e.preventDefault();
  setError('');
  const allErrors = validateForm(form, FIELDS);
  setErrors(allErrors);
  setTouched(FIELDS.reduce((o, f) => ({ ...o, [f]: true }), {}));
  if (Object.keys(allErrors).length) return;

  setSaving(true);
  try {
    const fd = new FormData();
    Object.entries(form).forEach(([k, v]) => fd.append(k, v));
    if (imageFile) fd.append('image', imageFile);
    const { data } = await api.post('/requests', fd, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    navigate(`/dashboard/requests/${data.request._id}`);
  } catch (err) {
    setError(err.userMessage || err.response?.data?.message || 'Failed to create request');
  } finally {
    setSaving(false);
  }
};

  return (
    <div className="max-w-3xl mx-auto">
      <Link to="/dashboard" className="inline-flex items-center gap-2 text-sm text-muted hover:text-ink mb-5">
        <ArrowLeft size={14} /> Back to dashboard
      </Link>

      <div className="mb-6">
        <h1 className="text-3xl sm:text-4xl font-bold text-ink">New Help Request</h1>
        <p className="text-muted mt-1 text-sm">Tell us what you need. Nearby volunteers will be notified.</p>
      </div>

      {error && (
        <div className="mb-5 p-3.5 rounded-xl bg-brand-50 border border-brand-200 text-brand-700 text-sm font-medium">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="card space-y-5">
        <div>
          <label className="label-text">Title</label>
          <FormField label="Title" name="title" error={errors.title}>
          <input
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="e.g. Need medicine delivery"
            required
            maxLength={120}
            className="input-field"
          />
          </FormField>
        </div>

        <div>
          <label className="label-text">Description</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            rows={4}
            required
            maxLength={1000}
            placeholder="Describe what you need and any important details."
            className="input-field resize-none"
          />
          <p className="text-xs text-muted mt-1">{form.description.length}/1000</p>
        </div>

        <div>
          <label className="label-text">Category</label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {CATEGORY_LIST.map((c) => {
              const active = form.category === c;
              return (
                <button
                  key={c}
                  type="button"
                  onClick={() => setForm({ ...form, category: c })}
                  className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border-2 text-left text-sm transition-all ${
                    active
                      ? 'border-brand-500 bg-brand-50 text-brand-700'
                      : 'border-line bg-white text-ink hover:border-brand-300'
                  }`}
                >
                  <CategoryIcon category={c} size={16} />
                  <span className="font-medium truncate">{c}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div>
          <label className="label-text">Urgency</label>
          <div className="grid grid-cols-4 gap-2">
            {URGENCIES.map((u) => {
              const active = form.urgency === u;
              const colors = {
                Low: 'border-teal-500 bg-teal-50 text-teal-700',
                Medium: 'border-amber-500 bg-amber-50 text-amber-700',
                High: 'border-brand-500 bg-brand-50 text-brand-700',
                Urgent: 'border-red-500 bg-red-50 text-red-700',
              };
              return (
                <button
                  key={u}
                  type="button"
                  onClick={() => setForm({ ...form, urgency: u })}
                  className={`px-2 py-2 rounded-xl border-2 text-xs font-bold transition-all ${
                    active ? colors[u] : 'border-line bg-white text-muted hover:border-ink/20'
                  }`}
                >
                  {u}
                </button>
              );
            })}
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="label-text">Location</label>
            <FormField label="Title" name="title" error={errors.title}>
              <input
              name="location"
              value={form.location}
              onChange={handleChange}
              required
              placeholder="Area, City"
              className="input-field"
            />
            </FormField>
            
          </div>
          <div>
            <label className="label-text">Required By</label>
            <FormField label="Title" name="title" error={errors.title}>
            <input
              name="requiredDate"
              type="date"
              value={form.requiredDate}
              onChange={handleChange}
              required
              className="input-field"
            />
            </FormField>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="label-text">Contact Name</label>
            <FormField label="Title" name="title" error={errors.title}>
            <input
              name="contactName"
              value={form.contactName}
              onChange={handleChange}
              required
              className="input-field"
            />
            </FormField>
          </div>
          <div>
            <label className="label-text">Contact Phone</label>
            <FormField label="Title" name="title" error={errors.title}>
            <input
              name="contactPhone"
              value={form.contactPhone}
              onChange={handleChange}
              required
              className="input-field"
            />
            </FormField>
          </div>
        </div>

        <div>
          <label className="label-text">Photo (optional)</label>
          {preview ? (
            <div className="relative w-full max-w-xs">
              <img src={preview} alt="preview" className="rounded-xl w-full h-40 object-cover" />
              <button
                type="button"
                onClick={() => {
                  setImageFile(null);
                  setPreview('');
                }}
                className="absolute top-2 right-2 p-1.5 bg-white rounded-full shadow"
              >
                <X size={14} />
              </button>
            </div>
          ) : (
            <label className="flex flex-col items-center justify-center gap-2 py-6 border-2 border-dashed border-line rounded-xl cursor-pointer hover:border-brand-300 hover:bg-brand-50/30 transition-colors">
              <Upload size={20} className="text-brand-500" />
              <span className="text-sm text-muted">Click to upload an image (JPG/PNG · max 2 MB)</span>
              <FormField label="Title" name="title" error={errors.title}>
              <input
                type="file"
                accept="image/png,image/jpeg,image/webp"
                className="hidden"
                onChange={handleImage}
              />
              </FormField>
            </label>
          )}
        </div>

        <div className="flex flex-col sm:flex-row gap-3 sm:justify-end pt-3 border-t border-line">
          <Link to="/dashboard" className="btn-ghost text-sm justify-center order-2 sm:order-1">
            Cancel
          </Link>
          <button
            type="submit"
            disabled={saving}
            className="btn-primary text-sm justify-center order-1 sm:order-2"
          >
            <Save size={16} />
            {saving ? 'Creating…' : 'Create Request'}
          </button>
        </div>
      </form>
    </div>
  );
}