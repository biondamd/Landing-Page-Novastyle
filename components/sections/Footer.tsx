
export default function Footer() {
  return (
    <footer className="mx-auto w-full max-w-6xl px-4 py-8 text-sm text-muted sm:px-6 lg:px-8">
      <div className="border-t border-border pt-6">
        © {new Date().getFullYear()} Novastyle
      </div>
    </footer>
  );
}
