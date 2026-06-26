'use client';
import Link from 'next/link';
import { Sparkles, Search, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

export default function Navbar() {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/70 backdrop-blur-xl">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="relative">
            <div className="absolute -inset-1 rounded-lg bg-gradient-to-br from-violet-500 via-fuchsia-500 to-orange-400 opacity-70 blur group-hover:opacity-100 transition" />
            <div className="relative flex h-8 w-8 items-center justify-center rounded-lg bg-background">
              <Sparkles className="h-4 w-4 text-violet-400" />
            </div>
          </div>
          <span className="text-lg font-semibold tracking-tight">AIToolHub</span>
        </Link>

        <nav className="hidden md:flex items-center gap-7 text-sm text-muted-foreground">
          <Link href="/tools" className="hover:text-foreground transition">Tools</Link>
          <Link href="/#categories" className="hover:text-foreground transition">Categories</Link>
          <Link href="/compare" className="hover:text-foreground transition">Compare</Link>
          <Link href="/#trending" className="hover:text-foreground transition">Trending</Link>
        </nav>

        <div className="flex items-center gap-2">
          <Link href="/tools" className="hidden sm:block">
            <Button variant="ghost" size="sm" className="gap-2">
              <Search className="h-4 w-4" /> Search
            </Button>
          </Link>
          <Link href="/tools">
            <Button size="sm" className="bg-gradient-to-r from-violet-500 to-fuchsia-500 hover:opacity-90">
              Browse Tools
            </Button>
          </Link>
          <button className="md:hidden p-2" onClick={() => setOpen(!open)}>
            <Menu className="h-5 w-5" />
          </button>
        </div>
      </div>
      {open && (
        <div className="md:hidden border-t border-border/50 px-4 py-3 space-y-2 text-sm">
          <Link href="/tools" className="block py-1">Tools</Link>
          <Link href="/#categories" className="block py-1">Categories</Link>
          <Link href="/compare" className="block py-1">Compare</Link>
        </div>
      )}
    </header>
  );
}
