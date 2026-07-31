<script setup>

import { ref, computed, watch } from 'vue';

import { useToneTranslator } from '@/composables/useToneTranslator';

const props = defineProps({
    song: Object,
    lyrics: Object,
});

const emit = defineEmits(['tone-change']);

const { getScale, transposeChord, transposeSpan } = useToneTranslator();

const useFlat = ref(false);
const semitones = ref(0);
let originals = new WeakMap();

const buttonLabel = computed(() => useFlat.value ? '♭' : '♯');
const scale = computed(() => getScale(useFlat.value));

const currentTone = computed(() => transposeChord(props.song.tone, semitones.value, useFlat.value));

watch(currentTone, (newTone) => {
  emit('tone-change', newTone);
});

function captureOriginals() {
  if (!props.lyrics) return;

  props.lyrics.querySelectorAll('.chord').forEach(span => {
    if (!originals.has(span)) originals.set(span, span.textContent);
  });
}

function applyTranspose() {
  if (!props.lyrics) return;

  props.lyrics.querySelectorAll('.chord').forEach(span => {
    const original = originals.get(span) ?? span.textContent;
    span.textContent = transposeSpan(original, semitones.value, useFlat.value);
  });
}

function step(delta) {
  captureOriginals();
  semitones.value += delta;
  console.log(semitones.value);
  applyTranspose();
}

function toggleChromatic() {
  useFlat.value = !useFlat.value;
  applyTranspose();
}

watch(() => props.song, () => {
  originals = new WeakMap();
  semitones.value = 0;
});

</script>

<template>
    <ul class="tones">
        <li
            class="item"
            :class="{ 'item-selected': currentTone === tone }"
            v-for="tone in scale"
            :key="tone"
            @click="console.log(tone)"
        >
            {{ tone }}
        </li>
    </ul>

    <button class="chromatic-btn" @click="toggleChromatic">{{ buttonLabel }}</button>
    <button class="chromatic-btn" @click="step(1)">+</button>
    <button class="chromatic-btn" @click="step(-1)">-</button>
</template>

<style scoped>

.tones {
  display: flex;
  list-style-type: none;
}

.item {
    padding: 0 1em;
    cursor: pointer;
}

.item:hover,
.item-selected {
    color: red;
}

.chromatic-btn {
    padding: 0.1em;
    font-size: 1.4em;
}

</style>