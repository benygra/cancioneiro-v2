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

const CHORD_TRANSLATE_REVERSE = new Map();
const MINOR_SYMBOL_TRANSLATE_REVERSE = new Map();

function loadReverseTranslate(translateMap, mapToBuild) {
    for (let [raw, translated] of Object.entries(translateMap)) {
        mapToBuild.set(translated, raw);
    }
}

loadReverseTranslate(CHORD_TRANSLATE, CHORD_TRANSLATE_REVERSE);
loadReverseTranslate(MINOR_SYMBOL_TRANSLATE, MINOR_SYMBOL_TRANSLATE_REVERSE);

const CHORD_TRANSLATE_REVERSE_STR = Array.from(CHORD_TRANSLATE_REVERSE.keys()).join('|');
const MINOR_SYMBOL_TRANSLATE_REVERSE_STR = Array.from(MINOR_SYMBOL_TRANSLATE_REVERSE.keys()).join('|');

const CHORD_ROOT_RE = /[A-G]?/g;
const CHORD_ROOT_REVERSE_RE = new RegExp(`(${CHORD_TRANSLATE_REVERSE_STR})?`, 'g');

const MINOR_SYMBOL_ROOT_RE = /[m]?/g;
const MINOR_SYMBOL_ROOT_REVERSE_RE = new RegExp(`(${MINOR_SYMBOL_TRANSLATE_REVERSE_STR})?`, 'g');

const undecorateChord = (chord) => chord.replace(CHORD_ROOT_REVERSE_RE, (match) => CHORD_TRANSLATE_REVERSE.get(match) ?? match);
const undecorateMinorSymbol = (chord) => chord.replace(MINOR_SYMBOL_ROOT_REVERSE_RE, (match) => MINOR_SYMBOL_TRANSLATE_REVERSE.get(match) ?? match);

function undecorate(chord) {
    if (isMinorSymbol.value) chord = undecorateMinorSymbol(chord);
    if (isChord.value) chord = undecorateChord(chord);
    return chord;
}

const isChord = ref(false);
const isMinorSymbol = ref(false);

const { getRawScale, getRawDefaultUseFlat, indexOfRawTone, transposeRawChord, transposeRawSpan } = useToneTranslator();

export function useDecorator() {

    function undecorate(chord) {
        if (isMinorSymbol.value) chord = undecorateMinorSymbol(chord);
        if (isChord.value) chord = undecorateChord(chord);
        return chord;
    }

    const decorateChord = (chord) => undecorateChord(chord).replace(CHORD_ROOT_RE, (match) => CHORD_TRANSLATE[match] ?? match);
    const decorateMinorSymbol = (chord) => undecorateMinorSymbol(chord).replace(MINOR_SYMBOL_ROOT_RE, (match) => MINOR_SYMBOL_TRANSLATE[match] ?? match);

    function decorate(chord) {
        chord = undecorate(chord);

        if (isMinorSymbol.value) chord = decorateMinorSymbol(chord);
        if (isChord.value) chord = decorateChord(chord);
        return chord;
    }

    const undecorateChord = (chord) => chord.replace(CHORD_ROOT_REVERSE_RE, (match) => CHORD_TRANSLATE_REVERSE.get(match) ?? match);
    const undecorateMinorSymbol = (chord) => chord.replace(MINOR_SYMBOL_ROOT_REVERSE_RE, (match) => MINOR_SYMBOL_TRANSLATE_REVERSE.get(match) ?? match);

    const getScale = (tone='', useFlat=false) => getRawScale(undecorate(tone), useFlat).map(decorate);
    const getDefaultUseFlat = (tone) => getRawDefaultUseFlat(undecorate(tone));
    const indexOfTone = (tone) => indexOfRawTone(undecorate(tone));
    const transposeChord = (chord, semitones, useFlat=false) => decorate(transposeRawChord(undecorate(chord), semitones, useFlat));
    const transposeSpan = (span, semitones, useFlat=false) => decorate(transposeRawSpan(undecorate(span), semitones, useFlat));

    return { isChord, isMinorSymbol, decorateChord, decorateMinorSymbol, decorate, undecorateChord, undecorateMinorSymbol, undecorate,
        getScale, getDefaultUseFlat, indexOfTone, transposeChord, transposeSpan
     };
}