// Escudo do Brasileirão XI: escudo verde, borda de giz e o "XI" em amarelo canário.
// O "XI" está desenhado em curvas, então não depende de nenhuma fonte instalada.

interface CrestLogoProps {
  /** Altura em pixels (a largura acompanha a proporção do escudo). */
  size?: number;
  className?: string;
}

export function CrestLogo({ size = 40, className = "" }: CrestLogoProps) {
  return (
    <svg
      viewBox="0 0 64 72"
      height={size}
      width={(size * 64) / 72}
      className={className}
      aria-hidden="true"
      focusable="false"
    >{/* Escudo */}
      <path d="M5 5H59V37C59 53 47 63 32 68C17 63 5 53 5 37Z" fill="#17663a" />
      <path
        d="M9.5 9.5H54.5V37C54.5 50 45 59 32 63.5C19 59 9.5 50 9.5 37Z"
        fill="none"
        stroke="#f1efe3"
        strokeWidth="2"
      />
      {/* XI */}
      <path d="M18.37 46Q18.05 46 17.98 45.82Q17.9 45.64 18.01 45.45L25.46 32.68L22.27 20.55Q22.23 20.32 22.36 20.16Q22.49 20 22.75 20H27.89Q28.41 20 28.45 20.55L28.98 24.26Q29.11 25.2 29.21 26.17Q29.31 27.13 29.37 28.07H29.41Q29.77 27.13 30.12 26.17Q30.48 25.21 30.83 24.27L32.29 20.55Q32.48 20 32.85 20H38.53Q38.77 20 38.89 20.16Q39.02 20.32 38.87 20.55L31.88 32.7L35.24 45.45Q35.35 46 34.79 46H29.54Q29.06 46 28.99 45.45L28.45 41.11Q28.35 40.15 28.26 39.21Q28.18 38.26 28.08 37.35H28Q27.68 38.26 27.29 39.22Q26.9 40.18 26.51 41.12L24.61 45.45Q24.5 45.7 24.37 45.85Q24.24 46 23.99 46ZM36.88 46Q36.27 46 36.37 45.45L40.35 20.55Q40.46 20 40.91 20H45.57Q46.14 20 46.04 20.55L42.06 45.45Q41.99 46 41.51 46Z" fill="#ffd21f" />
    </svg>
  );
}
