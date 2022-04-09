import { createStore } from 'vuex'

const store = createStore({
    state () {
        return {
            locale: localStorage.hasOwnProperty('locale') ? localStorage.getItem('locale') : 'zh-CN',
        }
    },
    mutations: {
        changeLocale(state, locale) {
            state.locale = locale
            localStorage.setItem('locale', locale)
        }
    }
})

export default store