"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, LogOut } from "lucide-react";
import { useConvexAuth } from "convex/react";
import { useAuthActions } from "@convex-dev/auth/react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
  SheetClose,
} from "@/components/ui/sheet";
import { ThemeToggle } from "./ThemeToggle";

const navLinks = [
  { label: "How It Works", href: "/#how-it-works" },
  { label: "Pricing", href: "/#pricing" },
];

export function Header() {
  const [open, setOpen] = useState(false);
  const { isAuthenticated, isLoading } = useConvexAuth();
  const { signOut } = useAuthActions();

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-sm">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        {/* Logo */}
        <Link
          href="/"
          className="text-xl font-semibold tracking-tight transition-opacity hover:opacity-80"
        >
          Scope<span className="text-primary">AI</span>
          <span className="text-primary">.</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-6 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
          <ThemeToggle />

          {!isLoading && isAuthenticated ? (
            <>
              <Link
                href="/account"
                className="text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                Account
              </Link>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => signOut()}
                className="text-muted-foreground hover:text-foreground"
              >
                <LogOut className="mr-1.5 h-4 w-4" />
                Sign Out
              </Button>
            </>
          ) : !isLoading ? (
            <>
              <Link
                href="/auth/login"
                className="text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                Sign In
              </Link>
              <Button asChild>
                <Link href="/create">Start My Scope</Link>
              </Button>
            </>
          ) : null}

          {isLoading && (
            <Button asChild>
              <Link href="/create">Start My Scope</Link>
            </Button>
          )}
        </nav>

        {/* Mobile nav */}
        <div className="flex items-center gap-2 md:hidden">
          <ThemeToggle />
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" aria-label="Open menu">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="flex flex-col">
              <SheetHeader>
                <SheetTitle className="text-left text-xl tracking-tight">
                  Scope<span className="text-primary">AI</span>
                  <span className="text-primary">.</span>
                </SheetTitle>
                <SheetDescription className="sr-only">
                  Navigation menu
                </SheetDescription>
              </SheetHeader>

              <nav className="flex flex-col px-4">
                {navLinks.map((link) => (
                  <SheetClose asChild key={link.href}>
                    <Link
                      href={link.href}
                      className="border-b border-border py-3 text-lg text-foreground transition-colors hover:text-primary"
                      onClick={() => setOpen(false)}
                    >
                      {link.label}
                    </Link>
                  </SheetClose>
                ))}

                {!isLoading && isAuthenticated ? (
                  <>
                    <SheetClose asChild>
                      <Link
                        href="/account"
                        className="border-b border-border py-3 text-lg text-foreground transition-colors hover:text-primary"
                        onClick={() => setOpen(false)}
                      >
                        Account
                      </Link>
                    </SheetClose>
                    <SheetClose asChild>
                      <button
                        onClick={() => { signOut(); setOpen(false); }}
                        className="border-b border-border py-3 text-left text-lg text-muted-foreground transition-colors hover:text-primary"
                      >
                        Sign Out
                      </button>
                    </SheetClose>
                  </>
                ) : !isLoading ? (
                  <SheetClose asChild>
                    <Link
                      href="/auth/login"
                      className="border-b border-border py-3 text-lg text-foreground transition-colors hover:text-primary"
                      onClick={() => setOpen(false)}
                    >
                      Sign In
                    </Link>
                  </SheetClose>
                ) : null}
              </nav>

              <SheetFooter>
                <SheetClose asChild>
                  <Button asChild className="w-full" size="lg">
                    <Link href="/create">Start My Scope</Link>
                  </Button>
                </SheetClose>
              </SheetFooter>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
