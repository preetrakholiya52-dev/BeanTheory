// Suppress known Three.js r183+ deprecation warnings originating from internal R3F store
if (typeof window !== 'undefined') {
  const originalWarn = console.warn;
  console.warn = (...args) => {
    const msg = args.map(a => (typeof a === 'string' ? a : (a && a.message ? a.message : ''))).join(' ');
    if (
      msg.includes('Clock: This module has been deprecated') ||
      msg.includes('THREE.Clock: This module has been deprecated') ||
      msg.includes('THREE.WebGLShadowMap')
    ) {
      return;
    }
    originalWarn.apply(console, args);
  };
}
