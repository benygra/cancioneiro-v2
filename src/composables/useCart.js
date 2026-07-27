import { ref, computed } from 'vue'

import songs_map from '@/assets/songs_map.json';

const cart = ref([]);

export function useCart() {
  function addToCart(id) {
    const exists = cart.value.some(item => item.id === id);
    if (exists) return;

    const song = computed(() => songs_map[id]);
    cart.value.push({ id, song });
  }

  function removeFromCart(id) {
    const idx = cart.value.findIndex(item => item.id === id);
    if (idx !== -1) {
      cart.value.splice(idx, 1);
    }
  }

  return { cart, addToCart, removeFromCart };
}