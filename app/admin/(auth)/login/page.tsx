import Image from "next/image";

import { login } from "./actions";

type LoginPageProps = {
  searchParams?: Promise<{ error?: string }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const params = await searchParams;
  const hasError = params?.error === "1";

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#141421] px-6 py-12 text-white">
      <section className="w-full max-w-xl bg-[#222234] px-14 py-14 shadow-2xl">
        <div className="mb-8 flex justify-center">
          <Image src="/favicon.ico" alt="Novastyle" width={72} height={72} />
        </div>

        <h1 className="text-center text-4xl font-bold">Bienvenido a Novastyle!</h1>
        <p className="mt-3 text-center text-lg text-[#b7b7d4]">
          Inicia sesión en tu cuenta de Novastyle
        </p>

        <form action={login} className="mt-10 flex flex-col gap-6">
          <label className="flex flex-col gap-2 text-sm font-bold">
            Correo electrónico<span className="text-red-400">*</span>
            <input
              name="email"
              type="email"
              required
              autoComplete="email"
              placeholder="kai@doe.com"
              className="border border-[#555574] bg-transparent px-4 py-3 text-base font-normal text-white outline-none placeholder:text-[#b7b7d4] focus:border-[#6c63ff]"
            />
          </label>

          <label className="flex flex-col gap-2 text-sm font-bold">
            Contraseña<span className="text-red-400">*</span>
            <input
              name="password"
              type="password"
              required
              autoComplete="current-password"
              className="border border-[#555574] bg-transparent px-4 py-3 text-base font-normal text-white outline-none focus:border-[#6c63ff]"
            />
          </label>

          <label className="flex items-center gap-3 text-base text-white">
            <input
              name="remember"
              type="checkbox"
              className="h-5 w-5 border border-[#555574] bg-transparent"
            />
            Recuérdame
          </label>

          {hasError && (
            <p className="border border-red-400/40 bg-red-500/10 px-4 py-3 text-sm text-red-200">
              No se pudo iniciar sesión. Revisa tu correo y contraseña.
            </p>
          )}

          <button
            type="submit"
            className="bg-[#4c4cff] px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-[#6868ff]"
          >
            Iniciar sesión
          </button>
        </form>
      </section>
    </main>
  );
}
