export const bgImage = (width = 1440, height = 1000) => `<svg height="${height}" width="${width}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <radialGradient id="grad1" fx="50%" fy="50%" r="100%" cx="86.88%" cy="56.49%">
      <stop offset="16.5%" stop-color="#30260B" />
      <stop offset="100%" stop-color="#000000" />
    </radialGradient>
  </defs>
  <rect height="${height}" width="${width}" x="0" y="0" fill="url(#grad1)" />
</svg>`;
