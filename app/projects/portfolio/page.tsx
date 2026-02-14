"use client";

import { useLayoutEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

export default function webDevProjectPage() {
  const root = useRef<HTMLDivElement | null>(null);

  useLayoutEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      const pinWrap = document.querySelector<HTMLElement>(".horiz-pin");
      const wrapper = document.querySelector<HTMLElement>(".horiz-gallery-wrapper");
      const strip = document.querySelector<HTMLElement>(".horiz-gallery-strip");
      if (!pinWrap || !wrapper || !strip) return;

      const getScroll = () => strip.scrollWidth - wrapper.clientWidth;

      const tween = gsap.to(strip, {
        x: () => -Math.max(0, getScroll()),
        ease: "none",
        scrollTrigger: {
          trigger: pinWrap,
          pin: pinWrap,
          start: "top top",
          end: () => `+=${Math.max(0, getScroll())}`,
          scrub: 1,
          invalidateOnRefresh: true,
        },
      });

      const refresh = () => ScrollTrigger.refresh();
      window.addEventListener("resize", refresh);

      // ✅ Next/Image can lazy-load; refresh a few times after mount
      requestAnimationFrame(() => ScrollTrigger.refresh());
      setTimeout(() => ScrollTrigger.refresh(), 250);
      setTimeout(() => ScrollTrigger.refresh(), 600);

      return () => {
        window.removeEventListener("resize", refresh);
        tween.scrollTrigger?.kill();
        tween.kill();
      };
    }, root);

    return () => ctx.revert();
  }, []);

const images = [
  "/images/webDev/dev01.jpg",
  "/images/webDev/dev02.png",
  "/images/webDev/dev03.jpg",
  // "/images/webDev/dev04.png",
  "/images/webDev/dev05.jpg",
  "/images/webDev/dev06.jpg",
  
];


  return (
    <section ref={root} className="space-y-6">
      <h1 className="text-3xl font-semibold tracking-tight text-primary uppercase">
        Software Developer Portfolio
      </h1>
       <div className="pointer-events-none absolute inset-0 -z-10">
              <Image
                src="/images/portBG04.png"
                alt=""
                fill
                priority
                className="object-cover opacity-[0.1] mix-blend-soft-light"
              />
              <div className="absolute inset-0 bg-background/10" />
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/10 to-background" />
            </div>
     

      <section className="mt-10 text-center text-sm text-muted">
        <h3>Scroll down for the Gallery</h3>
      </section>

      <div className="rounded-xl border border-border bg-card p-6 overflow-hidden mt-10 ">
        <div className="horiz-pin">
          <div className="horiz-gallery-wrapper w-full overflow-hidden">
            <div className="horiz-gallery-strip flex gap-6 will-change-transform">
              {images.map((src) => (
                <div key={src} className="flex-none w-[70vw] max-w-[720px] mt-20 ">
                  <Image
                    src={src}
                    alt=""
                    width={720}
                    height={600}
                    className="block w-full h-auto rounded-xl"
                    draggable={false}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        
      </div>
      <div>
        <div className="mt-10 text-center text-sm text-muted">That&apos;s it!</div>
      </div>
    </section>
    
  );
}
