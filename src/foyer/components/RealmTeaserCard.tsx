import { toRoman } from '../../lib/roman';
import type { Realm } from '../../realms/types';
import PlaceholderBox from './PlaceholderBox';

interface RealmTeaserCardProps {
  realm: Realm;
  onEnter: () => void;
}

const statusLabel: Record<Realm['status'], string> = {
  'in-progress': 'IN PROGRESS',
  built: 'BUILT',
  unbuilt: 'UNBUILT · OPENS WHEN IT RUNS',
};

export default function RealmTeaserCard({ realm, onEnter }: RealmTeaserCardProps) {
  const realmLabel = `REALM ${toRoman(realm.order)}`;

  if (realm.kind === 'unbuilt') {
    return (
      <div
        data-reveal="1"
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '16px',
          marginTop: '22px',
          padding: '24px 22px',
          border: '1px dashed #2A2C30',
          fontFamily: "'JetBrains Mono',monospace",
          fontSize: '10.5px',
          letterSpacing: '.16em',
          color: 'rgba(237,232,221,.26)',
          opacity: 0,
          transform: 'translateY(16px)',
          transition: 'opacity .9s cubic-bezier(.22,.61,.36,1) .1s,transform .9s cubic-bezier(.22,.61,.36,1) .1s',
        }}
      >
        <span>{realmLabel}</span>
        <span>{realm.tagline}</span>
      </div>
    );
  }

  const stats =
    realm.kind === 'simulation'
      ? realm.stats
      : [
          { label: 'STACK', value: realm.technologies.join(' · ') },
          { label: 'HIGHLIGHT', value: realm.highlights[0] },
        ];

  const ctaLabel = realm.kind === 'simulation' ? `Enter ${realmLabel}` : `View ${realmLabel}`;

  return (
    <article
      data-reveal="1"
      style={{
        display: 'grid',
        gridTemplateColumns: 'minmax(0,1.05fr) minmax(0,1fr)',
        gap: 'clamp(24px,4vw,58px)',
        alignItems: 'center',
        padding: 'clamp(30px,5vh,54px) 0',
        borderBottom: '1px solid #2A2C30',
        opacity: 0,
        transform: 'translateY(16px)',
        transition: 'opacity .9s cubic-bezier(.22,.61,.36,1),transform .9s cubic-bezier(.22,.61,.36,1)',
      }}
    >
      <PlaceholderBox image={realm.kind === 'simple' ? realm.image : undefined} imageAlt={realm.title} />
      <div>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '14px',
            fontFamily: "'JetBrains Mono',monospace",
            fontSize: '10px',
            letterSpacing: '.16em',
          }}
        >
          <span style={{ color: 'rgba(237,232,221,.3)' }}>{realmLabel}</span>
          <span style={{ flex: 1, height: '1px', background: '#2A2C30', maxWidth: '60px' }} />
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '7px', color: '#5A9284' }}>
            <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#5A9284' }} />
            {statusLabel[realm.status]}
          </span>
        </div>
        <h2
          style={{
            margin: '14px 0 0',
            fontFamily: 'Fraunces,Georgia,serif',
            fontWeight: 400,
            fontSize: 'clamp(26px,3.4vw,44px)',
            lineHeight: 1.08,
            letterSpacing: '-.022em',
            color: '#EDE8DD',
          }}
        >
          {realm.title}
        </h2>
        <p
          style={{
            margin: '14px 0 0',
            maxWidth: '46ch',
            fontSize: '15.5px',
            lineHeight: 1.6,
            fontWeight: 300,
            color: 'rgba(237,232,221,.6)',
            textWrap: 'pretty',
          }}
        >
          {realm.tagline}
        </p>
        <div
          style={{
            marginTop: '26px',
            borderTop: '1px solid #2A2C30',
            fontFamily: "'JetBrains Mono',monospace",
            fontSize: '11px',
          }}
        >
          {stats.map((s) => (
            <div
              key={s.label}
              style={{
                display: 'grid',
                gridTemplateColumns: 'minmax(0,110px) minmax(0,1fr)',
                gap: '14px',
                padding: '11px 0',
                borderBottom: '1px solid #2A2C30',
              }}
            >
              <span style={{ color: 'rgba(237,232,221,.28)', letterSpacing: '.13em' }}>{s.label}</span>
              <span style={{ color: 'rgba(237,232,221,.72)' }}>{s.value}</span>
            </div>
          ))}
        </div>
        <a
          href="#work"
          onClick={(e) => {
            e.preventDefault();
            onEnter();
          }}
          className="foyer-cta"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '11px',
            marginTop: '26px',
            background: '#B8874F',
            color: '#0B0C0E',
            fontSize: '13px',
            fontWeight: 500,
            padding: '13px 22px',
            borderRadius: '2px',
          }}
        >
          {ctaLabel}
          <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '11px', opacity: 0.7 }}>→</span>
        </a>
      </div>
    </article>
  );
}
