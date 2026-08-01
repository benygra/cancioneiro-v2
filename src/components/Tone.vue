<script setup>

import { ref, computed, watch } from 'vue';

import { useToneTranslator } from '@/composables/useToneTranslator';

const props = defineProps({
    song: Object,
    lyrics: Object,
});

const emit = defineEmits(['tone-change']);

const { getScale, indexOfTone, transposeChord, transposeSpan } = useToneTranslator();

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

function selectTone(tone) {
  const targetIdx = indexOfTone(tone);
  const baseIdx = indexOfTone(props.song.tone);
  if (targetIdx === undefined || baseIdx === undefined) return;

  captureOriginals();
  semitones.value = targetIdx - baseIdx;
  applyTranspose();
}

function step(delta) {
  captureOriginals();
  semitones.value += delta;
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
            @click="selectTone(tone)"
        >
            <span class="item-text">{{ tone }}</span>
        </li>
    </ul>

    <div class="buttons">
      <button class="chromatic-btn" @click="step(-1)">-</button>
      <button class="chromatic-btn" @click="toggleChromatic">{{ buttonLabel }}</button>
      <button class="chromatic-btn" @click="step(1)">+</button>
    </div>
</template>

<style scoped>

.tones {
  display: flex;
  list-style-type: none;
  flex-wrap: wrap;
  gap: 0.7em;
  justify-content: space-evenly;
  align-items: center;
}

.item {
  color: var(--chord-text-color);
  width: 3em;
  height: 3em;
  cursor: pointer;
  border: 2px solid var(--nav-bottom-color);
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.item-text {
  font-weight: bold;
  color: inherit;
}

.item:hover,
.item-selected {
  background-color: var(--default-bg-color);
  color: white;
}

.buttons {
  display: flex;
  gap: 0.1em;
  justify-content: center;
  margin: 0.9em 0;
}

.chromatic-btn {
  width: 25%;
  height: 25%;
  border: 2px solid var(--nav-bottom-color);
  background-color: var(--default-bg-color);
  border-radius: 5px;
  font-size: 1.5em;
  color: var(--nav-text-color);
  cursor: pointer;
}

.chromatic-btn:hover {
  background-color: var(--tone-btn-hover-bg-color);
}

</style>