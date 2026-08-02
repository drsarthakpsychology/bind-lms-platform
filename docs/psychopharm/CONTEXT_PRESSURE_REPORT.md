# Context Pressure Report — psychopharm

Per-drug record of passage size loaded and whether context came under pressure
(Rule 7). Any drug extracted under pressure is flagged for priority review.

This run's extraction was **deterministic** (script-parsed Stahl 7th
monographs), so it did not rely on model context windows — each monograph is
processed page-by-page by the extractor, not loaded whole into a model context.
This makes fabrication via context-exhaustion impossible for these fields.

Status: **no records were produced under context pressure this run.**

Records produced this way are the **mechanism / common_uses / dose_range /
side_effects** fields from Stahl 7th. The **curated band records** (e.g.
clonazepam, junction-dose) were authored by model with the source passages
loaded in-window; those are deliberately the ones routed to the TOP of the
reviewer queue for Dr. Sarthak's confirmation.