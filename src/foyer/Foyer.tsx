import { useEffect, useRef } from 'react';
import './foyer.css';
import { useColony } from '../colony/colonyApi';
import { useReveals } from './useReveals';
import { useProjectRoute } from './useProjectRoute';
import ProjectCard from './components/ProjectCard';
import ProjectView from '../work/ProjectView';
import { projects, getProject } from '../work';
import { bone, HAIRLINE, FONT_MONO, FONT_DISPLAY, FONT_BODY, TEAL_DEEP, AMBER, BONE } from '../colony/tokens';

export default function Foyer() {
  const rootRef = useRef<HTMLDivElement>(null);
  const { projectId, openProject, closeProject } = useProjectRoute();

  const { heroRef, onPointerDown, onPointerMove, onPointerLeave, cursor, setInstrumentsHidden } = useColony();

  const isProject = projectId !== null;
  const isIndex = !isProject;

  useReveals(rootRef, projectId ?? 'index');

  // The field belongs to the index. Inside a project the colony keeps running
  // as the background it is, but every readout and annotation comes off the
  // screen — a case study should not be read through an instrument panel.
  useEffect(() => {
    setInstrumentsHidden(isProject);
  }, [isProject, setInstrumentsHidden]);

  // Owned here rather than in the route, so that arriving by Back scrolls
  // exactly the same way as arriving by the on-page control.
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [projectId]);

  const onWorkClick = (e: React.MouseEvent) => {
    // On the index the anchor already does the right thing: scroll to the work
    // section. It only needs intercepting to leave an open project.
    if (!isProject) return;
    e.preventDefault();
    closeProject();
  };

  const openProjectEntry = projectId ? getProject(projectId) : undefined;
  const currentYear = new Date().getFullYear();

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
          <span style={{ fontFamily: FONT_MONO, fontSize: '10.5px', letterSpacing: '.24em', color: bone(0.8) }}>
            RP
          </span>
        </div>
        <nav style={{ display: 'flex', gap: 'clamp(14px,3vw,32px)', fontFamily: FONT_MONO, fontSize: '10px', letterSpacing: '.16em' }}>
          <a href="#work" onClick={onWorkClick} className="foyer-quiet-link">
            WORK
          </a>
          <a href="#contact" className="foyer-quiet-link">
            CONTACT
          </a>
        </nav>
      </header>

      {isIndex && (
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
                    fontSize: 'clamp(34px,4.6vw,62px)',
                    lineHeight: 1.04,
                    letterSpacing: '-.028em',
                    color: BONE,
                  }}
                >
                  <span style={{ display: 'block', overflow: 'hidden', paddingBottom: '.06em' }}>
                    <span style={{ display: 'block', animation: 'riseIn 1s cubic-bezier(.22,.61,.36,1) .4s both' }}>
                      Ryan Park
                    </span>
                  </span>
                </h1>
                <p
                  style={{
                    margin: '14px 0 0',
                    maxWidth: '44ch',
                    fontSize: '16px',
                    lineHeight: 1.55,
                    fontWeight: 300,
                    color: bone(0.58),
                    textWrap: 'pretty',
                    animation: 'fadeIn 1.2s ease .95s both',
                  }}
                >
                  Systems, theory, and practice. Building{' '}
                  <span
                    style={{
                      backgroundImage: `linear-gradient(${AMBER},${AMBER})`,
                      backgroundSize: '100% 1px',
                      backgroundPosition: '0 100%',
                      backgroundRepeat: 'no-repeat',
                      paddingBottom: '.06em',
                    }}
                  >
                    cool stuff
                  </span>
                  .
                </p>
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
              <a href="#work" className="foyer-quiet-link">
                &rarr; SELECTED WORK
              </a>
            </div>
          </div>
        </section>
      )}

      {isIndex && (
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
              <span style={{ color: bone(0.55) }}>SELECTED WORK</span>
            </div>

            {projects.map((project) => (
              <ProjectCard key={project.id} project={project} onEnter={() => openProject(project.id)} />
            ))}
          </div>
        </section>
      )}

      {isProject && openProjectEntry?.kind === 'case-study' && openProjectEntry.component && (
        <openProjectEntry.component onBack={closeProject} />
      )}
      {isProject && openProjectEntry?.kind === 'case-study' && !openProjectEntry.component && (
        <ProjectView project={openProjectEntry} onBack={closeProject} />
      )}

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
            <span style={{ fontSize: '10px', letterSpacing: '.18em', color: bone(0.55) }}>CONTACT</span>
            <a href="mailto:ryan.park2322@gmail.com" style={{ color: bone(0.75) }}>
              ryan.park2322@gmail.com
            </a>
            <a href="https://github.com/ryanpark2323" target="_blank" rel="noopener noreferrer" style={{ color: bone(0.75) }}>
              github.com/ryanpark2323
            </a>
            <a
              href="https://www.linkedin.com/in/ryan-park23"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: bone(0.75) }}
            >
              linkedin.com/in/ryan-park23
            </a>
            <span style={{ fontSize: '10px', letterSpacing: '.14em', color: bone(0.55) }}>Built by Ryan Park</span>
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
              color: bone(0.55),
            }}
          >
            <span>RYAN PARK · {currentYear}</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
