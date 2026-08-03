<script setup>

import { ref, computed, defineAsyncComponent, watch, watchEffect, onUnmounted } from 'vue';

import Tone from '@/components/Tone.vue';
import NotFound from '@/components/NotFound.vue';

import songs_map from '@/assets/songs_map.json';

import { DEFAULT_TITLE } from "@/constants.js";

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
const localRealTone = ref(null);
const localCapoTone = ref(null);
const localCapo = ref(null);

const onRealToneChange = (tone) => localRealTone.value = tone;
const onCapoToneChange = (tone) => localCapoTone.value = tone;
const onCapoChange = (capo) => localCapo.value = capo;

const displayRealTone = computed(() => localRealTone.value ?? song.value.tone);
const displayCapoTone = computed(() => localCapoTone.value ?? song.value.tone);
const displayCapo = computed(() => localCapo.value ?? song.value?.capo);

// Controls whether the mobile floating menu panel is expanded
const menuOpen = ref(false);
const toggleMenu = () => menuOpen.value = !menuOpen.value;

watch(() => props.id, () => {
  lyricsReady.value = false;
  localRealTone.value = null;
  localCapoTone.value = null;
  localCapo.value = null
  menuOpen.value = false
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

</script>

<template>
  <div v-if="song">
    <section class="content-section">
      <h2 class="section-header">{{ song.title }}</h2>
      <div class="lyrics-meta">
        <div class="lyrics-meta-item">
          <strong class="lyrics-meta-title">Tom</strong>
          <span class="chord-style">{{ displayRealTone }}</span>
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
            <Tone
              :song="song"
              :lyrics="lyricsContainer"
              :lyrics-ready="lyricsReady"
              @real-tone-change="onRealToneChange"
              @capo-tone-change="onCapoToneChange"
              @capo-change="onCapoChange"
            />
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
}

</style>
