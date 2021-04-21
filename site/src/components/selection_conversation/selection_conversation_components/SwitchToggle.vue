<template>
  <div class="container">
    <label class="switch">
      <input type="checkbox" @change="checkChange" v-model="isCheck" />
      <span class="slider round"></span>
      <span class="title">{{ title }}</span>
    </label>
  </div>
</template>

<script>
export default {
  props: {
    title: String,
  },
  methods: {
    checkChange() {
      this.$emit("checked", isCheck);
    },
  },
  data() {
    return {
      isCheck: false,
    };
  },
};
</script>

<style scoped>
* {
  --check-primary-color: #616b61;
  --check-secondary-color: #b1c7b1;
  --uncheck-primary-color: #bbb;
  --uncheck-secondary-color: #fff;
}
.container {
  padding: 4px;
}
.switch {
  position: relative;
  cursor: pointer;
}
.switch input {
  opacity: 0;
  width: 0;
  height: 0;
}
.slider {
  position: absolute;
  width: 42px;
  height: 13px;
  background-color: var(--uncheck-secondary-color);
  border-radius: 15px;
  box-shadow: 1px 1px 3px #aaa;
  margin-top: 1px;
}
.slider::before {
  position: absolute;
  content: "";
  height: 22px;
  width: 22px;
  background-color: var(--uncheck-primary-color);
  border-radius: 50%;
  margin-top: -5px;
  box-shadow: 1px 1px 3px #888;
  transition: 0.4s;
}
.switch input:checked + .slider::before {
  transform: translateX(20px);
  background-color: var(--check-primary-color);
}
.switch input:checked + .slider {
  background-color: var(--check-secondary-color);
}
.switch input:hover + .slider::before {
  box-shadow: 1px 1px 3px #aaa;
  opacity: 0.9;
}
.title {
  margin-left: 60px;
  font-size: 0.95rem;
}
</style>
