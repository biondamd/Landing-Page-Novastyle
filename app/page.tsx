import Navbar from "@/components/nav/Navbar";
import About from "@/components/sections/About";
import Catalog from "@/components/sections/Catalog";
import Collections from "@/components/sections/Collections";
import Footer from "@/components/sections/Footer";
import Hero from "@/components/sections/Hero";
import { getCollections, getFeaturedProduct, getProducts } from "@/lib/data";

export default async function Home() {
  // Los datos se leen en el servidor y bajan a los componentes como props.
  const [products, featured, collections] = await Promise.all([
    getProducts(),
    getFeaturedProduct(),
    getCollections(),
  ]);

  return (
    <>
      <Navbar products={products} />
      {/* Sin contenedor: cada sección ocupa el ancho completo y pone su propio
          margen interior, porque varias llevan fondo a sangre. */}
      <main>
        <Hero featured={featured} />
        <Collections collections={collections} />
        <Catalog />
        <About />
      </main>
      <Footer />
    </>
  );
}
