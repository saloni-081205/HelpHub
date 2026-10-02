import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Logo from '../components/Logo';
import FormField from '../components/FormField';
import { validateForm } from '../utils/validators';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
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
    const allErrors = validateForm(form, ['email', 'password']);
    setErrors(allErrors);
    if (Object.keys(allErrors).length) return;

    setLoading(true);
    try {
      await login(form);
      navigate('/dashboard');
    } catch (err) {
      setServerError(err.userMessage || err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] grid lg:grid-cols-2">
      <div className="hidden lg:flex relative overflow-hidden bg-gradient-to-br from-teal-700 via-teal-600 to-brand-500 items-center justify-center p-12">
        <div className="relative max-w-md text-white">
          <Logo size="lg" light />
          <h2 className="text-4xl font-bold mt-8 mb-4 leading-tight italic">
            Welcome back to the circle of care.
          </h2>
          <p className="text-white/85 leading-relaxed">
            Sign in to post requests, accept volunteer tasks, and track every
            act of help — all in one place.
          </p>

          <div className="mt-10 p-5 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20">
            <p className="text-sm italic leading-relaxed">
              "The best way to find yourself is to lose yourself in the
              service of others."
            </p>
            <p className="text-xs text-white mt-2">— Mahatma Gandhi</p>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-center px-5 py-12">
        <div className="w-full max-w-md">
          <h1 className="text-4xl font-bold text-ink mb-2">Welcome back</h1>
          <p className="text-muted mb-8">Sign in to continue helping your community.</p>

          {serverError && (
            <div className="mb-5 p-3.5 rounded-xl bg-brand-50 border border-brand-200 text-brand-700 text-sm font-medium flex items-start gap-2">
              <AlertCircle size={16} className="flex-shrink-0 mt-0.5" />
              {serverError}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            <FormField label="Email Address" name="email" error={errors.email}>
              <input
                id="email" name="email" type="email"
                value={form.email} onChange={handleChange} onBlur={handleBlur}
                className={`input-field ${errors.email ? '!border-red-400 focus:!ring-red-100' : ''}`}
              />
            </FormField>

            <FormField label="Password" name="password" error={errors.password}>
              <input
                id="password" name="password" type="password"
                value={form.password} onChange={handleChange} onBlur={handleBlur}
                className={`input-field ${errors.password ? '!border-red-400 focus:!ring-red-100' : ''}`}
              />
            </FormField>

            <button type="submit" disabled={loading} className="btn-primary w-full text-base mt-2">
              {loading ? 'Signing in…' : 'Sign In'}
            </button>
          </form>

          <p className="text-sm text-center mt-6 text-muted">
            New to HelpHub?{' '}
            <Link to="/register" className="text-brand-600 font-semibold hover:underline">
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}