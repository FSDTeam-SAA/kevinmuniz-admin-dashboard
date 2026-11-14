import { createRequire } from 'module';

const require = createRequire(import.meta.url);

/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: "http",
                hostname: "res.cloudinary.com",
            },
            {
                protocol: "https",
                hostname: "res.cloudinary.com",
            },
        ],
    },
};

export default nextConfig;
