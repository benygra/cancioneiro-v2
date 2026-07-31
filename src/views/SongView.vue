<script setup>

import { ref, computed, defineAsyncComponent, watchEffect } from 'vue';

import Tone from '@/components/Tone.vue';
import NotFound from '@/components/NotFound.vue';

import songs_map from '@/assets/songs_map.json';

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

const displayTone = ref(null);

const onToneChange = (tone) => displayTone.value = tone;

/**
 * Changes the browser tab title to the song's one.
 * If the song is not available, shows a default text.
 */
watchEffect(() => {
  document.title = song.value ? song.value.title : 'Não disponível';
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
          <div class="lyrics-meta-item">
            <strong class="lyrics-meta-title">Momento</strong>
            <span class="normal-text">{{ song.moment }}</span>
          </div>
      </div>

      <div class="wrapper" v-if="LyricsComponent">
        <div class="lyrics" ref="lyricsContainer">
          <component  :is="LyricsComponent" />
        </div>
        <div class="menu">
          <div class="menu-item">
            <h3 class="section-header-small">Tonalidade</h3>
            <Tone :song="song" :lyrics="lyricsContainer" @tone-change="onToneChange"/>
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
    display: inline-flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
  }

  .lyrics-meta-title {
    margin-right: 0;
  }
}

</style>
