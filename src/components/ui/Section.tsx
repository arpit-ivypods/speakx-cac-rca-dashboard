import * as React from "react";
import { cn } from "@/lib/utils";
import { Reveal } from "./Reveal";

export function Section({
  id,
  eyebrow,
  title,
  lede,
  number,
  children,
  className,
  contentClassName,
}: {
  id: string;
  eyebrow: string;
  title: string;
  lede?: React.ReactNode;
  number?: string;
  children: React.ReactNode;
  className?: string;
  contentClassName?: string;
}) {
  return (
    <section
      id={id}
      className={cn(
        "scroll-mt-20 py-12 md:py-16 border-t border-line/50",
        className,
      )}
    >
      <div className="max-w-7xl mx-auto px-6 lg:pr-12">
        <Reveal>
          <div className="flex items-baseline gap-3 mb-2">
            <span className="section-eyebrow">{eyebrow}</span>
            {number && (
              <span className="text-[11px] font-mono text-ink-ghost tracking-wider">{number}</span>
            )}
          </div>
          <h2 className="section-title max-w-3xl">{title}</h2>
          {lede && (
            <p className="mt-3 max-w-3xl text-ink-soft text-base md:text-[17px] leading-relaxed">
              {lede}
            </p>
          )}
        </Reveal>
        <div className={cn("mt-8", contentClassName)}>{children}</div>
      </div>
    </section>
  );
}
