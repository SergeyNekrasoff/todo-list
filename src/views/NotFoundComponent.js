import Vue from 'vue'

const NotFoundComponent = Vue.component('my-component', {
    functional: true,
    render: function(createElement, context) {
        return createElement('div', 'Sorry. Nothing to see here.')
    }
})

export {
    NotFoundComponent
}