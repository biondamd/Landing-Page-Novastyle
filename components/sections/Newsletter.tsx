"use client";

import { ArrowRight, Check } from "lucide-react";
import { useActionState, useEffect, useId, useRef, useState } from "react";

import {
  initialNewsletterState,
  subscribeNewsletter,
} from "@/app/actions/newsletter";
import type { NewsletterContent } from "@/lib/types";

type NewsletterProps = {
  content: NewsletterContent;
};

export default function Newsletter({ content }: NewsletterProps) {
  const [email, setEmail] = useState("");
  const [state, formAction, pending] = useActionState(
    subscribeNewsletter,
    initialNewsletterState,
  );
  const inputRef = useRef<HTMLInputElement>(null);
  const errorId = useId();

  useEffect(() => {
    if (state.message && !state.ok) inputRef.current?.focus();
  }, [state]);

  return (
    <section className="bg-accent px-6 py-20 text-accent-foreground">
      <div className="mx-auto max-w-3xl text-center">
        <span className="mb-4 block font-mono text-xs uppercase tracking-[0.2em] text-foreground/80">
          {content.badgeText}
        </span>
        <h2 className="mb-5 font-serif text-4xl font-medium text-foreground md:text-5xl">
          {content.title}
        </h2>
        <p className="mx-auto mb-10 max-w-lg font-light text-foreground/80">
          {content.description}
        </p>

        {state.ok ? (
          <div
            role="status"
            className="flex items-center justify-center gap-3 text-foreground"
          >
            <Check size={20} aria-hidden="true" />
            <span>{state.message}</span>
          </div>
        ) : (
          <form action={formAction} noValidate className="mx-auto max-w-md">
            <div className="flex flex-col gap-3 sm:flex-row">
              <label htmlFor="newsletter-email" className="sr-only">
                Correo electrónico
              </label>
              <input
                ref={inputRef}
                id="newsletter-email"
                name="email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="tu@email.com"
                autoComplete="email"
                aria-invalid={state.message ? true : undefined}
                aria-describedby={state.message ? errorId : undefined}
                disabled={pending}
                className="flex-1 border border-foreground/25 bg-foreground/10 px-5 py-3.5 text-sm text-foreground outline-none transition-colors placeholder:text-foreground/60 focus:border-foreground"
              />
              <button
                type="submit"
                disabled={pending}
                className="group inline-flex items-center justify-center gap-2 bg-foreground px-7 py-3.5 text-sm tracking-wide text-primary-foreground transition-colors hover:bg-foreground/80"
              >
                {pending ? "Enviando..." : content.buttonText}
                <ArrowRight
                  size={15}
                  aria-hidden="true"
                  className="transition-transform group-hover:translate-x-1"
                />
              </button>
            </div>
            {state.message && (
              <p id={errorId} role="alert" className="mt-3 text-sm text-foreground">
                {state.message}
              </p>
            )}
          </form>
        )}

        {content.privacyNote && (
          <p className="mt-6 font-mono text-[10px] uppercase tracking-wider text-foreground/80">
            {content.privacyNote}
          </p>
        )}
      </div>
    </section>
  );
}
