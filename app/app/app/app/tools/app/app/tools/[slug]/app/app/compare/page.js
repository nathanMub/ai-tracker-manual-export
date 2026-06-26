'use client';
import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Check, X as XIcon, Plus, Trash2, Star, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Navbar from '@/components/navbar';
import Footer from '@/components/footer';

function CompareInner() {
  const sp = useSearchParams();
  const router = useRouter();
  const initial = (sp.get('slugs') || '').split(',').filter(Boolean);
  const [slugs, setSlugs] = useState(initial);
  const [tools, setTools] = useState([]);
  const [allTools, setAllTools] = useState([]);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetch('/api/tools').then((r) => r.json()).then((d) => setAllTools(d.tools || []));
  }, []);

  useEffect(() => {
    if (slugs.length === 0) { setTools([]); return; }
    fetch('/api/compare?slugs=' + slugs.join(','))
      .then((r) => r.json())
      .then((d) => {
        // preserve order of slugs
        const ordered = slugs.map((s) => d.tools.find((t) => t.slug === s)).filter(Boolean);
        setTools(ordered);
      });
  }, [slugs]);

  const add = (slug) => {
    if (slugs.includes(slug) || slugs.length >= 4) return;
    const ns = [...slugs, slug];
    setSlugs(ns);
    router.replace('/compare?slugs=' + ns.join(','));
    setPickerOpen(false);
  };
  const remove = (slug) => {
    const ns = slugs.filter((s) => s !== slug);
    setSlugs(ns);
    router.replace('/compare?slugs=' + ns.join(','));
  };

  // Compute winner by rating
  const winnerSlug = tools.length ? tools.reduce((a, b) => (a.rating > b.rating ? a : b)).slug : null;

  const rows = [
    { label: 'Tagline', get: (t) => t.tagline },
    { label: 'Pricing', get: (t) => <Badge variant="outline">{t.pricing}</Badge> },
    { label: 'Rating', get: (t) => <span className="inline-flex items-center gap-1"><Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" /> {t.rating?.toFixed(1)}</span> },
    { label: 'Developer', get: (t) => t.developer },
    { label: 'Released', get: (t) => t.releaseYear },
    { label: 'API', get: (t) => t.hasAPI ? <Check className="h-4 w-4 text-emerald-400" /> : <XIcon className="h-4 w-4 text-rose-400" /> },
    { label: 'Open Source', get: (t) => t.isOpenSource ? <Check className="h-4 w-4 text-emerald-400" /> : <XIcon className="h-4 w-4 text-rose-400" /> },
    { label: 'Best for', get: (t) => <div className="flex flex-wrap gap-1">{t.bestFor?.map((b, i) => <Badge key={i} variant="outline" className="text-xs">{b}</Badge>)}</div> },
  ];

  const filtered = allTools.filter((t) => t.name.toLowerCase().includes(search.toLowerCase()) && !slugs.includes(t.slug)).slice(0, 30);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-10">
        <h1 className="text-4xl font-bold tracking-tight">Compare AI tools</h1>
        <p className="text-muted-foreground mt-1">Add up to 4 tools and see how they stack up side-by-side.</p>

        {tools.length === 0 && (
          <div className="mt-10 rounded-2xl border border-dashed border-border bg-card/30 p-10 text-center">
            <p className="text-muted-foreground mb-4">No tools selected yet.</p>
            <Button onClick={() => setPickerOpen(true)} className="gap-2"><Plus className="h-4 w-4" /> Add tool</Button>
          </div>
        )}

        {tools.length > 0 && (
          <div className="mt-8 overflow-x-auto">
            <div className="min-w-[700px]">
              <div className="grid" style={{ gridTemplateColumns: `200px repeat(${tools.length}, minmax(220px, 1fr)) auto` }}>
                {/* Header */}
                <div />
                {tools.map((t) => (
                  <div key={t.slug} className={`relative p-4 rounded-2xl border ${winnerSlug === t.slug ? 'border-amber-400/40 bg-amber-500/5' : 'border-border/60 bg-card'}`}>
                    {winnerSlug === t.slug && (
                      <Badge className="absolute -top-2 left-4 bg-gradient-to-r from-amber-400 to-orange-500 text-black border-0">Winner</Badge>
                    )}
                    <button onClick={() => remove(t.slug)} className="absolute top-2 right-2 text-muted-foreground hover:text-rose-400">
                      <Trash2 className="h-4 w-4" />
                    </button>
                    <div className={`h-12 w-12 rounded-xl bg-gradient-to-br ${t.color} flex items-center justify-center text-white font-bold text-lg`}>{t.initial}</div>
                    <div className="mt-3 font-semibold">{t.name}</div>
                    <a href={t.website} target="_blank" rel="noreferrer" className="text-xs text-violet-300 hover:underline inline-flex items-center gap-1 mt-1">
                      Visit <ExternalLink className="h-3 w-3" />
                    </a>
                  </div>
                ))}
                {tools.length < 4 && (
                  <div className="p-4 flex items-center justify-center">
                    <Button variant="outline" onClick={() => setPickerOpen(true)} className="gap-2"><Plus className="h-4 w-4" /> Add</Button>
                  </div>
                )}

                {/* Rows */}
                {rows.map((r, idx) => (
                  <>
                    <div key={`l-${idx}`} className="px-3 py-4 text-sm font-medium text-muted-foreground border-t border-border/40">{r.label}</div>
                    {tools.map((t) => (
                      <div key={`${r.label}-${t.slug}`} className="px-4 py-4 text-sm border-t border-border/40">{r.get(t)}</div>
                    ))}
                    {tools.length < 4 && <div className="border-t border-border/40" />}
                  </>
                ))}
              </div>
            </div>
          </div>
        )}

        {pickerOpen && (
          <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-start justify-center p-4 sm:p-10" onClick={() => setPickerOpen(false)}>
            <div className="w-full max-w-xl rounded-2xl border border-border bg-card shadow-2xl" onClick={(e) => e.stopPropagation()}>
              <div className="p-4 border-b border-border">
                <input autoFocus value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search tools to add..." className="w-full bg-transparent text-base focus:outline-none" />
              </div>
              <div className="max-h-96 overflow-y-auto p-2">
                {filtered.map((t) => (
                  <button key={t.slug} onClick={() => add(t.slug)} className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-background text-left">
                    <div className={`h-9 w-9 rounded-lg bg-gradient-to-br ${t.color} flex items-center justify-center text-white text-sm font-bold`}>{t.initial}</div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium">{t.name}</div>
                      <div className="text-xs text-muted-foreground truncate">{t.tagline}</div>
                    </div>
                    <Plus className="h-4 w-4 text-muted-foreground" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}

export default function ComparePage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background" />}>
      <CompareInner />
    </Suspense>
  );
}
