<script setup>
import { ref } from 'vue'
import { PDFDocument } from 'pdf-lib'

import CartListing from './CartListing.vue'
import { useCart } from '@/composables/useCart'

const { cart, removeFromCart } = useCart()

const isOpen = ref(false)

const toggleCart = () => isOpen.value = !isOpen.value;

async function downloadPdf(pdfBytes, filename) {
  const blob = new Blob([pdfBytes], { type: 'application/pdf' });
  const link = document.createElement('a');
  link.href = window.URL.createObjectURL(blob);
  link.download = filename;
  link.click();
}

async function fetchPDF(url) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch PDF: ${response.statusText}`);
  }
  const arrayBuffer = await response.arrayBuffer();
  return new Uint8Array(arrayBuffer);
}

async function mergePDFs () {
  const pdfDoc = await PDFDocument.create();

  for (const id of cart.value.keys()) {
    const url = '/data/pdf/' + id + ".pdf";
    const pdfBytes = await fetchPDF(url);
    const pdf = await PDFDocument.load(pdfBytes);
    const copiedPages = await pdfDoc.copyPages(pdf, pdf.getPageIndices());
    copiedPages.forEach(page => pdfDoc.addPage(page));
  }
  
  const mergedPdfBytes = await pdfDoc.save();
  downloadPdf(mergedPdfBytes, 'merged.pdf');
}

</script>

<template>
  <button
    class="cart-button"
    @click="toggleCart"
  >
    <img class="cart-icon" src="@/assets/img/cart.png" alt="car">
  </button>


  <div v-if="isOpen" class="cart-panel">
    <ul class="cart-list">
      <li class="merge-item" @click="mergePDFs">
        <img 
          class="pdf-merge-icon" 
          src="@/assets/img/pdfs-merge.png" 
          alt="pdfs-merge"
        >
      </li>
      <CartListing
        v-for="[id, song] in cart"
        :key="id"
        :song="song"
        @remove="removeFromCart(id)"
      />
    </ul>
  </div>

</template>

<style scoped>

.cart-button {
  position: fixed;
  left: 20px;
  bottom: 20px;

  width: 4.8em;
  height: 4.8em;
  border-radius: 50%;
  border-color: var(--cart-bg-color);
  z-index: 1000;
}

.cart-icon {
  display: inline-block;
  width: 4.3em;
  height: 4.3em;
  background-size: cover;
  vertical-align: middle;
  cursor: pointer;
}

.cart-panel {
  position: fixed;
  left: 20px;
  bottom: 95px;

  width: min(320px, calc(100vw - 40px));
  max-height: 45vh;
  overflow: auto;
  background-color: var(--cart-bg-color);
  border-radius: 5px;
  z-index: 1001;
}

.pdf-merge-icon {
  width: 110px;
  margin: 0.6em;
}

.pdf-merge-icon:hover {
  transform: scale(1.05);
  cursor: pointer;
}

.cart-list {
  display: flex;
  flex-direction: column;
}

.merge-item {
  display: flex;
  justify-content: center;
  align-items: center;
}

</style>