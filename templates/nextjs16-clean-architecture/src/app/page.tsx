import Image from "next/image";

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center gap-4 bg-zinc-50 font-sans dark:bg-black">
      <main className="flex min-h-screen w-full max-w-3xl flex-col gap-6 items-center justify-center py-32 px-16 bg-white dark:bg-black sm:items-start">
       <div className="relative flex items-center justify-center w-full h-[200px]">
       <Image
          className="absolute invert-100 dark:invert-0"
          src="/logo.jpeg"
          alt="nhut9dev logo"
          width={200}
          height={200}
          priority
        />
       </div>
        <div className="w-full flex flex-col items-center gap-6 sm:items-start sm:text-left">
          <h1 className="w-full text-3xl text-center font-semibold leading-10 tracking-tight text-black dark:text-zinc-50">
          To get started, read the README.md file.
          </h1>
          <p className="w-full text-lg text-center leading-8 text-zinc-600 dark:text-zinc-400">
          Need help getting started or want to contact me?
          </p>
        </div>

        <div className="w-full flex items-center justify-center gap-4 text-base font-medium sm:flex-row">
          <a
            className="flex h-12 w-full items-center justify-center gap-2 rounded-full border border-solid border-black/[.08] px-5 transition-colors hover:border-transparent hover:bg-black/[.04] dark:border-white/[.145] dark:hover:bg-[#1a1a1a] md:w-[158px]"
            href="https://nextjs.org/docs"
            target="_blank"
            rel="noopener noreferrer"
          >
           Next.js docs
          </a>

          <a
            className="flex h-12 w-full items-center justify-center gap-2 rounded-full border border-solid border-black/[.08] px-5 transition-colors hover:border-transparent hover:bg-black/[.04] dark:border-white/[.145] dark:hover:bg-[#1a1a1a] md:w-[158px]"
            href="https://nhut9dev.io.vn"
            target="_blank"
            rel="noopener noreferrer"
          >
            Contact me
            <Image
              className="dark:invert"
              src="/arrow-narrow-right.svg"
              alt="arrow-narrow-right"
              width={16}
              height={16}
            />
          </a>
        </div>
      </main>
    </div>
  );
}

