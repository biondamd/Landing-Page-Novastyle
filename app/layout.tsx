import type { Metadata } from "next";
import { DM_Mono, DM_Sans, Playfair_Display } from "next/font/google";
import "./globals.css";

// Playfair Display y DM Sans son fuentes variables: no hace falta declarar pesos.
// DM Mono no lo es, así que se piden los tres pesos que usa el diseño.
const playfair = Playfair_Display({
  subsets: ["latin"],
  style: ["normal", "italic"],
  display: "swap",
  variable: "--font-playfair",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  style: ["normal", "italic"],
  display: "swap",
  variable: "--font-dm-sans",
});

const dmMono = DM_Mono({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  display: "swap",
  variable: "--font-dm-mono",
});

// Dominio de producción. Sin metadataBase, las rutas relativas de Open Graph
// (la imagen) no podrían resolverse a URL absoluta, que es lo que exigen las
// redes sociales al leer las etiquetas.
const SITE_URL = "https://novastyle.pe";

const TITLE = "Novastyle — Moda consciente hecha en Perú";
const DESCRIPTION =
  "Lo último en moda y accesorios en Perú. En Novastyle encuentras los looks que marcan tendencia. ¡Arma tu outfit hoy!";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: TITLE,
  description: DESCRIPTION,
  applicationName: "Novastyle",
  keywords: [
    "moda peruana",
    "ropa de mujer",
    "catálogo virtual",
    "moda consciente",
    "producción local",
    "Novastyle",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    siteName: "Novastyle",
    title: TITLE,
    description: DESCRIPTION,
    url: "/",
    locale: "es_PE",
    // La imagen la aporta app/opengraph-image.jpg por convención de archivo.
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${playfair.variable} ${dmSans.variable} ${dmMono.variable} h-full scroll-smooth antialiased`}
    >
      <body className="min-h-full bg-background text-foreground">
        {children}
      </body>
    </html>
  );
}
