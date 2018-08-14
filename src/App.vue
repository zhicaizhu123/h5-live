<style lang="scss">
#app {
  height: 100%;
}
.app-main {
  height: 100%;
}
</style>

<template>
  <div id="app">
    <div class="app-main">
      <router-view></router-view>
    </div>
    <orientation-mask v-if="isHorizontalScreen"></orientation-mask>
  </div>
</template>

<script>
import OrientationMask from '@/components/common/mask'
import { isMatchPath } from '@/utils'

export default {
  name: 'App',
  components: {
    OrientationMask,
  },
  data() {
    return {
      isHorizontalScreen: false,
      hideHeaderList: [this.$root.path.site.login, this.$root.path.site.notFound, this.$root.path.site.authPage],
    }
  },
  computed: {
    hideHeader() {
      return isMatchPath(this.$route.path, this.hideHeaderList)
    },
  },
  mounted() {
    this.orientationChange()
    this.bindEvent()
  },
  methods: {
    orientationChange() {
      const { orientation } = window
      switch (orientation) {
        case 90:
        case -90:
          this.isHorizontalScreen = true
          break
        default:
          this.isHorizontalScreen = false
          break
      }
    },
    bindEvent() {
      // window.addEventListener('resize', this.resizeHandle.bind(this), false)
      window.addEventListener('orientationchange', this.orientationChange.bind(this), false)
    },
  },
}
</script>
