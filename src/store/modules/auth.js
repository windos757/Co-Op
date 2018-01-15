import api from '@/api'
import ls from '@/services/ls'

const initialState = {
    connected: false,
    user: {}
}

export default {
    namespaced: true,
    state: {
        connected: false,
        user: {}
    },
    getters: {
        isConnected (state) {
            return state.connected || ls.get('connected')
        },
        getConnectedUser (state) {
            return state.user
        }
    },
    mutations: {
        setConnectedUser (state, u) {
            state.user = u
            state.connected = true
            ls.set('token', state.user.token)
            ls.set('connected', state.connected)
        },
        initState (state) {
            ls.remove('token')
            ls.remove('connected')
            Object.assign(state, initialState)
        },
        profile (state) {
            ls.set('token', state.user.token)
        }
    },
    actions: {
        login ({commit}, credentials) {
            return api.post('/members/signin', credentials).then(response => {
                commit("setConnectedUser", response.data)
            }).catch(error => {
                console.log("store > auth > login -> error")
            })
        },
        logout ({commit}) {
            return api.delete('/members/signout').then(response => {
                commit("initState")
            }).catch(error => {
                console.log("store > auth > logout -> error")
            })
        },
        profile ({commit, state}) {
            return api.get('/members/' + state.user._id + '/signedin').then(response => {
                commit("profile")
            }).catch(error => {
                console.log("store > auth > logout -> error")
            })
        },
        initState ({commit}) {
            commit('initState')
        }
    }
}