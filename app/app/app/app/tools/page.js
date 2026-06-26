'use client';
import { useEffect, useState, useMemo, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Search, Filter, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Navbar from '@/components/navbar';
import Footer from '@/components/footer';
import ToolCard from '@/components/tool-card';

const PRICING = ['Free', 'Freemium', 'Paid'];
const SORTS = [
  { value: 'rating', label: 'Top Rated' },
  { value: 'popular', label: 'Most Popular' },
  { value: 'newest', label: 'Newest' },
  { value: 'name', label: 'A-Z' },
];

function ToolsInner() {
  const router = useRouter();
  const sp = useSearchParams();
  const [search, setSearch] = useState(sp.get('search') || '');
  const [category, setCategory] = useState(sp.get('category') || '');
  const [pricing, setPricing] = useState(sp.get('pricing') || '');
  const [sort, setSort] = useState('rating');
  const [tools, setTools] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/categories').then((r) => r.json()).then((d) => setCategories(d.categories || []));
  }, []);

  useEffect(() => {
    setLoading(true);
    const q = new URLSearchParams();
    if (search) q.set('search', search);
    if (category) q.set('category', category);
    if (pricing) q.set('pricing', pricing);
    if (sort) q.set('sort', sort);
    fetch('/api/tools?' + q.toString())
      .then((r) => r.json())
      .then((d) => { setTools(d.tools || []); setLoading(false); });
  }, [search, category, pricing, sort]);

  const clear = () => { setSearch(''); setCategory(''); setPricing(''); };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-10">
        <div className="flex items-end justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-4xl font-bold tracking-tight">All AI Tools</h1>
            <p className="text-muted-foreground mt-1">{tools.length} tools found</p>
          </div>
          <div className="flex items-center gap-2">
            <select value={sort} onChange={(e) => setSort(e.target.value)} className="h-10 rounded-lg border border-border bg-card px-3 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/50">
              {SORTS.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
            </select>
          </div>
        </div>

        <div className="mt-6 flex flex-col lg:flex-row gap-6">
          {/* Sidebar */}
          <aside className="lg:w-64 shrink-0">
            <div className="sticky top-20 space-y-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search tools..."
                  className="pl-9"
                />
              </div>
              <div>
                <div className="text-xs font-semibold text-muted-foreground uppercase mb-2 flex items-center justify-between">
                  Category
                  {category && <button onClick={() => setCategory('')} className="text-xs normal-case font-normal text-violet-400 hover:text-violet-300">Clear</button>}
                </div>
                <div className="space-y-1 max-h-72 overflow-auto pr-1">
                  {categories.map((c) => (
                    <button
                      key={c.slug}
                      onClick={() => setCategory(category === c.slug ? '' : c.slug)}
                      className={`w-full text-left text-sm px-3 py-2 rounded-lg flex items-center justify-between transition ${category === c.slug ? 'bg-violet-500/15 text-violet-300' : 'hover:bg-card text-muted-foreground hover:text-foreground'}`}
                    >
                      <span>{c.name}</span>
                      <span className="text-xs opacity-60">{c.count}</span>
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <div className="text-xs font-semibold text-muted-foreground uppercase mb-2">Pricing</div>
                <div className="flex flex-wrap gap-2">
                  {PRICING.map((p) => (
                    <button
                      key={p}
                      onClick={() => setPricing(pricing === p ? '' : p)}
                      className={`px-3 py-1.5 text-xs rounded-full border transition ${pricing === p ? 'bg-violet-500/15 border-violet-500/50 text-violet-300' : 'border-border text-muted-foreground hover:text-foreground hover:border-border'}`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>
              {(search || category || pricing) && (
                <Button variant="ghost" onClick={clear} className="w-full gap-2">
                  <X className="h-4 w-4" /> Clear all filters
                </Button>
              )}
            </div>
          </aside>

          {/* Grid */}
          <div className="flex-1">
            {loading ? (
              <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
                {Array.from({ length: 9 }).map((_, i) => (
                  <div key={i} className="h-40 rounded-2xl border border-border/60 bg-card/40 animate-pulse" />
                ))}
              </div>
            ) : tools.length === 0 ? (
              <div className="text-center py-24 text-muted-foreground">
                <Filter className="h-10 w-10 mx-auto mb-4 opacity-40" />
                <p>No tools match your filters.</p>
                <Button variant="link" onClick={clear}>Clear filters</Button>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
                {tools.map((t, i) => <ToolCard key={t.slug} tool={t} index={i} />)}
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default function ToolsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background" />}>
      <ToolsInner />
    </Suspense>
  );
}
