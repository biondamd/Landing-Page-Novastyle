import Navbar from "@/components/nav/Navbar";
import About from "@/components/sections/About";
import Catalog from "@/components/sections/Catalog";
import Collections from "@/components/sections/Collections";
import Footer from "@/components/sections/Footer";
import Hero from "@/components/sections/Hero";
import Newsletter from "@/components/sections/Newsletter";
import {
  getAboutContent,
  getCategories,
  getCollections,
  getFooterContent,
  getHeaderContent,
  getHeroSection,
  getNewsletterContent,
  getProducts,
} from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function Home() {
  const [
    products,
    collections,
    categories,
    header,
    hero,
    about,
    newsletter,
    footer,
  ] = await Promise.all([
    getProducts(),
    getCollections(),
    getCategories(),
    getHeaderContent(),
    getHeroSection(),
    getAboutContent(),
    getNewsletterContent(),
    getFooterContent(),
  ]);

  return (
    <>
      <Navbar content={header} products={products} />
      <main>
        <Hero content={hero.content} featured={hero.featured} />
        <Collections collections={collections} />
        <Catalog products={products} categories={categories} />
        <About content={about} />
        <Newsletter content={newsletter} />
      </main>
      <Footer content={footer} />
    </>
  );
}
