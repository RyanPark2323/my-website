import PlaceholderBox from '../foyer/components/PlaceholderBox';
import type { CaseStudy } from './types';

interface ProjectViewProps {
  project: CaseStudy;
  onBack: () => void;
}

/**
 * The shared case-study template: image (or placeholder), long description and
 * highlights. Built once and reused, so adding a project needs no new view
 * unless it wants a bespoke interactive one.
 *
 * Note that the stack is not shown here — it is on the index card only. If a
 * case study should report it, it wants a section of its own rather than the
 * label strip that used to sit above the canvas.
 */
export default function ProjectView({ project, onBack }: ProjectViewProps) {
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
          }}
        >
          &larr; ALL WORK
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
            <h2
              style={{
                margin: 0,
                fontFamily: 'Fraunces,Georgia,serif',
                fontWeight: 400,
                fontSize: 'clamp(30px,4.4vw,58px)',
                lineHeight: 1.04,
                letterSpacing: '-.026em',
                color: '#EDE8DD',
              }}
            >
              {project.title}
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
            {project.tagline}
          </p>
        </div>

        <div style={{ marginTop: 'clamp(22px,4vh,38px)', border: '1px solid #2A2C30', background: '#0A0B0D' }}>
          <div style={{ padding: 'clamp(16px,2.5vw,24px)' }}>
            <PlaceholderBox
              image={project.image}
              stillImage={project.imageStill}
              imageAlt={project.imageAlt ?? project.title}
              caption={project.imageCaption}
              annotation={project.imageAnnotation}
            />
            {project.longDescription.map((paragraph, i) => (
              <p
                key={paragraph.slice(0, 48)}
                style={{
                  margin: i === 0 ? '20px 0 0' : '15px 0 0',
                  fontSize: '14.5px',
                  lineHeight: 1.65,
                  fontWeight: 300,
                  color: 'rgba(237,232,221,.62)',
                  textWrap: 'pretty',
                }}
              >
                {paragraph}
              </p>
            ))}
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
                color: 'rgba(237,232,221,.55)',
                paddingBottom: '10px',
                borderBottom: '1px solid #2A2C30',
              }}
            >
              HIGHLIGHTS
            </div>
          </div>
          {project.highlights.map((h) => (
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

        <div style={{ marginTop: 'clamp(26px,4.5vh,46px)' }}>
          <div
            style={{
              fontFamily: "'JetBrains Mono',monospace",
              fontSize: '9.5px',
              letterSpacing: '.16em',
              color: 'rgba(237,232,221,.55)',
              paddingBottom: '10px',
              borderBottom: '1px solid #2A2C30',
            }}
          >
            STACK
          </div>
          <div
            style={{
              marginTop: '13px',
              fontFamily: "'JetBrains Mono',monospace",
              fontSize: '11.5px',
              letterSpacing: '.08em',
              lineHeight: 1.9,
              color: 'rgba(237,232,221,.62)',
            }}
          >
            {project.technologies.join(' · ')}
          </div>
        </div>
      </div>
    </section>
  );
}
