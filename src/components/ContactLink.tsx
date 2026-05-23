"use client";

import { ReactNode } from "react";
import { trackContact } from "@/lib/metaPixel";

interface ContactLinkProps {
  href: string;
  channel: string;
  className?: string;
  target?: string;
  rel?: string;
  "aria-label"?: string;
  children: ReactNode;
}

export default function ContactLink({
  href,
  channel,
  className,
  target,
  rel,
  "aria-label": ariaLabel,
  children,
}: ContactLinkProps) {
  return (
    <a
      href={href}
      target={target}
      rel={rel}
      aria-label={ariaLabel}
      className={className}
      onClick={() => trackContact({ content_name: channel, content_category: "footer" })}
    >
      {children}
    </a>
  );
}
