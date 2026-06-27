---
name: source-dtc-brand
description: Discover and qualify high-potential true-DTC opportunities for a TRNDY batch via live Google in Chrome — read Heimerdinger intelligence first, apply the opportunity-quality gate, pick best-fit celeb, then write earned opportunities to the run sheet.
---

# Discover & Qualify DTC Opportunities

Run this for every sourcing batch. You **discover and qualify** companies, set the batch's category
**mix**, and pick the best-fit **celeb** for each opportunity. You output qualified companies to the
run sheet and nothing else — you don't enrich contacts (Jayce), touch HubSpot (Viktor), or perform
security work (Camille).

Opportunity quality beats lead quantity: a quick bad lead is worse than a slower good one. When the
gate and the count fight, **the gate wins** — skip/flag rather than force a number. Every company
entering the pipeline should be one you would confidently hand to Sales.

## Inputs (from Nexus / the run sheet)
- The **batch brief**: size + any one-off instruction from Jacob.
- **Heimerdinger's `lead-patterns.md`** + the last-24h read of HubSpot adds and what's converting.

## Step 1 — Morning intelligence read FIRST
Before sourcing anything:
1. Read Heimerdinger's **Operational Intelligence**: last-24h adds, current categories being written,
   channel scoreboard, and enrichment gaps.
2. Read Heimerdinger's **Success Intelligence**: what is advancing, converting, or becoming closed-won.
3. Identify the categories, company profiles, source channels, and celeb pairings that are writing the
   most deals.
4. Build today's sourcing strategy: proven lanes to exploit, disciplined exploration to test, and
   obvious skip risks to avoid.

Do not start from habit when fresh intelligence exists. The morning read sets your mix for the batch.

## Step 2 — Source from multiple channels (all funnel into the gate)
Work several channels and rotate. The **lead is always the brand's own DTC site** — every channel
below is just a way to *discover* a brand. Pull keywords from `search-queries.md` and lanes from
`category-map.md` (Howie) / `category-map-brooke.md` (Brooke).

- **A. Google comma-search (primary).** Drive the `openclaw` Chrome to google.com and run the comma
  method `{ingredient}, {product form}, {descriptor}` (see `search-queries.md`). Rotate the descriptor
  for fresh SERPs; work every result.
- **B. Google Shopping.** Same product keywords in Shopping; click listings through to the brand's site.
- **C. Amazon & Walmart.** In-site search `{keyword} {product type}`; find the brand on a listing, then
  go to its own site (`search-queries.md` → Site-scoped search).
- **D. Meta Ad Library (secondary).** Find live DTC advertisers by keyword; click through to their
  site. Noisy — part of the explore budget.
- **E. Trade-show exhibitor lists.** Mine directories per `trade-shows.md` — most exhibitors are B2B
  (manufacturers/wholesalers) and auto-skip, so qualify hard.
- **F. Explore/exploit — find new channels.** The channel list is a starting set, not a ceiling. Spend
  most effort on what Heimerdinger says is converting; reserve a slice each batch to test a new angle
  (Product Hunt, Kickstarter/Indiegogo, TikTok Shop, niche subreddits, influencer #ad posts, "best of"
  listicles, retailer "new arrivals"). Log each channel's yield; promote winners, retire dead ones.

**Rules across every channel:** **never** source from training memory (brands go stale/acquired/dead);
**never** use the `web_search` API for discovery — go through the browser (a quick fetch to verify one
known URL is fine); **never** bypass bot-detection or CAPTCHAs — if you hit one, stop and flag Jacob.

## Step 3 — Qualify each candidate (open the site; ALL must pass or SKIP)
1. **TRUE DTC only** — the brand makes/owns its product and sells directly to consumers from its **own
   branded site** with a working cart/checkout. SKIP B2B/wholesale-only, distributors, ingredient or
   private-label suppliers, agencies, resellers/marketplaces, and "where to buy / find us in stores"
   brands with no direct online purchase path.
2. **NO manufacturers — ever.** Never a manufacturer, factory, OEM/ODM, contract or white-label/
   private-label producer, or supplier. If it describes itself that way or sells mainly to businesses,
   SKIP outright — even with a slick site.
3. **Site LIVE and FULLY FUNCTIONAL.** Load it and confirm end-to-end: pages load, product + checkout
   work, no broken links/images, not dead/parked/expired/"coming soon"/erroring. Loads-but-broken
   (no working checkout) does **not** qualify.
4. **No handmade / artisanal beauty & personal care.** SKIP homemade, hand-poured, small-batch craft,
   or Etsy/farmers-market-style beauty/personal care. It qualifies only when professionally produced
   and scalable.

## Step 3b — Potential, not perfection
Weak websites, weak branding, poor SEO, thin social media, unclear positioning, and operational gaps
can be opportunity signals. Do **not** reject a legitimate DTC business merely because its marketing
is imperfect.

You are not deciding whether the company will become a client. You decide whether it fits the ICP,
is legitimate, and deserves Sales' time; Sales determines whether there is a business opportunity.

Reject only when the business is not legitimate, not truly DTC, clearly outside the department
objective, abandoned/no longer operating, or blocked by a no-go/safety rule. The standard is: "Would
Sales be right to spend time here, and can TRNDY plausibly create meaningful value?"

## Step 4 — Category & geography rules
- **Health & Wellness ≠ food.** When the brief calls for Health & Wellness / Supplements, do NOT count
  food, snacks, cereal, pantry, bars, nut butters, pasta — unless Jacob explicitly asks for food. Use
  real supplements/wellness products and safe wellness devices/accessories with light claims.
- **US is the default.** A few strong non-US leads are OK when they resemble approved examples
  (ecommerce-ready, demoable 10-second problem/solution, clean contact info) — use them **sparingly**,
  never let them dominate a batch.

## Step 5 — Own the batch mix
- **Health & Wellness leads the mix**, but round each batch out with a varied spread of other strong
  categories so it doesn't skew into a few narrow lanes. H&W leads; it isn't the whole mix.
- **No fixed per-category quotas** (the old 6/6/6/2 split is retired). Mix is set dynamically by
  Step 1's read.
- Favor demoable, practical products a recognizable personality can explain fast (clear before/after
  or a daily problem solved). Prefer **pets over kids**. See the Sourcing Playbook lanes in your
  `AGENTS.md` for what a strong lead looks like in each lane.
- Balance proven opportunities with disciplined exploration. Curiosity is part of the job, but every
  exploration lead must still earn its place.

## Step 6 — Pick the celeb (your judgment, honor the No-Go lists)
- Choose ONE best-fit endorser from **only: Howie Mandel and Brooke Burke.** (Dr. Phil is parked — not in rotation.)
- **Before assigning, check the product against that celeb's No-Go list in your `AGENTS.md`.** If it's
  on their list, it's disqualified for that celeb — pick another eligible celeb or skip the lead. (The
  No-Go lists live in the brain so they stay the single source of truth — don't reproduce them here.)
- Celeb leans: **Howie** for clever problem-solving utility, pet, broad outdoor, general wellness;
  **Brooke** for beauty/lifestyle/home/kitchen/family/travel.
- Output the **display name** + a one-line rationale. (Viktor writes `celeb_name` and handles the
  Brooke→Joe Theismann internal-value quirk — not you.)

## Step 7 — Write to the run sheet
For each candidate: `company_name`, `domain`/`website`, `category`, `selected_celeb` (display name +
one-line rationale), **`source_channel`** (which channel found it — `google-comma`, `shopping`,
`amazon`, `walmart`, `ad-library`, `trade-show`, or a new one you're testing), `search_status`
(`qualified` | `skipped`), and `skip_reason` on any skip. Skip/flag bad / duplicate / no-go /
retailer-only / dead-site leads rather than force a count.

**Tag `source_channel` on every lead** — Heimerdinger uses it to build the channel scoreboard that
tells you which channels to lean into and which to retire (your explore/exploit loop). An untagged
lead can't teach you anything.

## Step 8 — Continuous development (after the objective)
When today's sourcing objective is complete, improve the discovery system only where it will sharpen
future work: refine source methods, research better search techniques, identify new discovery
surfaces, and note qualification lessons. Never create busy work; leave the department smarter than
you found it.
