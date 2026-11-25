import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

// No Deadline Met: three days of careful polishing, all of it poured into
// the wrong copy. The filename is the joke's engine — every worker has a
// Downloads folder full of final_FINAL_v2_reallyfinal files, and the punch
// lands when the real document turns out to be untouched. It reads like
// something a person would actually say to their manager at 9 a.m.
const ENTRY =
  "I spent three days polishing the file, then realised I’d been editing the copy in Downloads called final_FINAL_v2_reallyfinal.docx — the real one is still blank.";

const MAX_CHARS = 200;
const EXPECTED_CHARS = 161;
const OUT_DIR = "/output";
const OUT_FILE = join(OUT_DIR, "entry.txt");

function guard(text: string): void {
  const chars = [...text].length;
  if (chars < 1 || chars > MAX_CHARS) {
    throw new Error(`entry is ${chars} characters, must be 1 to ${MAX_CHARS}`);
  }
  if (chars !== EXPECTED_CHARS) {
    throw new Error(`entry is ${chars} characters, expected ${EXPECTED_CHARS}`);
  }
  if (text.trim().length === 0) {
    throw new Error("entry must not be only whitespace");
  }
  const lines = text.split("\n");
  if (lines.length !== 1) {
    throw new Error(`entry must be exactly one line, got ${lines.length}`);
  }
  // It must actually be the missed-deadline excuse, built on the wrong copy.
  if (!/final_FINAL_v2_reallyfinal\.docx/.test(text)) {
    throw new Error("entry must name the wrong copy");
  }
  // The punchline must survive: the real file is still blank.
  if (!/the real one is still blank\.$/.test(text)) {
    throw new Error('entry must end with the "still blank" kicker');
  }
  // It must open with the three days of polishing, not a stray observation.
  if (!/^I spent three days polishing the file/.test(text)) {
    throw new Error("entry must open with the three-days setup");
  }
  // Tight writing: every word earns its place, no double spaces.
  if (/  /.test(text)) {
    throw new Error("entry must not contain double spaces");
  }
}

function main(): void {
  guard(ENTRY);
  // Create /output if needed; never delete the output directory itself.
  mkdirSync(OUT_DIR, { recursive: true });
  writeFileSync(OUT_FILE, ENTRY, "utf8");
  // Verify the write landed byte-identical, with no trailing newline.
  const written = readFileSync(OUT_FILE, "utf8");
  if (written !== ENTRY) {
    throw new Error("entry.txt does not match the deadline excuse");
  }
  if (!Buffer.from(written, "utf8").equals(Buffer.from(ENTRY, "utf8"))) {
    throw new Error("entry.txt bytes do not match the deadline excuse");
  }
  console.log(
    `${[...written].length} chars, ${Buffer.byteLength(written, "utf8")} bytes, one line:`,
  );
  console.log(written);
}

main();
