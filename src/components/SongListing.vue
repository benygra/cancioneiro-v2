<script setup>
import { defineProps } from 'vue';

defineProps({
  song: Object,
  id: String,
});
</script>

<template>
  <tr>
    <td><a target="_blank" :href="`/list_songs/${id}`">{{ song.title }}</a></td>
    <td>{{ song.moment }}</td>
    <td>{{ song.tone }}</td>
    <td>{{ song.add }}</td>
  </tr>
</template>
