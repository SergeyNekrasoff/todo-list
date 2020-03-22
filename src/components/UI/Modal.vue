<template>
  <div 
    class="overlay"
    @click="cancel">
    <div class="modal">
      <div class="modal__content">
        <slot></slot>
      </div>
      <div class="modal__footer">
        <button 
          class="default-btn btn-cancel"
          type="button"
          @click="cancel">
          Cancel
        </button>
        <button 
          class="default-btn btn-ok"
          type="button"
          @click="remove(item.id)">Ok</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    item: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      text: '???'
    }
  },
  methods: {
    cancel() {
      this.$emit('cancel', false)
    },
    remove(id) {
      this.$emit('delete', id)
    }
  }
}
</script>

<style lang="scss" scoped>
.overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, .5);
  height: 100vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  flex-wrap: nowrap;
  justify-content: center;
  align-content: center;
  align-items: center;
  z-index: 1000;
}

.modal {
  display: flex;
  flex-direction: column;
  flex-wrap: nowrap;
  justify-content: space-between;
  align-content: center;
  align-items: center;
  background: #fff;
  color: #333;
  min-width: 300px;
  min-height: 200px;
  padding: 16px;
}

.btn-cancel {
  width: 100px;
  border: 0;
  background: tomato;
  margin: 0 8px;
}

.btn-ok {
  width: 60px;
  border: 0;
  background: turquoise;
  margin: 0 8px;
}
</style>