import { NextResponse } from 'next/server';
import { getDb } from '@/lib/mongo';
import { TOOLS, CATEGORIES } from '@/lib/tools-data';

function json(data, status = 200) {
  return NextResponse.json(data, { status });
}

async function ensureSeed() {
  const db = await getDb();
  const toolsCol = db.collection('tools');
  const count = await toolsCol.countDocuments();
  if (count === 0) {
    const docs = TOOLS.map((t) => ({ ...t, createdAt: new Date(), updatedAt: new Date() }));
    await toolsCol.insertMany(docs);
  }
  const catCol = db.collection('categories');
  const cc = await catCol.countDocuments();
  if (cc === 0) {
    await catCol.insertMany(CATEGORIES.map((c) => ({ ...c })));
  }
}

export async function GET(request, { params }) {
  try {
    await ensureSeed();
    const p = (await params).path || [];
    const url = new URL(request.url);
    const db = await getDb();
    const tools = db.collection('tools');
    const cats = db.collection('categories');

    // GET /api/ -> health
    if (p.length === 0) {
      return json({ status: 'ok', name: 'AIToolHub API' });
    }

    // GET /api/categories
    if (p[0] === 'categories' && p.length === 1) {
      const list = await cats.find({}, { projection: { _id: 0 } }).toArray();
      // attach tool counts
      const withCounts = await Promise.all(
        list.map(async (c) => ({
          ...c,
          count: await tools.countDocuments({ category: c.slug }),
        }))
      );
      return json({ categories: withCounts });
    }

    // GET /api/categories/:slug
    if (p[0] === 'categories' && p.length === 2) {
      const cat = await cats.findOne({ slug: p[1] }, { projection: { _id: 0 } });
      if (!cat) return json({ error: 'Not found' }, 404);
      const list = await tools
        .find({ category: p[1] }, { projection: { _id: 0 } })
        .sort({ rating: -1 })
        .toArray();
      return json({ category: cat, tools: list });
    }

    // GET /api/tools?search=&category=&pricing=&sort=
    if (p[0] === 'tools' && p.length === 1) {
      const search = url.searchParams.get('search') || '';
      const category = url.searchParams.get('category') || '';
      const pricing = url.searchParams.get('pricing') || '';
      const sort = url.searchParams.get('sort') || 'rating';
      const limit = parseInt(url.searchParams.get('limit') || '500', 10);

      const q = {};
      if (category) q.category = category;
      if (pricing) q.pricing = pricing;
      if (search) {
        const rx = { $regex: search, $options: 'i' };
        q.$or = [
          { name: rx },
          { tagline: rx },
          { description: rx },
          { tags: rx },
          { developer: rx },
        ];
      }
      const sortMap = { rating: { rating: -1 }, popular: { views: -1 }, newest: { releaseYear: -1 }, name: { name: 1 } };
      const list = await tools
        .find(q, { projection: { _id: 0 } })
        .sort(sortMap[sort] || { rating: -1 })
        .limit(limit)
        .toArray();
      return json({ tools: list, total: list.length });
    }

    // GET /api/tools/:slug
    if (p[0] === 'tools' && p.length === 2) {
      const tool = await tools.findOne({ slug: p[1] }, { projection: { _id: 0 } });
      if (!tool) return json({ error: 'Not found' }, 404);
      // increment view
      await tools.updateOne({ slug: p[1] }, { $inc: { views: 1 } });
      const related = await tools
        .find({ category: tool.category, slug: { $ne: tool.slug } }, { projection: { _id: 0 } })
        .sort({ rating: -1 })
        .limit(6)
        .toArray();
      return json({ tool, related });
    }

    // GET /api/trending
    if (p[0] === 'trending') {
      const list = await tools
        .find({}, { projection: { _id: 0 } })
        .sort({ views: -1 })
        .limit(12)
        .toArray();
      return json({ tools: list });
    }

    // GET /api/stats
    if (p[0] === 'stats') {
      const totalTools = await tools.countDocuments();
      const totalCats = await cats.countDocuments();
      return json({
        tools: totalTools,
        categories: totalCats,
        reviews: 12450,
        users: 86200,
      });
    }

    // GET /api/compare?slugs=a,b,c
    if (p[0] === 'compare') {
      const slugs = (url.searchParams.get('slugs') || '').split(',').filter(Boolean);
      const list = await tools
        .find({ slug: { $in: slugs } }, { projection: { _id: 0 } })
        .toArray();
      return json({ tools: list });
    }

    return json({ error: 'Not found' }, 404);
  } catch (e) {
    console.error('API GET error', e);
    return json({ error: e.message }, 500);
  }
}

export async function POST(request, { params }) {
  try {
    await ensureSeed();
    const p = (await params).path || [];
    const db = await getDb();

    // POST /api/seed (idempotent re-seed if missing)
    if (p[0] === 'seed') {
      const tools = db.collection('tools');
      await tools.deleteMany({});
      await tools.insertMany(TOOLS.map((t) => ({ ...t, createdAt: new Date() })));
      const cats = db.collection('categories');
      await cats.deleteMany({});
      await cats.insertMany(CATEGORIES.map((c) => ({ ...c })));
      return json({ ok: true, seeded: TOOLS.length });
    }

    // POST /api/newsletter { email }
    if (p[0] === 'newsletter') {
      const body = await request.json();
      if (!body?.email) return json({ error: 'Email required' }, 400);
      await db.collection('newsletter').insertOne({ email: body.email, createdAt: new Date() });
      return json({ ok: true });
    }

    return json({ error: 'Not found' }, 404);
  } catch (e) {
    console.error('API POST error', e);
    return json({ error: e.message }, 500);
  }
}
