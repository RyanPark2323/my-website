interface PlaceholderBoxProps {
  image?: string;
  imageAlt?: string;
  label?: string;
}

/**
 * The site's intentional "screenshot not in yet" treatment. Swapping in a
 * real image later is just passing `image` — no broken <img> in the
 * meantime.
 */
export default function PlaceholderBox({ image, imageAlt, label = 'MODEL CANVAS · 1600×1000' }: PlaceholderBoxProps) {
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
        <img src={image} alt={imageAlt ?? ''} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
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
        color: 'rgba(237,232,221,.3)',
      }}
    >
      <span>{label}</span>
      <span style={{ color: 'rgba(78,133,119,.75)' }}>DROP IN</span>
    </div>
  );
}
