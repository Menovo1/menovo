import { memo, useEffect, useRef, useState } from "react";
import { heroVideo } from "@/content/site";

/**
 * Cinematic background video with poster fallback.
 * Memoized and keyless so React re-renders never restart playback.
 */
export const HeroVideo = memo(function HeroVideo({
  src,
  poster,
}: {
  src?: string | undefined;
  poster?: string | undefined;
}) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [ready, setReady] = useState(false);
  const videoSrc = src || heroVideo.src;
  const posterSrc = poster || heroVideo.poster;


  useEffect(() => {
    const el = videoRef.current;
    if (!el) return;
    const reduced =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;
    const play = el.play();
    if (play && typeof play.catch === "function") play.catch(() => {});
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden bg-navy" aria-hidden>
      <img
        src={posterSrc}
        alt=""
        className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-1000 ${
          ready ? "opacity-0" : "opacity-100"
        }`}
        style={{ objectPosition: heroVideo.objectPosition }}
        fetchPriority="high"
      />
      <video
        ref={videoRef}
        className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-1000 ${
          ready ? "opacity-100" : "opacity-0"
        }`}
        style={{ objectPosition: heroVideo.objectPosition }}
        poster={posterSrc}
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        disablePictureInPicture
        controls={false}
        tabIndex={-1}
        onPlaying={() => setReady(true)}
        onError={() => setReady(false)}
      >
        <source key={videoSrc} src={videoSrc} type={heroVideo.type} />
      </video>
      {/* readability overlay */}
      <div className="absolute inset-0 bg-navy/45" />
      <div className="absolute inset-0 bg-gradient-to-t from-navy/80 via-navy/10 to-navy/50" />
    </div>
  );
});
