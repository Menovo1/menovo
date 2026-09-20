import type { HTMLAttributes } from "react";

const BACKGROUND_SRC = "/backgrounds/menovo-background-animation.svg";

type AnimatedBackgroundProps = HTMLAttributes<HTMLDivElement> & {
  opacityClassName?: string;
};

export function AnimatedBackground({
  className = "",
  opacityClassName = "opacity-[0.16] dark:opacity-[0.28]",
  ...props
}: AnimatedBackgroundProps) {
  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none fixed inset-0 z-0 overflow-hidden ${className}`}
      {...props}
    >
      <img
        src={BACKGROUND_SRC}
        alt=""
        className={`absolute inset-0 h-full w-full object-cover ${opacityClassName}`}
        draggable={false}
      />
    </div>
  );
}
