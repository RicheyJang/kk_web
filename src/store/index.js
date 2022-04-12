import { createStore } from 'vuex'

const store = createStore({
    state () {
        return {
            locale: localStorage.hasOwnProperty('locale') ? localStorage.getItem('locale') : 'zh-CN',
            token: sessionStorage.hasOwnProperty('token') ? sessionStorage.getItem('token') : '',
            username: sessionStorage.hasOwnProperty('username') ? sessionStorage.getItem('username') : '',
            level: sessionStorage.hasOwnProperty('level') ? sessionStorage.getItem('level') : 0,
        }
    },
    mutations: {
        changeLocale(state, locale) {
            state.locale = locale
            localStorage.setItem('locale', locale)
        },
        setToken(state, token = '') {
            if(!token || token.length === 0) {
                this.commit('setUsername', '')
                this.commit('setLevel', 0)
            }
            state.token = token
            sessionStorage.setItem('token', token)
        },
        setUsername(state, username = '') {
            state.username = username
            sessionStorage.setItem('username', username)
        },
        setLevel(state, level = 0) {
            state.level = level
            sessionStorage.setItem('level', level)
        }
    }
})

export default store