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

const INDEXES = new Map();

function loadIndexes(scale) {
    for (let i = 0; i < scale.length; i++) {
        INDEXES.set(scale[i], i);
    }
}

loadIndexes(SHARP_CHROMATIC);
loadIndexes(FLAT_CHROMATIC);

const CHORD_ROOT_RE = /[A-G][#b]?/g;

export function useToneTranslator() {

    const getScale = (useFlat=false) => useFlat ? FLAT_CHROMATIC : SHARP_CHROMATIC;

    const indexOfTone = (tone) => INDEXES.get(tone);

    const getToneFromIndex = (idx) => {
        const chromaticScale = getScale(useFlat);
        if (idx < 0 || idx >= chromaticScale.length) return null;

        return chromaticScale[idx];
    };

    function transposeChord(chord, semitones, useFlat=false) {
        const chromaticScale = getScale(useFlat);

        const idx = INDEXES.get(chord);
        if (idx === undefined) return null;

        return chromaticScale[((idx + semitones) % chromaticScale.length + chromaticScale.length) % chromaticScale.length];   
    }

    function transposeSpan(span, semitones, useFlat=false) {
        if (!span) return;

        return span.replace(CHORD_ROOT_RE, (match) => {
            const newTone = transposeChord(match, semitones, useFlat);
            return newTone !== null ? newTone : match;
        });
    }

    return { getScale, transposeChord, transposeSpan } ;
}

