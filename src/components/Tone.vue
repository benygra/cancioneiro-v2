<script setup>

import { useToneTranslator } from '@/composables/useToneTranslator';

const { toCode } = useToneTranslator();

const tones = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];

defineProps({
    song: Object,
});

</script>

<template>
    <ul class="tones">
        <li class="item" v-for="tone in tones">{{ toCode(tone).toString(16) }}</li>
    </ul>
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

</style>