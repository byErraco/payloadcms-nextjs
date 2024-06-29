import Image from "next/image"
import Link from "next/link"

// import { Section, Container } from "@/components/craft";
// import Logo from "@/public/logo.svg"

const HeroThree = () => {
  return (
    <div className="m-auto flex h-full w-full max-w-5xl flex-col gap-8 px-4 py-4 md:px-6 md:py-10">
      {/* Large Text */}
      <h1 className="text-3xl font-normal tracking-tight md:text-6xl">
        Tactical specialists in {/* eslint-disable-next-line */}
        <img
          className="my-auto -mt-3 inline w-24 md:-mt-6 md:w-48"
          width={192}
          height={108}
          src="/handgun.png"
          alt=""
        ></img>{" "}
        guns and {/* eslint-disable-next-line */}
        <img
          className="my-auto -mt-3 inline w-24 md:-mt-6 md:w-48"
          width={192}
          height={108}
          src="/rifle.png"
          alt=""
        ></img>{" "}
        shooting capabilities. {/* eslint-disable-next-line */}
      </h1>
      {/* logo features */}
      {/* <div className="flex w-fit flex-wrap items-center gap-6 rounded-lg border p-4">
        <p>As seen in:</p>
 
        <Image className="h-6 w-fit dark:invert" src={Logo} alt=""></Image>
        <Image className="h-6 w-fit dark:invert" src={Logo} alt=""></Image>
        <Image className="h-6 w-fit dark:invert" src={Logo} alt=""></Image>
      </div> */}
      {/* End Text */}
      <div className="md:text-lg">
        <p className="hidden md:block">We make weapons for specialists.</p>
        <div className="grid gap-2 md:flex">
          <p className="opacity-50">Visit our catalog and get your armour. </p>
          <Link
            className="transition-all hover:opacity-70 text-primary"
            href="/products"
          >
            Purchase now -{`>`}
          </Link>
        </div>
        <p className="mt-4 text-xs">
          <span className="opacity-50">Want to become a partner?</span>
          <Link href="/contact" className="px-2">
            Contact us.
          </Link>
        </p>
      </div>
    </div>
  )
}

export default HeroThree
