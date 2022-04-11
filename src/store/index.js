import { createStore } from 'vuex'

const store = createStore({
    state () {
        return {
            locale: localStorage.hasOwnProperty('locale') ? localStorage.getItem('locale') : 'zh-CN',
            token: sessionStorage.hasOwnProperty('token') ? sessionStorage.getItem('token') : '',
            username: sessionStorage.hasOwnProperty('username') ? sessionStorage.getItem('username') : '',
        }
    },
    mutations: {
        changeLocale(state, locale) {
            state.locale = locale
            localStorage.setItem('locale', locale)
        },
        setToken(state, token) {
            state.token = token
            sessionStorage.setItem('token', token)
        },
        setUsername(state, username) {
            state.username = username
            sessionStorage.setItem('username', username)
        }
    }
})

export default store