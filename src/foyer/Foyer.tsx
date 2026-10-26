import { useRef, useState } from 'react';
import './foyer.css';
import { useColony } from '../colony/colonyApi';
import { useReveals } from './useReveals';
import RealmTeaserCard from './components/RealmTeaserCard';
import SimpleRealmView from '../realms/SimpleRealmView';
import { realms, getRealm } from '../realms';
import { toRoman } from '../lib/roman';
import { bone, HAIRLINE, FONT_MONO, FONT_DISPLAY, FONT_BODY, TEAL, TEAL_DEEP, AMBER, BONE } from '../colony/tokens';

type ViewState = 'foyer' | 'realm';

export default function Foyer() {
  const [view, setView] = useState<ViewState>('foyer');
  const [openRealmId, setOpenRealmId] = useState<string | null>(null);
  const rootRef = useRef<HTMLDivElement>(null);

  const { heroRef, onPointerDown, onPointerMove, onPointerLeave, cursor, footNoteRef } = useColony();

  useReveals(rootRef, view + (openRealmId ?? ''));

  function goHome() {
    setView('foyer');
    setOpenRealmId(null);
    window.scrollTo(0, 0);
  }

  function enterRealm(id: string) {
    setOpenRealmId(id);
    setView('realm');
    window.scrollTo(0, 0);
  }

  const onHomeClick = (e: React.MouseEvent) => {
    e.preventDefault();
    goHome();
  };

  const isFoyer = view === 'foyer';
  const isRealm = view === 'realm';
  const openRealm = openRealmId ? getRealm(openRealmId) : undefined;
  const builtCount = realms.filter((r) => r.status !== 'unbuilt').length;
  const currentYear = toRoman(new Date().getFullYear());

  return (
    <div
      ref={rootRef}
      className="foyer"
      style={{
        position: 'relative',
        minHeight: '100vh',
        fontFamily: FONT_BODY,
        overflowX: 'hidden',
        zIndex: 2,
      }}
    >
      <header
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '24px',
          padding: '20px clamp(20px,5vw,64px)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '13px' }}>
          <div style={{ width: '8px', height: '8px', border: `1px solid ${TEAL_DEEP}`, transform: 'rotate(45deg)' }} />
          <span style={{ fontFamily: FONT_MONO, fontSize: '10.5px', letterSpacing: '.2em', color: bone(0.8) }}>
            THE INSTRUMENT
          </span>
        </div>
        <nav style={{ display: 'flex', gap: 'clamp(14px,3vw,32px)', fontFamily: FONT_MONO, fontSize: '10px', letterSpacing: '.16em' }}>
          <a href="#work" onClick={onHomeClick} style={{ color: bone(0.5) }}>
            WORK
          </a>
          <a href="#contact" style={{ color: bone(0.5) }}>
            CONTACT
          </a>
        </nav>
      </header>

      {isFoyer && (
        <section
          ref={heroRef}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerLeave={onPointerLeave}
          style={{
            minHeight: 'calc(100vh - 60px)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-end',
            padding: '0 clamp(20px,5vw,64px) clamp(20px,3vh,30px)',
            cursor,
            pointerEvents: 'auto',
            touchAction: 'manipulation',
          }}
        >
          <div style={{ flex: 1 }} />

          <div style={{ maxWidth: '1180px', width: '100%', margin: '0 auto' }}>
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                alignItems: 'flex-end',
                justifyContent: 'space-between',
                gap: 'clamp(22px,4vw,60px)',
              }}
            >
              <div style={{ minWidth: 'min(100%,340px)' }}>
                <h1
                  style={{
                    margin: 0,
                    fontFamily: FONT_DISPLAY,
                    fontWeight: 400,
                    fontSize: 'clamp(25px,2.9vw,40px)',
                    lineHeight: 1.12,
                    letterSpacing: '-.02em',
                    color: BONE,
                    maxWidth: '20ch',
                  }}
                >
                  <span style={{ display: 'block', overflow: 'hidden', paddingBottom: '.06em' }}>
                    <span style={{ display: 'block', animation: 'riseIn 1s cubic-bezier(.22,.61,.36,1) .4s both' }}>
                      Agent-based models of
                    </span>
                  </span>
                  <span style={{ display: 'block', overflow: 'hidden', paddingBottom: '.06em' }}>
                    <span style={{ display: 'block', animation: 'riseIn 1s cubic-bezier(.22,.61,.36,1) .52s both' }}>
                      systems that{' '}
                      <span
                        style={{
                          backgroundImage: `linear-gradient(${AMBER},${AMBER})`,
                          backgroundSize: '100% 2px',
                          backgroundPosition: '0 98%',
                          backgroundRepeat: 'no-repeat',
                          paddingBottom: '.05em',
                        }}
                      >
                        answer back
                      </span>
                      .
                    </span>
                  </span>
                </h1>
              </div>

            </div>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                marginTop: 'clamp(18px,3vh,28px)',
                paddingTop: '14px',
                borderTop: `1px solid ${HAIRLINE}`,
                fontFamily: FONT_MONO,
                fontSize: '9.5px',
                letterSpacing: '.16em',
                animation: 'fadeIn 1.2s ease 1.35s both',
              }}
            >
              <a href="#work" style={{ color: bone(0.5) }}>
                &rarr; REALM I
              </a>
            </div>
          </div>
        </section>
      )}

      {isFoyer && (
        <section
          id="work"
          style={{
            background: 'rgba(11,12,14,.8)',
            backdropFilter: 'blur(3px)',
            WebkitBackdropFilter: 'blur(3px)',
            borderTop: `1px solid ${HAIRLINE}`,
            padding: 'clamp(56px,10vh,120px) clamp(20px,5vw,64px)',
          }}
        >
          <div style={{ maxWidth: '1180px', margin: '0 auto' }}>
            <div
              data-reveal="1"
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                alignItems: 'baseline',
                justifyContent: 'space-between',
                gap: '16px',
                paddingBottom: '20px',
                borderBottom: `1px solid ${HAIRLINE}`,
                fontFamily: FONT_MONO,
                fontSize: '10.5px',
                letterSpacing: '.18em',
                opacity: 0,
                transform: 'translateY(16px)',
                transition: 'opacity .9s cubic-bezier(.22,.61,.36,1),transform .9s cubic-bezier(.22,.61,.36,1)',
              }}
            >
              <span style={{ color: bone(0.32) }}>REALMS</span>
              <span style={{ color: bone(0.32) }}>
                {String(builtCount).padStart(2, '0')} BUILT · <span style={{ color: TEAL }}>SET GROWING</span>
              </span>
            </div>

            {realms.map((realm) => (
              <RealmTeaserCard key={realm.id} realm={realm} onEnter={() => enterRealm(realm.id)} />
            ))}
          </div>
        </section>
      )}

      {isRealm && openRealm && openRealm.kind === 'simulation' && <openRealm.component onBack={goHome} />}
      {isRealm && openRealm && openRealm.kind === 'simple' && <SimpleRealmView realm={openRealm} onBack={goHome} />}

      <footer
        id="contact"
        style={{
          background: 'rgba(11,12,14,.86)',
          backdropFilter: 'blur(3px)',
          WebkitBackdropFilter: 'blur(3px)',
          borderTop: `1px solid ${HAIRLINE}`,
          padding: 'clamp(44px,7vh,72px) clamp(20px,5vw,64px) 30px',
        }}
      >
        <div style={{ maxWidth: '1180px', margin: '0 auto' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'baseline', gap: 'clamp(24px,5vw,64px)', fontFamily: FONT_MONO, fontSize: '12px' }}>
            <span style={{ fontSize: '10px', letterSpacing: '.18em', color: bone(0.28) }}>CONTACT</span>
            <a href="mailto:ryan.park2322@gmail.com" style={{ color: bone(0.75) }}>
              ryan.park2322@gmail.com
            </a>
            <a href="https://github.com/ryanpark2323" target="_blank" rel="noopener noreferrer" style={{ color: bone(0.75) }}>
              github.com/ryanpark2323
            </a>
            <span style={{ fontSize: '10px', letterSpacing: '.14em', color: bone(0.24) }}>Built by Ryan Park</span>
          </div>
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'space-between',
              gap: '16px',
              marginTop: 'clamp(34px,6vh,60px)',
              paddingTop: '16px',
              borderTop: `1px solid ${HAIRLINE}`,
              fontFamily: FONT_MONO,
              fontSize: '9.5px',
              letterSpacing: '.13em',
              color: bone(0.2),
            }}
          >
            <span>THE INSTRUMENT · {currentYear}</span>
            <span ref={footNoteRef}>AMBIENT ENGINE: ANT COLONY · CLIENT-SIDE</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
