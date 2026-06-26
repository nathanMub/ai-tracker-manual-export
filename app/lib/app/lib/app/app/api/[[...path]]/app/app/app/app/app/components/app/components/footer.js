import Link from 'next/link';
import { Sparkles, Twitter, Github, Linkedin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-border/50 mt-24">
      <div className="container mx-auto px-4 py-12 grid gap-10 md:grid-cols-4">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="h-5 w-5 text-violet-400" />
            <span className="font-semibold">AIToolHub</span>
          </div>
          <p className="text-sm text-muted-foreground max-w-xs">
            The world\u2019s most comprehensive AI tools directory. Discover, compare, and choose the best AI for any task.
          </p>
          <div className="flex gap-3 mt-4 text-muted-foreground">
            <Twitter className="h-4 w-4 hover:text-foreground cursor-pointer" />
            <Github className="h-4 w-4 hover:text-foreground cursor-pointer" />
            <Linkedin className="h-4 w-4 hover:text-foreground cursor-pointer" />
          </div>
        </div>
        <div>
          <div className="text-sm font-medium mb-3">Discover</div>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><Link href="/tools" className="hover:text-foreground">All Tools</Link></li>
            <li><Link href="/#categories" className="hover:text-foreground">Categories</Link></li>
            <li><Link href="/#trending" className="hover:text-foreground">Trending</Link></li>
            <li><Link href="/compare" className="hover:text-foreground">Compare</Link></li>
          </ul>
        </div>
        <div>
          <div className="text-sm font-medium mb-3">Resources</div>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>Blog</li>
            <li>Newsletter</li>
            <li>Submit a Tool</li>
            <li>API</li>
          </ul>
        </div>
        <div>
          <div className="text-sm font-medium mb-3">Company</div>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>About</li>
            <li>Contact</li>
            <li>Privacy</li>
            <li>Terms</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border/50 py-6 text-center text-xs text-muted-foreground">
        \u00a9 {new Date().getFullYear()} AIToolHub. Crafted with care.
      </div>
    </footer>
  );
}
