import { useRiverSim } from './useRiverSim';

interface WaterRightsViewProps {
  onBack: () => void;
}

export default function WaterRightsView({ onBack }: WaterRightsViewProps) {
  const {
    riverRef,
    rDayRef,
    rQRef,
    rSatRef,
    rCurtRef,
    rAdaptRef,
    sc0Ref,
    sc1Ref,
    sc2Ref,
    onScenario0,
    onScenario1,
    onScenario2,
  } = useRiverSim(true);

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
              <span style={{ color: 'rgba(237,232,221,.3)' }}>REALM I</span>
              <span style={{ width: '44px', height: '1px', background: '#2A2C30' }} />
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '7px', color: '#5A9284' }}>
                <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#5A9284' }} />
                MODEL RUNNING
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
              Water Rights
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
            Eighteen diverters on one river, ranked by seniority. The river shrinks. Junior users get cut, then
            quietly become more efficient — and the curtailment pattern changes because of it.
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
            <span>PRIOR APPROPRIATION · DAILY ALLOCATION</span>
            <span style={{ display: 'flex', flexWrap: 'wrap', gap: 'clamp(12px,2vw,22px)' }}>
              <span style={{ display: 'flex', gap: '7px' }}>
                <span>DAY</span>
                <span ref={rDayRef} style={{ color: '#5A9284' }}>
                  000
                </span>
              </span>
              <span style={{ display: 'flex', gap: '7px' }}>
                <span>Q</span>
                <span ref={rQRef} style={{ color: '#5A9284' }}>
                  000 CFS
                </span>
              </span>
              <span style={{ display: 'flex', gap: '7px' }}>
                <span>SATISFIED</span>
                <span ref={rSatRef} style={{ color: '#5A9284' }}>
                  00/18
                </span>
              </span>
              <span style={{ display: 'flex', gap: '7px' }}>
                <span>CURTAILED</span>
                <span ref={rCurtRef} style={{ color: '#5A9284' }}>
                  00
                </span>
              </span>
              <span style={{ display: 'flex', gap: '7px' }}>
                <span>ADAPTED</span>
                <span ref={rAdaptRef} style={{ color: '#5A9284' }}>
                  00
                </span>
              </span>
            </span>
          </div>
          <canvas
            ref={riverRef}
            style={{ display: 'block', width: '100%', aspectRatio: '16/7', background: '#0A0B0D' }}
          />
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '16px',
              padding: '14px 16px',
              borderTop: '1px solid #2A2C30',
            }}
          >
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: 'clamp(12px,2vw,24px)',
                fontFamily: "'JetBrains Mono',monospace",
                fontSize: '9.5px',
                letterSpacing: '.15em',
                color: 'rgba(237,232,221,.34)',
              }}
            >
              <span style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
                <span style={{ width: '7px', height: '7px', background: '#4E8577' }} />
                DIVERTING
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
                <span style={{ width: '7px', height: '7px', border: '1px solid #3A3D42' }} />
                CURTAILED
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
                <span style={{ width: '20px', height: '3px', background: '#4E8577' }} />
                REMAINING FLOW
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span
                style={{
                  fontFamily: "'JetBrains Mono',monospace",
                  fontSize: '9.5px',
                  letterSpacing: '.15em',
                  color: 'rgba(237,232,221,.28)',
                }}
              >
                SCENARIO
              </span>
              <div style={{ display: 'flex', gap: '6px' }}>
                <button
                  ref={sc0Ref}
                  onClick={onScenario0}
                  aria-pressed="true"
                  style={{
                    fontFamily: "'JetBrains Mono',monospace",
                    fontSize: '9.5px',
                    letterSpacing: '.14em',
                    padding: '8px 13px',
                    background: '#B8874F',
                    color: '#0B0C0E',
                    border: '1px solid #B8874F',
                    cursor: 'pointer',
                  }}
                >
                  NORMAL
                </button>
                <button
                  ref={sc1Ref}
                  onClick={onScenario1}
                  aria-pressed="false"
                  style={{
                    fontFamily: "'JetBrains Mono',monospace",
                    fontSize: '9.5px',
                    letterSpacing: '.14em',
                    padding: '8px 13px',
                    background: 'transparent',
                    color: 'rgba(237,232,221,.6)',
                    border: '1px solid #2A2C30',
                    cursor: 'pointer',
                  }}
                >
                  DRY
                </button>
                <button
                  ref={sc2Ref}
                  onClick={onScenario2}
                  aria-pressed="false"
                  style={{
                    fontFamily: "'JetBrains Mono',monospace",
                    fontSize: '9.5px',
                    letterSpacing: '.14em',
                    padding: '8px 13px',
                    background: 'transparent',
                    color: 'rgba(237,232,221,.6)',
                    border: '1px solid #2A2C30',
                    cursor: 'pointer',
                  }}
                >
                  SEVERE
                </button>
              </div>
            </div>
          </div>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit,minmax(min(100%,240px),1fr))',
            gap: 'clamp(18px,3vw,40px)',
            marginTop: 'clamp(28px,5vh,52px)',
          }}
        >
          <div>
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
              MECHANISM
            </div>
            <p
              style={{
                margin: '14px 0 0',
                fontSize: '14.5px',
                lineHeight: 1.6,
                fontWeight: 300,
                color: 'rgba(237,232,221,.6)',
                textWrap: 'pretty',
              }}
            >
              Each day the flow is allocated strictly down the seniority queue. A diverter takes its full demand or
              nothing.
            </p>
          </div>
          <div>
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
              REFLEXIVITY
            </div>
            <p
              style={{
                margin: '14px 0 0',
                fontSize: '14.5px',
                lineHeight: 1.6,
                fontWeight: 300,
                color: 'rgba(237,232,221,.6)',
                textWrap: 'pretty',
              }}
            >
              Repeated curtailment makes a junior user cut its own demand. Less demand upstream means water reaches
              further — so the curtailment set is not stable.
            </p>
          </div>
          <div>
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
              READ IT
            </div>
            <p
              style={{
                margin: '14px 0 0',
                fontSize: '14.5px',
                lineHeight: 1.6,
                fontWeight: 300,
                color: 'rgba(237,232,221,.6)',
                textWrap: 'pretty',
              }}
            >
              Switch to SEVERE and hold. The curtailment trace spikes, then settles lower than it started. Nobody
              negotiated that.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
