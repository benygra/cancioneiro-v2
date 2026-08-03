<script setup>
import { ref } from 'vue';


const props = defineProps({
    tone: String,
});

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

const decorateChord = (chord) => chord.replace(CHORD_ROOT_RE, (match) => CHORD_TRANSLATE[match] ?? match);

const MINOR_SYMBOL_ROOT_RE = /[m]?/g;

const decorateMinorSymbol = (chord) => chord.replace(MINOR_SYMBOL_ROOT_RE, (match) => MINOR_SYMBOL_TRANSLATE[match] ?? match);

function decorate(chord) {
    if (isMinorSymbol.value) chord = decorateMinorSymbol(chord);
    if (isChord.value) chord = decorateChord(chord);
    return chord;
}

const isChord = ref(false);

const isMinorSymbol = ref(false);

defineExpose({
    decorate,
});

</script>

<template>
    <div class="decorator-big-wrapper">
        <p class="cipher-text">Cifra</p>
        <div class="decorator-buttons">
            <button 
                class="decorator-btn" 
                :class="{'decorator-item-selected': !isChord}"
                @click="isChord = false"
            >
                {{ tone }}
            </button>
            <button 
                class="decorator-btn" 
                :class="{'decorator-item-selected': isChord}"
                @click="isChord = true"
            >
                {{ decorateChord(tone) }}
            </button>
        </div>
        <p class="cipher-text">Marca</p>
        <div class="decorator-buttons">
            <button 
                class="decorator-btn" 
                :class="{'decorator-item-selected': !isMinorSymbol}"
                @click="isMinorSymbol = false"
            >
                m
            </button>
            <button 
                class="decorator-btn" 
                :class="{'decorator-item-selected': isMinorSymbol}"
                @click="isMinorSymbol = true"
            >
                {{decorateMinorSymbol('m')}}
            </button>
        </div>
    </div>
</template>

<style scoped>

.decorator-big-wrapper {
    font-size: 0.9rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 0.3em;
}

.cipher-text {
    font-weight: bold;
}

.decorator-buttons {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-wrap: wrap;
    width: fit-content;
    border: 2px solid var(--default-bg-color);
    border-radius: 5px;
    padding: 0.3em;
    gap: 0.3em;
}

.decorator-btn {
    padding: 0.3em;
    font-weight: bold;
    border: 2px solid var(--nav-bottom-color);
    border-radius: 5px;
    cursor: pointer;
}

.decorator-item-selected {
    background-color: var(--default-bg-color);
    color: white;
}

</style>
