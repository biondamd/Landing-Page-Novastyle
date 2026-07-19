import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Novastyle Web | Tu Estilo, Tu Moda",
  description: "Lo último en moda y accesorios en Perú. En Novastyle encuentras los looks que marcan tendencia. ¡Arma tu outfit hoy!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className="h-full scroll-smooth antialiased"
    >
      <body className="min-h-full bg-background text-foreground">
        {children}
      </body>
    </html>
  );
}
