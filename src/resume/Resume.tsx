import { bone, HAIRLINE, FONT_MONO, FONT_DISPLAY, TEAL, AMBER } from '../colony/tokens';
import {
  RESUME_PDF,
  RESUME_UPDATED,
  resumeHeader,
  resumeSections,
  type ResumeEntry,
} from './resume.data';

interface ResumeProps {
  onBack: () => void;
}

const monoLabel: React.CSSProperties = {
  fontFamily: FONT_MONO,
  fontSize: '9.5px',
  letterSpacing: '.16em',
  color: bone(0.28),
};

function Entry({ entry }: { entry: ResumeEntry }) {
  return (
    <div style={{ marginTop: 'clamp(20px,3vh,30px)' }}>
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'baseline',
          justifyContent: 'space-between',
          gap: '6px 20px',
        }}
      >
        <h3
          style={{
            margin: 0,
            fontFamily: FONT_DISPLAY,
            fontWeight: 400,
            fontSize: 'clamp(17px,2vw,21px)',
            letterSpacing: '-.012em',
            color: bone(0.92),
          }}
        >
          {entry.title}
        </h3>
        {entry.meta && <span style={{ ...monoLabel, letterSpacing: '.1em' }}>{entry.meta}</span>}
      </div>

      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'baseline',
          justifyContent: 'space-between',
          gap: '4px 20px',
          marginTop: '5px',
          fontFamily: FONT_MONO,
          fontSize: '11px',
          letterSpacing: '.06em',
          color: bone(0.5),
        }}
      >
        <span>{entry.subtitle}</span>
        {entry.metaSecondary && <span style={{ color: bone(0.38) }}>{entry.metaSecondary}</span>}
      </div>

      <ul style={{ margin: '12px 0 0', padding: 0, listStyle: 'none' }}>
        {entry.bullets.map((b) => (
          <li
            key={b.text.slice(0, 48)}
            style={{ display: 'flex', gap: '10px', alignItems: 'flex-start', marginTop: '8px' }}
          >
            <span
              style={{ width: '5px', height: '5px', marginTop: '8px', flexShrink: 0, background: TEAL }}
            />
            <p
              style={{
                margin: 0,
                fontSize: '14px',
                lineHeight: 1.62,
                fontWeight: 300,
                color: bone(0.62),
                textWrap: 'pretty',
              }}
            >
              {b.label && <span style={{ color: bone(0.85) }}>{b.label}: </span>}
              {b.text}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}

/**
 * The resume as a page rather than an embedded PDF: a white document dropped
 * into this palette reads as a different website, and a PDF is miserable on a
 * phone. The download is right here for anyone who wants the file itself.
 */
export default function Resume({ onBack }: ResumeProps) {
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
      <div style={{ maxWidth: '920px', margin: '0 auto' }}>
        <a
          href="#work"
          onClick={handleBack}
          className="foyer-back"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '9px',
            fontFamily: FONT_MONO,
            fontSize: '10px',
            letterSpacing: '.16em',
            color: bone(0.45),
          }}
        >
          &larr; BACK
        </a>

        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'flex-end',
            justifyContent: 'space-between',
            gap: '20px',
            marginTop: 'clamp(22px,4vh,40px)',
            paddingBottom: '20px',
            borderBottom: `1px solid ${HAIRLINE}`,
          }}
        >
          <div>
            <h2
              style={{
                margin: 0,
                fontFamily: FONT_DISPLAY,
                fontWeight: 400,
                fontSize: 'clamp(30px,4.4vw,52px)',
                lineHeight: 1.04,
                letterSpacing: '-.026em',
                color: bone(1),
              }}
            >
              {resumeHeader.name}
            </h2>
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '6px 16px',
                marginTop: '12px',
                fontFamily: FONT_MONO,
                fontSize: '11px',
                letterSpacing: '.06em',
                color: bone(0.5),
              }}
            >
              <span>{resumeHeader.location}</span>
              <a href={`mailto:${resumeHeader.email}`} style={{ color: bone(0.72) }}>
                {resumeHeader.email}
              </a>
              <a
                href={resumeHeader.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: bone(0.72) }}
              >
                LinkedIn
              </a>
            </div>
          </div>

          <a
            href={RESUME_PDF}
            download="Ryan-Park-Resume.pdf"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '10px',
              padding: '11px 18px',
              border: `1px solid ${HAIRLINE}`,
              fontFamily: FONT_MONO,
              fontSize: '10px',
              letterSpacing: '.16em',
              color: AMBER,
              whiteSpace: 'nowrap',
            }}
          >
            DOWNLOAD PDF &darr;
          </a>
        </div>

        {resumeSections.map((section) => (
          <div key={section.heading} style={{ marginTop: 'clamp(30px,5vh,52px)' }}>
            <div style={{ ...monoLabel, paddingBottom: '10px', borderBottom: `1px solid ${HAIRLINE}` }}>
              {section.heading}
            </div>
            {section.entries.map((entry) => (
              <Entry key={entry.title} entry={entry} />
            ))}
          </div>
        ))}

        <p
          style={{
            margin: 'clamp(34px,5vh,56px) 0 0',
            fontFamily: FONT_MONO,
            fontSize: '9.5px',
            letterSpacing: '.14em',
            color: bone(0.26),
          }}
        >
          LAST UPDATED {RESUME_UPDATED.toUpperCase()}
        </p>
      </div>
    </section>
  );
}
