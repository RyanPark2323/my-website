import { useEffect, useRef, useState } from 'react';
import './foyer.css';
import { useAntColonySim } from './ambient/useAntColonySim';
import RealmTeaserCard from './components/RealmTeaserCard';
import SimpleRealmView from '../realms/SimpleRealmView';
import { realms, getRealm } from '../realms';
import { toRoman } from '../lib/roman';

const SHOW_READOUT = true;

type ViewState = 'foyer' | 'realm';

export default function Foyer() {
  const [view, setView] = useState<ViewState>('foyer');
  const [openRealmId, setOpenRealmId] = useState<string | null>(null);
  const isFirstRender = useRef(true);

  const {
    rootRef,
    canvasRef,
    annoRef,
    tickRef,
    agentsRef,
    srcRef,
    deliverRef,
    fpsRef,
    hintRef,
    toastRef,
    footNoteRef,
    onFieldClick,
    onHintActivate,
    onViewChange,
  } = useAntColonySim();

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    onViewChange(view);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [view]);

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
        background: '#0B0C0E',
        fontFamily: "'Public Sans',system-ui,sans-serif",
        overflowX: 'hidden',
      }}
    >
      <canvas
        ref={canvasRef}
        style={{
          position: 'fixed',
          inset: 0,
          width: '100%',
          height: '100%',
          zIndex: 0,
          pointerEvents: 'none',
          display: 'block',
        }}
      />
      <div
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 1,
          pointerEvents: 'none',
          background:
            'linear-gradient(to top,rgba(11,12,14,.97) 0%,rgba(11,12,14,.86) 14%,rgba(11,12,14,.3) 34%,rgba(11,12,14,0) 52%),linear-gradient(to bottom,rgba(11,12,14,.9) 0%,rgba(11,12,14,0) 14%)',
        }}
      />
      <div
        ref={annoRef}
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 1,
          pointerEvents: 'none',
          opacity: 0,
          transition: 'opacity .6s ease',
          fontFamily: "'JetBrains Mono',monospace",
        }}
      >
        <div
          data-anno="0"
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            fontSize: '9.5px',
            letterSpacing: '.16em',
            color: 'rgba(237,232,221,.5)',
            whiteSpace: 'nowrap',
          }}
        >
          NEST · COLONY ORIGIN
        </div>
        <div
          data-anno="1"
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            fontSize: '9.5px',
            letterSpacing: '.16em',
            color: '#5A9284',
            whiteSpace: 'nowrap',
          }}
        >
          SOURCE 02 · <span data-anno-val="1">UNFOUND</span>
        </div>
        <div
          data-anno="2"
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            fontSize: '9.5px',
            letterSpacing: '.16em',
            color: '#5A9284',
            whiteSpace: 'nowrap',
          }}
        >
          PHEROMONE ρ <span data-anno-val="2">0.00</span> · <span data-anno-state="2">SETTLING</span>
        </div>
      </div>

      <div style={{ position: 'relative', zIndex: 2 }}>
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
            <div style={{ width: '8px', height: '8px', border: '1px solid #4E8577', transform: 'rotate(45deg)' }} />
            <span
              style={{
                fontFamily: "'JetBrains Mono',monospace",
                fontSize: '10.5px',
                letterSpacing: '.2em',
                color: 'rgba(237,232,221,.8)',
              }}
            >
              THE INSTRUMENT
            </span>
          </div>
          <nav
            style={{
              display: 'flex',
              gap: 'clamp(14px,3vw,32px)',
              fontFamily: "'JetBrains Mono',monospace",
              fontSize: '10px',
              letterSpacing: '.16em',
            }}
          >
            <a href="#work" onClick={onHomeClick} style={{ color: 'rgba(237,232,221,.5)' }}>
              WORK
            </a>
            <a href="#contact" style={{ color: 'rgba(237,232,221,.5)' }}>
              CONTACT
            </a>
          </nav>
        </header>

        {isFoyer && (
          <section
            onClick={onFieldClick}
            style={{
              minHeight: 'calc(100vh - 60px)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'flex-end',
              padding: '0 clamp(20px,5vw,64px) clamp(20px,3vh,30px)',
              cursor: 'crosshair',
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
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '9px',
                      marginBottom: '16px',
                      animation: 'fadeIn 1s ease .2s both',
                    }}
                  >
                    <span
                      style={{
                        width: '5px',
                        height: '5px',
                        borderRadius: '50%',
                        background: '#5A9284',
                        animation: 'pulseDot 3.4s ease-in-out infinite',
                      }}
                    />
                    <span
                      style={{
                        fontFamily: "'JetBrains Mono',monospace",
                        fontSize: '10px',
                        letterSpacing: '.18em',
                        color: '#5A9284',
                      }}
                    >
                      ANT COLONY OPTIMIZATION · LIVE
                    </span>
                  </div>
                  <h1
                    style={{
                      margin: 0,
                      fontFamily: 'Fraunces,Georgia,serif',
                      fontWeight: 400,
                      fontSize: 'clamp(25px,2.9vw,40px)',
                      lineHeight: 1.12,
                      letterSpacing: '-.02em',
                      color: '#EDE8DD',
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
                            backgroundImage: 'linear-gradient(#C9975C,#C9975C)',
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

                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '14px',
                    alignItems: 'flex-start',
                    animation: 'fadeIn 1.2s ease 1.1s both',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      flexWrap: 'wrap',
                      gap: 'clamp(14px,2.2vw,26px)',
                      fontFamily: "'JetBrains Mono',monospace",
                      fontSize: '9.5px',
                      letterSpacing: '.15em',
                    }}
                  >
                    <span style={{ display: 'flex', alignItems: 'center', gap: '7px', color: 'rgba(237,232,221,.4)' }}>
                      <span style={{ width: '4px', height: '4px', background: 'rgba(237,232,221,.6)' }} />
                      SEARCHING
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '7px', color: 'rgba(237,232,221,.4)' }}>
                      <span style={{ width: '5px', height: '5px', background: '#7AB2A3' }} />
                      CARRYING
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '7px', color: 'rgba(237,232,221,.4)' }}>
                      <span
                        style={{
                          width: '24px',
                          height: '4px',
                          background: 'linear-gradient(90deg,rgba(78,133,119,0),#4E8577)',
                        }}
                      />
                      PHEROMONE
                    </span>
                  </div>
                  {SHOW_READOUT && (
                    <div
                      style={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: 'clamp(14px,2.2vw,26px)',
                        fontFamily: "'JetBrains Mono',monospace",
                        fontSize: '10px',
                        letterSpacing: '.13em',
                      }}
                    >
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <span style={{ color: 'rgba(237,232,221,.28)' }}>TICK</span>
                        <span ref={tickRef} style={{ color: '#5A9284' }}>
                          000000
                        </span>
                      </div>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <span style={{ color: 'rgba(237,232,221,.28)' }}>AGENTS</span>
                        <span ref={agentsRef} style={{ color: '#5A9284' }}>
                          000
                        </span>
                      </div>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <span style={{ color: 'rgba(237,232,221,.28)' }}>SOURCES</span>
                        <span ref={srcRef} style={{ color: '#5A9284' }}>
                          00
                        </span>
                      </div>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <span style={{ color: 'rgba(237,232,221,.28)' }}>DELIVERIES</span>
                        <span ref={deliverRef} style={{ color: '#5A9284' }}>
                          0000
                        </span>
                      </div>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <span style={{ color: 'rgba(237,232,221,.28)' }}>FPS</span>
                        <span ref={fpsRef} style={{ color: '#5A9284' }}>
                          00
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '20px',
                  marginTop: 'clamp(18px,3vh,28px)',
                  paddingTop: '14px',
                  borderTop: '1px solid #2A2C30',
                  fontFamily: "'JetBrains Mono',monospace",
                  fontSize: '9.5px',
                  letterSpacing: '.16em',
                  color: 'rgba(237,232,221,.3)',
                  animation: 'fadeIn 1.2s ease 1.35s both',
                }}
              >
                <a href="#work" style={{ color: 'rgba(237,232,221,.5)' }}>
                  → REALM I
                </a>
                <span style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <button
                    ref={hintRef}
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onHintActivate();
                    }}
                    aria-label="Add a source to the field"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '8px',
                      color: 'rgba(237,232,221,.62)',
                      animation: 'fadeIn 1.6s ease 2.4s both',
                      background: 'none',
                      border: 'none',
                      padding: 0,
                      font: 'inherit',
                      letterSpacing: 'inherit',
                      cursor: 'pointer',
                    }}
                  >
                    <span style={{ width: '8px', height: '8px', border: '1px solid #4E8577', borderRadius: '50%' }} />
                    CLICK THE FIELD TO DROP A SOURCE
                  </button>
                  <span ref={toastRef} style={{ color: '#5A9284', opacity: 0, transition: 'opacity .5s ease' }}>
                    SOURCE ADDED
                  </span>
                </span>
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
              borderTop: '1px solid #2A2C30',
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
                  borderBottom: '1px solid #2A2C30',
                  fontFamily: "'JetBrains Mono',monospace",
                  fontSize: '10.5px',
                  letterSpacing: '.18em',
                  opacity: 0,
                  transform: 'translateY(16px)',
                  transition: 'opacity .9s cubic-bezier(.22,.61,.36,1),transform .9s cubic-bezier(.22,.61,.36,1)',
                }}
              >
                <span style={{ color: 'rgba(237,232,221,.32)' }}>REALMS</span>
                <span style={{ color: 'rgba(237,232,221,.32)' }}>
                  {String(builtCount).padStart(2, '0')} BUILT · <span style={{ color: '#5A9284' }}>SET GROWING</span>
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
            borderTop: '1px solid #2A2C30',
            padding: 'clamp(44px,7vh,72px) clamp(20px,5vw,64px) 30px',
          }}
        >
          <div style={{ maxWidth: '1180px', margin: '0 auto' }}>
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                alignItems: 'baseline',
                gap: 'clamp(24px,5vw,64px)',
                fontFamily: "'JetBrains Mono',monospace",
                fontSize: '12px',
              }}
            >
              <span style={{ fontSize: '10px', letterSpacing: '.18em', color: 'rgba(237,232,221,.28)' }}>
                CONTACT
              </span>
              <a href="mailto:ryan.park2322@gmail.com" style={{ color: 'rgba(237,232,221,.75)' }}>
                ryan.park2322@gmail.com
              </a>
              <a
                href="https://github.com/ryanpark2323"
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: 'rgba(237,232,221,.75)' }}
              >
                github.com/ryanpark2323
              </a>
              <span style={{ fontSize: '10px', letterSpacing: '.14em', color: 'rgba(237,232,221,.24)' }}>
                Built by Ryan Park
              </span>
            </div>
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                justifyContent: 'space-between',
                gap: '16px',
                marginTop: 'clamp(34px,6vh,60px)',
                paddingTop: '16px',
                borderTop: '1px solid #2A2C30',
                fontFamily: "'JetBrains Mono',monospace",
                fontSize: '9.5px',
                letterSpacing: '.13em',
                color: 'rgba(237,232,221,.2)',
              }}
            >
              <span>THE INSTRUMENT · {currentYear}</span>
              <span ref={footNoteRef}>AMBIENT ENGINE: ANT COLONY OPTIMIZATION · CLIENT-SIDE</span>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
