<script setup>

import { ref, computed, defineAsyncComponent, watch, watchEffect, onUnmounted } from 'vue';

import NotFound from '@/components/NotFound.vue';

import songs_map from '@/assets/songs_map.json';

import { DEFAULT_TITLE } from "@/constants.js";

import { useDecorator } from '@/composables/useDecorator.js';

/**
 * This view takes into account the id of a song.
 * It is referring to a song in particular.
 */
const props = defineProps({
  id: String,
});

/**
 * Fetches the song from the persisted json map from the given id.
 */
const song = computed(() => songs_map[props.id]);

const lyricModules = import.meta.glob('@/assets/lyrics/*.vue');
const componentCache = new Map();

const LyricsComponent = computed(() => {
  const path = `/src/assets/lyrics/${props.id}.vue`;

  if (!lyricModules[path]) return null;

  if (!componentCache.has(path)) {
    componentCache.set(path, defineAsyncComponent(lyricModules[path]));
  }

  return componentCache.get(path);
});

const lyricsContainer = ref(null);

const lyricsReady = ref(false);

function onLyricsMounted() {
  lyricsReady.value = true;
}

// Controls whether the mobile floating menu panel is expanded
const menuOpen = ref(false);
const toggleMenu = () => menuOpen.value = !menuOpen.value;

watch(() => props.id, () => {
  lyricsReady.value = false;
  menuOpen.value = false;
});

/**
 * Changes the browser tab title to the song's one.
 * If the song is not available, shows a default text.
 */
watchEffect(() => {
  document.title = song.value ? song.value.title : 'Não disponível';
});

onUnmounted(() => {
  document.title = DEFAULT_TITLE;
});

const { isChord, isMinorSymbol, decorateChord, decorateMinorSymbol, decorate,
  getScale, getDefaultUseFlat, indexOfTone, transposeChord, transposeSpan
 } = useDecorator();

const useFlat = ref(false);
const semitones = ref(song.value.capo ?? 0);
const capoInput = ref(song.value.capo ?? 0);
let originals = new WeakMap();

const chromaticButtonLabel = computed(() => useFlat.value ? '♭' : '♯');
const scale = computed(() => getScale(song.value.tone, useFlat.value));

const currentRealTone = computed(() => transposeChord(song.value.tone, semitones.value, useFlat.value));
const currentCapoTone = computed(() => transposeChord(song.value.tone, semitones.value - capoInput.value, useFlat.value));

// for display
const displayCapo = ref(capoInput.value);
const displayCapoTone = ref(currentCapoTone.value);

function captureOriginals() {
  if (!lyricsContainer.value) return;

  lyricsContainer.value.querySelectorAll('.chord').forEach(span => {
    originals.set(span, span.textContent);
  });
}

function applyTranspose() {
  if (!lyricsContainer.value) return;

  lyricsContainer.value.querySelectorAll('.chord').forEach(span => {
    const original = originals.get(span) ?? span.textContent;
    span.textContent = transposeSpan(original, semitones.value - capoInput.value, useFlat.value);
  });
}

function capoChange() {
  useFlat.value = getDefaultUseFlat(currentCapoTone.value);
  displayCapo.value = capoInput.value;
  displayCapoTone.value = currentCapoTone.value;
  applyTranspose();
}

function changeTone(newSemitones) {
  semitones.value = newSemitones;
  useFlat.value = getDefaultUseFlat(currentCapoTone.value);
  displayCapoTone.value = currentCapoTone.value;
  applyTranspose();
}

function selectTone(tone) {
  const targetIdx = indexOfTone(tone);
  const baseIdx = indexOfTone(song.value.tone);
  if (targetIdx === undefined || baseIdx === undefined) return;

  changeTone(targetIdx - baseIdx);
}

function step(delta) {
  changeTone(semitones.value + delta);
}

function toggleChromatic() {
  useFlat.value = !useFlat.value;
  applyTranspose();
}

watch(
  () => [props.id, lyricsReady.value],
  ([, ready]) => {
    if (!ready) return; // wait until the real DOM is actually there

    originals = new WeakMap();
    useFlat.value = getDefaultUseFlat(currentCapoTone.value);

    captureOriginals();
    applyTranspose();
  },
);

</script>

<template>
  <div v-if="song">
    <section class="content-section">
      <h2 class="section-header">{{ song.title }}</h2>
      <div class="lyrics-meta">
        <div class="lyrics-meta-item">
          <strong class="lyrics-meta-title">Tom</strong>
          <span class="chord-style">{{ currentRealTone }}</span>
        </div>
        <div class="lyrics-meta-item" v-if="displayCapo > 0">
          <span class="chord-style">({{ displayCapoTone }})</span>
        </div>
        <div class="lyrics-meta-item" v-if="displayCapo > 0">
          <strong class="lyrics-meta-title">Capo</strong>
          <span>{{ displayCapo }}</span>
        </div>
          <div class="lyrics-meta-item">
            <strong class="lyrics-meta-title">Momento</strong>
            <span class="normal-text">{{ song.moment }}</span>
          </div>
      </div>

      <div class="wrapper" v-if="LyricsComponent">
        <div class="lyrics" ref="lyricsContainer">
          <component
            :is="LyricsComponent"
            @vue:mounted="onLyricsMounted"
          />
        </div>

        <div class="menu" :class="{ 'menu-open': menuOpen }">
          <div class="menu-item">
            <h3 class="section-header-small">Tonalidade</h3>
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
                <button class="chromatic-btn" @click="toggleChromatic">{{ chromaticButtonLabel }}</button>
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
          </div>
          <div class="menu-item">
            <div class="decorator-big-wrapper">
              <p class="cipher-text">Cifra</p>
              <div class="decorator-buttons">
                <button 
                    class="decorator-btn" 
                    :class="{'decorator-item-selected': !isChord}"
                    @click="isChord = false"
                >
                    {{ currentRealTone }}
                </button>
                <button 
                    class="decorator-btn" 
                    :class="{'decorator-item-selected': isChord}"
                    @click="isChord = true"
                >
                    {{ decorateChord(currentRealTone) }}
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
          </div>
        </div>

        <button
          class="menu-button"
          type="button"
          @click="toggleMenu"
        >
          <img class="menu-icon" src="@/assets/img/guitar.png" alt="guitar">
        </button>
      </div>
      <div v-else>
        <NotFound :title="song.title" />
      </div>
    </section>
  </div>
  <div v-else>
    <NotFound />
  </div>
</template>

<style scoped>

.lyrics-meta {
  position: sticky;
  top: 0;
  background-color: white;
  padding: 0.7em 0;
  display: flex;
  justify-content: space-between;
}

.lyrics-meta-title {
  margin-right: 0.4em;
}

.wrapper {
  display: flex;
}

.lyrics {
  width: 100%;
  line-height: 1.5;
}

.menu {
  width: 17vw;
  margin-top: 1em;
}

.menu-item {
  border-bottom: 1px solid var(--default-bg-color);
  padding-bottom: 1em;
}

.menu-button {
  display: none;
}

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
  .lyrics-meta-item {
    display: inline-flex;
    flex-direction: column;
    align-items: center;
    justify-content: end;
    text-align: center;
  }

  .lyrics-meta-title {
    margin-right: 0;
  }

  .menu-button {
    display: block;
    position: fixed;
    bottom: 1.4em;
    right: 1.4em;

    width: 4.8em;
    height: 4.8em;
    border-radius: 50%;
    background-color: var(--default-bg-color);
    cursor: pointer;
    z-index: 1000;
  }

  .menu-icon {
    display: inline-block;
    width: 3.3em;
    height: 3.3em;
    background-size: cover;
    vertical-align: middle;
  }

  .menu {
    display: none;
    position: fixed;
    bottom: 6em;
    right: 1.4em;

    width: min(80vw, 320px);
    max-height: 70vh;
    overflow: auto;
    background-color: white;
    border-radius: 12px;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
    padding: 1em;
    z-index: 1001;
  }

  .menu-open {
    display: block;
  }

  .menu-item {
    border-bottom: none;
    padding-bottom: 0;
  }

  .chromatic-btn {
    width: 2em;
  }
}

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
