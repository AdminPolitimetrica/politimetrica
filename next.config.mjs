// next.config.mjs
import withPWA from 'next-pwa';

const pwaConfig = {
  dest: 'public',
  register: true,
  skipWaiting: true,
};

export default withPWA({
  reactStrictMode: true,
  // cualquier otra config tuya
})(pwaConfig);
