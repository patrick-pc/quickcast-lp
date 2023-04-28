import { Inter } from 'next/font/google'
import { useEffect, useRef, useState } from 'react'
import { QuickCast } from '@/components/QuickCast'
import Head from 'next/head'
import { Logo } from '../components/Logo'

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  const mainRef = useRef(null)
  const [isActive, setIsActive] = useState(false)

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.metaKey && e.which === 69) {
        setIsActive((c) => !c)
      } else if (e.which === 27) {
        setIsActive(false)
      }
    }

    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  })

  return (
    <>
      <Head>
        <title>quickcast</title>
        <meta name="description" content="Quick launch ChatGPT with a single shortcut key." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/images/logo@2x.png" />
      </Head>

      <main
        className={`relative min-h-screen overflow-x-hidden bg-zinc-950 text-white ${inter.className}`}
        ref={mainRef}
      >
        <QuickCast isActive={isActive} setIsActive={setIsActive} />
        <div
          className={`absolute left-0 top-0 z-40 h-screen w-full ${isActive ? 'block' : 'hidden'}`}
          onClick={() => setIsActive(false)}
        ></div>

        <div className="flex select-none items-center justify-between px-4 py-6 focus:outline-none md:px-12">
          <a
            className="flex items-center justify-center gap-2"
            href="https://patrickpc.gumroad.com/l/quickcast"
            target="_blank"
          >
            <Logo className="h-6 w-6 text-white" />
            <p className="text-lg font-medium">quickcast</p>
          </a>

          <div className="flex items-center justify-center gap-4">
            <a
              className="flex items-center justify-center"
              href="https://twitter.com/quickcastai"
              target="_blank"
            >
              <img className="h-5 w-5" src="/images/twitter.png" alt="twitter" />
            </a>
            <a
              className="flex items-center justify-center"
              href="https://discord.gg/Xha5Tegc72"
              target="_blank"
            >
              <img className="h-5 w-5" src="/images/discord.png" alt="discord" />
            </a>
          </div>
        </div>

        <div className="mt-20 flex flex-col items-center justify-center gap-12 px-4 md:mt-40">
          <h1 className="text-center text-5xl font-medium leading-tight">
            Quick launch ChatGPT <br /> with a single shortcut key.
          </h1>

          <button
            className="animate-text-shimmer select-none bg-[linear-gradient(110deg,#e2e8f0,45%,#1e293b,55%,#e2e8f0)] bg-[length:250%_100%] bg-clip-text px-6 py-3 text-2xl text-transparent focus:outline-none"
            onClick={() => setIsActive(true)}
          >
            Press ⌘ + E
          </button>

          <a
            className="flex select-none items-center justify-center gap-2 rounded-full bg-white px-6 py-3 font-medium text-black transition-transform duration-200 ease-in-out hover:scale-110 focus:outline-none active:scale-90"
            href="https://patrickpc.gumroad.com/l/quickcast"
            target="_blank"
          >
            <img className="h-6 w-6" src="images/apple.png" alt="apple" />
            <p className="mt-1 text-lg tracking-tight">Download For Mac</p>
          </a>
        </div>
      </main>
    </>
  )
}
