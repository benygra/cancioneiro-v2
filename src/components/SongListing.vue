<script setup>
import { defineProps } from 'vue';

import { useCart } from '@/composables/useCart'

const { addToCart } = useCart();

defineProps({
  song: Object,
  id: String,
});
</script>

<template>
  <tr>
    <td><a target="_blank" :href="`/songs/${id}`">{{ song.title }}</a></td>
    <td>{{ song.moment }}</td>
    <td>{{ song.tone }}</td>
    <td><button class="btn" @click="addToCart(id, song)">+</button></td>
  </tr>
</template>
