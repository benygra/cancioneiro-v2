<script setup>

import { ref, computed, watch, nextTick, onMounted  } from 'vue';

import { useToneTranslator } from '@/composables/useToneTranslator';

const props = defineProps({
    song: Object,
    lyrics: Object,
    lyricsReady: Boolean,
});

const emit = defineEmits(['tone-change', 'capo-change']);

const { getScale, getDefaultUseFlat, indexOfTone, transposeChord, transposeSpan } = useToneTranslator();

const useFlat = ref(false);
const semitones = ref(0);
const capoInput = ref(props.song.capo ?? 0);
let originals = new WeakMap();

const buttonLabel = computed(() => useFlat.value ? '♭' : '♯');
const scale = computed(() => getScale(props.song.tone, useFlat.value));

const getCurrentTone = () => transposeChord(props.song.tone, semitones.value, useFlat.value);

const currentTone = computed(() => getCurrentTone());

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
    span.textContent = transposeSpan(original, semitones.value - capoInput.value, useFlat.value);
  });
}

function selectTone(tone) {
  const targetIdx = indexOfTone(tone);
  const baseIdx = indexOfTone(props.song.tone);
  if (targetIdx === undefined || baseIdx === undefined) return;

  semitones.value = targetIdx - baseIdx;
  useFlat.value = getDefaultUseFlat(tone);
  capoInput.value = 0; emit('capo-change', capoInput.value);
  applyTranspose();

}

function step(delta) {
  semitones.value += delta;
  useFlat.value = getDefaultUseFlat(getCurrentTone());
  capoInput.value = 0; emit('capo-change', capoInput.value);
  applyTranspose();
}

function toggleChromatic() {
  useFlat.value = !useFlat.value;
  applyTranspose();
}

function capoChange() {
  emit('capo-change', capoInput.value);
  applyTranspose();
}


async function applyInitialCapo() {
  await nextTick();
  captureOriginals();
  applyTranspose();
}

watch(
  () => [props.song, props.lyricsReady],
  ([, ready]) => {
    if (!ready) return; // wait until the real DOM is actually there

    originals = new WeakMap();
    semitones.value = 0;
    useFlat.value = getDefaultUseFlat(props.song.tone);
    capoInput.value = props.song.capo ?? 0;

    captureOriginals();
    applyTranspose();
  }
);

onMounted(() => {
  applyInitialCapo();
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

    <div class="capo-wrapper">
      <p class="capo">Capo</p>
      <input 
        class="capo-number"
        type="number"
        name="capo-number"
        v-model="capoInput"
        @change="capoChange"
      >
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
  text-align: center;
}

.item:hover {
  background-color: var(--tone-btn-hover-bg-color);
}

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

.capo-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  border: 2px solid var(--default-bg-color);
  width: fit-content;
  border-radius: 5px;
  margin: 1em auto;
}

.capo {
  padding-left: 0.5em;
  text-align: center;
}

.capo-number {
  margin: 0.5em;
  width: 3.2em;
  padding: 0.5em;
}

</style>