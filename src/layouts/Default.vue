<template>
  <div class="main">
    <div class="row">
      <div class="col col-12">
        <header class="header">
          <router-link to="/todos" class="default-link logo"><b>notes</b>app</router-link>
        </header>
        <button 
          class="default-btn btn-menu"
          v-if="isMobile" 
          @click="toggleMenu">
          ⭕
        </button>
      </div>
    </div>
    <div class="container">
      <div class="row">
        <div class="col col-3">
          <Sidebar :visible="dialog" />
        </div>
        <div class="col col-8">
          <slot />
        </div>
      </div>
    </div>
    <div>
    </div>
  </div>
</template>

<script>
import { isMobile } from '@/helpers/checkIsMobile'

export default {
  components: {
    Sidebar: () => import('@/components/UI/Sidebar')
  },
  data() {
    return {
      windowWidth: 0,
      dialog: false
    }
  },
  methods: {
    handleResize() {
      this.windowWidth = window.innerWidth;
    },
    toggleMenu(status) {
      this.dialog = !this.dialog
    }
  },
  computed: {
    isMobile
  },
  watch: {
    '$route.path': function(value) {
      if (value) {
        this.dialog = false
      }
    }
  },
  created() {
    window.addEventListener('resize', this.handleResize)
    this.handleResize()
  },
  destroyed() {
    window.removeEventListener('resize', this.handleResize)
  }
}
</script>

<style lang="scss" scoped>
.header {
  padding: 16px;
  letter-spacing: 1.2rem;
  height: 54px;
  border-bottom: 1px solid #ccc;
}

.logo {
  color: #333;
}

.btn-menu {
  position: absolute;
  top: 9px;
  left: 9px;
  border: 0;
}

@media (max-width: 480px) {
  .header {
    text-align: center;
  }
}

@media (min-width: 768px) {
  .header {
    text-align: left;
  }
}
</style>

