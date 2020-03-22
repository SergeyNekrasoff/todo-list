<template>
  <div>
    <div v-if="loading" class="loading">Loading...</div>
    <div :class="['create-note', { 'smooth': loading }]">
      <div 
        class="create-note__group">
        <div class="row columns">
          <h2 class="title">{{ title }}</h2>
          <div class="col col-6">
            <input 
              type="text" 
              class="input"
              v-model="title" 
              placeholder="Type note name...">
          </div>
          <div class="col col-8">
            <ul class="todos-list" v-if="todos.length">
              <li 
                class="todos-list__li"
                v-for="todo in todos" 
                :key="todo.id">
                <input 
                  class="input--checkbox"
                  type="checkbox"
                  :checked="todo.completed"
                  @change="setStatus(todo.id)">
                <input 
                  class="input"
                  type="text" 
                  placeholder="Type new task..."
                  @keyup="setTodo({ 
                    id: todo.id, 
                    value: $event.target.value 
                  })">
                <span 
                  class="icon"
                  @click.stop="toggleModal({
                    status: true,
                    todo: todo
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
        class="create-note__group">
        <div class="row columns">
          <button 
            class="default-btn btn-save" 
            type="button"
            :disabled="!title || !todos.length || loading"
            @click="save">Save</button>
        </div>
      </div>
  </div>

    <modal
      v-if="dialog"
      :item="currentTodo"
      @cancel="(status) => dialog = status"
      @delete="delTodo">
      <p>Do you really want to delete <b>{{ currentTodo.title }}</b>?</p> 
    </modal>
  </div>
</template>

<script>
import { v4 as uuidv4 } from 'uuid'
import { mapActions } from 'vuex'
const Modal = () => import('@/components/UI/Modal')

export default {
  components: { Modal },
  data() {
    return {
      dialog: false,
      title: null,
      todos: [],
      currentTodo: null,
      loading: false
    }
  },
  methods: {
    addTodo() {
      this.todos.push({ 
        id: uuidv4(),
        title: 'default',
        completed: false
      })
    },
    setStatus(id) {
      const todo = this.todos.find(item => item.id === id)
      todo.completed = !todo.completed
    },
    setTodo(data) {
      const todo = this.todos.find(item => item.id === data.id)
      todo.title = data.value
    },
    toggleModal(data) {
      this.dialog = data.status
      this.currentTodo = data.todo
    },
    delTodo(id) {
      this.todos.splice(this.todos.findIndex(i => i.id === id), 1)
    },
    async save() {
      this.loading = true
      const id = uuidv4()

      const response = await this.createNote({
        id: id,
        title: this.title,
        todos: this.todos
      })

      if (response.status === 200) {
        this.loading = false
        this.$router.push({ name: 'Todos' })
      }
    },
    ...mapActions(['createNote'])
  },
  destroyed() {
    this.currentTodo = null
    this.todos = []
    this.title = null
  },
}
</script>

<style lang="scss" scoped>
.create-note {
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

.btn-save {
  width: 120px;

  &[disabled] {
    background: #ddd;
    color: #f7f7f7;
    cursor: not-allowed;

    &:hover {
      background: #ddd;
    }
  }

  &:hover {
    background: #35eac9;
  }
}

@media (max-width: 767px) {
  .create-note {
    padding: 20px 16px;
  }
}

@media (min-width: 768px) {
  .create-note {
    padding: 20px 0 0 20px;
  }
}
</style>