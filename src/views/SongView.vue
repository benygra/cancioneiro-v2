<script setup>

import { computed, defineAsyncComponent } from 'vue';

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

/**
 * From the lyrics present in the project, fetches the component referring
 * to the song with the provided id.
 * If there is no such file, null is returned instead.
 */
const LyricsComponent = computed(() => {
  const path = `/src/assets/lyrics/${props.id}.vue`;
  return lyricModules[path]
    ? defineAsyncComponent(lyricModules[path])
    : null;
});
</script>

<template>
  <div v-if="song">
    <section class="content-section">
      <h2 class="section-header">{{ song.title }}</h2>
        <div class="lyrics-meta">
            <div class="lyrics-meta-item">
                <strong class="lyrics-meta-title">Tom</strong>
                <span class="chord-style">{{ song.tone }}</span>
            </div>
            <div class="lyrics-meta-item">
                <strong class="lyrics-meta-title">Momento</strong>
                <span class="normal-text">{{ song.moment }}</span>
            </div>
        </div>

        <div class="lyrics">
          <component v-if="LyricsComponent" :is="LyricsComponent" />
          <NotFound v-else :title="song.title" />
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

.lyrics {
  line-height: 1.5;
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
