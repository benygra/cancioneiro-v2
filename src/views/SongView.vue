<script setup>
import { computed, defineAsyncComponent } from 'vue';
import songs_map from '@/songs_map.json';

const props = defineProps({
  id: String,
});

const song = computed(() => songs_map[props.id]);

const lyricModules = import.meta.glob('@/data/lyrics/*.vue');

const LyricsComponent = computed(() => {
  const path = `/src/data/lyrics/${props.id}.vue`;
  return lyricModules[path]
    ? defineAsyncComponent(lyricModules[path])
    : null;
});
</script>

<template>
  <div v-if="song">
    <h2 class="section-header">{{ song.title }}</h2>
    <section class="content-section">
        <div class="lyrics-meta">
            <div class="lyrics-meta-item">
                <strong class="lyrics-meta-title">Tom</strong>
                <span id="song-tone" class="lyrics-meta-subtitle chord-style">{{ song.tone }}</span>
            </div>
            <div class="lyrics-meta-item">
                <strong class="lyrics-meta-title">Momento</strong>
                <span id="song-moment" class="lyrics-meta-subtitle normal-text">{{ song.moment }}</span>
            </div>
        </div>

        <div class="lyrics">
        <component :is="LyricsComponent" v-if="LyricsComponent" />
        <p v-else>Letra não disponível.</p>
        </div>
    </section>
  </div>
</template>