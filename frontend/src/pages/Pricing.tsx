import { useState, useEffect } from 'react';
import { Gem } from 'lucide-react';
import { apiFetch, useAuth } from '../context/AuthContext';
import { Skeleton } from '../hooks/useAutosave';

interface TierInfo {
  name: string; price: number; maxCourses: number; maxExercises: number; features: string[];
}
interface CurrentSub {
  subscription: { tier: string; status: string };
  tier: TierInfo;
}

export default function Pricing() {
  const { user } = useAuth();
  const [tiers, setTiers] = useState<Record<string, TierInfo>>({});

  useEffect(() => { document.title = 'Preise — Excel-lenz'; }, []);
  const [current, setCurrent] = useState<CurrentSub | null>(null);
  const [loading, setLoading] = useState(true);
  const [subscribing, setSubscribing] = useState('');

  useEffect(() => {
    Promise.all([
      apiFetch('/enterprise/pricing').catch(() => ({ tiers: {} })),
      user ? apiFetch('/enterprise/subscription').catch(() => null) : Promise.resolve(null),
    ]).then(([p, s]) => {
      setTiers(p.tiers); setCurrent(s); setLoading(false);
    });
  }, [user]);

  const handleSubscribe = async (tier: string) => {
    if (tier === 'free') {
      setSubscribing(tier);
      await apiFetch('/enterprise/subscribe', { method: 'POST', body: JSON.stringify({ tier }) });
      const s = await apiFetch('/enterprise/subscription');
      setCurrent(s);
      setSubscribing('');
      return;
    }
    // Paid tier: create checkout session
    setSubscribing(tier);
    const session = await apiFetch('/enterprise/create-checkout', { method: 'POST', body: JSON.stringify({ tier }) });
    // Simulate successful payment
    await apiFetch('/enterprise/subscribe', { method: 'POST', body: JSON.stringify({ tier }) });
    const s = await apiFetch('/enterprise/subscription');
    setCurrent(s);
    setSubscribing('');
  };

  if (loading) return <Skeleton lines={4} />;

  const tierKeys = Object.keys(tiers);

  return (
    <div>
      <div className="page-header">
        <h1><Gem size={28} style={{marginRight:8, verticalAlign:'middle'}} />Preise & Tarife</h1>
        <p>Wählen Sie den passenden Tarif für Ihre Excel-Weiterbildung.</p>
      </div>

      {current && (
        <div className="text-center mb-4">
          <span style={{ background: 'var(--primary-light)', color: 'var(--primary)', padding: '8px 20px', borderRadius: 20, fontWeight: 600 }}>
            Aktueller Tarif: {tiers[current.subscription.tier]?.name || 'Offen'}
          </span>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24, maxWidth: 900, margin: '0 auto' }}>
        {tierKeys.map((key, i) => {
          const tier = tiers[key];
          const isCurrent = current?.subscription?.tier === key;
          const isPopular = key === 'pro';

          return (
            <div key={key} className="card" style={{
              textAlign: 'center', position: 'relative',
              border: isPopular ? '2px solid var(--primary)' : undefined,
              transform: isPopular ? 'scale(1.03)' : undefined,
            }}>
              {isPopular && (
                <div style={{
                  position: 'absolute', top: -12, left: '50%', transform: 'translateX(-50%)',
                  background: 'var(--primary)', color: 'white', padding: '4px 16px',
                  borderRadius: 12, fontSize: '0.8rem', fontWeight: 700,
                }}>
                  BELIEBTESTE
                </div>
              )}
              <h2 style={{ marginTop: 8 }}>{tier.name}</h2>
              <div style={{ fontSize: '2.5rem', fontWeight: 800, margin: '12px 0' }}>
                {tier.price === 0 ? 'Geöffnet' : `${(tier.price / 100).toFixed(2)}€`}
                {tier.price > 0 && <span style={{ fontSize: '1rem', color: 'var(--text-secondary)' }}>/Monat</span>}
              </div>
              <ul style={{ listStyle: 'none', textAlign: 'left', margin: '20px 0' }}>
                {tier.features.map((f, j) => (
                  <li key={j} style={{ padding: '8px 0', borderBottom: '1px solid var(--border-light)', fontSize: '0.9rem' }}>
                    ✅ {f}
                  </li>
                ))}
              </ul>
              {user ? (
                isCurrent ? (
                  <button className="btn btn-outline" disabled style={{ width: '100%' }}>Aktueller Tarif</button>
                ) : (
                  <button className={`btn ${isPopular ? 'btn-primary' : 'btn-outline'}`}
                    style={{ width: '100%' }}
                    onClick={() => handleSubscribe(key)}
                    disabled={subscribing === key}>
                    {subscribing === key ? 'Wird aktiviert...' : key === 'free' ? 'Downgraden' : 'Upgraden'}
                  </button>
                )
              ) : (
                <a href="/register" className={`btn ${isPopular ? 'btn-primary' : 'btn-outline'}`}
                  style={{ width: '100%', display: 'block' }}>
                  Jetzt starten
                </a>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
