import { createStore } from 'vuex'

const store = createStore({
    state () {
        return {
            locale: localStorage.hasOwnProperty('locale') ? localStorage.getItem('locale') : 'zh',
        }
    },
    mutations: {
    }
})

export default store