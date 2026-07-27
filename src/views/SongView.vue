<script setup>
import { computed, defineAsyncComponent } from 'vue';
import songs_map from '@/songs_map.json';

import NotFound from '@/components/NotFound.vue';

const props = defineProps({
  id: String,
});

const song = computed(() => songs_map[props.id]);

const lyricModules = import.meta.glob('@/assets/lyrics/*.vue');

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
