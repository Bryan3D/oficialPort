"use client";

import { useLayoutEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

export default function XRProjectPage() {
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
      setTimeout(() => ScrollTrigger.refresh(), 800);

      return () => {
        window.removeEventListener("resize", refresh);
        tween.scrollTrigger?.kill();
        tween.kill();
      };
    }, root);

    return () => ctx.revert();
  }, []);

  const images = Array.from({ length: 8 }).map(
    (_, i) => `https://assets.codepen.io/16327/portrait-image-${i + 1}.jpg`
  );

  return (
    <section ref={root} className="space-y-6">
      <h1 className="text-3xl font-semibold tracking-tight text-primary uppercase">
        Software Developer Portfolio
      </h1>

      <p className="text-sm text-muted uppercase">
        Coming soon.  This page is a work in progress.
      </p>

      <section className="mt-10 text-center text-sm text-muted">
        <h3>Scroll down for the Gallery</h3>
      </section>

      <div className="rounded-xl border border-border bg-card p-6 overflow-hidden">
        <div className="horiz-pin">
          <div className="horiz-gallery-wrapper w-full overflow-hidden">
            <div className="horiz-gallery-strip flex gap-6 will-change-transform">
              {images.map((src) => (
                <div key={src} className="flex-none w-[70vw] max-w-[720px]">
                  <Image
                    src={src}
                    alt=""
                    width={720}
                    height={900}
                    className="block w-full h-auto rounded-xl"
                    draggable={false}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-10 text-center text-sm text-muted">That&apos;s it!</div>
      </div>
    </section>
  );
}
