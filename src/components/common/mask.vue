<style lang="scss" scoped>
.orientation-mask {
  position: fixed;
  left: 0;
  top: 0;
  bottom: 0;
  right: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #fff;
  font-size: .24rem;
  background-image: linear-gradient(to bottom, #00cf80, #00c278);
  z-index: 9999;
}
</style>

<template>
<div class="orientation-mask">
  <span>请使用竖屏浏览页面</span>
</div>
</template>

<script>
export default {
  data() {
    return {

    }
  },
}
</script>
