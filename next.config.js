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
    domains: [
      'www.themealdb.com',
      'via.placeholder.com',
      "oaidalleapiprodscus.blob.core.windows.net",
      'oaidalleapiprodscus.blob.core.windows.net'
    ], // Ajoutez ici le domaine autorisé
  },
  env: {
    OPENAI_API_KEY: process.env.OPENAI_API_KEY, // Exposez la clé API ici
  }
};

module.exports = nextConfig;
