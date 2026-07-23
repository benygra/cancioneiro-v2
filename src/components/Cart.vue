<script setup>
import { ref } from 'vue'

import CartListing from './CartListing.vue'
import { useCart } from '@/composables/useCart'

const { cart, removeFromCart } = useCart()

const isOpen = ref(false)

const toggleCart = () => isOpen.value = !isOpen.value;

</script>

<template>
  <button
    class="cart-button"
    @click="toggleCart"
  >
    <img class="cart-icon" src="@/assets/img/cart.png" alt="car">
  </button>

  <Teleport to="body">
    <Transition name="cart">
      <div v-if="isOpen" class="cart-panel">
        <ul id="cart-list" class="cart-list">
          <li class="merge"><img src="@/assets/img/pdfs-merge.png" alt="pdfs-merge" class="pdf-merge-icon"></li>
          <CartListing
            v-for="[id, song] in cart"
            :key="id"
            :song="song"
            @remove="removeFromCart(id)"
          />
        </ul>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.cart-button {
  position: fixed;
  left: 20px;
  bottom: 20px;

  width: 64px;
  height: 64px;
  border-radius: 50%;

  z-index: 1000;
}

.cart-panel {
  position: fixed;
  left: 20px;
  bottom: 95px;

  width: min(320px, calc(100vw - 40px));
  max-height: 70vh;

  overflow: auto;

  z-index: 1001;

  background-color: var(--cart-bg-color);
  border-radius: 5px;
}

.pdf-merge-icon {
  width: 100px;
  padding: 6px;
}

.pdf-merge-icon:hover {
  transform: scale(1.1);
  cursor: pointer;
}

.cart-list {
  display: flex;
  flex-direction: column;
}

.merge {
  display: flex;
  justify-content: center;
  align-items: center;
}

@media (max-width: 768px) {
.pdf-merge-icon {
  width: 150px;
  padding: 6px;
}
}

</style>