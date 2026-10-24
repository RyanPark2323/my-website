import { toRoman } from '../lib/roman';
import PlaceholderBox from '../foyer/components/PlaceholderBox';
import type { SimpleRealm } from './types';

interface SimpleRealmViewProps {
  realm: SimpleRealm;
  onBack: () => void;
}

/**
 * Generic case-study template shared by every `kind: 'simple'` realm — image
 * (or placeholder), long description, highlights and stack. Built once,
 * reused for all of them; adding another simple realm needs no new view.
 */
export default function SimpleRealmView({ realm, onBack }: SimpleRealmViewProps) {
  const realmLabel = `REALM ${toRoman(realm.order)}`;

  const handleBack = (e: React.MouseEvent) => {
    e.preventDefault();
    onBack();
  };

  return (
    <section
      style={{
        background: 'rgba(11,12,14,.9)',
        backdropFilter: 'blur(4px)',
        WebkitBackdropFilter: 'blur(4px)',
        minHeight: 'calc(100vh - 60px)',
        padding: 'clamp(24px,4vh,44px) clamp(20px,5vw,64px) clamp(48px,8vh,90px)',
      }}
    >
      <div style={{ maxWidth: '1180px', margin: '0 auto' }}>
        <a
          href="#work"
          onClick={handleBack}
          className="foyer-back"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '9px',
            fontFamily: "'JetBrains Mono',monospace",
            fontSize: '10px',
            letterSpacing: '.16em',
            color: 'rgba(237,232,221,.45)',
          }}
        >
          ← THE FOYER
        </a>

        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'flex-end',
            justifyContent: 'space-between',
            gap: '24px',
            marginTop: 'clamp(22px,4vh,40px)',
            paddingBottom: '22px',
            borderBottom: '1px solid #2A2C30',
          }}
        >
          <div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '13px',
                fontFamily: "'JetBrains Mono',monospace",
                fontSize: '10px',
                letterSpacing: '.16em',
              }}
            >
              <span style={{ color: 'rgba(237,232,221,.3)' }}>{realmLabel}</span>
              <span style={{ width: '44px', height: '1px', background: '#2A2C30' }} />
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '7px', color: '#5A9284' }}>
                <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#5A9284' }} />
                BUILT
              </span>
            </div>
            <h2
              style={{
                margin: '12px 0 0',
                fontFamily: 'Fraunces,Georgia,serif',
                fontWeight: 400,
                fontSize: 'clamp(30px,4.4vw,58px)',
                lineHeight: 1.04,
                letterSpacing: '-.026em',
                color: '#EDE8DD',
              }}
            >
              {realm.title}
            </h2>
          </div>
          <p
            style={{
              margin: 0,
              maxWidth: '44ch',
              fontSize: '15px',
              lineHeight: 1.6,
              fontWeight: 300,
              color: 'rgba(237,232,221,.58)',
              textWrap: 'pretty',
            }}
          >
            {realm.tagline}
          </p>
        </div>

        <div style={{ marginTop: 'clamp(22px,4vh,38px)', border: '1px solid #2A2C30', background: '#0A0B0D' }}>
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '14px',
              padding: '12px 16px',
              borderBottom: '1px solid #2A2C30',
              fontFamily: "'JetBrains Mono',monospace",
              fontSize: '9.5px',
              letterSpacing: '.15em',
              color: 'rgba(237,232,221,.3)',
            }}
          >
            <span>CASE STUDY</span>
            <span style={{ color: 'rgba(237,232,221,.4)' }}>{realm.technologies.join(' · ')}</span>
          </div>
          <div style={{ padding: 'clamp(16px,2.5vw,24px)' }}>
            <PlaceholderBox image={realm.image} imageAlt={realm.title} label="MODEL CANVAS · 1600×1000" />
            <p
              style={{
                margin: '20px 0 0',
                fontSize: '14.5px',
                lineHeight: 1.65,
                fontWeight: 300,
                color: 'rgba(237,232,221,.62)',
                textWrap: 'pretty',
              }}
            >
              {realm.longDescription}
            </p>
          </div>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit,minmax(min(100%,240px),1fr))',
            gap: 'clamp(14px,2.5vw,28px)',
            marginTop: 'clamp(28px,5vh,52px)',
          }}
        >
          <div style={{ gridColumn: '1 / -1' }}>
            <div
              style={{
                fontFamily: "'JetBrains Mono',monospace",
                fontSize: '9.5px',
                letterSpacing: '.16em',
                color: 'rgba(237,232,221,.28)',
                paddingBottom: '10px',
                borderBottom: '1px solid #2A2C30',
              }}
            >
              HIGHLIGHTS
            </div>
          </div>
          {realm.highlights.map((h) => (
            <div key={h} style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
              <span style={{ width: '5px', height: '5px', marginTop: '7px', flexShrink: 0, background: '#5A9284' }} />
              <p
                style={{
                  margin: 0,
                  fontSize: '14.5px',
                  lineHeight: 1.6,
                  fontWeight: 300,
                  color: 'rgba(237,232,221,.6)',
                  textWrap: 'pretty',
                }}
              >
                {h}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
