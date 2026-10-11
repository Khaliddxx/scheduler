/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  // The brand package is plain TypeScript in the workspace with no build step.
  transpilePackages: ['@scheduler/brand', '@scheduler/provisioning'],
  images: { remotePatterns: [{ protocol: 'https', hostname: '**' }] },
};
export default nextConfig;
