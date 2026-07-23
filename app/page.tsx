import Navbar from "@/components/nav/Navbar";
import About from "@/components/sections/About";
import Catalog from "@/components/sections/Catalog";
import Collections from "@/components/sections/Collections";
import Footer from "@/components/sections/Footer";
import Hero from "@/components/sections/Hero";
import { getProducts } from "@/lib/data";

export default async function Home() {
  // Los datos se leen en el servidor y bajan al buscador, que es cliente.
  const products = await getProducts();

  return (
    <>
      <Navbar products={products} />
      <main className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-6 sm:px-6 lg:px-8">
        <Hero />
        <Collections />
        <Catalog />
        <About />
      </main>
      <Footer />
    </>
  );
}
