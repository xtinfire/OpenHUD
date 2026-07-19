import { useEffect, useState } from 'react';

export function SponsorView({ sponsorConfig }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeSponsors = sponsorConfig.sponsors.filter((s) => s.enabled);

  useEffect(() => {
    if (activeSponsors.length === 0) return;
    setActiveIndex(0);
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % activeSponsors.length);
    }, sponsorConfig.rotationIntervalMs);
    return () => clearInterval(timer);
  }, [activeSponsors.length, sponsorConfig.rotationIntervalMs]);

  if (activeSponsors.length === 0) return <div style={{ width: '100vw', height: '100vh' }} />;

  const current = activeSponsors[activeIndex % activeSponsors.length];
  return (
    <div style={{ width: '100vw', height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div key={current.id} className="chamfer sponsor-fade" style={{ background: 'var(--bg-panel-alpha)', padding: 16, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <img src={`http://127.0.0.1:3000/sponsors/${current.filename}`} alt={current.displayName} style={{ maxHeight: 80, maxWidth: 240, objectFit: 'contain' }} />
      </div>
    </div>
  );
}