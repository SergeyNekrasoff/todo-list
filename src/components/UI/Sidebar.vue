<template>
  <div :class="[
    'notes', 
    { 'notes--mobile': isMobile },
    { 'notes--mobile--on': visible }]">
    <div v-if="loading" class="loading">Loading...</div>
    <ul 
      :class="['notes-list', { 'smooth': loading }]" 
      v-if="storageNotes.length">
      <li 
        class="notes-list__item"
        v-for="note in storageNotes" 
        :key="note.id">
        <router-link 
          class="default-link"
          :to="{ name: 'Todo', params: { id: note.id } }">
          {{ note.title }}
        </router-link>
        <span 
          class="icon">
          <router-link 
          class="default-link"
          :to="{ name: 'Todo', params: { id: note.id } }">
            <span class="icon">✏️</span>
          </router-link> 
        </span>
        <span 
          class="icon"
          @click.stop="toggleModal({
            status: true,
            node: note
          })">
          🗑️
        </span>
        <ul class="todos-list">
          <li 
            class="todos-list__item"
            v-for="(todo, index) in note.todos" 
            :key="todo.id">
            <div v-if="index <= 2">
              {{ todo.title }}
            </div>
          </li>
        </ul>
      </li>
      <li class="notes-list__item">
        <router-link 
          to="/create"
          class="default-link btn-create">
          <span class="icon">➕</span>
        </router-link> 
      </li>
    </ul>
    <div v-else>
      <p class="second-text">
        Your list is empty
      </p>
      <router-link 
        to="/create"
        class="default-link btn-create">
        <span class="icon">➕</span>
      </router-link>
    </div>

    <modal
      v-if="dialog"
      :item="note"
      @cancel="(status) => dialog = status"
      @delete="del">
      <p>Do you really want to delete <b>{{ note.title }}</b>?</p> 
    </modal>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import { v4 as uuidv4 } from 'uuid'
import { isMobile } from '@/helpers/checkIsMobile'
const Modal = () => import('@/components/UI/Modal')

export default {
  components: {
    Modal
  },
  props: {
    visible: {
      type: Boolean,
      required: false
    }
  },
  data() {
    return {
      windowWidth: 0,
      dialog: false,
      note: null,
      loading: false,
      storageNotes: []
    }
  },
  methods: {
    handleResize() {
      this.windowWidth = window.innerWidth;
    },
    toggleModal(data) {
      this.dialog = data.status
      this.note = data.node
    },
    async del(id) {
      this.loading = true
      const response = await this.delNote(id)

      if (response.status === 200) {
        this.loading = false
      }
    },
    ...mapActions(['delNote'])
  },
  computed: {
    ...mapGetters({
      notes: 'getNotes'
    }),
    isMobile
  },
  watch: {
    notes(value) {
      this.storageNotes = value
    }
  },
  mounted() {
    if (localStorage.getItem('notes')) {
      try {
        const notes = JSON.parse(localStorage.getItem('notes'))
        this.storageNotes = notes
        this.$store.commit('SET_NOTES', notes)
      } catch(e) {
        localStorage.removeItem('notes')
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
.notes {
  border-right: 4px solid #fbfbfb;
  padding-top: 20px;
  width: 300px;
  height: 100vh;
  padding-top: 40px;
  position: relative;

  &--mobile {
    display: none;

    &--on {
      display: block;
    }
  }
}

.notes-list {
  &__item {
    margin-bottom: 16px;
  }

  &.smooth {
    opacity: .3;
  }
}

.todos-list {
  &__item {
    position: relative;
    padding: 0 0 0 4px;

    &:last-child::before {
      content: '';
      position: absolute;
      bottom: -3px;
      left: 0;
      right: 0;
      height: 20px;
      background: -webkit-radial-gradient(top, ellipse cover, transparent 0%, #FFF 99%);
      z-index: 1;
    }
  }
}

.btn-create {
  display: block;
  margin-top: 24px;
  width: 24px;
  height: 24px;
  text-align: center;
  line-height: 24px;
  cursor: pointer;

  &:hover {
    background: lime;
  }
}

@media (max-width: 767px) {
  .notes {
    background: #fff;
    position: absolute;
    top: 40px;
    width: 100%;
    height: auto;
    padding-left: 16px;
    padding-right: 16px;
    padding-bottom: 20px;
    box-shadow: 1px 8px 7px #ddd;
    z-index: 1;
  }
}

@media (min-width: 768px) {
  .notes {
    position: relative;
    top: 0;
    width: 300px;
    height: 100vh;
    padding-left: 0;
    padding-right: 0;
    padding-bottom: 0;
    box-shadow: transparent;
  }
}


</style>