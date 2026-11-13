import type { Project } from '../../work/types';
import PlaceholderBox from './PlaceholderBox';

interface ProjectCardProps {
  project: Project;
  onEnter: () => void;
}

export default function ProjectCard({ project, onEnter }: ProjectCardProps) {
  const projectLabel = String(project.order).padStart(2, '0');

  if (project.kind === 'planned') {
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
          color: 'rgba(237,232,221,.55)',
          opacity: 0,
          transform: 'translateY(16px)',
          transition: 'opacity .9s cubic-bezier(.22,.61,.36,1) .1s,transform .9s cubic-bezier(.22,.61,.36,1) .1s',
        }}
      >
        <span style={{ display: 'inline-flex', gap: '16px', alignItems: 'baseline' }}>
          <span>{projectLabel}</span>
          <span style={{ color: 'rgba(237,232,221,.5)' }}>{project.title}</span>
        </span>
        <span>{project.tagline}</span>
      </div>
    );
  }

  const stats = [
    { label: 'STACK', value: project.technologies.join(' · ') },
    { label: 'HIGHLIGHT', value: project.cardHighlight ?? project.highlights[0] },
  ];

  const ctaLabel = 'View project';

  return (
    <article
      data-reveal="1"
      className="foyer-card"
      style={{
        display: 'grid',
        alignItems: 'center',
        padding: 'clamp(30px,5vh,54px) 0',
        borderBottom: '1px solid #2A2C30',
        opacity: 0,
        transform: 'translateY(16px)',
        transition: 'opacity .9s cubic-bezier(.22,.61,.36,1),transform .9s cubic-bezier(.22,.61,.36,1)',
      }}
    >
      <PlaceholderBox image={project.image} imageAlt={project.title} />
      <div>
        <h2
          style={{
            margin: 0,
            fontFamily: 'Fraunces,Georgia,serif',
            fontWeight: 400,
            fontSize: 'clamp(26px,3.4vw,44px)',
            lineHeight: 1.08,
            letterSpacing: '-.022em',
            color: '#EDE8DD',
          }}
        >
          {project.title}
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
          {project.tagline}
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
              className="foyer-card-stat"
              style={{
                display: 'grid',
                padding: '11px 0',
                borderBottom: '1px solid #2A2C30',
              }}
            >
              <span style={{ color: 'rgba(237,232,221,.55)', letterSpacing: '.13em' }}>{s.label}</span>
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
