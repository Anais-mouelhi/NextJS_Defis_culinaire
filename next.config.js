/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    images: {
        remotePatterns: [
            {
              protocol: "https",
              hostname: "oaidalleapiprodscus.blob.core.windows.net",
            },
          ],
      domains: ['www.themealdb.com'], // Ajoutez ici le domaine autorisé
    },
  };
  
  module.exports = nextConfig;
  