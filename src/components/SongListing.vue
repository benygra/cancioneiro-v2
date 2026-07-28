<script setup>
import { useCart } from '@/composables/useCart';
import { useToast } from 'vue-toastification';

const { addToCart } = useCart();
const toast = useToast();

const props = defineProps({
  song: Object,
  id: String,
});

function handleAdd() {
  addToCart(props.id);
  toast.success(`Adicionando ${props.song.title} ao carrinho!`);
}

</script>

<template>
  <tr>
    <td><a target="_blank" :href="`/songs/${id}`">{{ song.title }}</a></td>
    <td>{{ song.moment }}</td>
    <td>{{ song.tone }}</td>
    <td><button class="btn" @click="handleAdd">+</button></td>
  </tr>
</template>

<style scoped>

.songs-table td {
  padding: 0.7em;
  border-bottom: 1px solid var(--default-bg-color);
}

.songs-table td a {
  text-decoration: none;
}

.songs-table td a:hover {
  text-decoration: underline;
}

.songs-table td:last-child {
  text-align: center;
}

.btn {
  display: inline-block;
  padding: 0.3em 0.63em;
  background-color: var(--default-bg-color);
  color: white;
  text-decoration: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1.1em;
}

.btn:hover {
  background-color: rgba(123, 98, 30, 0.8);
}

@media (max-width: 768px) {
  .songs-table td {
      padding: 0.9em;
      font-size: 0.9em;
  }
}

</style>
