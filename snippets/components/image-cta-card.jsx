export const ImageCtaCard = ({ img, alt, ctaText, ctaHref }) => (
  <div className="image-cta-card group relative rounded-xl overflow-hidden border border-zinc-950/10 dark:border-white/10 not-prose">
    <style>{`
      @media (hover: hover) and (pointer: fine) {
        .image-cta-card .image-cta-card-btn:hover {
          --tw-drop-shadow: drop-shadow(0 8px 12px #222A350d) drop-shadow(0 32px 80px #2f30370f);
          filter: var(--tw-blur) var(--tw-brightness) var(--tw-contrast) var(--tw-grayscale) var(--tw-hue-rotate) var(--tw-invert) var(--tw-saturate) var(--tw-sepia) var(--tw-drop-shadow);
        }
      }
    `}</style>
    <a href={ctaHref} target="_blank" rel="noopener noreferrer" className="block">
      <img
        src={img}
        alt={alt}
        className="w-full h-auto transition-all duration-300 group-hover:scale-105"
      />
      <div
        className="absolute inset-0 flex items-center justify-center bg-white/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{
          "--tw-backdrop-blur": "blur(8px)",
          WebkitBackdropFilter:
            "var(--tw-backdrop-blur) var(--tw-backdrop-brightness) var(--tw-backdrop-contrast) var(--tw-backdrop-grayscale) var(--tw-backdrop-hue-rotate) var(--tw-backdrop-invert) var(--tw-backdrop-opacity) var(--tw-backdrop-saturate) var(--tw-backdrop-sepia)",
          backdropFilter:
            "var(--tw-backdrop-blur) var(--tw-backdrop-brightness) var(--tw-backdrop-contrast) var(--tw-backdrop-grayscale) var(--tw-backdrop-hue-rotate) var(--tw-backdrop-invert) var(--tw-backdrop-opacity) var(--tw-backdrop-saturate) var(--tw-backdrop-sepia)",
        }}
      >
        <span className="image-cta-card-btn inline-block rounded-full border border-gray-200 bg-white px-8 py-2 transition-shadow cursor-pointer font-medium text-sm text-zinc-950 dark:text-zinc-950">
          {ctaText}
        </span>
      </div>
    </a>
  </div>
);
