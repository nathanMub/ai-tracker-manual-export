'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Star, ExternalLink, Check, X as XIcon, Sparkles, Tag,
  Calendar, Users, Code, Globe, ArrowLeft, BarChart3, GitCompare,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Navbar from '@/components/navbar';
import Footer from '@/components/footer';
import ToolCard from '@/components/tool-card';

export default function ToolDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug;
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/tools/${slug}`)
      .then((r) => r.json())
      .then((d) => { setData(d); setLoading(false); });
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-16">
          <div className="h-40 rounded-2xl bg-card/40 animate-pulse" />
        </div>
      </div>
    );
  }
  if (!data?.tool) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-24 text-center">
          <h1 className="text-3xl font-bold">Tool not found</h1>
          <Link href="/tools"><Button variant="link" className="mt-2">Browse all tools</Button></Link>
        </div>
      </div>
    );
  }
  const t = data.tool;
  const related = data.related || [];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border/40">
        <div className={`absolute inset-0 bg-gradient-to-br ${t.color} opacity-10`} />
        <div className="absolute inset-0 grid-bg opacity-30" />
        <div className="container relative mx-auto px-4 py-12">
          <button onClick={() => router.back()} className="text-sm text-muted-foreground hover:text-foreground inline-flex items-center gap-1 mb-6">
            <ArrowLeft className="h-4 w-4" /> Back
          </button>
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col md:flex-row md:items-start gap-6">
            <div className={`h-24 w-24 rounded-2xl bg-gradient-to-br ${t.color} flex items-center justify-center text-white text-4xl font-bold shadow-2xl shrink-0`}>
              {t.initial}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3 flex-wrap">
                <h1 className="text-4xl md:text-5xl font-bold tracking-tight">{t.name}</h1>
                <Badge variant="outline" className="gap-1 bg-amber-500/10 text-amber-400 border-amber-500/20">
                  <Star className="h-3 w-3 fill-current" /> {t.rating?.toFixed(1)}
                </Badge>
              </div>
              <p className="mt-2 text-lg text-muted-foreground">{t.tagline}</p>
              <div className="mt-4 flex flex-wrap items-center gap-2">
                <Badge variant="outline">{t.pricing}</Badge>
                <Link href={`/tools?category=${t.category}`}>
                  <Badge variant="outline" className="hover:bg-card cursor-pointer">{t.category}</Badge>
                </Link>
                {t.hasAPI && <Badge variant="outline" className="bg-violet-500/10 text-violet-300 border-violet-500/20">API available</Badge>}
                {t.isOpenSource && <Badge variant="outline" className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20">Open Source</Badge>}
              </div>
            </div>
            <div className="flex flex-col gap-2 md:items-end">
              <a href={t.website} target="_blank" rel="noreferrer">
                <Button className="gap-2 bg-gradient-to-r from-violet-500 to-fuchsia-500 hover:opacity-90">
                  Visit website <ExternalLink className="h-4 w-4" />
                </Button>
              </a>
              <Link href={`/compare?slugs=${t.slug}`}>
                <Button variant="outline" className="gap-2 w-full">
                  <GitCompare className="h-4 w-4" /> Compare
                </Button>
              </Link>
            </div>
          </motion.div>

          {/* meta */}
          <div className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-3">
            <Meta icon={Users} label="Developer" value={t.developer} />
            <Meta icon={Calendar} label="Released" value={t.releaseYear} />
            <Meta icon={BarChart3} label="Views" value={(t.views || 0).toLocaleString()} />
            <Meta icon={Globe} label="Pricing" value={t.pricing} />
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12 grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-10">
          <Section title="Overview">
            <p className="text-base leading-relaxed text-muted-foreground">{t.description}</p>
          </Section>
          <Section title="Key features" icon={Sparkles}>
            <div className="grid sm:grid-cols-2 gap-3">
              {t.features?.map((f, i) => (
                <div key={i} className="flex items-start gap-2 rounded-xl border border-border/60 bg-card/40 p-3">
                  <Check className="h-4 w-4 mt-0.5 text-emerald-400 shrink-0" />
                  <span className="text-sm">{f}</span>
                </div>
              ))}
            </div>
          </Section>
          <div className="grid md:grid-cols-2 gap-6">
            <Section title="Pros">
              <ul className="space-y-2">
                {t.pros?.map((p, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm"><Check className="h-4 w-4 mt-0.5 text-emerald-400 shrink-0" /> {p}</li>
                ))}
              </ul>
            </Section>
            <Section title="Cons">
              <ul className="space-y-2">
                {t.cons?.map((p, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm"><XIcon className="h-4 w-4 mt-0.5 text-rose-400 shrink-0" /> {p}</li>
                ))}
              </ul>
            </Section>
          </div>
          <Section title="Best for">
            <div className="flex flex-wrap gap-2">
              {t.bestFor?.map((b, i) => (
                <Badge key={i} variant="outline" className="px-3 py-1.5 text-sm">{b}</Badge>
              ))}
            </div>
          </Section>
          {t.tags?.length > 0 && (
            <Section title="Tags" icon={Tag}>
              <div className="flex flex-wrap gap-2">
                {t.tags?.map((tag) => (
                  <span key={tag} className="px-2.5 py-1 rounded-full text-xs border border-border/60 bg-card/50 text-muted-foreground">#{tag}</span>
                ))}
              </div>
            </Section>
          )}
        </div>

        <aside className="space-y-6">
          <div className="rounded-2xl border border-border/60 bg-card p-5">
            <h3 className="font-semibold mb-3">Quick links</h3>
            <a href={t.website} target="_blank" rel="noreferrer" className="flex items-center justify-between p-3 rounded-lg hover:bg-background transition group">
              <span className="text-sm">Official website</span>
              <ExternalLink className="h-4 w-4 text-muted-foreground group-hover:text-foreground" />
            </a>
            <Link href={`/tools?category=${t.category}`} className="flex items-center justify-between p-3 rounded-lg hover:bg-background transition">
              <span className="text-sm">More in {t.category}</span>
              <ExternalLink className="h-4 w-4 text-muted-foreground" />
            </Link>
          </div>
        </aside>
      </div>

      {related.length > 0 && (
        <section className="container mx-auto px-4 pb-20">
          <h2 className="text-2xl font-bold tracking-tight mb-6">Alternatives & related</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {related.map((rt, i) => <ToolCard key={rt.slug} tool={rt} index={i} />)}
          </div>
        </section>
      )}

      <Footer />
    </div>
  );
}

function Section({ title, icon: Icon, children }) {
  return (
    <div>
      <h2 className="text-2xl font-bold tracking-tight mb-4 flex items-center gap-2">
        {Icon && <Icon className="h-5 w-5 text-violet-400" />} {title}
      </h2>
      {children}
    </div>
  );
}

function Meta({ icon: Icon, label, value }) {
  return (
    <div className="rounded-xl border border-border/60 bg-card/40 p-3">
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <Icon className="h-3.5 w-3.5" /> {label}
      </div>
      <div className="mt-1 font-semibold text-sm">{value || '—'}</div>
    </div>
  );
}
