import Vue from 'vue'
import Vuex from 'vuex'
import { undoRedoPlugin } from '@/plugins/undoRedoPlugin'

Vue.use(Vuex)

function timeoutPromise(interval, data) {
  return new Promise((resolve, reject) => {
    if (Object.keys(data).length || 
        !isNaN(parseFloat(data)) && !isNaN(data - 0)) {
      setTimeout(() => {
        resolve({ 
          data: data, 
          status: 200 
        })
      }, interval)
    } else {
      setTimeout(() => {
        reject({ error: {
          status: 403,
          message: 'Something went wrong...'
        }})
      }, 5000)
    }
  },)
}

export default new Vuex.Store({
  plugins: [undoRedoPlugin],
  state: {
    notes: []
  },

  mutations: {
    SET_NOTES(state, data) {
      state.notes = data
    },
    SET_NOTE(state, data) {
      state.notes.push(data)

      const parsed = JSON.stringify(state.notes)
      localStorage.setItem('notes', parsed)
    },
    UPDATE_NOTE(state, data) {
      const index = state.notes
        .findIndex(i => i.id === data.id)
      state.notes[index].title = data.title
        
      const parsed = JSON.stringify(state.notes)
      localStorage.setItem('notes', parsed)
    },
    DEL_NOTE(state, id) {
      state.notes
        .splice(state.notes.findIndex(i => i.id === id), 1)

      const parsed = JSON.stringify(state.notes)
      localStorage.setItem('notes', parsed)
    },
    ADD_TODO(state, data) {
      const todosNote = state.notes.find(item => item.id === data.nid).todos
      todosNote.push({
        id: data.tid,
        title: data.title,
        completed: data.completed
      })

      const parsed = JSON.stringify(state.notes)
      localStorage.setItem('notes', parsed)
    },
    SET_STATUS_TODO(state, data) {
      const note = state.notes.find(item => item.id === data.nid)
      const todo = note.todos.find(item => item.id === data.tid)
      todo.completed = !todo.completed

      localStorage.removeItem('notes')
      const parsed = JSON.stringify(state.notes)
      localStorage.setItem('notes', parsed)
    },
    SET_TODO(state, data) {
      const note = state.notes.find(item => item.id === data.nid)
      const todo = note.todos.find(item => item.id === data.tid)
      todo.title = data.title

      localStorage.removeItem('notes')
      const parsed = JSON.stringify(state.notes)
      localStorage.setItem('notes', parsed)
    },
    DEL_TODO(state, data) {
      const note = state.notes.find(item => item.id === data.nid)
      note.todos.splice(note.todos.findIndex(i => i.id === data.tid), 1)
    }
  },

  actions: {
    async createNote ({ commit }, data) {
      try {
        const response = await timeoutPromise(2000, data)

        if (response.status === 200) {
          commit('SET_NOTE', response.data)
          return response
        }
      } catch (error) {
        console.log(`status: ${error.status}, message: ${error.message}`)
      }
    },
    async updateNote ({ commit }, data) {
      try {
        const response = await timeoutPromise(2000, data)

        if (response.status === 200) {
          localStorage.removeItem('notes')
          commit('UPDATE_NOTE', response.data)
          return response
        }
      } catch (error) {
        console.log(`status: ${error.status}, message: ${error.message}`)
      }
    },
    async delNote ({ commit }, id) {
      try {
        const response = await timeoutPromise(2000, id)

        if (response.status === 200) {
          commit('DEL_NOTE', response.data)
          return response
        }
      } catch (error) {
        console.log(`status: ${error.status}, message: ${error.message}`)
      }
    }
  },

  getters: {
    getNotes: state => state.notes
  }
})
