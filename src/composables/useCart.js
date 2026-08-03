import { ref, watch } from 'vue'

import songs_map from '@/assets/songs_map.json';

const STORAGE_KEY = 'cart:v2';

/**
 * Tries to load the cart from the browser's local storage by the specified storage key.
 * If there is no such mapping to the key, or any error occurs, an empty cart is returned.
 * It also discards any deprecated song upon loading.
 */
function loadCart() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];

    const ids = JSON.parse(raw);
    if (!Array.isArray(ids)) return [];

    return ids
      .filter(id => songs_map[id])
      .map(id => ({ id, song: songs_map[id] }));

  } catch (err) {
    return [];
  }
}

/**
 * Represents the cart being built by the user.
 * It's an array of objects {id, song} where song is composed of: title, moment and tone
 * (it's a mapping of id -> song from the JSON file).
 */
const cart = ref(loadCart());

/**
 * Persists the cart into the browser local storage under the specified storage key.
 * It only stores the ids to save space.
 */
function saveCart() {
  const ids = cart.value.map(item => item.id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
}

/**
 * Watches any update on the cart,
 * to persist the information on browser local storage.
 */
watch(cart, saveCart, { deep: true });

// /**
//  * Warns the user if any modification to the browser's tab (close/refresh)
//  * affects the non-empty cart being built.
//  */
// window.addEventListener('beforeunload', (e) => {
//   if (cart.value.length > 0) {
//     e.preventDefault();
//   }
// });

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

    const song = songs_map[id];
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

  /**
   * Clears the cart entirely!
   */
  function clearAll() {
    cart.value = [];
  }

  return { cart, addToCart, removeFromCart, clearAll };
}