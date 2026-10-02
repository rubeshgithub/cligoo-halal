import React from 'react';

/*
 * Cligoo star-dot wordmark (Zellige & Saffron).
 * "Cligoo" in El Messiri Bold; the dot of the i is a saffron zellige star.
 * Outlined SVG versions for print / social live in /public/brand.
 *
 * Props
 *   size      reference height in px (wordmark font-size = size * 0.85)
 *   showText  false = star symbol only (app-icon style tile)
 *   light     true on dark backgrounds (white text, lighter saffron star)
 *   tagline   show "Click & Goo" under the wordmark
 */

const STAR_RECT = { x: 5, y: 5, width: 14, height: 14 };

export const Star = ({ color = '#F2A71B', hole, style, className }) => (
  <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false" style={style} className={className}>
    <g fill={color}>
      <rect {...STAR_RECT} />
      <rect {...STAR_RECT} transform="rotate(45 12 12)" />
    </g>
    {hole && <circle cx="12" cy="12" r="2.6" fill={hole} />}
  </svg>
);

export const LogoMark = ({ size = 36, className = '' }) => (
  <span
    role="img"
    aria-label="Cligoo"
    className={`inline-flex items-center justify-center shrink-0 bg-emerald-700 ${className}`}
    style={{ width: size, height: size, borderRadius: size * 0.22 }}
  >
    <Star color="#F2A71B" hole="#0B6E4F" style={{ width: size * 0.62, height: size * 0.62 }} />
  </span>
);

const Logo = ({ size = 36, showText = true, className = '', light = false, tagline = false }) => {
  if (!showText) return <LogoMark size={size} className={className} />;
  const textColor = light ? '#FFFFFF' : '#0B6E4F';
  const starColor = light ? '#FFC24D' : '#F2A71B';
  const fontSize = Math.round(size * 0.85);
  return (
    <span className={`inline-flex flex-col items-start leading-none ${className}`}>
      <span
        role="img"
        aria-label="Cligoo"
        className="font-display font-bold whitespace-nowrap"
        style={{ fontSize, lineHeight: 1, letterSpacing: '-0.01em', color: textColor }}
      >
        Cl
        <span className="relative inline-block">
          {'ı'}
          <Star
            color={starColor}
            style={{
              position: 'absolute', left: '50%', top: '-0.04em',
              width: '0.24em', height: '0.24em', transform: 'translateX(-50%)',
            }}
          />
        </span>
        goo
      </span>
      {tagline && (
        <span
          className="font-medium uppercase"
          style={{
            fontSize: Math.max(9, Math.round(size * 0.26)), letterSpacing: '0.3em', marginTop: size * 0.12,
            color: light ? '#B8C0D0' : '#4A5468',
          }}
        >
          Click &amp; Goo
        </span>
      )}
    </span>
  );
};

export default Logo;
