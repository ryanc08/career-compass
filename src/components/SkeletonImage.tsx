import { useState } from "react";
import { cn } from "@/lib/utils";

export function SkeletonImage({ src, alt, className, ratio = "aspect-[4/5]", eager }: { src: string; alt: string; className?: string; ratio?: string; eager?: boolean }) {
  const [loaded, setLoaded] = useState(false);
  return (
    <div className={cn("relative overflow-hidden bg-muted", ratio, className)}>
      {!loaded && <div className="shimmer absolute inset-0" aria-hidden />}
      <img
        src={src}
        alt={alt}
        loading={eager ? "eager" : "lazy"}
        decoding="async"
        width={768}
        height={960}
        ref={(el) => { if (el?.complete && el.naturalWidth) setLoaded(true); }}
        onLoad={() => setLoaded(true)}
        className={cn("absolute inset-0 h-full w-full object-cover transition-opacity duration-500", loaded ? "opacity-100" : "opacity-0")}
      />
    </div>
  );
}
