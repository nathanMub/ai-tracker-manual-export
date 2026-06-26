'use client';
import { useEffect, useState, useMemo } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Search, Sparkles, TrendingUp, ArrowRight, Star, Zap,
  MessageSquare, Image as ImageIcon, Code2, Video, Mic, Music,
  PenTool, Palette, Megaphone, Briefcase, Layers,
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Navbar from '@/components/navbar';
import Footer from '@/components/footer';
import ToolCard from '@/components/tool-card';
import { useRouter } from 'next/navigation';

const ICONS = {
  MessageSquare, Image: ImageIcon, Code2, Video, Mic, Music,
  PenTool, Palette, Zap, Megaphone, Search, Briefcase,
};

function useFetch(url) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    let alive = true;
    setLoading(true);
    fetch(url).then((r) => r.json()).then((d) => { if (alive) { setData(d); setLoading(false); } }).catch(() => setLoading(false));
    return () => { alive = false; };
  }, [url]);
  return { data, loading };
}

function Hero() {
  const router = useRouter();
  const [q, setQ] = useState('');
  const popular = ['ChatGPT', 'Midjourney', 'Claude', 'Cursor', 'Suno', 'Runway'];
  const onSearch = (e) => {
    e.preventDefault();
    const url = q ? `/tools?search=${encodeURIComponent(q)}` : '/tools';
    router.push(url);
  };
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 grid-bg opacity-50" />
      <div className="absolute -top-32 -left-32 h-96 w-96 rounded-full bg-violet-600/30 blur-3xl animate-blob" />
      <div className="absolute -top-10 right-0 h-96 w-96 rounded-full bg-fuchsia-600/20 blur-3xl animate-blob" style={{ animationDelay: '4s' }} />
      <div className="absolute top-40 left-1/3 h-96 w-96 rounded-full bg-orange-500/15 blur-3xl animate-blob" style={{ animationDelay: '8s' }} />

      <div className="container relative mx-auto px-4 pt-20 pb-24 sm:pt-28 sm:pb-32">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col items-center text-center"
        >
          <Badge variant="outline" className="mb-6 gap-1.5 border-violet-500/30 bg-violet-500/10 text-violet-300">
            <Sparkles className="h-3 w-3" />
            Updated daily · {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
          </Badge>
          <h1 className="max-w-4xl text-5xl sm:text-6xl md:text-7xl font-bold tracking-tight leading-[1.05]">
            Discover the best{' '}
            <span className="gradient-text">AI tools</span>
            <br className="hidden sm:block" /> in seconds.
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-muted-foreground">
            Browse, compare, and choose from thousands of curated AI tools across every category. Built for makers, creators, and teams.
          </p>

          <form onSubmit={onSearch} className="mt-10 w-full max-w-2xl">
            <div className="relative group">
              <div className="absolute -inset-0.5 rounded-2xl bg-gradient-to-r from-violet-500 via-fuchsia-500 to-orange-400 opacity-60 blur-md group-hover:opacity-90 transition" />
              <div className="relative flex items-center gap-2 rounded-2xl border border-border bg-background/95 p-2 backdrop-blur-xl">
                <Search className="ml-3 h-5 w-5 text-muted-foreground shrink-0" />
                <Input
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="Search 50+ AI tools by name, task, or feature..."
                  className="border-0 bg-transparent text-base focus-visible:ring-0 shadow-none"
                />
                <Button type="submit" className="h-10 px-5 bg-gradient-to-r from-violet-500 to-fuchsia-500 hover:opacity-90">
                  Search
                </Button>
              </div>
            </div>
            <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-xs text-muted-foreground">
              <span>Popular:</span>
              {popular.map((p) => (
                <Link key={p} href={`/tools?search=${encodeURIComponent(p)}`}>
                  <span className="px-2.5 py-1 rounded-full border border-border/60 bg-card/50 hover:bg-card hover:border-violet-500/40 hover:text-foreground transition cursor-pointer">
                    {p}
                  </span>
                </Link>
              ))}
            </div>
          </form>
        </motion.div>
      </div>
    </section>
  );
}

function Stats() {
  const { data } = useFetch('/api/stats');
  const stats = [
    { label: 'AI Tools Curated', value: (data?.tools ?? 50) + '+' },
    { label: 'Categories', value: (data?.categories ?? 12) + '+' },
    { label: 'Daily Visits', value: '124k+' },
    { label: 'Community Reviews', value: '12k+' },
  ];
  return (
    <section className="container mx-auto px-4 -mt-8 mb-16">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 rounded-2xl border border-border/60 bg-card/40 backdrop-blur p-2">
        {stats.map((s, i) => (
          <div key={i} className="text-center p-5 rounded-xl hover:bg-card/60 transition">
            <div className="text-3xl font-bold gradient-text">{s.value}</div>
            <div className="text-xs uppercase tracking-wider text-muted-foreground mt-1">{s.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

function Marquee({ tools }) {
  if (!tools?.length) return null;
  const items = [...tools, ...tools];
  return (
    <section className="relative my-16 overflow-hidden border-y border-border/40 py-6 bg-card/20">
      <div className="flex gap-4 animate-marquee whitespace-nowrap">
        {items.map((t, i) => (
          <Link key={i} href={`/tools/${t.slug}`} className="flex items-center gap-3 px-5 py-2 rounded-full border border-border/60 bg-background hover:border-violet-500/40 transition">
            <div className={`h-7 w-7 rounded-lg bg-gradient-to-br ${t.color} flex items-center justify-center text-xs font-bold text-white`}>
              {t.initial}
            </div>
            <span className="text-sm font-medium">{t.name}</span>
            <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
            <span className="text-xs text-muted-foreground">{t.rating?.toFixed(1)}</span>
          </Link>
        ))}
      </div>
    </section>
  );
}

function Categories({ categories }) {
  return (
    <section id="categories" className="container mx-auto px-4 py-16">
      <div className="flex items-end justify-between mb-10">
        <div>
          <Badge variant="outline" className="mb-3 gap-1.5">
            <Layers className="h-3 w-3" /> Explore by category
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Browse every category</h2>
          <p className="text-muted-foreground mt-2">From writing to video, find tools tailored to your workflow.</p>
        </div>
        <Link href="/tools" className="hidden md:inline-flex">
          <Button variant="ghost" className="gap-1">View all <ArrowRight className="h-4 w-4" /></Button>
        </Link>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {categories?.map((c, i) => {
          const Icon = ICONS[c.icon] || Sparkles;
          return (
            <motion.div
              key={c.slug}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: i * 0.03 }}
            >
              <Link href={`/tools?category=${c.slug}`} className="group block">
                <div className="relative h-full overflow-hidden rounded-2xl border border-border/60 bg-card p-5 hover:border-violet-500/40 transition">
                  <div className={`absolute -top-10 -right-10 h-32 w-32 rounded-full bg-gradient-to-br ${c.gradient} opacity-20 blur-2xl group-hover:opacity-40 transition`} />
                  <div className="relative">
                    <div className={`inline-flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br ${c.gradient} text-white shadow-lg`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <h3 className="mt-4 font-semibold group-hover:text-violet-300 transition">{c.name}</h3>
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{c.description}</p>
                    <div className="mt-3 text-xs text-muted-foreground">{c.count} tools</div>
                  </div>
                </div>
              </Link>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}

function Trending({ tools }) {
  return (
    <section id="trending" className="container mx-auto px-4 py-16">
      <div className="flex items-end justify-between mb-10">
        <div>
          <Badge variant="outline" className="mb-3 gap-1.5 border-orange-500/30 bg-orange-500/10 text-orange-300">
            <TrendingUp className="h-3 w-3" /> Trending now
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Most popular AI tools</h2>
          <p className="text-muted-foreground mt-2">Hand-picked by the community this month.</p>
        </div>
        <Link href="/tools" className="hidden md:inline-flex">
          <Button variant="ghost" className="gap-1">See all <ArrowRight className="h-4 w-4" /></Button>
        </Link>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {tools?.slice(0, 12).map((t, i) => <ToolCard key={t.slug} tool={t} index={i} />)}
      </div>
    </section>
  );
}

function CTA() {
  return (
    <section className="container mx-auto px-4 my-20">
      <div className="relative overflow-hidden rounded-3xl border border-border/60 bg-gradient-to-br from-violet-600/20 via-fuchsia-600/10 to-orange-500/10 p-10 md:p-16 text-center">
        <div className="absolute inset-0 grid-bg opacity-30" />
        <div className="relative">
          <h3 className="text-3xl md:text-4xl font-bold tracking-tight">Get the weekly AI digest</h3>
          <p className="text-muted-foreground mt-3 max-w-xl mx-auto">
            New AI tools, trends, and tutorials \u2014 in your inbox every Friday. No spam.
          </p>
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              const fd = new FormData(e.currentTarget);
              await fetch('/api/newsletter', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email: fd.get('email') }) });
              e.currentTarget.reset();
              const { toast } = await import('sonner');
              toast.success('Subscribed! Check your inbox.');
            }}
            className="mt-8 flex flex-col sm:flex-row gap-2 max-w-md mx-auto"
          >
            <Input name="email" type="email" required placeholder="you@email.com" className="h-12" />
            <Button className="h-12 px-6 bg-gradient-to-r from-violet-500 to-fuchsia-500">Subscribe</Button>
          </form>
        </div>
      </div>
    </section>
  );
}

function App() {
  const { data: catData } = useFetch('/api/categories');
  const { data: toolData } = useFetch('/api/trending');
  const tools = toolData?.tools || [];
  const categories = catData?.categories || [];
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <Hero />
      <Stats />
      <Marquee tools={tools} />
      <Trending tools={tools} />
      <Categories categories={categories} />
      <CTA />
      <Footer />
    </div>
  );
}

export default App;
