/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental: {
        esmExternals: 'loose',
        serverComponentsExternalPackages: ['mongoose']
    },
    images: {
        domains: ['localhost', 'cj-s3-training.s3.us-west-1.amazonaws.com']
    }
}

module.exports = nextConfig
