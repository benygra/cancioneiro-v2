<script setup>

import { ref, computed, watch } from 'vue';

import { useToneTranslator } from '@/composables/useToneTranslator';

const props = defineProps({
    song: Object,
    lyrics: Object,
    lyricsReady: Boolean,
    decorator: Object,
});

const emit = defineEmits(['real-tone-change', 'capo-tone-change', 'capo-change']);

const { getScale, getDefaultUseFlat, indexOfTone, transposeChord, transposeSpan } = useToneTranslator();

const useFlat = ref(false);
const semitones = ref(props.song.capo ?? 0);
const capoInput = ref(props.song.capo ?? 0);
let originals = new WeakMap();

const buttonLabel = computed(() => useFlat.value ? '♭' : '♯');
const scale = computed(() => getScale(props.song.tone, useFlat.value));

const currentRealTone = computed(() => transposeChord(props.song.tone, semitones.value, useFlat.value));
const currentCapoTone = computed(() => transposeChord(props.song.tone, semitones.value - capoInput.value, useFlat.value));

function captureOriginals() {
  if (!props.lyrics) return;

  props.lyrics.querySelectorAll('.chord').forEach(span => {
    originals.set(span, span.textContent);
  });
}

function applyTranspose() {
  if (!props.lyrics) return;

  props.lyrics.querySelectorAll('.chord').forEach(span => {
    const original = originals.get(span) ?? span.textContent;
    span.textContent = transposeSpan(original, semitones.value - capoInput.value, useFlat.value, props.decorator.decorate);
  });
}

function capoChange() {
  useFlat.value = getDefaultUseFlat(currentCapoTone.value);
  emit('capo-tone-change', currentCapoTone.value);
  emit('capo-change', capoInput.value);
  applyTranspose();
}

function changeTone(newSemitones) {
  semitones.value = newSemitones;
  useFlat.value = getDefaultUseFlat(currentCapoTone.value);
  emit('real-tone-change', currentRealTone.value);
  emit('capo-tone-change', currentCapoTone.value);
  emit('capo-change', capoInput.value);
  applyTranspose();
}

function selectTone(tone) {
  const targetIdx = indexOfTone(tone);
  const baseIdx = indexOfTone(props.song.tone);
  if (targetIdx === undefined || baseIdx === undefined) return;

  changeTone(targetIdx - baseIdx);
}

function step(delta) {
  changeTone(semitones.value + delta);
}

function toggleChromatic() {
  useFlat.value = !useFlat.value;
  emit('real-tone-change', currentRealTone.value);
  emit('capo-tone-change', currentCapoTone.value);
  applyTranspose();
}

watch(
  () => [props.song, props.lyricsReady],
  ([, ready]) => {
    if (!ready) return; // wait until the real DOM is actually there

    originals = new WeakMap();
    useFlat.value = getDefaultUseFlat(currentCapoTone.value);

    emit('real-tone-change', currentRealTone.value);
    emit('capo-tone-change', currentCapoTone.value);

    captureOriginals();
    applyTranspose();
  },
);

</script>

<template>
  <div class="tone-big-wrapper">
    <ul class="tones">
      <li
        class="tone-item"
        :class="{ 'tone-item-selected': currentRealTone === tone }"
        v-for="tone in scale"
        :key="tone"
        @click="selectTone(tone)"
      >
        <span class="tone-item-text">{{ tone }}</span>
      </li>
    </ul>

    <div class="chromatic-buttons">
      <button class="chromatic-btn" @click="step(-1)">-</button>
      <button class="chromatic-btn" @click="toggleChromatic">{{ buttonLabel }}</button>
      <button class="chromatic-btn" @click="step(1)">+</button>
    </div>

    <div class="capo-wrapper">
      <p class="capo">Capo</p>
      <input 
        class="capo-number"
        type="numeric"
        name="capo-number"
        v-model="capoInput"
        @change="capoChange"
      >
    </div>
  </div>
</template>

<style scoped>

.tone-big-wrapper {
  font-size: 0.9rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-content: center;
  gap: 0.9em;
}

.tones {
  display: flex;
  list-style-type: none;
  flex-wrap: wrap;
  gap: 0.4em;
  justify-content: space-evenly;
  align-items: center;
}

.tone-item {
  color: var(--chord-text-color);
  width: 2.6em;
  height: 2.6em;
  cursor: pointer;
  border: 2px solid var(--nav-bottom-color);
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.tone-item-text {
  font-weight: bold;
  color: inherit;
  text-align: center;
}

.tone-item:hover {
  background-color: var(--tone-btn-hover-bg-color);
}

.tone-item-selected {
  background-color: var(--default-bg-color);
  color: white;
}

.chromatic-buttons {
  display: flex;
  gap: 0.3em;
  justify-content: center;
}

.chromatic-btn {
  width: 25%;
  border: 2px solid var(--nav-bottom-color);
  background-color: var(--default-bg-color);
  border-radius: 5px;
  font-size: 1.4em;
  color: var(--nav-text-color);
  cursor: pointer;
}

.chromatic-btn:hover {
  background-color: var(--tone-btn-hover-bg-color);
}

.capo-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  border: 2px solid var(--default-bg-color);
  width: fit-content;
  border-radius: 5px;
  margin-right: auto;
  margin-left: auto;
}

.capo {
  padding-left: 0.5em;
  text-align: center;
}

.capo-number {
  text-align: center;
  margin: 0.4em;
  width: 2.1em;
}

/* Mobile responsiveness */
@media (max-width: 768px) {
  .chromatic-btn {
    width: 2em;
  }
}

</style>