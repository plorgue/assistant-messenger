<template>
  <div>
    <h4>{{ `${titre} (${nombre}):` }}</h4>
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

<style scoped>
h4 {
  margin-bottom: 12px;
}
p {
  font-size: 14px;
  margin: 10px 16px 0 0;
}
</style>
