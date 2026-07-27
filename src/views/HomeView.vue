<template>
  <section class="content-section">
    <h2 class="section-header">INÍCIO</h2>
    <img class="beny-guitar-image" src="@/assets/img/beny.jpg" alt="beny-guitar">
    <p>Este é o cancioneiro utilizado por Bernardo Gracioso para a animação das eucaristias</p>
    <p>Para ver a lista de cânticos, clique no link acima.</p>
    <p>Para sugestões ou correções, por favor contacte-me através do email: <a
        href="mailto:bernardo.gracioso@gmail.com">bernardo.gracioso@gmail.com</a></p>
    <p>Este cancioneiro é uma obra em progresso, e será atualizado com novos cânticos regularmente.</p>
    <p>Obrigado por visitar!</p>
  </section>
</template>

<style scoped>

.beny-guitar-image {
  float: left;
  width: 40%;
  margin-right: 0.95em;
  border-radius: 2%;
}

.content-section p {
  margin: 1.5em 0;
}

.content-section a {
  text-decoration: none;
}

.content-section a:hover {
  text-decoration: underline;
}

/* Mobile responsiveness */
@media (max-width: 768px) {
  .beny-guitar-image {
    display: block;
    float: none;
    width: 74%;
    max-width: 74%;
    margin: 0 auto 0.9em auto;
  }
}

</style>
