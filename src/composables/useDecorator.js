import { ref } from 'vue';

import { useToneTranslator } from '@/composables/useToneTranslator.js';

const CHORD_TRANSLATE = {
    "C": "Dó",
    "D": "Ré",
    "E": "Mi",
    "F": "Fá",
    "G": "Sol",
    "A": "Lá",
    "B": "Si"
};

const MINOR_SYMBOL_TRANSLATE = {
    "m": "-"
}

const CHORD_ROOT_RE = /[A-G]?/g;

const MINOR_SYMBOL_ROOT_RE = /[m]?/g;

const isChord = ref(false);
const isMinorSymbol = ref(false);

const { getRawScale, getRawDefaultUseFlat, indexOfRawTone, transposeRawChord, transposeRawSpan } = useToneTranslator();

export function useDecorator() {

    const decorateChord = (chord) => chord.replace(CHORD_ROOT_RE, (match) => CHORD_TRANSLATE[match] ?? match);
    const decorateMinorSymbol = (chord) => chord.replace(MINOR_SYMBOL_ROOT_RE, (match) => MINOR_SYMBOL_TRANSLATE[match] ?? match);

    function decorate(chord) {
        if (isMinorSymbol.value) chord = decorateMinorSymbol(chord);
        if (isChord.value) chord = decorateChord(chord);
        return chord;
    }

    const getScale = (tone='', useFlat=false) => getRawScale(tone, useFlat);
    const getDefaultUseFlat = (scale) => getRawDefaultUseFlat(scale);
    const indexOfTone = (tone) => indexOfRawTone(tone);
    const transposeChord = (chord, semitones, useFlat=false) => transposeRawChord(chord, semitones, useFlat);
    const transposeSpan = (span, semitones, useFlat=false) => transposeRawSpan(span, semitones, useFlat);

    return { isChord, isMinorSymbol, decorateChord, decorateMinorSymbol, decorate,
        getScale, getDefaultUseFlat, indexOfTone, transposeChord, transposeSpan
     };
}