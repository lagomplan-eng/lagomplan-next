# Lagomplan — Next.js Setup Guide

## 1. Install dependencies
```bash
npm install
```

## 2. Environment variables
Create `.env.local` at the project root:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_key
```

## 3. Add your images to /public/images/
```
public/
  images/
    logo.png                   ← from your Webflow CDN
    teotihuacan.jpg            ← philosophy section
    founders/
      elena.png
      pilar.png
    guias/
      valle.jpg
      riviera.jpg
      cuernavaca.jpg
    reviews/
      jorge.png
      julia.png
      ana.png
    icons/
      guides.svg
      itin.svg
      adaptable.svg
      clarity.svg
```

Download all from your Webflow CDN:
- https://cdn.prod.website-files.com/69306a7963a631e30891e062/69856a3800a0b4caec3cd410_lagomplan_logo_full_transparent.png
- https://cdn.prod.website-files.com/69306a7963a631e30891e062/698b645bb81604ccbcb87576_Teotihuacán.jpg
- https://cdn.prod.website-files.com/69306a7963a631e30891e062/6997206b87647967a761d431_1.png  → elena.png
- https://cdn.prod.website-files.com/69306a7963a631e30891e062/6997206bd1d71ea0782a00fa_2.png  → pilar.png
- https://cdn.prod.website-files.com/69306a7963a631e30891e062/699719b0abc9067ea4920074_1.png  → jorge.png
- https://cdn.prod.website-files.com/69306a7963a631e30891e062/699719b097e7c1d1fb9964ab_2.png  → julia.png
- https://cdn.prod.website-files.com/69306a7963a631e30891e062/699719b0dc465d4063be5b82_3.png  → ana.png
- https://cdn.prod.website-files.com/698ccdce8917fd5186bff404/69c59236ef8a8b6c46d361e4_Valle.png
- https://cdn.prod.website-files.com/698ccdce8917fd5186bff404/69c5925c06af707040f34eb9_Riviera Maya.png
- https://cdn.prod.website-files.com/698ccdce8917fd5186bff404/69c59270a37d63249ad3bbfa_Cuernavaca.png
- https://cdn.prod.website-files.com/69306a7963a631e30891e062/6994cbcd9f77d76dc5ca9bf8_guides_lagomplan_icon.svg
- https://cdn.prod.website-files.com/69306a7963a631e30891e062/6994cbcd6cf8c1fe5062db87_itineraries_lagomplan_icon.svg
- https://cdn.prod.website-files.com/69306a7963a631e30891e062/6994cbcd07f3954c8d79fd18_adaptable_lagomplan_icon.svg
- https://cdn.prod.website-files.com/69306a7963a631e30891e062/6994cbcdfa24171db2d62bca_clarity_lagomplan_icon.svg

## 4. Run dev server
```bash
npm run dev
```
→ http://localhost:3000

## 5. Regenerate Supabase types (after schema changes)
```bash
npm run types
```

## 6. Deploy to Vercel
```bash
npx vercel
```
Add the same env vars in Vercel dashboard → Settings → Environment Variables.

---

## File structure delivered
```
lagomplan/
├── app/
│   ├── globals.css
│   └── [locale]/
│       ├── layout.tsx        ← Nav + Footer + i18n
│       └── page.tsx          ← Homepage (all 8 sections)
├── components/
│   ├── layout/
│   │   ├── Nav.tsx           ← Desktop + mobile hamburger
│   │   └── Footer.tsx
│   ├── forms/
│   │   ├── HeroForm.tsx      ← Full planner form
│   │   ├── PlacesInput.tsx   ← Google Maps typeahead
│   │   └── DateRangePicker.tsx
│   └── ui/
│       └── index.tsx         ← GuideCard, TripCard, Button...
├── lib/
│   └── supabase/
│       ├── client.ts
│       ├── server.ts
│       └── types.ts
├── messages/
│   ├── es.json
│   └── en.json
├── i18n.ts
├── middleware.ts
├── next.config.ts
├── tailwind.config.ts
└── package.json
```

## What's next
- `/guias` — guides index page
- `/guias/[slug]` — guide detail template (stub exists)
- `/trip-generator` — planner page
- E11 (April): Auth — replace stub in Nav.tsx
- E12/E13 (April): Stripe paywall
