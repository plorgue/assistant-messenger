<template>
  <div id="nav">
    <router-view />
  </div>
</template>

<style>
h2 {
  padding: 20px 0 0 20px;
  margin: 0;
}
.box {
  background-color: #eeeeee;
  border-radius: 5px;
  padding-bottom: 30px;
}
.flex-horizontal {
  display: flex;
  flex-direction: row;
  justify-content: space-around;
}
.rounded-input {
  height: fit-content;
  padding: 10px;
  margin-top: 20px;
  margin-left: 16px;
  border-radius: 15px;
  border: 1px solid #222;
  outline: 0;
  font-size: 14px;
  color: #505a50;
  background-color: whitesmoke;
}
.select-container {
  display: flex;
  flex-direction: row;
  align-items: baseline;
}
</style>
