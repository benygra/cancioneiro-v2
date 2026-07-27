import { ref, computed } from 'vue'

import songs_map from '@/assets/songs_map.json';

/**
 * Represents the cart being built by the user.
 * It's an array of objects {id, song} where song is composed of: title, moment and tone
 * (it's a mapping of id -> song from the JSON file).
 */
const cart = ref([]);

/**
 * This composable exposes an API to add and remove items from the cart.
 */
export function useCart() {

  /**
   * Adds a new item to the cart based of the provided id of the song.
   * If it is already present in the cart, doesn't add a duplicate!
   * If the song is not present in the project, it also doesn't add it
   * (besides this situation being much rarer).
   * @param {String} id the id of the song in the project.
   */
  function addToCart(id) {
    const exists = cart.value.some(item => item.id === id);
    if (exists) return;

    const song = computed(() => songs_map[id]);
    if (!song) return;

    cart.value.push({ id, song });
  }

  /**
   * Tries to remove the entry with the given id.
   * If it is not present, doesn't do anything.
   * @param {String} id 
   */
  function removeFromCart(id) {
    const idx = cart.value.findIndex(item => item.id === id);
    if (idx !== -1) {
      cart.value.splice(idx, 1);
    }
  }

  return { cart, addToCart, removeFromCart };
}