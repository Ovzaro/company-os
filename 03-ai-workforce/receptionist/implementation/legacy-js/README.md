# Company Naming Engine

Generate and rank 10,000 strategy-driven technology-company names:

```sh
npm run names
```

This deterministic offline run writes `company_names.csv` and `top_100.md`, containing Top 25 Elite, Top 100 Excellent, and Top 500 Good tiers. Generation uses curated invented, Latin, Greek, astronomy, mythology, scientific, blended, and modified-word strategies documented in `NAMING_METHODOLOGY.md`. For best-effort point-in-time public checks of all 500 ranked candidates, run:

```sh
npm run names:live
```

Use `--count`, `--top`, `--concurrency`, `--csv`, and `--markdown` to tune the CLI. A confirmed missing profile is treated as available, strong existence evidence as unavailable, and blocked/rate-limited/ambiguous responses as unknown. Uncertainty never removes a candidate. Social checks are not legal trademark clearance and do not reserve a name.
