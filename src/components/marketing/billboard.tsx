"use client"

import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel"
import Autoplay from "embla-carousel-autoplay"
import Image from "next/image"
// import Customize from "../public/banner/ri.webp"
// import EcoFriendly from "../public/banner/Eco-Friendly.webp"
import { AspectRatio } from "@/components/ui/aspect-ratio"
import { useEffect, useRef, useState } from "react"

export default function Billboard() {
  const plugin = useRef(Autoplay({ delay: 4000, stopOnInteraction: true }))
  const [api, setApi] = useState<CarouselApi>()

  // useEffect(() => {
  //   if (!api) {
  //     return
  //   }

  //   api.on("select", (item) => {
  //     // Do something on select.
  //     console.log("item", item)
  //   })
  // }, [api])

  return (
    <div className="flex-1 py-4 w-full  ">
      <Carousel
        // setApi={setApi}
        opts={{
          loop: true,
          align: "start",
        }}
        // @ts-ignore
        plugins={[plugin.current]}
        onMouseEnter={plugin.current.stop}
        onMouseLeave={plugin.current.reset}
      >
        <CarouselContent>
          <CarouselItem>
            {/* <AspectRatio ratio={2 / 1}> */}
            <Image
              className="w-full max-h-[210px] md:max-h-[320px] lg:max-h-[400px] rounded-lg object-cover object-center"
              src={"/banners/rifle-banner-v2.jpg"}
              alt=""
              priority
              width={1920}
              height={960}
            />
            {/* </AspectRatio> */}
          </CarouselItem>
          <CarouselItem>
            {/* <AspectRatio ratio={2 / 1}> */}
            <Image
              className="w-full max-h-[210px] md:max-h-[320px] lg:max-h-[400px] rounded-lg object-cover object-center"
              src={"/banners/guns-banner-v2.jpg"}
              alt="Customize your with your own design and preference."
              width={1920}
              height={960}
              priority
            />
            {/* </AspectRatio> */}
          </CarouselItem>
        </CarouselContent>
      </Carousel>
    </div>
  )
}
