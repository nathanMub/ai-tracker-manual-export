'use client';
import Link from 'next/link';
import { Star, ExternalLink, ArrowUpRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';

export default function ToolCard({ tool, index = 0 }) {
  const priceColor = {
    Free: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    Freemium: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    Paid: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    Enterprise: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
  }[tool.pricing] || 'bg-muted text-muted-foreground';

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: Math.min(index * 0.03, 0.3) }}
    >
      <Link href={`/tools/${tool.slug}`} className="group block">
        <div className="relative h-full rounded-2xl border border-border/60 bg-card p-5 hover:border-violet-500/40 hover:bg-card/80 transition-all duration-300">
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-violet-500/0 via-fuchsia-500/0 to-orange-400/0 group-hover:from-violet-500/5 group-hover:via-fuchsia-500/5 group-hover:to-orange-400/5 transition-opacity" />
          <div className="relative">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${tool.color} text-white font-bold text-lg shadow-lg`}>
                  {tool.initial}
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <h3 className="font-semibold truncate group-hover:text-violet-300 transition">{tool.name}</h3>
                    <ArrowUpRight className="h-3.5 w-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition" />
                  </div>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                    <span>{tool.rating?.toFixed(1)}</span>
                    <span>\u00b7</span>
                    <span>{(tool.views || 0).toLocaleString()} views</span>
                  </div>
                </div>
              </div>
            </div>
            <p className="mt-3 text-sm text-muted-foreground line-clamp-2 leading-relaxed">
              {tool.tagline}
            </p>
            <div className="mt-4 flex items-center gap-2 flex-wrap">
              <Badge variant="outline" className={`text-xs ${priceColor}`}>{tool.pricing}</Badge>
              {tool.hasAPI && <Badge variant="outline" className="text-xs bg-violet-500/10 text-violet-300 border-violet-500/20">API</Badge>}
              {tool.isOpenSource && <Badge variant="outline" className="text-xs bg-emerald-500/10 text-emerald-400 border-emerald-500/20">Open Source</Badge>}
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
