import types from './mutation-types'

export default {
  [types.SET_USER_STATE]: (state, payload) => {
    state.user = payload
  },
  [types.SET_ERROR_STATE]: (state, payload) => {
    state.error = payload
  },
  [types.SET_LOAD_STATE]: (state, payload) => {
    state.load = payload
  },
  [types.SET_EVENTS_STATE]: (state, payload) => {
    state.events = payload
  },
  [types.ADD_EVENTS_STATE]: (state, payload) => {
    state.events.push(payload)
  },
  [types.DELETE_EVENTS_STATE]: (state, payload) => {
    for (let i = 0; i < state.events.length; i++) {
      if (state.events[i].id === payload) {
        state.events.splice(i, 1)
      }
    }
  },
  [types.EDIT_EVENTS_STATE]: (state, payload) => {
    for (let i = 0; i < state.events.length; i++) {
      if (state.events[i].id === payload.id) {
        state.events[i].name = payload.name
        state.events[i].address = payload.address
        state.events[i].date = payload.date
        state.events[i].description = payload.description
        state.events[i].image_url = payload.image_url
      }
    }
  },
  [types.SET_EVENT_JOIN_STATE]: (state, payload) => {
    state.eventjoin = payload
  },
  [types.ADD_EVENT_JOIN_STATE]: (state, payload) => {
    state.eventjoin.push(payload)
  },
  [types.DELETE_EVENT_JOIN_STATE]: (state, payload) => {
    for (let i = 0; i < state.eventjoin.length; i++) {
      if (state.eventjoin[i].id === payload) {
        state.eventjoin.splice(i, 1)
      }
    }
  }
}
