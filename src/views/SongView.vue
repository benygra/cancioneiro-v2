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
const displayRealTone = ref(null);
const displayCapoTone = ref(null);

watch(() => props.id, () => {
  lyricsReady.value = false;
  displayRealTone.value = null;
  displayCapoTone.value = null;
});


const onRealToneChange = (tone) => displayRealTone.value = tone;
const onCapoToneChange = (tone) => displayCapoTone.value = tone;

const localCapo = ref(null);
const displayCapo = computed(() => localCapo.value ?? song.value?.capo);

const onCapoChange = (capo) => localCapo.value = capo;

watch(() => props.id, () => localCapo.value = null);

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
          <span class="chord-style">{{ displayRealTone ?? song.tone }}</span>
        </div>
        <div class="lyrics-meta-item" v-if="displayCapo">
          <span class="chord-style">({{ displayCapoTone ?? song.tone }})</span>
        </div>
        <div class="lyrics-meta-item" v-if="displayCapo">
          <strong class="lyrics-meta-title">Capo</strong>
          <span>{{ displayCapo ?? song.capo }}</span>
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
        <div class="menu">
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
}

</style>
