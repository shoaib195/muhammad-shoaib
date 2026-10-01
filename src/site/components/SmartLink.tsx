"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import type { ComponentProps, MouseEvent } from "react";
import { scrollToHash, setPendingHash, splitHref } from "../scroll";

type Props = ComponentProps<typeof Link> & { href: string };

/**
 * Link that understands section hashes:
 *  - same page  → smooth scroll (Lenis)
 *  - other page → client navigation, then smooth scroll to the section
 */
export function SmartLink({ href, onClick, children, ...rest }: Props) {
  const pathname = usePathname();
  const router = useRouter();
  const { path, hash } = splitHref(href);

  const handle = (e: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(e);
    if (e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;

    // Cross-route without hash: push imperatively so mobile menu unmount can't cancel navigation
    if (!hash && path !== pathname) {
      e.preventDefault();
      router.push(path);
      return;
    }

    e.preventDefault();
    if (path === pathname) {
      scrollToHash(hash || "#top");
      history.replaceState(null, "", hash || path);
      return;
    }
    setPendingHash(hash || "#top");
    router.push(path, { scroll: false });
  };

  return (
    <Link href={href} onClick={handle} scroll={!hash} {...rest}>
      {children}
    </Link>
  );
}
