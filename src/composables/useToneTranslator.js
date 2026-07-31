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

export function useToneTranslator() {

    const getScale = (useFlat=false) => useFlat ? FLAT_CHROMATIC : SHARP_CHROMATIC;

    function transpose(chord, semitones, useFlat=false) {

        const chromaticScale = getScale(useFlat);

        const idx = INDEXES.get(chord);
        if (!idx) return null;

        return chromaticScale[(idx + semitones) % chromaticScale.length];   
    }

    return { getScale, transpose } ;
}

