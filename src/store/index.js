import { createStore } from 'vuex'
import { getInstances } from '../api/instance'

const store = createStore({
    state () {
        return {
            locale: localStorage.hasOwnProperty('locale') ? localStorage.getItem('locale') : 'zh-CN',
            token: sessionStorage.hasOwnProperty('token') ? sessionStorage.getItem('token') : '',
            username: sessionStorage.hasOwnProperty('username') ? sessionStorage.getItem('username') : '',
            level: sessionStorage.hasOwnProperty('level') ? sessionStorage.getItem('level') : 0,
            instances: sessionStorage.hasOwnProperty('instances') ? JSON.parse(sessionStorage.getItem('instances')) : [],
        }
    },
    actions: {
        flushInstances({ commit }) {
            getInstances().then(res => {
                commit('setInstances', res.data['data'].instances.map(v => v.identifier))
            }).catch(err => {
                commit('setInstances')
            })
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
                this.commit('setInstances', [])
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
        },
        setInstances(state, instances = []) {
            state.instances = instances
            sessionStorage.setItem('instances', JSON.stringify(instances))
        }
    }
})

export default store