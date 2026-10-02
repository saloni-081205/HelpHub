import { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { ArrowLeft, Save } from 'lucide-react';
import api from '../../services/api';
import CategoryIcon, { CATEGORY_LIST } from '../../components/CategoryIcon';
import Loader from '../../components/Loader';

const URGENCIES = ['Low', 'Medium', 'High', 'Urgent'];

export default function EditRequest() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState(null);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await api.get(`/requests/${id}`);
        const r = data.request;
        if (r.status !== 'Pending') {
          setError('Only pending requests can be edited');
          return;
        }
        setForm({
          title: r.title,
          description: r.description,
          category: r.category,
          urgency: r.urgency,
          location: r.location,
          contactName: r.contactName,
          contactPhone: r.contactPhone,
          requiredDate: r.requiredDate?.slice(0, 10),
        });
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load');
      }
    };
    load();
  }, [id]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      await api.put(`/requests/${id}`, form);
      navigate(`/dashboard/requests/${id}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save');
    } finally {
      setSaving(false);
    }
  };

  if (!form && !error) return <Loader />;
  if (error && !form) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="card text-center py-10">
          <p className="text-brand-600 font-semibold mb-4">{error}</p>
          <Link to="/dashboard" className="btn-primary text-sm">Back to Dashboard</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      <Link to={`/dashboard/requests/${id}`} className="inline-flex items-center gap-2 text-sm text-muted hover:text-ink mb-5">
        <ArrowLeft size={14} /> Back to request
      </Link>

      <h1 className="text-3xl sm:text-4xl font-bold text-ink mb-6">Edit Request</h1>

      {error && (
        <div className="mb-5 p-3.5 rounded-xl bg-brand-50 border border-brand-200 text-brand-700 text-sm font-medium">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="card space-y-5">
        <div>
          <label className="label-text">Title</label>
          <input name="title" value={form.title} onChange={handleChange} required maxLength={120} className="input-field" />
        </div>

        <div>
          <label className="label-text">Description</label>
          <textarea name="description" value={form.description} onChange={handleChange} rows={4} required maxLength={1000} className="input-field resize-none" />
        </div>

        <div>
          <label className="label-text">Category</label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {CATEGORY_LIST.map((c) => (
              <button
                key={c} type="button"
                onClick={() => setForm({ ...form, category: c })}
                className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border-2 text-left text-sm transition-all ${
                  form.category === c ? 'border-brand-500 bg-brand-50 text-brand-700' : 'border-line bg-white hover:border-brand-300'
                }`}
              >
                <CategoryIcon category={c} size={16} />
                <span className="font-medium truncate">{c}</span>
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="label-text">Urgency</label>
          <div className="grid grid-cols-4 gap-2">
            {URGENCIES.map((u) => (
              <button
                key={u} type="button"
                onClick={() => setForm({ ...form, urgency: u })}
                className={`px-2 py-2 rounded-xl border-2 text-xs font-bold transition-all ${
                  form.urgency === u ? 'border-brand-500 bg-brand-50 text-brand-700' : 'border-line bg-white text-muted'
                }`}
              >
                {u}
              </button>
            ))}
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="label-text">Location</label>
            <input name="location" value={form.location} onChange={handleChange} required className="input-field" />
          </div>
          <div>
            <label className="label-text">Required By</label>
            <input name="requiredDate" type="date" value={form.requiredDate} onChange={handleChange} required className="input-field" />
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="label-text">Contact Name</label>
            <input name="contactName" value={form.contactName} onChange={handleChange} required className="input-field" />
          </div>
          <div>
            <label className="label-text">Contact Phone</label>
            <input name="contactPhone" value={form.contactPhone} onChange={handleChange} required className="input-field" />
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 sm:justify-end pt-3 border-t border-line">
          <Link to={`/dashboard/requests/${id}`} className="btn-ghost text-sm justify-center order-2 sm:order-1">Cancel</Link>
          <button type="submit" disabled={saving} className="btn-primary text-sm justify-center order-1 sm:order-2">
            <Save size={16} /> {saving ? 'Saving…' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
}