<template>
  <div>
    <div v-if="loading" class="loading">Loading...</div>
    <div 
      :class="['edit-note', { 'smooth': loading }]" 
      v-if="typeof note === 'object' && Object.keys(note).length">

      <div 
        class="edit-note__group">
        <div class="row columns">
          <h2 class="title">Editing note: {{ noteTitle }}</h2>
          <div class="col col-6">
            <input 
              v-model="noteTitle"
              type="text" 
              class="input"
              placeholder="Type note name...">
          </div>
          <div class="col col-8">
            <ul class="todos-list" v-if="note.todos.length">
              <li 
                class="todos-list__li"
                v-for="todo in note.todos" 
                :key="todo.id">
                <input 
                  class="input--checkbox"
                  type="checkbox"
                  :checked="todo.completed"
                  @change="setStatusTodo(todo.id)">
                <input 
                  class="input"
                  type="text" 
                  placeholder="Type new task..."
                  :value="todo.title"
                  @keyup="setTodo({ 
                    id: todo.id, 
                    value: $event.target.value 
                  })">
                <span 
                  class="icon"
                  @click.stop="toggleTodo({
                    status: true,
                    node: todo
                  })">
                  🗑️
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div 
        class="create-note__group">
        <div class="row columns">
          <div class="col col-6">
            <button
              type="button"
              class="default-btn btn-create"
              @click="addTodo">
              <span class="icon">➕</span>
              New task
            </button>
          </div>
        </div>
      </div>

      <div 
        class="edit-note__group">
        <div class="row row--mobile-row start">
          <button 
            :class="['default-btn', 'btn-control', 'btn-update',
                      {'btn-control--mobile': isMobile}]" 
            type="button"
            :disabled="loading"
            @click="save">
            Save
          </button>
          <button 
            :class="['default-btn', 'btn-control', 'btn-del',
                      {'btn-control--mobile': isMobile}]" 
            type="button"
            :disabled="loading"
            @click="toggleNote({
              status: true,
              node: note
            })">
            Delete
          </button>
          <button 
            :class="['default-btn', 'btn-control', 'btn-redo',
                      {'btn-control--mobile': isMobile}]" 
            type="button"
            :disabled="loading"
            @click="handleRedo">
            ↪ Redo
          </button>
          <button 
            :class="['default-btn', 'btn-control', 'btn-undo',
                      {'btn-control--mobile': isMobile}]"
            type="button"
            :disabled="loading"
            @click="handleUndo">
            ↩ Undo
          </button>
        </div>
      </div>

      <modal
        v-if="dialogTodo"
        :item="currentTodo"
        @cancel="(status) => dialogTodo = status"
        @delete="delTodo">
        <p>Do you really want to delete <b>{{ currentTodo.title }}</b>?</p> 
      </modal>

      <modal
        v-if="dialogNote"
        :item="currentNote"
        @cancel="(status) => dialogNote = status"
        @delete="del">
        <p>Do you really want to delete <b>{{ noteTitle }}</b>?</p> 
      </modal>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import { undoRedoHistory } from '@/plugins/undoRedoPlugin'
import { isMobile } from '@/helpers/checkIsMobile'
import { v4 as uuidv4 } from 'uuid'
const Modal = () => import('@/components/UI/Modal')

export default {
  components: { Modal },
  data() {
    return {
      windowWidth: 0,
      dialogTodo: false,
      dialogNote: false,
      currentTodo: null,
      currentNote: null,
      noteTitle: null,
      loading: false
    }
  },
  methods: {
    handleResize() {
      this.windowWidth = window.innerWidth;
    },
    addTodo() {
      this.$store.commit('ADD_TODO', {
        nid: this.note.id,
        tid: uuidv4(),
        title: 'default',
        completed: false
      })
    },
    setStatusTodo(id) {
      this.$store.commit('SET_STATUS_TODO', {
        nid: this.note.id,
        tid: id
      })
    },
    setTodo(data) {
      this.$store.commit('SET_TODO', {
        nid: this.note.id,
        tid: data.id,
        title: data.value
      })
    },
    delTodo(id) {
      this.$store.commit('DEL_TODO', {
        nid: this.note.id,
        tid: id
      })
    },
    toggleTodo(data) {
      this.dialogTodo = data.status
      this.currentTodo = data.node
    },
    toggleNote(data) {
      this.dialogNote = data.status
      this.currentNote = data.node
    },
    async save() {
      this.loading = true
      const response = await this.updateNote({
        id: this.note.id,
        title: this.noteTitle
      })

      if (response.status === 200) {
        this.loading = false
        this.$router.push({ path: '/todos' })
      }
    },
    async del(id) {
      this.loading = true
      const response = await this.delNote(id)

      if (response.status === 200) {
        this.$router.push({ name: 'Todos' })
        this.loading = false
      }
    },
    handleUndo() {
      undoRedoHistory.undo()
    },
    handleRedo() {
      undoRedoHistory.redo()
    },
    ...mapActions([
      'updateNote', 
      'delNote'
    ])
  },
  computed: {
    note() {
      return this.notes.find(item => {
        if (item.id === this.$route.params.id) {
          this.noteTitle = item.title
          return item
        }
      })
    },
    isMobile,
    ...mapGetters({
      notes: 'getNotes'
    })
  },
  mounted() {
    if (localStorage.getItem('notes')) {
      try {
        const notes = JSON.parse(localStorage.getItem('notes'))
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
.edit-note {
  max-width: 640px;
  min-width: 320px;
  padding-top: 20px;
  position: relative;
  padding-left: 20px;
  overflow: hidden;

  &__group {
    margin-bottom: 40px;

    &:first-child {
      margin-bottom: 16px;
    }

    &:last-child {
      border-top: 1px solid #ccc;
      padding-top: 20px;
    }
  }

  .title {
    font-size: 20px;
    color: #333;
    height: 24px;
    margin-bottom: 12px;
  }

  &.smooth {
    opacity: .3;
  }
}

.todos-list {
  &__li {
    padding: 8px;
    margin-bottom: 12px;

    .input {
      margin-bottom: 0;
    }
  }
}

.btn-create {
  border: 0;
  display: block;
  width: 100%;
  height: 24px;
  text-align: left;
  line-height: 24px;
  padding: 0;

  &:hover {
    background: lime;
  }
}

.btn-control {
  border: 0;
  width: 120px;
  margin-right: 12px;

  &[disabled] {
    background: #ddd;
    color: #f7f7f7;
    cursor: not-allowed;

    &:hover {
      background: #ddd;
    }
  }

  &--mobile {
    width: 20%;
  }

  &.btn-update {
    background: #35eac9;
  }
  &.btn-del {
    background: tomato;
  }
  &.btn-undo {
    background: #7d7dda;
  }
  &.btn-redo {
    background: #7d7dda;
  }
}

@media (max-width: 767px) {
  .edit-note {
    padding: 20px 16px;
  }
}

@media (min-width: 768px) {
  .edit-note {
    padding: 20px 0 0 20px;
  }
}
</style>