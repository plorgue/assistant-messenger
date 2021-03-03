<template>
  <div>
    <h3>{{ `${titre} (${nombre}):` }}</h3>
    <p>{{ `Envoyé par ${auteur} le ${quand}` }}</p>
    <p>{{ contenu }}</p>
  </div>
</template>

<script>
export default {
  props: {
    titre: String,
    auteur: String,
    quand: String,
    contenu: String,
    nombre: Number,
  },
};
</script>

<style scoped></style>
