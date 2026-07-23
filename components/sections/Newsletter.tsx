"use client";

import { ArrowRight, Check } from "lucide-react";
import { useId, useRef, useState } from "react";

// Validación de formato suficiente para el cliente. La real la hará el backend.
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const errorId = useId();

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!EMAIL_RE.test(email.trim())) {
      setError("Ingresa un correo válido, por ejemplo hola@correo.com.");
      inputRef.current?.focus();
      return;
    }
    setError("");
    // TODO(strapi): POST /api/subscribers con el email. Por ahora se simula.
    setSubmitted(true);
  };

  return (
    <section className="bg-accent px-6 py-20 text-accent-foreground">
      <div className="mx-auto max-w-3xl text-center">
        <span className="mb-4 block font-mono text-xs uppercase tracking-[0.2em] text-foreground/80">
          Comunidad Novastyle
        </span>
        <h2 className="mb-5 font-serif text-4xl font-medium text-foreground md:text-5xl">
          Sé la primera en saberlo
        </h2>
        <p className="mx-auto mb-10 max-w-lg font-light text-foreground/80">
          Nuevos ingresos, preventas exclusivas, descuentos para suscriptoras y detrás de
          escena del taller. Nada de spam, solo lo lindo.
        </p>

        {submitted ? (
          <div
            role="status"
            className="flex items-center justify-center gap-3 text-foreground"
          >
            <Check size={20} aria-hidden="true" />
            <span>¡Bienvenida a la comunidad! Pronto tendrás novedades.</span>
          </div>
        ) : (
          <form onSubmit={handleSubmit} noValidate className="mx-auto max-w-md">
            <div className="flex flex-col gap-3 sm:flex-row">
              <label htmlFor="newsletter-email" className="sr-only">
                Correo electrónico
              </label>
              <input
                ref={inputRef}
                id="newsletter-email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="tu@email.com"
                autoComplete="email"
                aria-invalid={error ? true : undefined}
                aria-describedby={error ? errorId : undefined}
                className="flex-1 border border-foreground/25 bg-foreground/10 px-5 py-3.5 text-sm text-foreground outline-none transition-colors placeholder:text-foreground/60 focus:border-foreground"
              />
              <button
                type="submit"
                className="group inline-flex items-center justify-center gap-2 bg-foreground px-7 py-3.5 text-sm tracking-wide text-primary-foreground transition-colors hover:bg-foreground/80"
              >
                Suscribirme
                <ArrowRight
                  size={15}
                  aria-hidden="true"
                  className="transition-transform group-hover:translate-x-1"
                />
              </button>
            </div>
            {error && (
              <p id={errorId} role="alert" className="mt-3 text-sm text-foreground">
                {error}
              </p>
            )}
          </form>
        )}

        <p className="mt-6 font-mono text-[10px] uppercase tracking-wider text-foreground/80">
          Sin spam · Cancelas cuando quieras · Solo lo bueno
        </p>
      </div>
    </section>
  );
}