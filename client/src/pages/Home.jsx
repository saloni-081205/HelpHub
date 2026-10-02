import { Link } from 'react-router-dom';
import FeatureCard from '../components/FeatureCard';

export default function Home() {
  return (
    <div className="min-h-[calc(100vh-64px)]">
      {/* ---------- HERO ---------- */}
      <section className="relative overflow-hidden">
        {/* Soft decorative blobs */}
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-brand-200/40 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -right-32 w-[28rem] h-[28rem] bg-teal-200/40 rounded-full blur-3xl" />

        <div className="relative max-w-6xl mx-auto px-5 pt-20 pb-24 text-center">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full
                           bg-brand-50 text-brand-700 text-xs font-semibold
                           border border-brand-200 mb-6">
            <span className="w-2 h-2 rounded-full bg-brand-500 animate-pulse" />
            Community-Powered Help Network
          </span>

          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-ink leading-[1.05] mb-6 animate-[fade-up_0.8s_ease-out_both]">
            Kindness, <span className="text-brand-500 italic">organised</span>.
            <br />
            Help, <span className="text-teal-700">delivered</span>.
          </h1>

          <p className="max-w-2xl mx-auto text-lg md:text-xl text-muted leading-relaxed mb-10 animate-[fade-up_0.9s_ease-out_both]">
            HelpHub connects people who need a hand — with groceries, medicine,
            rides, or a friendly visit — to volunteers nearby who are ready to
            step up.
          </p>

          <div className="flex flex-wrap justify-center gap-4 animate-[fade-up_1s_ease-out_both]">
            <Link to="/register" className="btn-primary text-base">
              I Need Help
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </Link>
            <Link to="/register" className="btn-secondary text-base">
              I Want to Volunteer
            </Link>
          </div>

          {/* Trust strip */}
          <div className="mt-14 flex flex-wrap justify-center items-center gap-x-8 gap-y-3 text-sm text-muted">
            <div className="flex items-center gap-2">
              <span className="text-teal-700">✓</span> Verified volunteers
            </div>
            <div className="flex items-center gap-2">
              <span className="text-teal-700">✓</span> Real-time updates
            </div>
            <div className="flex items-center gap-2">
              <span className="text-teal-700">✓</span> Free for the community
            </div>
          </div>
        </div>
      </section>

      {/* ---------- FEATURES ---------- */}
      <section className="max-w-6xl mx-auto px-5 pb-24">
        <div className="text-center mb-12 mt-6">
          <h2 className="text-3xl md:text-4xl font-bold text-ink mb-3">
            How HelpHub Works
          </h2>
          <p className="text-muted max-w-xl mx-auto">
            Three simple steps from a request to a helping hand.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <FeatureCard
            accent="brand"
            title="Post a Request"
            description="Describe what you need — food, medicine, transport, or supplies — and set a time and location."
            icon={
              <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
            }
          />
          <FeatureCard
            accent="teal"
            title="Get Matched"
            description="Nearby volunteers discover your request and accept it. You'll be notified instantly."
            icon={
              <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a4 4 0 00-3-3.87M9 20H4v-2a4 4 0 013-3.87m6-5.13a4 4 0 11-8 0 4 4 0 018 0zm6 0a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            }
          />
          <FeatureCard
            accent="amber"
            title="Track to Done"
            description="Follow every status update in real time — from accepted, in-progress, all the way to completed."
            icon={
              <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4M12 21a9 9 0 100-18 9 9 0 000 18z" />
              </svg>
            }
          />
        </div>
      </section>

      {/* ---------- CTA BANNER ---------- */}
      <section className="max-w-6xl mx-auto px-5 pb-24">
        <div className="relative overflow-hidden rounded-3xl
                        bg-gradient-to-br from-brand-500 via-brand-600 to-teal-700
                        px-8 py-14 text-center text-white shadow-[var(--shadow-card)]">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-2xl" />
          <div className="absolute bottom-0 left-0 w-72 h-72 bg-white/5 rounded-full blur-2xl" />

          <div className="relative">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">
              Every small act of help changes a life.
            </h2>
            <p className="text-white/90 max-w-xl mx-auto mb-8">
              Join thousands of neighbours already making a difference.
            </p>
            <Link
              to="/register"
              className="inline-flex items-center gap-2 bg-white text-brand-600 font-bold
                         px-8 py-3.5 rounded-full hover:bg-cream transition-colors
                         shadow-lg hover:shadow-xl"
            >
              Create Your Free Account
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* ---------- FOOTER ---------- */}
      <footer className="border-t border-line py-8 text-center text-sm text-muted">
        © {new Date().getFullYear()} HelpHub — Community Help & Volunteer Coordination
      </footer>
    </div>
  );
}