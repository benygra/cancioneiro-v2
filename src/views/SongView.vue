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

watch(() => props.id, () => {
  lyricsReady.value = false;
});

const displayTone = ref(null);

const onToneChange = (tone) => displayTone.value = tone;

const localCapo = ref(null);
const displayCapo = computed(() => localCapo.value ?? song.value?.capo);

const onCapoChange = (capo) => localCapo.value = capo;

watch(() => props.id, () => { localCapo.value = null; });

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
          <span class="chord-style">{{ displayTone ?? song.tone }}</span>
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
              @tone-change="onToneChange"
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
  align-items: center;
}

.lyrics-meta-item:first-child {
  flex: 1;
  display: flex;
  justify-content: flex-start;
}

.lyrics-meta-item:last-child {
  flex: 1;
  display: flex;
  justify-content: flex-end;
}

.lyrics-meta-item:not(:first-child):not(:last-child) {
  flex: 0 0 auto;
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
  position: sticky;
  top: 100px;
  width: 400px;
  height: 400px;
  margin-top: 1em;
}

.menu-item {
  border-bottom: 1px solid var(--default-bg-color);
}

/* Mobile responsiveness */
@media (max-width: 768px) {
  .lyrics-meta-item {
    display: flex;
    flex-direction: column;
  }

  .lyrics-meta-item:last-child {
    text-align: end;
  }

  .lyrics-meta-item:not(:first-child):not(:last-child) {
    text-align: center;
  }

  .lyrics-meta-title {
    margin-right: 0;
  }
}

</style>
