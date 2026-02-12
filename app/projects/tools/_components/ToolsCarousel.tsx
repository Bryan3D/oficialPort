"use client";

import * as React from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import gsap from "gsap";
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

// ✅ Only load 3D when modal is open
const GltfPreview = dynamic(() => import("./GltfPreview"), { ssr: false });

type SlideBase = {
  id: string;
  title: string;
  subtitle: string;
  thumb?: string; // lightweight image used in carousel
};

type ImageSlide = SlideBase & {
  type: "image";
  src: string; // full image (optional to show in modal)
};

type VideoSlide = SlideBase & {
  type: "video";
  src: string;
  poster?: string; // used as carousel thumb + video poster
};

type GltfSlide = SlideBase & {
  type: "gltf";
  src: string; // glb path
  thumb?: string; // recommended thumbnail for carousel
};

type Slide = ImageSlide | VideoSlide | GltfSlide;

const SLIDES: Slide[] = [
  {
    id: "livewire-gltf",
    type: "gltf",
    title: "LiveWire - 3D Preview",
    subtitle: "GLB model preview (loads only when expanded).",
    src: "/models/LiveWire.glb",
    thumb: "/images/livewire-thumb.jpg", // ✅ create a screenshot thumb for speed
  },
  {
    id: "vr-proto-01",
    type: "video",
    title: "VR Prototyping - Unreal Demo",
    subtitle: "VR prototyping demo video.",
    src: "/videos/vrProto2.mp4",
    poster: "/images/vrproto-poster.jpg",
  },
  {
    id: "vr-proto-02",
    type: "video",
    title: "Canopies - Drone / VR",
    subtitle: "Canopies demo video.",
    src: "/videos/Canopys.mp4",
    poster: "/images/canopys-poster.jpg",
  },
];

const clamp = (n: number, min: number, max: number) => Math.max(min, Math.min(max, n));

function CarouselThumb({ slide, priority }: { slide: Slide; priority: boolean }) {
  const thumb =
    slide.type === "video"
      ? slide.poster
      : slide.type === "image"
      ? slide.src
      : slide.thumb;

  if (!thumb) {
    // Fallback if you don't have posters/thumbs yet
    return (
      <div className="relative aspect-[16/9] w-full bg-muted/40">
        <div className="absolute inset-0 grid place-items-center">
          <div className="rounded-lg border border-border bg-background/60 px-3 py-2 text-xs text-muted-foreground">
            Add a thumbnail/poster for: <span className="text-foreground">{slide.title}</span>
          </div>
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-background/85 via-background/25 to-transparent" />
      </div>
    );
  }

  return (
    <div className="relative aspect-[16/9] w-full overflow-hidden">
      <Image
        src={thumb}
        alt={slide.title}
        fill
        priority={priority}
        sizes="(max-width: 768px) 90vw, 45vw"
        className="object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-background/85 via-background/25 to-transparent" />

      {/* Small badge so user knows what it is */}
      <div className="absolute left-3 top-3 rounded-full border border-border/60 bg-background/70 px-2 py-1 text-[11px] text-muted-foreground backdrop-blur">
        {slide.type.toUpperCase()}
      </div>

      {slide.type === "video" && (
        <div className="absolute right-3 top-3 rounded-full border border-border/60 bg-background/70 px-2 py-1 text-[11px] text-muted-foreground backdrop-blur">
          Click to play
        </div>
      )}

      {slide.type === "gltf" && (
        <div className="absolute right-3 top-3 rounded-full border border-border/60 bg-background/70 px-2 py-1 text-[11px] text-muted-foreground backdrop-blur">
          Click to view 3D
        </div>
      )}
    </div>
  );
}

function ExpandedModal({
  open,
  slide,
  onClose,
}: {
  open: boolean;
  slide: Slide | null;
  onClose: () => void;
}) {
  const rootRef = React.useRef<HTMLDivElement | null>(null);
  const backdropRef = React.useRef<HTMLButtonElement | null>(null);
  const panelRef = React.useRef<HTMLDivElement | null>(null);
  const closeBtnRef = React.useRef<HTMLButtonElement | null>(null);

  React.useLayoutEffect(() => {
    if (!open) return;
    if (!rootRef.current || !backdropRef.current || !panelRef.current) return;

    const ctx = gsap.context(() => {
      gsap.set(rootRef.current, { autoAlpha: 1 });

      gsap.fromTo(
        backdropRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.18, ease: "power1.out" }
      );

      gsap.fromTo(
        panelRef.current,
        { opacity: 0, scale: 0.94, y: 16, transformOrigin: "50% 50%" },
        { opacity: 1, scale: 1, y: 0, duration: 0.22, ease: "power2.out" }
      );

      requestAnimationFrame(() => closeBtnRef.current?.focus());
    });

    return () => ctx.revert();
  }, [open]);

  React.useEffect(() => {
    if (!open) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, onClose]);

  const animateClose = () => {
    if (!backdropRef.current || !panelRef.current || !rootRef.current) {
      onClose();
      return;
    }

    gsap
      .timeline({
        defaults: { ease: "power2.inOut" },
        onComplete: onClose,
      })
      .to(panelRef.current, { opacity: 0, scale: 0.96, y: 10, duration: 0.18 }, 0)
      .to(backdropRef.current, { opacity: 0, duration: 0.16 }, 0.02)
      .set(rootRef.current, { autoAlpha: 0 });
  };

  if (!open || !slide) return null;

  return (
    <div ref={rootRef} className="fixed inset-0 z-50" style={{ opacity: 0 }}>
      {/* Backdrop */}
      <button
        ref={backdropRef}
        className="absolute inset-0 bg-black/75"
        onClick={animateClose}
        aria-label="Close expanded view"
        style={{ opacity: 0 }}
        type="button"
      />

      {/* Panel */}
      <div
        ref={panelRef}
        className="relative mx-auto mt-10 w-[min(1200px,92vw)] overflow-hidden rounded-2xl border border-border bg-background shadow-2xl"
        style={{ opacity: 0 }}
      >
        <div className="relative aspect-[16/9] w-full bg-black">
          {slide.type === "image" && (
            <Image
              src={slide.src}
              alt={slide.title}
              fill
              priority
              sizes="(max-width: 768px) 92vw, 1200px"
              className="object-contain"
            />
          )}

          {slide.type === "video" && (
            <video
              className="h-full w-full object-contain bg-black"
              src={slide.src}
              poster={slide.poster}
              controls
              playsInline
              autoPlay
              preload="metadata"
            />
          )}

          {slide.type === "gltf" && (
            <div className="absolute inset-0">
              {/* ✅ 3D only renders here (modal only) */}
              <GltfPreview url={slide.src} />
            </div>
          )}

          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background/85 via-background/10 to-transparent" />
        </div>

        <div className="flex items-start justify-between gap-4 p-5">
          <div className="space-y-1">
            <h2 className="text-lg font-semibold tracking-tight text-primary">{slide.title}</h2>
            <p className="text-sm text-muted-foreground">{slide.subtitle}</p>
          </div>

          <button
            ref={closeBtnRef}
            onClick={animateClose}
            className="rounded-lg border border-border px-3 py-2 text-sm hover:bg-muted"
            type="button"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default function ToolsCarousel() {
  const [api, setApi] = React.useState<CarouselApi | null>(null);
  const [selected, setSelected] = React.useState(0);

  const [open, setOpen] = React.useState(false);
  const [activeSlide, setActiveSlide] = React.useState<Slide | null>(null);

  const openSlide = (slide: Slide) => {
    setActiveSlide(slide);
    setOpen(true);
  };

  const closeSlide = () => {
    setOpen(false);
    setTimeout(() => setActiveSlide(null), 0);
  };

  React.useEffect(() => {
    if (!api) return;
    const onSelect = () => setSelected(api.selectedScrollSnap());
    onSelect();
    api.on("select", onSelect);
    api.on("reInit", onSelect);
    return () => {
      api.off("select", onSelect);
      api.off("reInit", onSelect);
    };
  }, [api]);

  return (
    <div className="w-full">
      <div className="[perspective:1200px]">
        <Carousel setApi={setApi} opts={{ align: "center", loop: true }}>
          <CarouselContent className="-ml-6 py-6">
            {SLIDES.map((s, i) => {
              const dist = clamp(i - selected, -3, 3);

              const rotateY = dist * -14;
              const translateX = dist * 34;
              const translateZ = 240 - Math.abs(dist) * 100;
              const scale = 1 - Math.abs(dist) * 0.12;
              const opacity = 1 - Math.abs(dist) * 0.22;
              const isCenter = dist === 0;

              // ✅ Hide far slides completely to reduce paint work
              const isVisible = Math.abs(dist) <= 3;

              return (
                <CarouselItem
                  key={s.id}
                  className="pl-6 basis-[90%] sm:basis-[70%] md:basis-[48%] lg:basis-[38%]"
                >
                  <div
                    className="transition-transform duration-500 ease-out will-change-transform"
                    style={{
                      transform: `translateX(${translateX}px) translateZ(${translateZ}px) rotateY(${rotateY}deg) scale(${scale})`,
                      opacity: isVisible ? opacity : 0,
                      pointerEvents: isVisible ? "auto" : "none",
                      transformStyle: "preserve-3d",
                    }}
                  >
                    <button
                      type="button"
                      onClick={() => openSlide(s)}
                      className={[
                        "group relative w-full text-left",
                        "overflow-hidden rounded-2xl border border-border/60",
                        "bg-background/20 backdrop-blur-xl shadow-xl",
                        "transition hover:-translate-y-1 hover:shadow-2xl",
                        isCenter ? "ring-1 ring-primary/40" : "",
                      ].join(" ")}
                    >
                      {/* ✅ lightweight thumbnail only (no video/canvas here) */}
                      <div className="pointer-events-none">
                        <CarouselThumb slide={s} priority={isCenter} />
                      </div>

                      <div className="space-y-2 p-5">
                        <div className="flex items-center justify-between gap-3">
                          <h3 className="text-base font-semibold tracking-tight text-primary">
                            {s.title}
                          </h3>

                          {isCenter && (
                            <span className="rounded-full border border-primary/30 bg-primary/10 px-2 py-0.5 text-[11px] text-primary">
                              Featured
                            </span>
                          )}
                        </div>

                        <p className="text-sm text-muted-foreground">{s.subtitle}</p>

                        <div className="flex items-center gap-2 pt-2 text-[11px] text-muted-foreground">
                          <span className="rounded-full border border-border/60 bg-background/30 px-2 py-0.5">
                            {s.type.toUpperCase()}
                          </span>
                          <span className="opacity-70">Click to expand • Drag or use arrows</span>
                        </div>
                      </div>

                      <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity group-hover:opacity-100">
                        <div className="absolute right-3 top-3 rounded-full border border-border/60 bg-background/60 px-2 py-1 text-[11px] text-muted-foreground">
                          Expand
                        </div>
                      </div>
                    </button>
                  </div>
                </CarouselItem>
              );
            })}
          </CarouselContent>

          <CarouselPrevious className="left-2" />
          <CarouselNext className="right-2" />
        </Carousel>
      </div>

      <ExpandedModal open={open} slide={activeSlide} onClose={closeSlide} />
    </div>
  );
}
