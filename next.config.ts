import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Todas las imágenes son locales (public/images), así que next/image no
  // necesita permisos de dominio. Al migrar a Strapi habrá que declarar su
  // dominio de medios en images.remotePatterns.
};

export default nextConfig;