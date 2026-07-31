<script setup>

import { ref, computed } from 'vue';

import { useToneTranslator } from '@/composables/useToneTranslator';

const { getScale, transpose } = useToneTranslator();

const useFlat = ref(false);

const toggleChromatic = () => useFlat.value = !useFlat.value;

const buttonLabel = computed(() => useFlat.value ? '♭' : '♯');

defineProps({
    song: Object,
});

</script>

<template>
    <ul class="tones">
        <li class="item" v-for="tone in getScale(useFlat)" @click="console.log(tone)">{{ tone }}</li>
    </ul>

    <button class="chromatic-btn" @click="toggleChromatic">{{ buttonLabel }}</button>
    <button class="chromatic-btn" @click="">+</button>
    <button class="chromatic-btn" @click="">-</button>
</template>

<style scoped>

.tones {
  display: flex;
  list-style-type: none;
}

.item {
    padding: 0 1em;
    cursor: pointer;
}

.item:hover {
    color: red;
}

.chromatic-btn {
    padding: 0.1em;
    font-size: 1.4em;
}

</style>