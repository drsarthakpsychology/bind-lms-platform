#!/usr/bin/env tsx
/**
 * Fetch public-domain fiction from Project Gutenberg for the STYLE LAYER
 * (Part 4.3 + Kavya's instruction: "train on fictional books to learn how to
 * talk"). Fiction contributes ONLY conversational texture — how people
 * hesitate, deflect, change the subject, answer a question they weren't
 * asked — with ZERO clinical content attached.
 *
 * Every extracted pattern is tagged `style_pattern = 'style'` and can NEVER be
 * returned for a clinical query (enforced in the retrieval layer + a test).
 *
 *   npm run corpus:gutenberg
 *
 * Writes: scripts/corpus/raw/gutenberg/*.txt (raw, cached so re-runs are free)
 */
import { mkdirSync, writeFileSync, existsSync, appendFileSync } from "node:fs";
import { join } from "node:path";

const RAW = join(process.cwd(), "scripts/corpus/raw/gutenberg");
mkdirSync(RAW, { recursive: true });

/** Classic novels with dialogue-rich, public-domain text.
 *  Expanded with the v5 brief's high-value titles for how people evade,
 *  minimise and fail to say things. IDs verified via Gutenberg search. */
const BOOKS: Array<{ id: number; title: string; author: string }> = [
  { id: 1342, title: "Pride and Prejudice", author: "Jane Austen" },
  { id: 11, title: "Alice's Adventures in Wonderland", author: "Lewis Carroll" },
  { id: 98, title: "A Tale of Two Cities", author: "Charles Dickens" },
  { id: 74, title: "The Adventures of Tom Sawyer", author: "Mark Twain" },
  { id: 1260, title: "Northanger Abbey", author: "Jane Austen" },
  { id: 174, title: "The Picture of Dorian Gray", author: "Oscar Wilde" },
  { id: 1661, title: "The Adventures of Sherlock Holmes", author: "Arthur Conan Doyle" },
  { id: 844, title: "The Importance of Being Earnest", author: "Oscar Wilde" },
  { id: 2680, title: "Meditations", author: "Marcus Aurelius" },
  { id: 37106, title: "Little Women", author: "Louisa May Alcott" },
  // v5 dialogue-craft titles
  { id: 57333, title: "Short Stories by Chekhov", author: "Anton Chekhov" },
  { id: 2542, title: "A Doll's House", author: "Henrik Ibsen" },
  { id: 768, title: "Wuthering Heights", author: "Emily Brontë" },
  { id: 600, title: "Notes from the Underground", author: "Fyodor Dostoevsky" },
  { id: 1952, title: "The Yellow Wallpaper", author: "Charlotte Perkins Gilman" },
  { id: 5365, title: "Mrs Dalloway", author: "Virginia Woolf" },
  { id: 5417, title: "Ethan Frome", author: "Edith Wharton" },
  { id: 160, title: "The Awakening", author: "Kate Chopin" },
  { id: 15492, title: "Hedda Gabler", author: "Henrik Ibsen" },
  { id: 2554, title: "The Turn of the Screw", author: "Henry James" },
  { id: 219, title: "Heart of Darkness", author: "Joseph Conrad" },
];

const UA = "LumenPracticeLayerBot/1.0 (corpus building; contact: dev@lumen.example)";

function fetchBook(id: number): Promise<string> {
  return fetch(`https://www.gutenberg.org/cache/epub/${id}/pg${id}.txt`, {
    headers: { "User-Agent": UA },
  }).then((r) => {
    if (!r.ok) throw new Error(`HTTP ${r.status}`);
    return r.text();
  });
}

async function main() {
  for (const b of BOOKS) {
    const file = join(RAW, `${b.id}.txt`);
    if (existsSync(file)) {
      console.log(`✓ ${b.title} (cached)`);
      continue;
    }
    try {
      const text = await fetchBook(b.id);
      writeFileSync(file, text, "utf8");
      // Log the fetch (provenance).
      appendFileSync(
        join(process.cwd(), "docs/psychopharm/WEB_ACCESS_LOG.md"),
        `| ${new Date().toISOString().slice(0, 10)} | gutenberg.org pg${b.id} | Project Gutenberg | fetch style-layer source ${b.title} (${b.author}) | ${file} |\n`,
      );
      console.log(`✓ ${b.title} (${text.length.toLocaleString()} chars)`);
    } catch (e) {
      console.error(`✗ ${b.title}: ${(e as Error).message}`);
    }
    // Be polite — 1s between fetches.
    await new Promise((r) => setTimeout(r, 1000));
  }
  console.log("done — raw fiction cached in scripts/corpus/raw/gutenberg/");
}

main();
