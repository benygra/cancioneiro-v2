<script setup>

import { ref } from 'vue';
import draggable from 'vuedraggable';
import { PDFDocument } from 'pdf-lib';

import CartListing from './CartListing.vue';

import { useCart } from '@/composables/useCart';

const { cart, removeFromCart, clearAll } = useCart();

const isOpen = ref(false); // reference to the cart panel being opened or not.

/**
 * Toggles the cart panel by interacting with the proper button.
 */
const toggleCart = () => isOpen.value = !isOpen.value;

async function downloadPdf(pdfBytes, filename) {
  const blob = new Blob([pdfBytes], { type: 'application/pdf' });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);
}

async function fetchPDF(url) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch PDF: ${response.statusText}`);
  }
  const arrayBuffer = await response.arrayBuffer();
  return new Uint8Array(arrayBuffer);
}

/**
 * Merge the pdfs selected by the user in the cart.
 * For some reason, if any of the songs is not available via pdf, it skips it.
 */
async function mergePDFs () {
  if (cart.value.length === 0) {
    alert('Não selecionou nenhuma música para concatenar.');
    return;
  }

  const pdfDoc = await PDFDocument.create();

  for (const { id } of cart.value) {
    try {
      const url = `/data/pdf/${id}.pdf`;
      const pdfBytes = await fetchPDF(url);
      const pdf = await PDFDocument.load(pdfBytes);
      const copiedPages = await pdfDoc.copyPages(pdf, pdf.getPageIndices());
      copiedPages.forEach(page => pdfDoc.addPage(page));

    } catch (err) {
      console.warn(`Skipping id "${id}": invalid PDF`, err.message);
    }
  }

  if (pdfDoc.getPageCount() === 0) {
    alert('Nenhuma música que selecionou tem letra disponível.');
    return;
  }
  
  const mergedPdfBytes = await pdfDoc.save();
  downloadPdf(mergedPdfBytes, 'merged.pdf');
}

function confirmClearAll() {
  if (confirm('Tem a certeza que quer remover todas as músicas do carrinho?')) {
    clearAll();
  }
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
      <li class="merge-item">
        <div class="cart-menu">
          <img 
            class="pdf-merge-icon" 
            src="@/assets/img/pdfs-merge.png" 
            alt="pdfs-merge"
            @click="mergePDFs"
          >
          <img 
            class="clean-icon" 
            src="@/assets/img/mr-clean.png" 
            alt="CLEAR ALL"
            @click="confirmClearAll"
          >
        </div>
      </li>
    </ul>

    <draggable
      v-model="cart"
      item-key="id"
      tag="ul"
      class="cart-list"
      handle=".drag-handle"
      animation="150"
    >
      <template #item="{ element }">
          <CartListing
            :id="element.id"
            :song="element.song"
          />
      </template>
    </draggable>
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
  border-color: var(--default-bg-color);
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
  background-color: var(--default-bg-color);
  border-radius: 5px;
  z-index: 1001;
}

.cart-list {
  display: flex;
  flex-direction: column;
}

.merge-item {
  display: flex;
  justify-content: center;
  align-items: center;
  border-bottom: 1px solid rgba(255, 255, 255, .3);
}

.cart-menu {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
}

.pdf-merge-icon {
  width: 110px;
  margin: 0.6em;
}

.clean-icon {
  width: 60px;
  margin: 0.6em;
}

.pdf-merge-icon:hover {
  transform: scale(1.05);
  cursor: pointer;
}

.clean-icon:hover {
  transform: scale(1.1);
  cursor: pointer;
}

</style>