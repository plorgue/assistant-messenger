<template>
  <div>
    <button
      :class="
        (isSelected ? 'selected ' : '').concat(size === 's' ? 'small' : '')
      "
    >
      {{ content }}
    </button>
  </div>
</template>

<script>
export default {
  props: {
    content: String,
    isSelected: Boolean,
    size: String,
  },
};
</script>

<style scoped>
button {
  font-family: Arial, Helvetica, sans-serif;
  font-size: 18px;
  font-weight: bold;
  border: 2.5px solid #333;
  border-radius: 15px;
  padding: 15px 10px;
  width: 160px;
  color: #505a50;
  background-color: whitesmoke;
  margin: 20px 0 0 0;
}
button:hover {
  background-color: #eeeeee;
  cursor: pointer;
}
button:focus {
  outline: 0;
}
.selected {
  color: whitesmoke;
  background-color: #505a50;
  border-color: #505a50;
}
button.selected:hover {
  background-color: #555f55;
  border-color: #555f55;
}
button.small {
  border-width: 1px;
  font-size: 14px;
  width: auto;
  padding-top: 10px;
  padding-bottom: 10px;
}
</style>
