# Mandarin lesson pipeline

This is the repeatable intake process for Lesson 2 and every lesson after it. Lesson 1 is the complete Mandarin knowledge collected before August 8, 2026.

## Accepted lesson sources

- pasted or uploaded written notes;
- exported or pasted Granola lesson notes/transcripts;
- photographs or screenshots of handwritten notes, textbook pages, exercises, and teacher annotations;
- short corrections or vocabulary lists supplied directly by the learner.

Keep raw transcripts, private notes, and source images outside the public GitHub repository. Only the normalized study material belongs in the published lesson data.

## Intake procedure

1. Assign every new batch to one lesson number before extracting it. Do not mix unfinished Lesson 2 material into Lesson 1.
2. Transcribe Chinese, pinyin, translations, corrections, pronunciation notes, and example sentences. Flag uncertain handwriting or OCR for human confirmation instead of guessing.
3. Compare the extracted vocabulary with every earlier lesson by Hanzi plus meaning. Preserve a later correction, but do not create duplicate quiz entries.
4. Treat a term as learned only when the newest source teaches, defines, translates, or deliberately practices it. Words invented only to make a generated reading do not enter the learned-word quiz bank.
5. Normalize pinyin with tone marks, use simplified Chinese unless the source explicitly teaches traditional characters, and keep translations short.
6. Generate compact practice material from the confirmed lesson knowledge: sentence groups, pronunciation drills, one balanced conversation, readings, and character practice when supported by the notes.
7. A generated reading may introduce at most five highlighted terms per paragraph. Those terms remain reading aids until a lesson source confirms them as learned.
8. Add a new object to `mandarin/lesson-data.js`; never overwrite an earlier lesson. Add the matching visible `Lesson N` route/button only after the lesson data passes review.
9. Bump the cache version in every Mandarin HTML file that loads the changed data or scripts.

## Lesson data contract

```js
{
  id: "lesson-2",
  title: "Lesson 2",
  status: "learned",
  vocabulary: [["汉字", "pinyin", "meaning", "category"]],
  sentenceGroups: {
    "Topic": [["中文句子。", "Pinyin.", "English."]]
  },
  dialogue: [["speaker", "中文", "Pinyin", "English"]],
  pronunciationDrills: [[1, "sound", "focus", "note"]],
  readings: [{ chinese: "", pinyin: "", english: "", newWords: [] }],
  characters: [["字", "pinyin", "meaning"]]
}
```

## Quiz behavior

- `lesson-data.js` is the single source for learned vocabulary and sentence questions.
- The quiz combines and deduplicates every learned lesson, then reshuffles both question order and answer choices whenever a quiz starts.
- Adding Lesson 2 automatically expands the cumulative quiz bank; old Lesson 1 questions remain available.
- Wrong-bank items retain stable keys so a lesson update does not duplicate existing misses.
- Writing practice remains a separate manually managed list and must appear in both the notebook and Quiz navigation.

## Regression checklist

- Confirm each new lesson contains only source-supported learned vocabulary.
- Confirm the cumulative quiz count increases by the number of unique new words and sentences.
- Start the same quiz type twice and confirm its order changes.
- Confirm every answer has three distinct distractors and no duplicate answer buttons.
- Open Lesson, Writing, Quiz, and every study section from both notebook and Quiz menus.
- Confirm Voice Settings is one top-corner button, opens one compact panel, closes with its close button, outside click, and Escape, and never becomes a study-menu tile.
- Confirm every Chinese target remains keyboard- and touch-speakable.

## Saved visual reference

The Mandarin Quiz intentionally uses the aviation-style study background: a `#f2f4f0` green-gray base, a mint radial glow from the upper-left, a pale-gold radial glow from the upper-right, and translucent white panels with blur and soft shadows. Dark mode uses the same layered composition with deep green and muted gold. Preserve this as a named visual option for future pages; do not silently apply it to the rest of the Mandarin notebook.
