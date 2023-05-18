import { Inter } from 'next/font/google'
import { useEffect, useRef, useState } from 'react'
import { QuickCast } from '@/components/QuickCast'
import Head from 'next/head'
import { Logo } from '../components/Logo'

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  const mainRef = useRef(null)
  const [isActive, setIsActive] = useState(true)

  // useEffect(() => {
  //   const handleKeyDown = (e) => {
  //     if (e.metaKey && e.which === 69) {
  //       setIsActive((c) => !c)
  //     } else if (e.which === 27) {
  //       setIsActive(false)
  //     }
  //   }

  //   document.addEventListener('keydown', handleKeyDown)

  //   return () => {
  //     document.removeEventListener('keydown', handleKeyDown)
  //   }
  // })

  return (
    <>
      <Head>
        <title>QuickCast</title>
        <meta name="description" content="Boost your efficiency with hotkeys and AI." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/images/logo@2x.png" />
      </Head>

      <main
        className={`relative min-h-screen overflow-x-hidden bg-zinc-950 text-white ${inter.className}`}
        ref={mainRef}
      >
        <div className="gradient-bg-index z-10"></div>
        {/* <div
          className={`absolute left-0 top-0 z-40 h-screen w-full ${isActive ? 'block' : 'hidden'}`}
          onClick={() => setIsActive(false)}
        ></div> */}

        <div className="flex select-none items-center justify-between px-4 py-6 focus:outline-none md:px-12">
          <a
            className="flex items-center justify-center gap-2"
            href="https://patrickpc.gumroad.com/l/quickcast"
            target="_blank"
          >
            <Logo className="h-6 w-6 text-white" />
            {/* <p className="text-lg font-medium">QuickCast</p> */}
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

        <div className="mt-10 flex flex-col items-center justify-center gap-12 px-4">
          <div className="flex flex-col items-center justify-center gap-6">
            <h1 className="text-center font-gentium text-6xl font-medium tracking-wide md:text-8xl">
              QuickCast
            </h1>
            <h2 className="text-center text-lg text-white/40 md:text-xl">
              Boost your efficiency with hotkeys and AI.
            </h2>
          </div>

          {/* <button
            className="animate-text-shimmer select-none bg-[linear-gradient(110deg,#e2e8f0,45%,#1e293b,55%,#e2e8f0)] bg-[length:250%_100%] bg-clip-text px-6 py-3 text-2xl text-transparent focus:outline-none"
            onClick={() => setIsActive(true)}
          >
            Press ⌘ + E
          </button> */}

          <a
            className="z-20 flex select-none items-center justify-center gap-2 rounded-full bg-white px-4 py-1 font-medium text-black transition-transform duration-200 ease-in-out hover:scale-110 focus:outline-none active:scale-90"
            href="https://patrickpc.gumroad.com/l/quickcast"
            target="_blank"
          >
            <img className="h-5 w-5" src="images/apple.png" alt="apple" />
            <p className="mt-1 tracking-tight">Download For Mac</p>
          </a>
        </div>

        <div className="px-4">
          <QuickCast isActive={isActive} setIsActive={setIsActive} />
        </div>
      </main>
    </>
  )
}
