const TRANSPOSE = {
    'Dó':   0x00,
    'Dó#':  0x10,
    'Réb':  0x10,
    'Ré':   0x20,
    'Ré#':  0x30,
    'Mib':  0x30,
    'Mi':   0x40,
    'Fá':   0x50,
    'Fá#':  0x60,
    'Solb': 0x60,
    'Sol':  0x70,
    'Sol#': 0x80,
    'Láb':  0x80,
    'Lá':   0x90,
    'Lá#':  0xA0,
    'Sib':  0xA0,
    'Si':   0xB0,

    'C':    0x00,
    'C#':   0x10,
    'Db':   0x10,
    'D':    0x20,
    'D#':   0x30,
    'Eb':   0x30,
    'E':    0x40,
    'F':    0x50,
    'F#':   0x60,
    'Gb':   0x60,
    'G':    0x70,
    'G#':   0x80,
    'Ab':   0x80,
    'A':    0x90,
    'A#':   0xA0,
    'Bb':   0xA0,
    'B':    0xB0
}

const TRANSPOSE_JOINED = Object.keys(TRANSPOSE).join('|');

// all chords are considered, only minors contribute to the last part of the code
const CHORD_RE = new RegExp(`^(${TRANSPOSE_JOINED})(m(?!aj)|-)?`);

export function useToneTranslator() {

    function toCode(chord) {

        function doOne(splitted) {
            const match = splitted.match(CHORD_RE);
            if (!match) return null; // we don't know that chord...

            let code = TRANSPOSE[match[1]];

            if (match[2]) {
                code |= 0x01; // minor
            }

            return code;
        }

        const barSplit = chord.split('/'); //because the chord might get like Am/A (on the chorus it went from minor to major)
        var code = 0x0;
        for (let i = 0; i < barSplit.length; i++) {
            code |= doOne(barSplit[i]);

            if (i < barSplit.length-1) {
                code <<= 8;
            }
        }

        return code;
    }

    return { toCode } ;
}

