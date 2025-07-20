/** @type {import('next').NextConfig} */
import path from 'path';
import { fileURLToPath } from 'url';

const nextConfig = {
    reactStrictMode: true,
    experimental: {
        serverComponentsExternalPackages: ["yjs"],
    },
    webpack: (config, { isServer }) => {
        if (isServer) {
            const yjsEsmPath = path.resolve(
                fileURLToPath(import.meta.url),
                "../node_modules/yjs/dist/yjs.cjs"
            );
            config.resolve.alias.yjs = yjsEsmPath;
        }
        return config;
    },
};

export default nextConfig;
