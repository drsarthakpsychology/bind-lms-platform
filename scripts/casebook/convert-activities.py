#!/usr/bin/env python3
"""
Convert the book analysts' activity specs (docs/transformation/books/*-activities.json)
into typed Casebook content (src/content/casebook/<name>.ts).

    python3 scripts/casebook/convert-activities.py <activities.json> <ExportName> <out.ts> [--prefix k1]

The specs come in several shapes; this maps each onto one of the Casebook
formats (src/lib/casebook/types.ts). Single-vignette differentials from one
book are grouped into a single "Which diagnosis?" game so a round has
several cases. Anything that cannot be mapped is listed on stderr and left
out. Run `npx vitest run src/lib/casebook` afterwards: the validator checks
every converted activity.
"""
import json
import re
import sys

LEVEL = {"F": "Foundation", "I": "Intermediate", "A": "Advanced", "Foundation": "Foundation", "Intermediate": "Intermediate", "Advanced": "Advanced"}


def slug(s, n=34):
    s = re.sub(r"[^a-z0-9]+", "-", str(s).lower()).strip("-")
    return s[:n].rstrip("-")


def first_sentence(s, n=110):
    s = str(s or "").strip()
    m = re.match(r"(.+?[.!?])(\s|$)", s)
    out = m.group(1) if m else s
    return out if len(out) <= n else out[: n - 1].rsplit(" ", 1)[0] + "…"


def text_of(d, *keys):
    for k in keys:
        v = d.get(k)
        if isinstance(v, str) and v.strip():
            return v.strip()
    return ""


def join_notes(*parts):
    return " ".join(p.strip() for p in parts if isinstance(p, str) and p.strip())


def base(a, fmt, prefix):
    ref = a.get("bookRef") or {}
    book = ref.get("book", "")
    if ref.get("edition") and ref["edition"] not in book:
        book = f"{book}, {ref['edition']}"
    return {
        "id": slug(a["id"]) if not prefix else slug(a["id"]),
        "title": a["title"],
        "hook": first_sentence(a.get("hook") or a.get("objective", "")),
        "module": a["module"],
        "level": LEVEL.get(a.get("level", "I"), "Intermediate"),
        "objective": a.get("objective", ""),
        "bookRef": {"book": book, "chapter": str(ref.get("chapter", "")), "pages": str(ref.get("pages", ""))},
        "reviewFlags": [str(x) for x in a.get("reviewFlags", [])],
        "format": fmt,
    }


def cat_id(label):
    return slug(label, 30) or "x"


URG = {
    "routine": "routine", "low": "routine", "note": "routine", "monitor": "routine",
    "soon": "soon", "discuss": "soon", "prompt": "soon", "this week": "soon", "same-week": "soon",
    "urgent": "urgent", "emergency": "urgent", "same-day": "urgent", "immediate": "urgent",
}


def urgency(v):
    v = str(v).lower()
    for k, u in URG.items():
        if k in v:
            return u
    return None


def convert(acts, prefix):
    out, skipped, diff_items, diff_meta = [], [], [], []
    for a in acts:
        fmt = a.get("format", "")
        c = a.get("content") or {}
        debrief = join_notes(c.get("debrief"), c.get("teachingPoint"))
        try:
            if fmt in ("differential", "ethics-dilemma") and "vignette" in c and "options" in c and all(isinstance(o, str) for o in c["options"]):
                opts = [str(o) for o in c["options"]]
                ans = c["answer"]
                idx = ans if isinstance(ans, int) else opts.index(str(ans))
                diff_items.append({
                    "id": slug(a["id"], 30),
                    "vignette": c["vignette"],
                    "question": c.get("question") or None,
                    "options": opts,
                    "answer": idx,
                    "explain": join_notes(c.get("explanation") or c.get("explain"), c.get("teachingPoint"), ("Next: " + c["followUp"]) if c.get("followUp") else ""),
                    "ref": f"{a.get('bookRef', {}).get('chapter', '')}, {a.get('bookRef', {}).get('pages', '')}",
                })
                diff_meta.append(a)
                continue
            if fmt in ("differential", "ethics-dilemma") and isinstance(c.get("items"), list):
                b = base(a, "differential", prefix)
                b["items"] = []
                for k, it in enumerate(c["items"]):
                    opts = [str(o) for o in it["options"]]
                    ans = it["answer"]
                    b["items"].append({"id": str(it.get("id") or f"q{k+1}"), "vignette": text_of(it, "vignette", "text", "scenario"), "options": opts,
                                       "answer": ans if isinstance(ans, int) else opts.index(str(ans)), "explain": text_of(it, "explanation", "explain", "why")})
                if debrief: b["debrief"] = debrief
                out.append(b)
                continue
            if fmt == "era-sorter":
                b = base(a, "sort", prefix)
                b["categories"] = [{"id": x["id"], "label": x["label"]} for x in c["choices"]]
                b["items"] = [{"id": str(it["id"]), "text": it["claim"], "category": it["answer"], "explain": it.get("currentPosition", "")} for it in c["items"]]
                b["reviewFlags"] += [f"Verify against the official text: {it['id']}" for it in c["items"] if it.get("verify")]
                if debrief: b["debrief"] = debrief
                out.append(b)
                continue
            if fmt == "differential" and isinstance(c.get("cases"), list):
                b = base(a, "differential", prefix)
                pool = [str(o) for o in c["options"]]
                b["items"] = [{"id": str(it.get("id") or f"c{k+1}"), "vignette": it["vignette"], "options": pool, "answer": pool.index(str(it["answer"])), "explain": it.get("why", "")} for k, it in enumerate(c["cases"])]
                d = join_notes(debrief, c.get("takeaway"), c.get("whyItMatters"))
                if d: b["debrief"] = d
                out.append(b)
                continue
            if fmt == "adherence-talk" and isinstance(c.get("turns"), list):
                b = base(a, "skill", prefix)
                items = []
                for k, t in enumerate(c["turns"]):
                    prompt = c.get("client", "") if k == 0 else ("\u201c" + t.get("clientSays", "") + "\u201d")
                    rs = [{"text": o["text"], "grade": {"best": "best", "ok": "ok"}.get(o.get("score"), "poor"), "why": o.get("feedback", "")} for o in t["options"]]
                    items.append({"id": f"turn{k+1}", "prompt": prompt, "responses": rs})
                b["items"] = items
                if debrief: b["debrief"] = debrief
                out.append(b)
                continue
            if fmt == "branching-case" and isinstance(c.get("beats"), list):
                b = base(a, "branching", prefix)
                beats = c["beats"]
                nodes = []
                for k, bt in enumerate(beats):
                    head = (bt.get("when") + ": ") if bt.get("when") else ""
                    text = (c.get("client", "") + " " if k == 0 and c.get("client") else "") + head + bt["situation"]
                    nxt = f"b{k+2}" if k + 1 < len(beats) else None
                    nodes.append({"id": f"b{k+1}", "text": text.strip(), "choices": [{"text": ch["text"], "next": nxt, "feedback": ch.get("consequence", ""), "good": ch.get("outcome") != "harm"} for ch in bt["choices"]]})
                b["start"] = "b1"
                b["nodes"] = nodes
                cc = c.get("conceptCard")
                d = join_notes(debrief, cc if isinstance(cc, str) else (cc or {}).get("text") if isinstance(cc, dict) else "")
                if d: b["debrief"] = d
                out.append(b)
                continue
            if fmt == "matching" and "families" in c:
                b = base(a, "sort", prefix)
                b["categories"] = [{"id": f["id"].lower(), "label": f["name"]} for f in c["families"]]
                b["items"] = [{"id": f"s{k+1}", "text": p_["situation"], "category": p_["family"].lower(), "explain": p_.get("action", "")} for k, p_ in enumerate(c["pairs"])]
                if c.get("principle"): b["debrief"] = c["principle"]
                out.append(b)
                continue
            if fmt == "matching" and "groups" in c:
                b = base(a, "sort", prefix)
                b["categories"] = [{"id": cat_id(g), "label": g} for g in c["groups"]]
                b["items"] = [{"id": f"s{k+1}", "text": cd["concern"], "category": cat_id(cd["group"]), "explain": cd.get("point", "")} for k, cd in enumerate(c["cards"])]
                if debrief: b["debrief"] = debrief
                out.append(b)
                continue
            if fmt == "sort" and "bins" in c:
                b = base(a, "sort", prefix)
                labels = [str(x) for x in c["bins"]]
                ids = [cat_id(l) for l in labels]
                b["categories"] = [{"id": i, "label": l} for i, l in zip(ids, labels)]
                b["items"] = [{"id": f"s{k+1}", "text": text_of(it, "text", "item"), "category": ids[it["bin"]], **({"explain": it["why"]} if it.get("why") else {})} for k, it in enumerate(c["items"])]
                if debrief: b["debrief"] = debrief
                out.append(b)
                continue
            if fmt == "differential" and isinstance(c.get("vignettes"), list):
                b = base(a, "differential", prefix)
                vs = c["vignettes"]
                pool = list(dict.fromkeys(str(v["answer"]) for v in vs))
                if c.get("options"):
                    pool = list(dict.fromkeys([str(o) for o in c["options"]] + pool))
                b["items"] = [{"id": f"v{k+1}", "vignette": v["text"], **({"question": c["question"]} if c.get("question") else {}), "options": pool, "answer": pool.index(str(v["answer"])), "explain": v.get("why", "")} for k, v in enumerate(vs)]
                if debrief: b["debrief"] = debrief
                out.append(b)
                continue
            if fmt in ("therapy-skill", "ethics-dilemma") and ("clientStatement" in c or (isinstance(c.get("options"), list) and c["options"] and isinstance(c["options"][0], dict))):
                b = base(a, "skill", prefix)
                if "clientStatement" in c:
                    prompt = join_notes(c.get("setting"), "\u201c" + c["clientStatement"] + "\u201d")
                    raw = c["responses"]
                else:
                    prompt = join_notes(c.get("vignette"), c.get("question"))
                    raw = [{"text": o["text"], "grade": "best" if o.get("good") else "poor", "why": o.get("why", "")} for o in c["options"]]
                rs = []
                for r in raw:
                    g = str(r.get("grade") or r.get("quality") or "").lower()
                    g = "best" if g in ("best", "good", "excellent") else "ok" if g in ("ok", "okay", "acceptable", "partial", "neutral", "fair") else "poor"
                    rs.append({"text": text_of(r, "text", "label"), "grade": g, "why": text_of(r, "why", "reason", "feedback")})
                for i in [i for i, r in enumerate(rs) if r["grade"] == "best"][1:]:
                    rs[i]["grade"] = "ok"
                b["items"] = [{"id": "k1", "prompt": prompt, "responses": rs}]
                if debrief: b["debrief"] = debrief
                out.append(b)
                continue
            if fmt == "sort":
                b = base(a, "sort", prefix)
                cats = c["categories"]
                labels = [x["label"] if isinstance(x, dict) else str(x) for x in cats]
                ids = [x["id"] if isinstance(x, dict) and x.get("id") else cat_id(l) for x, l in zip(cats, labels)]
                lookup = {**{l: i for l, i in zip(labels, ids)}, **{i: i for i in ids}}
                b["categories"] = [{"id": i, "label": l} for i, l in zip(ids, labels)]
                b["items"] = [{"id": f"s{k+1}", "text": text_of(it, "text", "item"), "category": lookup[it["category"]], **({"explain": it["why"]} if it.get("why") else {})} for k, it in enumerate(c["items"])]
                if debrief: b["debrief"] = debrief
                out.append(b)
                continue
            if fmt in ("mse-observation", "phenomenon-spotter") and isinstance(c.get("observations"), list) and not any("question" in o for o in c["observations"]):
                b = base(a, "spotter", prefix)
                obs = c["observations"]
                labels = list(dict.fromkeys(o["answer"] for o in obs))
                b["categories"] = [{"id": cat_id(l), "label": l} for l in labels]
                items = []
                for k, o in enumerate(obs):
                    others = [l for l in labels if l != o["answer"]]
                    j = labels.index(o["answer"])
                    near = sorted(others, key=lambda l: abs(labels.index(l) - j))[:3]
                    items.append({"id": f"o{k+1}", "quote": o["sample"], "answer": cat_id(o["answer"]), "distractors": [cat_id(x) for x in near], "explain": o.get("why", "")})
                b["items"] = items
                if debrief: b["debrief"] = debrief
                out.append(b)
                continue
            if fmt == "mse-observation" and isinstance(c.get("observations"), list):
                b = base(a, "differential", prefix)
                obs = c["observations"]
                items = []
                for k, o in enumerate(obs):
                    same_q = [x["answer"] for x in obs if x.get("question") == o.get("question")]
                    pool = list(dict.fromkeys(same_q if len(same_q) >= 3 else [x["answer"] for x in obs]))
                    items.append({"id": f"o{k+1}", "vignette": o["sample"], "question": o.get("question"), "options": pool, "answer": pool.index(o["answer"]), "explain": o.get("why", "")})
                b["items"] = items
                if debrief: b["debrief"] = debrief
                out.append(b)
                continue
            if fmt == "phenomenon-spotter":
                b = base(a, "spotter", prefix)
                b["categories"] = [{"id": x["id"], "label": x["label"]} for x in c["categories"]]
                b["items"] = [{"id": str(it["id"]), "quote": it["quote"], "answer": it["answer"], "distractors": list(dict.fromkeys(d for d in it["distractors"] if d != it["answer"])), "explain": it.get("explain", ""), **({"ref": str(it["ref"])} if it.get("ref") else {})} for it in c["items"]]
                if debrief: b["debrief"] = debrief
                out.append(b)
                continue
            if fmt == "red-flag-triage":
                b = base(a, "triage", prefix)
                items = []
                for k, it in enumerate(c.get("items", [])):
                    u = urgency(it.get("answer") or it.get("urgency") or it.get("decision") or "")
                    if not u:
                        raise ValueError(f"unknown urgency in {it}")
                    items.append({"id": str(it.get("id") or f"t{k+1}"), "vignette": text_of(it, "vignette", "scenario", "text"), "answer": u, "explain": join_notes(text_of(it, "explanation", "explain", "why"), ("Your move: " + it["psychologistAction"]) if it.get("psychologistAction") else ""), **({"ref": str(it["ref"])} if it.get("ref") else {})})
                b["items"] = items
                if debrief: b["debrief"] = debrief
                out.append(b)
                continue
            if fmt == "therapy-skill" or fmt == "adherence-talk" and isinstance(c.get("items"), list) and c["items"] and "responses" in c["items"][0]:
                b = base(a, "skill", prefix)
                items = []
                for k, it in enumerate(c["items"]):
                    rs = []
                    for r in it["responses"]:
                        g = str(r.get("grade") or r.get("quality") or "").lower()
                        g = "best" if g in ("best", "good", "excellent") else "ok" if g in ("ok", "okay", "acceptable", "partial", "neutral") else "poor"
                        rs.append({"text": text_of(r, "text", "label", "response"), "grade": g, "why": text_of(r, "why", "feedback", "reason")})
                    bests = [i for i, r in enumerate(rs) if r["grade"] == "best"]
                    for i in bests[1:]:
                        rs[i]["grade"] = "ok"
                    items.append({"id": str(it.get("id") or f"k{k+1}"), "prompt": text_of(it, "client", "prompt", "statement", "patient"), "responses": rs})
                b["items"] = items
                if debrief: b["debrief"] = debrief
                out.append(b)
                continue
            if fmt == "matching":
                b = base(a, "matching", prefix)
                b["pairs"] = [{"id": f"p{k+1}", "left": p["left"], "right": p["right"]} for k, p in enumerate(c["pairs"])]
                if c.get("story"):
                    b["objective"] = join_notes(b["objective"], c["story"])
                if debrief: b["debrief"] = debrief
                out.append(b)
                continue
            if fmt == "timeline":
                b = base(a, "timeline", prefix)
                evs = c["events"]
                if all("order" in e for e in evs):
                    evs = sorted(evs, key=lambda e: e["order"])
                b["events"] = [{"id": f"e{k+1}", "when": str(e.get("when") or e.get("phase") or e.get("date") or e.get("order")), "text": text_of(e, "label", "storyClue", "text", "event")} for k, e in enumerate(evs)]
                if c.get("scenario"):
                    b["objective"] = join_notes(b["objective"], c["scenario"].split(" Students ")[0])
                if debrief: b["debrief"] = debrief
                out.append(b)
                continue
            if fmt in ("branching-case", "branching", "ethics-dilemma") and isinstance(c.get("nodes"), list):
                b = base(a, "branching", prefix)
                nodes = []
                for k, n in enumerate(c["nodes"]):
                    text = n["text"]
                    if k == 0 and c.get("setup"):
                        text = f"{c['setup']} {text}"
                    chs = []
                    for ch in n.get("choices", []):
                        q = str(ch.get("quality", "")).lower()
                        good = ch["good"] if isinstance(ch.get("good"), bool) else q != "poor"
                        chs.append({"text": text_of(ch, "text", "label"), "next": ch.get("next"), "feedback": text_of(ch, "feedback", "why"), "good": good})
                    if not chs:
                        chs = [{"text": "Finish", "next": None, "feedback": debrief or "End of case.", "good": True}]
                    nodes.append({"id": n["id"], "text": text, "choices": chs})
                b["start"] = c.get("start") or nodes[0]["id"]
                b["nodes"] = nodes
                if debrief: b["debrief"] = debrief
                out.append(b)
                continue
            skipped.append(f"{a.get('id')} ({fmt}): no mapping")
        except Exception as e:  # keep going; report
            skipped.append(f"{a.get('id')} ({fmt}): {e}")

    if diff_items:
        mods = [m["module"] for m in diff_meta]
        common = max(set(mods), key=mods.count)
        book = (diff_meta[0].get("bookRef") or {}).get("book", "")
        if len(diff_items) == 1:
            a = diff_meta[0]
            b = base(a, "differential", prefix)
            it = dict(diff_items[0]); it.pop("ref", None)
            b["items"] = [{k: v for k, v in it.items() if v is not None}]
            out.append(b)
        else:
            out.insert(0, {
                "id": slug(f"{prefix}-which-diagnosis"),
                "title": "Which diagnosis?",
                "hook": f"{len(diff_items)} tricky presentations. Pick the most likely answer.",
                "module": "case-sheet" if len(set(mods)) > 2 else common,
                "level": "Intermediate",
                "objective": "Reason through look-alike presentations: what tips the balance, and what to ask next.",
                "bookRef": {"book": book, "chapter": "Several chapters (see each case)", "pages": "; ".join(dict.fromkeys(str((m.get("bookRef") or {}).get("pages", "")) for m in diff_meta))},
                "reviewFlags": list(dict.fromkeys(f for m in diff_meta for f in m.get("reviewFlags", []))),
                "format": "differential",
                "items": [{k: v for k, v in it.items() if v is not None} for it in diff_items],
            })
    return out, skipped


def main():
    src, name, dst = sys.argv[1], sys.argv[2], sys.argv[3]
    prefix = sys.argv[sys.argv.index("--prefix") + 1] if "--prefix" in sys.argv else ""
    acts = json.load(open(src))
    out, skipped = convert(acts, prefix)
    for s in skipped:
        print("skipped:", s, file=sys.stderr)
    body = json.dumps(out, indent=2, ensure_ascii=False)
    with open(dst, "w") as f:
        f.write(
            "// Generated by scripts/casebook/convert-activities.py from\n"
            f"// {src}. Original wording; see each bookRef. Edit the source JSON and re-run.\n"
            'import type { CaseActivity } from "@/lib/casebook/types";\n\n'
            f"export const {name}: CaseActivity[] = {body};\n"
        )
    print(f"{len(out)} activities -> {dst}", file=sys.stderr)


if __name__ == "__main__":
    main()
