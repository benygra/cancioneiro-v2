import { ref } from 'vue'

const cart = ref(new Map())

export function useCart() {
  function addToCart(id, song) {
    if (!cart.value.has(id)) {
      cart.value.set(id, {...song });
      console.log("Added " + id);
    }
  }

  function removeFromCart(id) {
        cart.value.delete(id);
  }

  return { cart, addToCart, removeFromCart };
}