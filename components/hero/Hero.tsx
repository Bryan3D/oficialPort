'use client'

import { useLayoutEffect, useRef } from "react"
import gsap from "gsap"

export default function Hero() {
  const root = useRef<HTMLDivElement | null>(null)

  useLayoutEffect(() => {
    if (!root.current) return

    const ctx = gsap.context(() => {
      gsap.set(".hero-kicker", { y: 10, autoAlpha: 0 })
      gsap.set(".hero-title", { y: 18, autoAlpha: 0 })
      gsap.set(".hero-sub", { y: 18, autoAlpha: 0 })
      gsap.set(".hero-cta", { y: 12, autoAlpha: 0 })
      gsap.set(".hero-orb", { scale: 0.9, autoAlpha: 0 })

      const tl = gsap.timeline({ defaults: { ease: "power3.out" } })

      tl.to(".hero-orb", { autoAlpha: 1, scale: 1, duration: 0.9 }, 0)
        .to(".hero-kicker", { autoAlpha: 1, y: 0, duration: 0.55 }, 0.05)
        .to(".hero-title", { autoAlpha: 1, y: 0, duration: 0.7 }, 0.12)
        .to(".hero-sub", { autoAlpha: 1, y: 0, duration: 0.65 }, 0.18)
        .to(".hero-cta", { autoAlpha: 1, y: 0, duration: 0.6 }, 0.28)

      gsap.to(".hero-orb", {
        y: -10,
        duration: 2.4,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
      })
    }, root)

    return () => ctx.revert()
  }, [])

  return (
    <section ref={root} className="relative overflow-hidden">
      {/* background accent */}
      <div className="hero-orb pointer-events-none absolute -top-24 -right-24 h-72 w-72 rounded-full blur-3xl opacity-30 bg-foreground/20" />

      <div className="mx-auto max-w-6xl px-6 py-20 md:py-28">
        <p className="hero-kicker text-sm tracking-wider uppercase text-muted-foreground">
          Software Developer • Tools • Real-time 3D
        </p>

        <h1 className="hero-title mt-4 text-4xl font-extrabold tracking-tight md:text-6xl">
          Software developer building scalable tools, real-time 3D pipelines, and modern web experiences.
        </h1>

        <p className="hero-sub mt-6 max-w-2xl text-lg text-muted-foreground md:text-xl">
          Fast, practical, and production-ready—bridging game tech, XR, and AEC/BIM workflows.
        </p>

        <div className="hero-cta mt-8 flex flex-col gap-3 sm:flex-row">
          <a
            href="#projects"
            className="inline-flex items-center justify-center rounded-xl px-5 py-3 text-sm font-semibold bg-foreground text-background"
          >
            View Projects
          </a>
          <a
            href="#contact"
            className="inline-flex items-center justify-center rounded-xl px-5 py-3 text-sm font-semibold border border-border"
          >
            Contact Me
          </a>
        </div>
      </div>
    </section>
  )
}