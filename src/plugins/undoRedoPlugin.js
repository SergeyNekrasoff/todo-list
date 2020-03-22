class UndoRedoHistory {
  store
  history = []
  currentIndex = -1

  init(store) {
    this.store = store
  }

  addState(state) {
    if (this.currentIndex + 1 < this.history.length) {
      this.history.splice(this.currentIndex + 1)
    }
    this.history.push(state)
    this.currentIndex++
  }

  undo() {
    const prevState = this.history[this.currentIndex - 1]
    this.store.replaceState({ ...prevState })
    this.currentIndex--
  }

  redo() {
    const nextState = this.history[this.currentIndex + 1]
    this.store.replaceState({ ...nextState })
    this.currentIndex++
  }
}

const undoRedoHistory = new UndoRedoHistory()

const undoRedoPlugin = (store) => {
  undoRedoHistory.init(store)
  let firstState = { ...store.state }
  undoRedoHistory.addState(firstState)
  
  store.subscribe((mutation, state) => {
    if (mutation.type === 'SET_NOTE' || mutation.type === 'SET_STATUS_TODO' ||
      mutation.type === 'SET_TODO' || mutation.type === 'DEL_TODO') {
      undoRedoHistory.addState({ ...state })
    }
  })
}

module.exports = {
  undoRedoHistory,
  undoRedoPlugin
}