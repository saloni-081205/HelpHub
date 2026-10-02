import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Logo from '../components/Logo';
import FormField from '../components/FormField';
import { validateForm } from '../utils/validators';

const FIELDS = ['firstName', 'lastName', 'email', 'phone', 'password'];

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    firstName: '', lastName: '', email: '', password: '', phone: '', role: 'requester',
  });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [serverError, setServerError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    if (touched[name]) {
      const msg = validateForm({ ...form, [name]: value }, [name])[name] || '';
      setErrors((prev) => ({ ...prev, [name]: msg }));
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched({ ...touched, [name]: true });
    const msg = validateForm({ ...form, [name]: value }, [name])[name] || '';
    setErrors((prev) => ({ ...prev, [name]: msg }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError('');
    const allErrors = validateForm(form, FIELDS);
    setErrors(allErrors);
    setTouched(FIELDS.reduce((o, f) => ({ ...o, [f]: true }), {}));
    if (Object.keys(allErrors).length) return;

    setLoading(true);
    try {
      await register(form);
      navigate('/dashboard');
    } catch (err) {
      setServerError(err.userMessage || err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] grid lg:grid-cols-2">
      <div className="flex items-center justify-center px-5 py-12">
        <div className="w-full max-w-md">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-ink mb-2">Create your account</h1>
            <p className="text-muted">Join HelpHub and be part of a kinder community.</p>
          </div>

          {serverError && (
            <div className="mb-5 p-3.5 rounded-xl bg-brand-50 border border-brand-200 text-brand-700 text-sm font-medium flex items-start gap-2">
              <AlertCircle size={16} className="flex-shrink-0 mt-0.5" />
              {serverError}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            <div className="grid grid-cols-2 gap-3">
              <FormField label="First Name" name="firstName" error={errors.firstName}>
                <input
                  id="firstName" name="firstName"
                  value={form.firstName}
                  onChange={handleChange} onBlur={handleBlur}
                  className={`input-field ${errors.firstName ? '!border-red-400 focus:!ring-red-100' : ''}`}
                />
              </FormField>

              <FormField label="Last Name" name="lastName" error={errors.lastName}>
                <input
                  id="lastName" name="lastName"
                  value={form.lastName}
                  onChange={handleChange} onBlur={handleBlur}
                  className={`input-field ${errors.lastName ? '!border-red-400 focus:!ring-red-100' : ''}`}
                />
              </FormField>
            </div>

            <FormField label="Email Address" name="email" error={errors.email}>
              <input
                id="email" name="email" type="email"
                value={form.email}
                onChange={handleChange} onBlur={handleBlur}
                className={`input-field ${errors.email ? '!border-red-400 focus:!ring-red-100' : ''}`}
              />
            </FormField>

            <FormField label="Phone Number" name="phone" error={errors.phone}>
              <input
                id="phone" name="phone"
                value={form.phone}
                onChange={handleChange} onBlur={handleBlur}
                className={`input-field ${errors.phone ? '!border-red-400 focus:!ring-red-100' : ''}`}
              />
            </FormField>

            <FormField
              label="Password" name="password" error={errors.password}
              hint="At least 6 characters, with a letter and a number"
            >
              <input
                id="password" name="password" type="password"
                value={form.password}
                onChange={handleChange} onBlur={handleBlur}
                className={`input-field ${errors.password ? '!border-red-400 focus:!ring-red-100' : ''}`}
              />
            </FormField>

            <div>
              <label className="label-text">I am joining as…</label>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { value: 'requester', label: 'I Need Help', hint: 'Requester' },
                  { value: 'volunteer', label: 'I Want to Help', hint: 'Volunteer' },
                ].map((opt) => (
                  <button type="button" key={opt.value}
                    onClick={() => setForm({ ...form, role: opt.value })}
                    className={`text-left px-4 py-3 rounded-xl border-2 transition-all ${
                      form.role === opt.value
                        ? 'border-brand-500 bg-brand-50 ring-2 ring-brand-100'
                        : 'border-line bg-white hover:border-brand-300'
                    }`}
                  >
                    <div className="font-semibold text-ink text-sm">{opt.label}</div>
                    <div className="text-xs text-muted mt-0.5">{opt.hint}</div>
                  </button>
                ))}
              </div>
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full text-base mt-2">
              {loading ? 'Creating account…' : 'Create Account'}
            </button>
          </form>

          <p className="text-sm text-center mt-6 text-muted">
            Already have an account?{' '}
            <Link to="/login" className="text-brand-600 font-semibold hover:underline">Login</Link>
          </p>
        </div>
      </div>

      <div className="hidden lg:flex relative overflow-hidden bg-gradient-to-br from-teal-700 via-teal-600 to-brand-500 items-center justify-center p-12">
        <div className="absolute top-10 -right-20 w-80 h-80 bg-white/10 rounded-full blur-2xl" />
        <div className="relative max-w-md text-white">
          <Logo size="lg" light />
          <h2 className="text-4xl font-bold mt-8 mb-4 leading-tight">
            A neighbourly hand is only a click away.
          </h2>
          <p className="text-white/85 leading-relaxed">
            Whether you're delivering groceries or receiving a ride to the pharmacy — HelpHub makes
            every act of care visible and organised.
          </p>
        </div>
      </div>
    </div>
  );
}