"use client";

import Image from "next/image";
import { ArrowLeft, ArrowRight, X } from "@phosphor-icons/react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { Observer } from "gsap/Observer";
import { useCallback, useEffect, useRef, useState } from "react";
import type { CSSProperties, MouseEvent } from "react";

gsap.registerPlugin(Observer, useGSAP);

type Artwork = {
  src: string;
  alt: string;
  title: string;
  collection: string;
  shape: "square" | "portrait" | "landscape";
};

const cofilang: Artwork[] = [
  ["cofilang-01.jpg", "Call for Coaches poster", "Call for Coaches", "square"],
  ["cofilang-02.jpg", "Cofilang Officers 2026 announcement", "Officers 2026", "square"],
  ["cofilang-03.jpg", "First General Assembly poster", "General Assembly", "square"],
  ["cofilang-04.jpg", "General Assembly program flow", "Program Flow", "portrait"],
  ["cofilang-05.jpg", "Cofilang team building poster", "Team Building", "square"],
  ["cofilang-06.jpg", "Hearts of Cofilang Women's Month poster", "Hearts of Cofilang", "portrait"],
  ["cofilang-07.jpg", "Cofilang birthday greeting", "Birthday Feature", "portrait"],
  ["cofilang-08.jpg", "Cofilang one stop shop guide", "One Stop Shop", "landscape"],
  ["cofilang-09.jpg", "Griffon Pentacle emblem", "Griffon Pentacle", "square"],
  ["cofilang-10.png", "Griffon Pentacle horizontal lockup", "Visual Identity", "landscape"],
  ["cofilang-11.jpg", "Cofilang basketball team group portrait", "Team Portrait", "portrait"],
  ["cofilang-12.jpg", "Cofilang basketball athlete portrait", "Athlete Portrait", "portrait"],
  ["cofilang-13.jpg", "Cofilang men's basketball group portrait", "Men's Team", "portrait"],
  ["cofilang-14.jpg", "Cofilang women's basketball group portrait", "Women's Team", "portrait"],
  ["cofilang-15.jpg", "Cofilang basketball Game Day poster", "Game Day", "portrait"],
  ["cofilang-16.jpg", "Cofilang basketball Day One poster", "Day One", "portrait"],
  ["cofilang-17.jpg", "Cofilang basketball Day Two poster", "Day Two", "portrait"],
].map(([file, alt, title, shape]) => ({
  src: `/images/graphic-design/cofilang/${file}`,
  alt,
  title,
  collection: "Cofilang Dormitories",
  shape,
})) as Artwork[];

const mabolo: Artwork[] = [
  ["mabolo-01.jpg", "Mabolo Men's Home beach team building poster", "Beach Team Building", "square"],
  ["mabolo-02.jpg", "Mabolo Brain Brawl quiz show poster", "Brain Brawl", "square"],
  ["mabolo-03.jpg", "Mabolo Days opening poster", "Mabolo Days", "square"],
  ["mabolo-04.jpg", "Welcome Maboloans publication material", "Welcome Maboloans", "square"],
  ["mabolo-05.jpg", "Meet the Officers publication material", "Meet the Officers", "square"],
  ["mabolo-06.jpg", "Mabolo Men's Home team building poster", "Team Building", "square"],
  ["mabolo-07.jpg", "Happy Teachers' Day publication material", "Teachers' Day", "square"],
  ["mabolo-08.jpg", "Mabolo dormitory ranking announcement", "Dormitory Rankings", "square"],
  ["mabolo-09.jpg", "VisB Quiz Show champions poster", "Quiz Champions", "square"],
  ["mabolo-10.jpg", "Mabolo Days Day One poster", "Day One", "square"],
  ["mabolo-11.jpg", "Mabolo Days title poster", "Mabolo Days Series", "square"],
  ["mabolo-12.jpg", "Mabolo Days Day Two poster", "Day Two", "square"],
  ["mabolo-13.jpg", "Mabolo Days Day Three poster", "Day Three", "square"],
].map(([file, alt, title, shape]) => ({
  src: `/images/graphic-design/mabolo/${file}`,
  alt,
  title,
  collection: "Mabolo Men's Home",
  shape,
})) as Artwork[];

const allWorks = [...cofilang, ...mabolo];

const asciiLetters: Record<string, readonly string[]> = {
  A: [" ### ", "#   #", "#####", "#   #", "#   #"],
  C: [" ####", "#    ", "#    ", "#    ", " ####"],
  D: ["#### ", "#   #", "#   #", "#   #", "#### "],
  E: ["#####", "#    ", "#### ", "#    ", "#####"],
  G: [" ####", "#    ", "#  ##", "#   #", " ####"],
  H: ["#   #", "#   #", "#####", "#   #", "#   #"],
  I: ["#####", "  #  ", "  #  ", "  #  ", "#####"],
  N: ["#   #", "##  #", "# # #", "#  ##", "#   #"],
  P: ["#### ", "#   #", "#### ", "#    ", "#    "],
  R: ["#### ", "#   #", "#### ", "#  # ", "#   #"],
  S: [" ####", "#    ", " ### ", "    #", "#### "],
  V: ["#   #", "#   #", "#   #", " # # ", "  #  "],
};

const archiveTitleWords = ["GRAPHIC", "DESIGN", "ARCHIVE"];

function AsciiArchiveTitle() {
  return (
    <div className="graphic-archive-heading">
      <h1 className="graphic-stage-title">
        <span className="graphic-title-text">Graphic Design Archive</span>
        <span className="graphic-ascii" aria-hidden="true">
          {archiveTitleWords.map((word) => (
            <span className="ascii-word" key={word}>
              {word.split("").map((letter, index) => (
                <span className="ascii-letter" key={`${word}-${letter}-${index}`}>
                  {asciiLetters[letter].join("\n")}
                </span>
              ))}
            </span>
          ))}
        </span>
      </h1>
      <p className="graphic-stage-subtitle">Selected publication materials and visual systems.</p>
    </div>
  );
}

export function GraphicGallery() {
  const [active, setActive] = useState(0);
  const [hovered, setHovered] = useState<number | null>(null);
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const railViewportRef = useRef<HTMLDivElement>(null);
  const railTrackRef = useRef<HTMLDivElement>(null);
  const viewerRef = useRef<HTMLDivElement>(null);
  const viewerImageRef = useRef<HTMLDivElement>(null);
  const originRectRef = useRef<DOMRect | null>(null);
  const viewerTimelineRef = useRef<gsap.core.Timeline | null>(null);
  const viewerInitializedRef = useRef(false);
  const viewerOpen = openIndex !== null;
  const viewerOpenRef = useRef(viewerOpen);

  useEffect(() => {
    viewerOpenRef.current = viewerOpen;
  }, [viewerOpen]);

  useGSAP(
    () => {
      const viewport = railViewportRef.current;
      const track = railTrackRef.current;
      if (!viewport || !track) return;

      const media = gsap.matchMedia();
      media.add("(prefers-reduced-motion: no-preference)", () => {
        let halfWidth = track.scrollWidth / 2;
        const firstSlice = track.querySelector<HTMLElement>(".graphic-rail-sequence:first-child .graphic-slice");
        const firstSliceWidth = firstSlice?.getBoundingClientRect().width ?? 320;
        let current = -halfWidth + viewport.clientWidth / 2 - firstSliceWidth / 2;
        let target = current;
        let previous = current;
        let motionStrength = 0;
        const wheelTravel = 0.68;
        const dragTravel = 0.92;
        const follow = 0.075;
        const slices = gsap.utils.toArray<HTMLElement>(".graphic-slice", track);
        let sliceCenters: number[] = [];
        const sliceMotion = slices.map((slice) => ({
          scaleX: gsap.quickSetter(slice, "scaleX"),
          scaleY: gsap.quickSetter(slice, "scaleY"),
          z: gsap.quickSetter(slice, "z", "px"),
          gray: gsap.quickSetter(slice, "--motion-gray"),
          brightness: gsap.quickSetter(slice, "--motion-brightness"),
          contrast: gsap.quickSetter(slice, "--motion-contrast"),
          opacity: gsap.quickSetter(slice, "--motion-opacity"),
          lastDepth: -1,
          lastColor: -1,
          lastZIndex: -1,
        }));
        const setTrackX = gsap.quickSetter(track, "x", "px");
        const wrapPosition = (value: number) => gsap.utils.wrap(-halfWidth, 0, value);
        const measureSlices = () => {
          const trackRect = track.getBoundingClientRect();
          sliceCenters = slices.map((slice) => {
            const rect = slice.getBoundingClientRect();
            return rect.left - trackRect.left + rect.width / 2;
          });
        };
        const render = (_time: number, deltaTime: number) => {
          const frameRatio = Math.min(deltaTime / (1000 / 60), 3);
          if (!viewerOpenRef.current) {
            const frameFollow = 1 - Math.pow(1 - follow, frameRatio);
            current += (target - current) * frameFollow;
          }

          if (Math.abs(target - current) < 0.01) current = target;
          if (current <= -halfWidth) {
            current += halfWidth;
            target += halfWidth;
          } else if (current > 0) {
            current -= halfWidth;
            target -= halfWidth;
          }

          const speed = Math.abs(current - previous) / Math.max(frameRatio, 0.01);
          const speedStrength = gsap.utils.clamp(0, 1, (speed - 2.4) / 8.6);
          const motionFollow = speedStrength > motionStrength ? 0.4 : 0.28;
          motionStrength += (speedStrength - motionStrength) * (1 - Math.pow(1 - motionFollow, frameRatio));
          if (viewerOpenRef.current) motionStrength *= Math.pow(0.72, frameRatio);
          previous = current;

          setTrackX(current);

          const viewportCenter = viewport.clientWidth / 2;
          const focusRadius = Math.min(viewport.clientWidth * 0.34, 430);
          const colorRadius = Math.min(viewport.clientWidth * 0.075, 100);
          sliceMotion.forEach((setters, index) => {
            const distance = Math.abs(sliceCenters[index] + current - viewportCenter);
            const normalized = gsap.utils.clamp(0, 1, 1 - distance / focusRadius);
            const proximity = Math.sin(normalized * Math.PI * 0.5);
            const depth = proximity * motionStrength;
            const colorProximity = Math.sin(
              gsap.utils.clamp(0, 1, 1 - distance / colorRadius) * Math.PI * 0.5,
            );
            const color = Math.pow(colorProximity, 1.5) * motionStrength;
            const nextZIndex = Math.round(depth * 100);

            if (Math.abs(depth - setters.lastDepth) > 0.001) {
              setters.scaleX(1 + depth * 0.09);
              setters.scaleY(1 + depth * 0.15);
              setters.z(depth * 18);
              setters.opacity(0.82 + depth * 0.18);
              setters.lastDepth = depth;
            }

            if (Math.abs(color - setters.lastColor) > 0.003) {
              setters.gray(1 - color);
              setters.brightness(0.56 + color * 0.36);
              setters.contrast(1.08 - color * 0.06);
              setters.lastColor = color;
            }

            if (nextZIndex !== setters.lastZIndex) {
              slices[index].style.zIndex = String(nextZIndex);
              setters.lastZIndex = nextZIndex;
            }
          });
        };

        const resizeObserver = new ResizeObserver(() => {
          halfWidth = track.scrollWidth / 2;
          current = wrapPosition(current);
          target = current;
          previous = current;
          setTrackX(current);
          measureSlices();
        });
        gsap.set(track, { force3D: true });
        gsap.set(slices, { force3D: true });
        measureSlices();
        resizeObserver.observe(track);

        const observer = Observer.create({
          target: viewport,
          type: "wheel,touch,pointer",
          preventDefault: true,
          lockAxis: true,
          dragMinimum: 4,
          onChangeX: (self) => {
            target += self.deltaX * dragTravel;
          },
          onChangeY: (self) => {
            target += self.deltaY * wheelTravel;
          },
        });

        gsap.ticker.add(render);
        return () => {
          gsap.ticker.remove(render);
          resizeObserver.disconnect();
          observer.kill();
          gsap.set(slices, {
            clearProps: "transform,zIndex,--motion-gray,--motion-brightness,--motion-contrast,--motion-opacity",
          });
        };
      });

      return () => media.revert();
    },
    { scope: railViewportRef },
  );

  useGSAP(
    () => {
      const viewer = viewerRef.current;
      const image = viewerImageRef.current;
      if (openIndex === null || !viewer || !image) return;

      viewerTimelineRef.current?.kill();
      const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const target = image.getBoundingClientRect();
      const origin = originRectRef.current;
      const firstOpen = !viewerInitializedRef.current;
      viewerInitializedRef.current = true;
      gsap.set(viewer, { autoAlpha: 1 });

      if (reduceMotion || !origin || !firstOpen) {
        gsap.fromTo(image, { autoAlpha: 0.35, scale: 0.985 }, { autoAlpha: 1, scale: 1, duration: 0.42, ease: "power2.out" });
        gsap.fromTo(".viewer-meta > *, .viewer-controls", { autoAlpha: 0, y: 8 }, { autoAlpha: 1, y: 0, duration: 0.36, stagger: 0.035, ease: "power2.out" });
        return;
      }

      const deltaX = origin.left - target.left;
      const deltaY = origin.top - target.top;
      const scaleX = origin.width / target.width;
      const scaleY = origin.height / target.height;
      const timeline = gsap.timeline();
      viewerTimelineRef.current = timeline;
      timeline
        .fromTo(viewer, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.18, ease: "none" })
        .fromTo(
          image,
          {
            x: deltaX,
            y: deltaY,
            scaleX,
            scaleY,
            transformOrigin: "left top",
          },
          {
            x: 0,
            y: 0,
            scaleX: 1,
            scaleY: 1,
            duration: 0.86,
            ease: "power3.inOut",
            clearProps: "transform",
          },
          0,
        )
        .fromTo(
          ".viewer-meta > *, .viewer-controls, .viewer-close",
          { autoAlpha: 0, y: 10 },
          { autoAlpha: 1, y: 0, duration: 0.4, stagger: 0.04, ease: "power2.out" },
          0.54,
        );
    },
    { dependencies: [openIndex], scope: viewerRef },
  );

  const openArtwork = useCallback((index: number, element: HTMLElement) => {
    originRectRef.current = element.getBoundingClientRect();
    viewerInitializedRef.current = false;
    setOpenIndex(index);
  }, []);

  const closeViewer = useCallback(() => {
    const viewer = viewerRef.current;
    const image = viewerImageRef.current;
    const origin = originRectRef.current;
    if (!viewer || !image || !origin || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      viewerInitializedRef.current = false;
      setOpenIndex(null);
      return;
    }

    viewerTimelineRef.current?.kill();
    const target = image.getBoundingClientRect();
    const timeline = gsap.timeline({
      onComplete: () => {
        viewerInitializedRef.current = false;
        setOpenIndex(null);
      },
    });
    viewerTimelineRef.current = timeline;
    timeline
      .to(".viewer-meta > *, .viewer-controls, .viewer-close", { autoAlpha: 0, y: 8, duration: 0.2, ease: "power2.in" })
      .to(
        image,
        {
          x: origin.left - target.left,
          y: origin.top - target.top,
          scaleX: origin.width / target.width,
          scaleY: origin.height / target.height,
          transformOrigin: "left top",
          duration: 0.68,
          ease: "power3.inOut",
        },
        0.06,
      )
      .to(viewer, { autoAlpha: 0, duration: 0.2, ease: "none" }, 0.54);
  }, []);

  const changeArtwork = useCallback((direction: -1 | 1) => {
    originRectRef.current = null;
    setOpenIndex((current) =>
      current === null ? null : (current + direction + allWorks.length) % allWorks.length,
    );
  }, []);

  useEffect(() => {
    if (!viewerOpen) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeViewer();
      if (event.key === "ArrowLeft") changeArtwork(-1);
      if (event.key === "ArrowRight") changeArtwork(1);
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [changeArtwork, closeViewer, viewerOpen]);

  return (
    <>
      <section className="graphic-stage" aria-label="All graphic design work">
        <div className="graphic-showcase">
          <AsciiArchiveTitle />
          <div className="graphic-rail" ref={railViewportRef}>
            <div className="graphic-rail-track" ref={railTrackRef}>
              {[false, true].map((clone) => (
                <div className="graphic-rail-sequence" key={clone ? "clone" : "original"} aria-hidden={clone}>
                  {allWorks.map((work, index) => (
                    <button
                      className={`graphic-slice${hovered === index ? " is-active" : ""}`}
                      key={`${clone ? "clone" : "original"}-${work.src}`}
                      type="button"
                      onMouseEnter={() => {
                        setActive(index);
                        setHovered(index);
                      }}
                      onMouseLeave={() => setHovered(null)}
                      onFocus={() => {
                        setActive(index);
                        setHovered(index);
                      }}
                      onBlur={() => setHovered(null)}
                      onClick={(event: MouseEvent<HTMLButtonElement>) => openArtwork(index, event.currentTarget)}
                      style={{ "--slice-index": index } as CSSProperties}
                      aria-label={clone ? undefined : `View ${work.title}`}
                      tabIndex={clone ? -1 : 0}
                    >
                      <Image
                        src={work.src}
                        alt=""
                        fill
                        loading={index < 5 ? "eager" : "lazy"}
                        sizes="(max-width: 720px) 72vw, 34vw"
                        className="graphic-slice-image"
                      />
                    </button>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="graphic-stage-meta" aria-live="polite">
          <span>{allWorks[active].collection}</span>
          <strong>{allWorks[active].title}</strong>
          <span>{String(active + 1).padStart(2, "0")} / {String(allWorks.length).padStart(2, "0")}</span>
        </div>
      </section>

      {openIndex !== null && (
        <div className="artwork-viewer" ref={viewerRef} role="dialog" aria-modal="true" aria-label="Artwork viewer">
          <button className="viewer-close" type="button" onClick={closeViewer} aria-label="Close artwork viewer">
            <X size={22} weight="regular" />
          </button>
          <div ref={viewerImageRef} className={`viewer-image viewer-image-${allWorks[openIndex].shape}`}>
            <Image
              src={allWorks[openIndex].src}
              alt={allWorks[openIndex].alt}
              fill
              priority
              sizes="92vw"
              className="viewer-art"
            />
          </div>
          <div className="viewer-meta">
            <span>{allWorks[openIndex].collection}</span>
            <strong>{allWorks[openIndex].title}</strong>
            <span>{String(openIndex + 1).padStart(2, "0")} / {String(allWorks.length).padStart(2, "0")}</span>
          </div>
          <div className="viewer-controls">
            <button type="button" onClick={() => changeArtwork(-1)} aria-label="Previous artwork">
              <ArrowLeft size={21} weight="regular" />
            </button>
            <button type="button" onClick={() => changeArtwork(1)} aria-label="Next artwork">
              <ArrowRight size={21} weight="regular" />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
