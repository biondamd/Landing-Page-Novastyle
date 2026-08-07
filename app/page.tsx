import Navbar from "@/components/nav/Navbar";
import About from "@/components/sections/About";
import Catalog from "@/components/sections/Catalog";
import Collections from "@/components/sections/Collections";
import Footer from "@/components/sections/Footer";
import Hero from "@/components/sections/Hero";
import Newsletter from "@/components/sections/Newsletter";
import Promotions from "@/components/sections/Promotions";
import {
  getAboutContent,
  getCategories,
  getCollections,
  getFooterContent,
  getFeaturedProduct,
  getHeaderContent,
  getHeroContent,
  getNewsletterContent,
  getProducts,
  getPromotions,
} from "@/lib/data";

export default async function Home() {
  // Los datos se leen en el servidor y bajan a los componentes como props.
  const [
    products,
    featured,
    collections,
    categories,
    header,
    hero,
    about,
    newsletter,
    footer,
    promotions,
  ] = await Promise.all([
    getProducts(),
    getFeaturedProduct(),
    getCollections(),
    getCategories(),
    getHeaderContent(),
    getHeroContent(),
    getAboutContent(),
    getNewsletterContent(),
    getFooterContent(),
    getPromotions(),
  ]);

  return (
    <>
      <Navbar products={products} content={header} />
      {/* Sin contenedor: cada sección ocupa el ancho completo y pone su propio
          margen interior, porque varias llevan fondo a sangre. */}
      <main>
        <Hero featured={featured} content={hero} />
        <Collections collections={collections} />
        <Promotions promotions={promotions} />
        <Catalog products={products} categories={categories} />
        <About content={about} />
        <Newsletter content={newsletter} />
      </main>
      <Footer content={footer} />
    </>
  );
}
