import type { ReactNode } from "react";
import {
  ApproachPlayer,
  ChordExplorer,
  ChordScaleTable,
  CircleOfFifths,
  CirclePractice,
  DetunePlayer,
  DiatonicChords,
  IIVIPlayer,
  IntervalFinder,
  IntervalPlayer,
  Keyboard,
  MiniGrid,
  ModeExplorer,
  RoutinePresets,
  ScaleExplorer,
  SpellingCompare,
} from "./widgets";

export type QuizQ = { q: string; options: string[]; answer: number; explain: string };
export type Step = { title: string; body: ReactNode; widget?: ReactNode; quiz?: QuizQ[] };
export type Lesson = { id: string; title: string; steps: Step[] };

const C_MAJOR = { label: "C Major", key: "C", mode: "scale" as const, id: "major" };
const CHROMATIC = { label: "All notes", key: "C", mode: "scale" as const, id: "chromatic" };

export const LESSONS: Lesson[] = [
  // ------------------------------------------------------------------ 1
  {
    id: "alphabet",
    title: "Musical Alphabet & Sharps vs Flats",
    steps: [
      {
        title: "Seven letters, twelve notes",
        body: (
          <>
            <p>
              Music uses only seven letter names: <b>C D E F G A B</b>. After B the alphabet starts again at C — one
              <b> octave</b> higher. On a chromatic harmonica in C these natural notes are exactly what you play without
              pressing the slide.
            </p>
            <p>
              Between most letters there is one more note, so every octave contains <b>12 different notes</b>, each a{" "}
              <b>semitone</b> (half step) apart. Tap the keys and listen.
            </p>
          </>
        ),
        widget: <Keyboard />,
      },
      {
        title: "Natural half steps: E–F and B–C",
        body: (
          <>
            <p>
              Look at the keyboard: there is <b>no black key between E and F</b>, and none between <b>B and C</b>. These
              two pairs are only a semitone apart. Every other pair of neighbouring letters is a <b>whole step</b> (two
              semitones).
            </p>
            <p>
              That is why the major scale has its half steps between degrees 3–4 and 7–8. On the harmonica you meet them
              as <b>blow 2 → draw 2</b> (E → F) and <b>draw 4 → blow 5</b> (B → C).
            </p>
          </>
        ),
        widget: <Keyboard highlight={[4, 5, 11, 0]} />,
      },
      {
        title: "Sharps ♯ and flats ♭",
        body: (
          <>
            <p>
              A <b>sharp (#)</b> raises a note by one semitone, a <b>flat (b)</b> lowers it by one semitone. The black key
              between C and D is therefore <b>C#</b> or <b>Db</b>. Two names for the same sound are called{" "}
              <b>enharmonic equivalents</b>.
            </p>
            <div className="tip">
              The <b>slide button</b> of the chromatic harmonica is a built-in sharp: it raises every note a semitone.
              Blow 1 (C) becomes C#, draw 1 (D) becomes D#.
            </div>
          </>
        ),
        widget: <Keyboard names="both" />,
      },
      {
        title: "Which name do we use?",
        body: (
          <>
            <p>
              It depends on the key. In a seven-note scale <b>every letter is used exactly once</b>. F major is
              F G A <b>Bb</b> C D E — not A#, because A is already taken. D major is D E <b>F#</b> G A B <b>C#</b>. That
              is why you will even meet notes like <b>E#</b> (in F# major) or <b>Cb</b> (in Gb major).
            </p>
            <p>
              The trainer follows the same rule: the grid and the Note bar always spell the scale correctly. Notes outside
              the scale are shown with sharps, just like the slide.
            </p>
          </>
        ),
        widget: <SpellingCompare />,
      },
      {
        title: "Check yourself",
        body: <p>Answer all questions correctly to complete the lesson. You can try again as often as you like.</p>,
        quiz: [
          { q: "What is the enharmonic equivalent of Eb?", options: ["D#", "E", "Fb", "D"], answer: 0, explain: "Eb and D# are the same pitch — one semitone above D." },
          { q: "Which pair of letters is only a semitone apart?", options: ["C–D", "E–F", "F–G", "A–B"], answer: 1, explain: "E–F and B–C are the natural half steps." },
          { q: "In F major the 4th note is written as…", options: ["A#", "Bb", "B", "A"], answer: 1, explain: "Each letter once: F G A Bb C D E." },
          { q: "What does the slide button do?", options: ["Raises every note a semitone", "Lowers every note a semitone", "Plays an octave higher", "Mutes the reeds"], answer: 0, explain: "Slide in = every hole sounds one semitone higher." },
        ],
      },
    ],
  },

  // ------------------------------------------------------------------ 2
  {
    id: "layout",
    title: "Harmonica Layout Deep Dive",
    steps: [
      {
        title: "Blow and draw",
        body: (
          <>
            <p>
              Every hole has two reeds: one sounds when you <b>blow</b>, the other when you <b>draw</b> (breathe in). On a
              12-hole chromatic in C (solo tuning) each group of four holes repeats an octave higher:
            </p>
            <table>
              <thead>
                <tr>
                  <th>Hole</th>
                  <th>1</th>
                  <th>2</th>
                  <th>3</th>
                  <th>4</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Blow</td>
                  <td>C</td>
                  <td>E</td>
                  <td>G</td>
                  <td>C</td>
                </tr>
                <tr>
                  <td>Draw</td>
                  <td>D</td>
                  <td>F</td>
                  <td>A</td>
                  <td>B</td>
                </tr>
              </tbody>
            </table>
            <p>
              Blowing gives the notes of the <b>C major chord</b>, drawing fills in the rest of the <b>C major scale</b>.
              Tap the holes to hear them.
            </p>
          </>
        ),
        widget: <MiniGrid choices={[C_MAJOR]} />,
      },
      {
        title: "The slide",
        body: (
          <>
            <p>
              With the slide pushed in every reed sounds a semitone higher — those are the rows labelled <b>Slide</b>:
              blow + slide gives <b>C# F G# C#</b>, draw + slide gives <b>D# F# A# C</b>. Together you have all 12 notes
              in every octave. That is what makes the instrument chromatic.
            </p>
            <div className="tip">
              Some notes exist twice: <b>F</b> (draw 2, or blow 2 + slide) and <b>C</b> (blow 4, blow 5, or draw 4 +
              slide). Players use these alternatives to avoid awkward slide moves.
            </div>
          </>
        ),
        widget: <MiniGrid choices={[CHROMATIC, C_MAJOR]} />,
      },
      {
        title: "Octaves and ranges",
        body: (
          <>
            <p>
              The vertical lines in the grid separate the octaves. The <b>top hole</b> is special: on most 12-, 14- and
              16-hole chromatics draw + slide gives <b>D</b> instead of C, extending the range to D7.
            </p>
            <ul>
              <li>
                <b>10 holes</b> (e.g. Chrometta 10): G3 – Db6
              </li>
              <li>
                <b>12 holes</b>: C4 – D7 — the classic jazz chromatic
              </li>
              <li>
                <b>14 holes</b>: G3 – D7
              </li>
              <li>
                <b>16 holes</b>: C3 – D7 — a whole extra low octave
              </li>
            </ul>
          </>
        ),
        widget: <MiniGrid choices={[C_MAJOR]} holeChoices={[10, 12, 14, 16]} />,
      },
      {
        title: "Reading the grid",
        body: (
          <>
            <p>
              In the trainer the <b>orange</b> holes are the root of the scale, <b>blue</b> holes are the other scale
              notes and <b>grey</b> holes are everything else. Try to find these notes and check the caption:
            </p>
            <ul>
              <li>F#4 — hole 2, draw + slide</li>
              <li>G#4 — hole 3, blow + slide</li>
              <li>Bb4 (A#) — hole 3, draw + slide</li>
              <li>D7 — the very top: hole 12, draw + slide</li>
            </ul>
          </>
        ),
        widget: (
          <MiniGrid
            choices={[
              { label: "G Major", key: "G", mode: "scale", id: "major" },
              { label: "F Major", key: "F", mode: "scale", id: "major" },
              { label: "Bb Major", key: "Bb", mode: "scale", id: "major" },
            ]}
          />
        ),
      },
      {
        title: "Check yourself",
        body: <p>Answer all questions correctly to complete the lesson.</p>,
        quiz: [
          { q: "Where is F#4 on a 12-hole C chromatic?", options: ["Hole 2 draw + slide", "Hole 2 blow + slide", "Hole 3 draw", "Hole 1 draw + slide"], answer: 0, explain: "Draw 2 is F; the slide raises it to F#." },
          { q: "Hole 3 blow + slide gives…", options: ["G#", "A", "G", "F#"], answer: 0, explain: "Blow 3 is G, the slide makes it G#." },
          { q: "Which notes appear twice in every octave of the solo tuning?", options: ["C and F", "D and A", "E and B", "G and C#"], answer: 0, explain: "C: blow 4 = blow 5 (= draw 4 + slide). F: draw 2 = blow 2 + slide." },
          { q: "Lowest note of a 16-hole chromatic in C?", options: ["C3", "C4", "G3", "A2"], answer: 0, explain: "The 16-hole adds a full octave below middle C: C3 – D7." },
        ],
      },
    ],
  },

  // ------------------------------------------------------------------ 3
  {
    id: "intervals",
    title: "Understanding Intervals",
    steps: [
      {
        title: "What is an interval?",
        body: (
          <>
            <p>
              An <b>interval</b> is the distance between two notes. We measure it in <b>semitones</b> and name it with a{" "}
              <b>number</b> (how many letters, counting both ends: C→E = a 3rd) and a <b>quality</b>: perfect, major,
              minor, augmented or diminished.
            </p>
            <p>Tap the intervals to hear them from C4 — first one after another, then together.</p>
          </>
        ),
        widget: <IntervalPlayer />,
      },
      {
        title: "The interval table",
        body: (
          <>
            <table>
              <thead>
                <tr>
                  <th>Semitones</th>
                  <th>Name</th>
                  <th>From C</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ["0", "P1 — unison", "C"],
                  ["1", "m2 — minor second", "Db"],
                  ["2", "M2 — major second", "D"],
                  ["3", "m3 — minor third", "Eb"],
                  ["4", "M3 — major third", "E"],
                  ["5", "P4 — perfect fourth", "F"],
                  ["6", "A4 / d5 — tritone", "F# / Gb"],
                  ["7", "P5 — perfect fifth", "G"],
                  ["8", "m6 — minor sixth", "Ab"],
                  ["9", "M6 — major sixth", "A"],
                  ["10", "m7 — minor seventh", "Bb"],
                  ["11", "M7 — major seventh", "B"],
                  ["12", "P8 — octave", "C"],
                ].map((r) => (
                  <tr key={r[0]}>
                    <td>{r[0]}</td>
                    <td>{r[1]}</td>
                    <td>{r[2]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p>
              Unisons, 4ths, 5ths and octaves are <b>perfect</b>; 2nds, 3rds, 6ths and 7ths are <b>major</b> or{" "}
              <b>minor</b>. One semitone wider than perfect or major = <b>augmented</b>; one narrower than perfect or
              minor = <b>diminished</b>.
            </p>
          </>
        ),
      },
      {
        title: "Measure intervals on the harmonica",
        body: (
          <>
            <p>Tap any two holes and the trainer names the interval between them. Try these:</p>
            <ul>
              <li>blow 1 → blow 2: C → E, a major third</li>
              <li>blow 2 → blow 3: E → G, a minor third</li>
              <li>blow 1 → blow 3: C → G, a perfect fifth</li>
              <li>draw 3 → draw 4: A → B, a major second</li>
              <li>draw 4 → blow 5: B → C, a minor second</li>
            </ul>
          </>
        ),
        widget: <IntervalFinder />,
      },
      {
        title: "Degrees = intervals from the root",
        body: (
          <>
            <p>
              The <b>Degrees</b> bar on the main screen lists every scale note as an interval above the root. Major:
              P1 M2 M3 P4 P5 M6 M7. Natural minor: P1 M2 m3 P4 P5 m6 m7. Comparing degrees is the fastest way to see how
              scales differ.
            </p>
            <div className="tip">
              Tip: Menu → Harmonica &amp; Sound → <b>Cell labels: Degrees</b> shows intervals directly on the grid.
            </div>
          </>
        ),
        widget: <ScaleExplorer ids={["major", "aeolian", "dorian", "mixolydian"]} />,
      },
      {
        title: "Check yourself",
        body: <p>Answer all questions correctly to complete the lesson.</p>,
        quiz: [
          { q: "How many semitones are in a perfect fifth?", options: ["5", "6", "7", "8"], answer: 2, explain: "C → G = 7 semitones." },
          { q: "C up to Eb is a…", options: ["Major third", "Minor third", "Augmented second", "Major second"], answer: 1, explain: "C–E is a major third; Eb makes it minor. (C–D# would be an augmented second.)" },
          { q: "Which interval is the tritone?", options: ["P4", "A4 / d5", "P5", "M6"], answer: 1, explain: "Six semitones — exactly half an octave." },
          { q: "Blow 1 to blow 3 on a C chromatic (C → G) is a…", options: ["Perfect fourth", "Perfect fifth", "Major sixth", "Major third"], answer: 1, explain: "C D E F G — five letters, 7 semitones." },
        ],
      },
    ],
  },

  // ------------------------------------------------------------------ 4
  {
    id: "circle",
    title: "Circle of Fifths Mastery",
    steps: [
      {
        title: "Around the circle",
        body: (
          <>
            <p>
              Going <b>clockwise</b> each key is a perfect fifth higher and adds one sharp: C G D A E B F#. Going{" "}
              <b>counter-clockwise</b> each key is a fifth lower (a fourth higher) and adds one flat: F Bb Eb Ab Db Gb.
            </p>
            <p>Tap a key to see its key signature and hear its scale.</p>
          </>
        ),
        widget: <CircleOfFifths />,
      },
      {
        title: "Order of sharps and flats",
        body: (
          <>
            <p>
              Sharps are always added in the order <b>F# C# G# D# A# E# B#</b>; flats in the reverse order{" "}
              <b>Bb Eb Ab Db Gb Cb Fb</b>.
            </p>
            <ul>
              <li>
                Sharp keys: the <b>last sharp</b> is the 7th degree — a semitone below the key name (A major: last sharp
                G#).
              </li>
              <li>
                Flat keys: the <b>second-to-last flat</b> is the key name (Eb major: Bb <b>Eb</b> Ab).
              </li>
            </ul>
          </>
        ),
        widget: <CircleOfFifths />,
      },
      {
        title: "Relative minors",
        body: (
          <p>
            Every major key shares its key signature with a <b>relative minor</b> a minor third lower: C ↔ Am, G ↔ Em,
            F ↔ Dm, Eb ↔ Cm. You see them in the inner ring. Same notes, different home — which is the first step toward
            modes.
          </p>
        ),
        widget: <CircleOfFifths />,
      },
      {
        title: "Practise around the circle",
        body: (
          <>
            <p>
              Jazz harmony moves <b>counter-clockwise</b>, in fourths: the ii–V–I Dm7 → G7 → Cmaj7 is two steps around
              the circle. Practising scales in the order <b>C F Bb Eb Ab Db Gb B E A D G</b> takes you through all 12
              keys the way tunes really move.
            </p>
            <p>Step through the keys below, then load one into the trainer.</p>
          </>
        ),
        widget: <CirclePractice />,
      },
      {
        title: "Check yourself",
        body: <p>Answer all questions correctly to complete the lesson.</p>,
        quiz: [
          { q: "How many sharps does A major have?", options: ["2", "3", "4", "5"], answer: 1, explain: "F# C# G#." },
          { q: "Relative minor of F major?", options: ["D minor", "A minor", "E minor", "G minor"], answer: 0, explain: "A minor third below F is D." },
          { q: "Moving counter-clockwise from C you reach…", options: ["G", "F", "D", "Bb"], answer: 1, explain: "Counter-clockwise = up a fourth = one flat: F." },
          { q: "Which major key has four flats?", options: ["Eb", "Ab", "Db", "Bb"], answer: 1, explain: "Bb Eb Ab Db → Ab major." },
        ],
      },
    ],
  },

  // ------------------------------------------------------------------ 5
  {
    id: "scales",
    title: "Scale Universe",
    steps: [
      {
        title: "The major scale",
        body: (
          <p>
            The major scale follows the step pattern <b>W W H W W W H</b> (W = whole step, H = half step). Start on any
            note, follow the pattern and you get the major scale of that key. Pick a key and listen.
          </p>
        ),
        widget: <ScaleExplorer ids={["major"]} keyChoice />,
      },
      {
        title: "Three minor scales",
        body: (
          <ul>
            <li>
              <b>Natural minor</b> (Aeolian): W H W W H W W.
            </li>
            <li>
              <b>Harmonic minor</b>: raises the 7th to get a leading tone — note the wide step (m3) between b6 and 7.
            </li>
            <li>
              <b>Melodic minor</b>: raises the 6th and 7th. Jazz players use it the same way up and down — it is the
              mother of the altered and lydian-dominant sounds.
            </li>
          </ul>
        ),
        widget: <ScaleExplorer ids={["aeolian", "harmonicMinor", "melodicMinor"]} keyName="A" />,
      },
      {
        title: "Pentatonics & the blues",
        body: (
          <p>
            Five-note scales without half steps are easy to improvise with: <b>major pentatonic</b> (1 2 3 5 6) and{" "}
            <b>minor pentatonic</b> (1 b3 4 5 b7). The <b>blues scale</b> adds the b5 “blue note” to the minor pentatonic.
          </p>
        ),
        widget: <ScaleExplorer ids={["majorPentatonic", "minorPentatonic", "blues", "majorBlues"]} />,
      },
      {
        title: "Symmetric scales",
        body: (
          <>
            <p>
              The <b>whole-tone</b> scale has six notes, all whole steps apart — only two different whole-tone scales
              exist. The <b>diminished</b> scale alternates half and whole steps: the half-whole version fits dominant
              7b9 chords, the whole-half version fits dim7 chords.
            </p>
            <div className="tip">
              On the chromatic harmonica symmetric scales are great slide-control studies: the slide moves in a regular
              pattern.
            </div>
          </>
        ),
        widget: <ScaleExplorer ids={["wholeTone", "diminishedHW", "diminishedWH"]} />,
      },
      {
        title: "Bebop scales",
        body: (
          <p>
            Bebop scales add one <b>chromatic passing tone</b> to a seven-note scale. With eight notes, a run of eighth
            notes puts the chord tones on the beat. Bebop dominant = Mixolydian + major 7th; bebop major = major + #5.
          </p>
        ),
        widget: <ScaleExplorer ids={["bebopDominant", "bebopMajor", "bebopDorian"]} />,
      },
      {
        title: "Check yourself",
        body: <p>Answer all questions correctly to complete the lesson.</p>,
        quiz: [
          { q: "Step pattern of the major scale?", options: ["W W H W W W H", "W H W W H W W", "W W W H W W H", "H W W W H W W"], answer: 0, explain: "Half steps between 3–4 and 7–8." },
          { q: "Which scale has a minor 3rd and minor 6th but a major 7th?", options: ["Harmonic minor", "Melodic minor", "Dorian", "Natural minor"], answer: 0, explain: "Harmonic minor = natural minor with a raised 7th." },
          { q: "How many notes does the whole-tone scale have?", options: ["5", "6", "7", "8"], answer: 1, explain: "Six whole steps fill the octave." },
          { q: "The blues scale adds which note to the minor pentatonic?", options: ["b5", "M3", "M7", "b2"], answer: 0, explain: "The b5 — the blue note." },
        ],
      },
    ],
  },

  // ------------------------------------------------------------------ 6
  {
    id: "arpeggios",
    title: "Arpeggios & Chord Tones",
    steps: [
      {
        title: "Triads: stacking thirds",
        body: (
          <ul>
            <li>
              <b>Major</b> = major 3rd + minor 3rd (C E G)
            </li>
            <li>
              <b>Minor</b> = minor 3rd + major 3rd (C Eb G)
            </li>
            <li>
              <b>Diminished</b> = minor 3rd + minor 3rd (C Eb Gb)
            </li>
            <li>
              <b>Augmented</b> = major 3rd + major 3rd (C E G#)
            </li>
          </ul>
        ),
        widget: <ChordExplorer ids={["major", "minor", "diminished", "augmented"]} />,
      },
      {
        title: "Seventh chords",
        body: (
          <p>
            Stack one more third and you get the five chords at the heart of jazz: <b>Maj7</b> (1 3 5 7), <b>7</b> (1 3 5
            b7), <b>m7</b> (1 b3 5 b7), <b>m7b5</b> (1 b3 b5 b7) and <b>dim7</b> (1 b3 b5 bb7).
          </p>
        ),
        widget: <ChordExplorer ids={["maj7", "dom7", "min7", "m7b5", "dim7"]} />,
      },
      {
        title: "The chords of a key",
        body: (
          <p>
            Stack thirds on every note of the major scale: in C you get <b>Cmaj7 Dm7 Em7 Fmaj7 G7 Am7 Bm7b5</b> — the
            diatonic chords I ii iii IV V vi vii. This pattern is the same in every key.
          </p>
        ),
        widget: <DiatonicChords />,
      },
      {
        title: "Tensions: 9, 11, 13",
        body: (
          <p>
            Keep stacking thirds above the 7th: <b>9</b> (= 2nd), <b>11</b> (= 4th), <b>13</b> (= 6th). Dominant chords
            also take altered tensions — <b>b9, #9, #11, b13</b> — which create the tension that wants to resolve.
          </p>
        ),
        widget: <ChordExplorer ids={["maj9", "dom9", "min9", "dom7b9", "dom7s9", "dom13"]} />,
      },
      {
        title: "Arpeggios on the chromatic",
        body: (
          <>
            <p>
              The blow notes of a C chromatic are a <b>C major triad</b>. The draw notes (D F A B) are the upper part of{" "}
              <b>G9</b> — so drawing sounds dominant and blowing resolves. Switch between the chords below to see where
              their tones lie.
            </p>
            <div className="tip">
              In the trainer, switch to <b>Arpeggios</b> to show any chord on the grid and play it at your tempo.
            </div>
          </>
        ),
        widget: (
          <MiniGrid
            choices={[
              { label: "C Major", key: "C", mode: "arpeggio", id: "major" },
              { label: "G7", key: "G", mode: "arpeggio", id: "dom7" },
              { label: "Dm7", key: "D", mode: "arpeggio", id: "min7" },
              { label: "Cmaj7", key: "C", mode: "arpeggio", id: "maj7" },
            ]}
          />
        ),
      },
      {
        title: "Check yourself",
        body: <p>Answer all questions correctly to complete the lesson.</p>,
        quiz: [
          { q: "A minor triad is built from…", options: ["m3 + M3", "M3 + m3", "m3 + m3", "M3 + M3"], answer: 0, explain: "C–Eb is a minor third, Eb–G a major third." },
          { q: "The chord tones of G7 are…", options: ["G B D F", "G B D F#", "G Bb D F", "G B D# F"], answer: 0, explain: "1 3 5 b7 of G." },
          { q: "Which chord is built on the 7th degree of C major?", options: ["Bm7b5", "Bdim7", "Bm7", "Bmaj7"], answer: 0, explain: "B D F A — half-diminished." },
          { q: "Blowing holes 1–3 on a C chromatic sounds a…", options: ["C major triad", "A minor triad", "G7 chord", "F major triad"], answer: 0, explain: "C E G." },
        ],
      },
    ],
  },

  // ------------------------------------------------------------------ 7
  {
    id: "modes",
    title: "Modes & Chord Scales",
    steps: [
      {
        title: "Same notes, new home",
        body: (
          <p>
            Play the C major scale starting on each of its notes and you get the seven <b>modes</b>: C Ionian, D Dorian,
            E Phrygian, F Lydian, G Mixolydian, A Aeolian and B Locrian. Same notes — but each has its own centre and
            colour.
          </p>
        ),
        widget: <ModeExplorer />,
      },
      {
        title: "Characteristic notes",
        body: (
          <ul>
            <li>
              <b>Dorian</b> = minor with a major 6th
            </li>
            <li>
              <b>Phrygian</b> = minor with a b2
            </li>
            <li>
              <b>Lydian</b> = major with a #4
            </li>
            <li>
              <b>Mixolydian</b> = major with a b7
            </li>
            <li>
              <b>Locrian</b> = minor with b2 and b5
            </li>
          </ul>
        ),
        widget: <ScaleExplorer ids={["major", "dorian", "phrygian", "lydian", "mixolydian", "aeolian", "locrian"]} />,
      },
      {
        title: "Chord → scale",
        body: (
          <p>
            Improvisers choose a scale for each chord. The table shows the classic choices. Tap ▶ to hear the chord and
            then its scale, ↗ to practise it in the trainer.
          </p>
        ),
        widget: <ChordScaleTable />,
      },
      {
        title: "Modes of melodic minor",
        body: (
          <p>
            The modes of melodic minor give the sound of modern jazz: <b>Lydian dominant</b> (4th mode) for 7#11,{" "}
            <b>Altered</b> (7th mode) for 7alt, and <b>Locrian #2</b> (6th mode) for m7b5.
          </p>
        ),
        widget: <ScaleExplorer ids={["melodicMinor", "lydianDominant", "altered", "locrian2"]} />,
      },
      {
        title: "Check yourself",
        body: <p>Answer all questions correctly to complete the lesson.</p>,
        quiz: [
          { q: "Dorian differs from natural minor by its…", options: ["Raised 6th", "Raised 7th", "Lowered 2nd", "Raised 4th"], answer: 0, explain: "D Dorian has B natural; D natural minor has Bb." },
          { q: "Which mode fits a Maj7#11 chord?", options: ["Lydian", "Mixolydian", "Dorian", "Locrian"], answer: 0, explain: "Lydian = major with #4 (= #11)." },
          { q: "D Dorian contains the same notes as…", options: ["C major", "D major", "F major", "G major"], answer: 0, explain: "It is the 2nd mode of C major." },
          { q: "Classic scale over G7alt?", options: ["G Altered", "G Mixolydian", "G Lydian", "G Dorian"], answer: 0, explain: "Altered = all tensions altered: b9 #9 b5 b13." },
        ],
      },
    ],
  },

  // ------------------------------------------------------------------ 8
  {
    id: "practice",
    title: "ii–V–I & Practice Routine",
    steps: [
      {
        title: "The ii–V–I",
        body: (
          <p>
            Chords on degrees 2, 5 and 1 — in C: <b>Dm7 → G7 → Cmaj7</b> — form the most important progression in jazz.
            Choose a key and listen to the arpeggios.
          </p>
        ),
        widget: <IIVIPlayer />,
      },
      {
        title: "Guide tones",
        body: (
          <p>
            The <b>3rd and 7th</b> define a chord’s quality. In a ii–V–I they move by step: the 7th of Dm7 (C) falls to
            the 3rd of G7 (B); the 7th of G7 (F) falls to the 3rd of Cmaj7 (E). Play only the guide tones to hear the
            harmony move.
          </p>
        ),
        widget: <IIVIPlayer />,
      },
      {
        title: "Approach notes & enclosures",
        body: (
          <p>
            Strong lines aim at chord tones. Approach the target from a <b>semitone below</b>, from a <b>scale step
            above</b>, or <b>surround</b> it (enclosure). On the chromatic the slide makes semitone approaches easy —
            the caption shows where each note lies on a 12-hole C harmonica.
          </p>
        ),
        widget: <ApproachPlayer />,
      },
      {
        title: "Intonation & the tuner",
        body: (
          <>
            <p>
              A semitone is <b>100 cents</b>. The tuner (tuning fork button) shows how far you are from the nearest note
              and draws a line in the matching hole: high in the box = sharp, low = flat.
            </p>
            <p>
              Zones: <b>Perfect</b> ±5 cents, <b>Good</b> ±15, <b>Fair</b> ±25, <b>Poor</b> beyond. Hear what those
              differences sound like:
            </p>
          </>
        ),
        widget: <DetunePlayer />,
      },
      {
        title: "Your daily routine",
        body: (
          <ol style={{ listStyle: "decimal", paddingLeft: 22, marginBottom: 12 }}>
            <li>Long tones with the tuner — 5 minutes, aim for Perfect.</li>
            <li>Scales around the circle of fourths — direction Both, metronome on, start at 60 BPM.</li>
            <li>ii–V–I arpeggios in all keys.</li>
            <li>Improvise with the scale of the week.</li>
          </ol>
        ),
        widget: <RoutinePresets />,
      },
      {
        title: "Check yourself",
        body: <p>Answer all questions correctly to complete the course.</p>,
        quiz: [
          { q: "In a ii–V–I in F major the V chord is…", options: ["C7", "G7", "Bb7", "D7"], answer: 0, explain: "Gm7 → C7 → Fmaj7." },
          { q: "Guide tones are the chord’s…", options: ["3rd and 7th", "Root and 5th", "9th and 13th", "5th and 9th"], answer: 0, explain: "They define major/minor/dominant quality." },
          { q: "How many cents are in a semitone?", options: ["50", "100", "120", "12"], answer: 1, explain: "1200 cents per octave / 12." },
          { q: "The tuner's Perfect zone means you are within…", options: ["±5 cents", "±25 cents", "exactly 440 Hz", "one semitone"], answer: 0, explain: "Perfect ±5, Good ±15, Fair ±25." },
        ],
      },
    ],
  },
];
