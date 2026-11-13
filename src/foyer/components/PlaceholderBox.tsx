import { AMBER } from '../../colony/tokens';

/** Gap between the callout and what it points at, as a share of frame height. */
const CONNECTOR_HEIGHT = 7;

/**
 * A callout pinned to a point in the image. Positions are percentages of the
 * frame, so they track the image at any size rather than at one fixed width.
 */
export interface ImageAnnotation {
  /** First line, in bone. */
  text: string;
  /** Second line, in amber, for the part worth noticing. Optional. */
  emphasis?: string;
  /**
   * The point being named, as a percentage of frame width and height. The
   * callout sits above it, so `y` wants the top edge of the subject rather
   * than its centre.
   */
  x: number;
  y: number;
}

interface PlaceholderBoxProps {
  image?: string;
  /**
   * Shown in place of `image` when the reader has asked their system for
   * reduced motion. Only meaningful when `image` is animated.
   */
  stillImage?: string;
  imageAlt?: string;
  /** A mono readout over the bottom of the image, for figures that need one. */
  caption?: string;
  /** A callout pointing at something inside the image. */
  annotation?: ImageAnnotation;
  label?: string;
}

/**
 * The site's intentional "screenshot not in yet" treatment. Swapping in a
 * real image later is just passing `image` — no broken <img> in the
 * meantime.
 */
export default function PlaceholderBox({
  image,
  stillImage,
  imageAlt,
  caption,
  annotation,
  label = 'IMAGE · 1600×1000',
}: PlaceholderBoxProps) {
  const boxStyle: React.CSSProperties = {
    position: 'relative',
    aspectRatio: '16/10',
    border: '1px solid #2A2C30',
    backgroundColor: '#0D0E11',
    overflow: 'hidden',
  };

  if (image) {
    return (
      <div style={boxStyle}>
        {/*
          A <picture> rather than an <img> so an animated source can fall back
          to a still frame for anyone who has asked their system for reduced
          motion. The media query does the work; no script, no state.
        */}
        <picture>
          {stillImage && <source media="(prefers-reduced-motion: reduce)" srcSet={stillImage} />}
          <img
            src={image}
            alt={imageAlt ?? ''}
            loading="lazy"
            decoding="async"
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
          />
        </picture>
        {annotation && (
          <>
            {/*
              Centred on the marker's x so the callout sits directly over what
              it names, with the connector running down to it.
            */}
            <div
              style={{
                position: 'absolute',
                left: `${annotation.x}%`,
                // Sits on top of the connector: the translate lifts it by its
                // own height, so the two meet whatever the text wraps to.
                top: `${annotation.y - CONNECTOR_HEIGHT}%`,
                transform: 'translate(-50%,-100%)',
                textAlign: 'center',
                whiteSpace: 'nowrap',
                fontFamily: "'JetBrains Mono',monospace",
                fontSize: '9.5px',
                letterSpacing: '.14em',
                lineHeight: 1.7,
                pointerEvents: 'none',
              }}
            >
              <div style={{ color: 'rgba(237,232,221,.55)' }}>{annotation.text}</div>
              {annotation.emphasis && <div style={{ color: AMBER }}>{annotation.emphasis}</div>}
            </div>
            <div
              style={{
                position: 'absolute',
                left: `${annotation.x}%`,
                top: `${annotation.y - CONNECTOR_HEIGHT}%`,
                // A percentage height resolves against the frame's height,
                // unlike a percentage margin, which would resolve against its
                // width and drift as the box changes size.
                height: `${CONNECTOR_HEIGHT}%`,
                width: '1px',
                background: 'rgba(237,232,221,.3)',
                pointerEvents: 'none',
              }}
            />
          </>
        )}
        {caption && (
          <div
            style={{
              position: 'absolute',
              inset: 'auto 0 0 0',
              display: 'flex',
              justifyContent: 'flex-start',
              padding: '26px 16px 12px',
              // The scrim keeps the readout legible wherever the frame is
              // bright, without flattening the image behind it.
              background: 'linear-gradient(to top,rgba(11,12,14,.92),rgba(11,12,14,0))',
              fontFamily: "'JetBrains Mono',monospace",
              fontSize: '9.5px',
              letterSpacing: '.14em',
              color: 'rgba(237,232,221,.62)',
              pointerEvents: 'none',
            }}
          >
            {caption}
          </div>
        )}
      </div>
    );
  }

  return (
    <div
      style={{
        ...boxStyle,
        backgroundImage: 'repeating-linear-gradient(115deg,rgba(78,133,119,.09) 0 1px,transparent 1px 9px)',
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'space-between',
        padding: '14px 16px',
        fontFamily: "'JetBrains Mono',monospace",
        fontSize: '9.5px',
        letterSpacing: '.16em',
        color: 'rgba(237,232,221,.55)',
      }}
    >
      <span>{label}</span>
      <span style={{ color: 'rgba(78,133,119,.75)' }}>PENDING</span>
    </div>
  );
}
