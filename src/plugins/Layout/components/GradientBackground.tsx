import React, { CSSProperties } from "react";
import { cn } from "$lib/css";

export const GradientBackground = () => {
  const commonClasses = "absolute left-0 top-0 h-full w-screen blur-3xl";

  const styles: CSSProperties = {
    backgroundImage: "url('/images/noise.png')",
    backgroundSize: "80px 80px",
  };

  return (
    <div
      className="absolute pointer-events-none inset-0 overflow-hidden z-[-100] opacity-[0.3] dark:opacity-[0.02]"
      style={styles}
    >
      <div
        className={cn(commonClasses)}
        style={{
          background: `radial-gradient(circle, rgba(255, 243, 184, 0.538), transparent 700px)`,
        }}
      />
      <div
        className={cn(
          commonClasses,
          "sm:translate-y-[-30%] translate-y-[-60%] sm:translate-x-2/3 translate-x-3/4"
        )}
        style={{
          background: `radial-gradient(circle, rgba(249, 188, 158, 0.235), transparent 1000px)`,
        }}
      />
    </div>
  );
};
