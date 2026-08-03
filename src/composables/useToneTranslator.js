const SHARP_CHROMATIC = [
  'C',
  'C#',
  'D',
  'D#',
  'E',
  'F',
  'F#',
  'G',
  'G#',
  'A',
  'A#',
  'B'
];

const FLAT_CHROMATIC = [
  'C',
  'Db',
  'D',
  'Eb',
  'E',
  'F',
  'Gb',
  'G',
  'Ab',
  'A',
  'Bb',
  'B'
];

const DEFAULT_FLAT = ['F', 'Dm', 'A#', 'Bb', 'Gm', 'D#', 'Eb', 'Cm', 'G#', 'Ab', 'Fm'];

const INDEXES = new Map();

function loadIndexes(scale) {
    for (let i = 0; i < scale.length; i++) {
        INDEXES.set(scale[i], i);
    }
}

loadIndexes(SHARP_CHROMATIC);
loadIndexes(FLAT_CHROMATIC);

const CHORD_ROOT_RE = /[A-G][#b]?/g;
const CHORD_TONE_RE = /[A-G][#b]?m?/g;

export function useToneTranslator() {

    function stripTone(tone, regex=CHORD_ROOT_RE) {
        const match = tone.match(regex);
        if (!match) return null;
        return match[0];
    }

    function getScale(tone='', useFlat=false) {
        const chromaticScale = useFlat ? FLAT_CHROMATIC : SHARP_CHROMATIC;

        const toneStripped = stripTone(tone);

        return chromaticScale.map((item) => item + tone.substring(toneStripped.length));
    };

    const getDefaultUseFlat = (scale) => DEFAULT_FLAT.includes(stripTone(scale, CHORD_TONE_RE));

    const indexOfTone = (tone) => INDEXES.get(stripTone(tone));

    function transposeChord(chord, semitones, useFlat=false) {
        const chromaticScale = useFlat ? FLAT_CHROMATIC : SHARP_CHROMATIC;

        const chordStripped = stripTone(chord);
        if (!chordStripped) return null;

        const idx = INDEXES.get(chordStripped);

        return chromaticScale[((idx + semitones) % chromaticScale.length + chromaticScale.length) % chromaticScale.length] + chord.substring(chordStripped.length);
    }

    function transposeSpan(span, semitones, useFlat=false) {
        if (!span) return;

        return span.replace(CHORD_ROOT_RE, (match) => {
            const newTone = transposeChord(match, semitones, useFlat);
            return newTone !== null ? newTone : match;
        });
    }

    return { getScale, getDefaultUseFlat, indexOfTone, transposeChord, transposeSpan } ;
}

