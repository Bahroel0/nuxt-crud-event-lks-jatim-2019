import types from './mutation-types'
const cookieparser = process.server ? require('cookieparser') : undefined
const Cookie = process.client ? require('js-cookie') : undefined
export default {
  // global actions
  async nuxtServerInit({ commit, state }, { req }) {
    let user
    if (req.headers.cookie) {
      const parsed = cookieparser.parse(req.headers.cookie)
      try {
        user = JSON.parse(parsed.user)
        commit(types.SET_USER_STATE, user)
        await this.$axios
          .get(
            process.env.webServiceUrl +
              '/event/user/' +
              state.user.id +
              '?api_token=' +
              state.user.api_token
          )
          .then(function(response) {
            if (response.data.total > 0) {
              const array = []
              for (const key in response.data.data) {
                array.push({ ...response.data.data[key].event })
              }
              commit(types.SET_EVENT_JOIN_STATE, array)
            }
          })
          .catch(function(error) {
            // eslint-disable-next-line
        console.log(error)
          })
      } catch (err) {
        // No valid cookie found
      }
    }
    await this.$axios
      .get(process.env.webServiceUrl + '/event')
      .then(function(response) {
        if (response.data.success) {
          const array = []
          for (const key in response.data.data) {
            array.push({ ...response.data.data[key] })
          }
          commit(types.SET_EVENTS_STATE, array)
        }
      })
      .catch(function(error) {
        // eslint-disable-next-line
        console.log(error)
      })
  },
  setError({ commit }, payload) {
    commit(types.SET_ERROR_STATE, payload)
  },
  setLoad({ commit }, payload) {
    commit(types.SET_LOAD_STATE, payload)
  },
  // user actions
  register({ commit }, payload) {
    commit(types.SET_LOAD_STATE, true)
    const user = {
      email: payload.email,
      password: payload.password,
      role_id: payload.roleId
    }
    this.$axios
      .post(process.env.webServiceUrl + '/register', user)
      .then(function(response) {
        commit(types.SET_LOAD_STATE, false)
        if (!response.data.success)
          commit(types.SET_ERROR_STATE, {
            status: true,
            message: response.data.message
          })
        Cookie.set('user', response.data.data)
        commit(types.SET_USER_STATE, response.data.data)
      })
      .catch(function(error) {
        // eslint-disable-next-line
        console.log(error)
      })
  },
  login({ commit }, payload) {
    commit(types.SET_LOAD_STATE, true)
    this.$axios
      .post(process.env.webServiceUrl + '/login', payload)
      .then(function(response) {
        commit(types.SET_LOAD_STATE, false)

        if (!response.data.success)
          commit(types.SET_ERROR_STATE, {
            status: true,
            message: response.data.message
          })
        Cookie.set('user', response.data.data)
        commit(types.SET_USER_STATE, response.data.data)
      })
      .catch(function(error) {
        // eslint-disable-next-line
        console.log(error)
      })
  },
  logout({ commit }) {
    if (process.client) {
      Cookie.remove('user')
    }
    commit(types.SET_USER_STATE, null)
  },
  // event action
  addEvent({ commit, state }, payload) {
    commit(types.SET_LOAD_STATE, true)
    const apiToken = state.user.api_token

    const form = new FormData()
    form.append('name', payload.name)
    form.append('address', payload.address)
    form.append('date', payload.date)
    form.append('description', payload.description)
    form.append('api_token', apiToken)
    form.append('image', payload.image)

    this.$axios
      .post(process.env.webServiceUrl + '/event', form, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      .then(function(response) {
        commit(types.SET_LOAD_STATE, false)
        if (!response.data.success)
          commit(types.SET_ERROR_STATE, {
            status: true,
            message: response.data.message
          })
        const event = response.data.data
        commit(types.ADD_EVENTS_STATE, event)
      })
      .catch(function(error) {
        commit(types.SET_LOAD_STATE, false)
        // eslint-disable-next-line
        console.log(error)
      })
  },
  editEvent({ commit, state }, payload) {
    commit(types.SET_LOAD_STATE, true)
    const apiToken = state.user.api_token

    const form = new FormData()
    form.append('name', payload.name)
    form.append('address', payload.address)
    form.append('date', payload.date)
    form.append('description', payload.description)
    form.append('api_token', apiToken)
    form.append('image', payload.image)

    this.$axios
      .post(process.env.webServiceUrl + '/event/update/' + payload.id, form, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      .then(function(response) {
        commit(types.SET_LOAD_STATE, false)
        if (!response.data.success)
          commit(types.SET_ERROR_STATE, {
            status: true,
            message: response.data.message
          })
        const event = response.data.data
        commit(types.EDIT_EVENTS_STATE, event)
      })
      .catch(function(error) {
        commit(types.SET_LOAD_STATE, false)
        // eslint-disable-next-line
        console.log(error)
      })
  },
  deleteEvent({ commit, state }, payload) {
    const apiToken = state.user.api_token
    this.$axios
      .get(
        process.env.webServiceUrl +
          '/event/delete/' +
          payload.id +
          '?api_token=' +
          apiToken
      )
      .then(function(response) {
        if (!response.data.success)
          commit(types.SET_ERROR_STATE, {
            status: true,
            message: response.data.message
          })

        commit(types.DELETE_EVENTS_STATE, payload.id)
      })
      .catch(function(error) {
        // eslint-disable-next-line
        console.log(error)
      })
  },
  registerEvent({ commit, state }, payload) {
    const data = {
      user_id: state.user.id,
      event_id: payload.id,
      api_token: state.user.api_token
    }

    this.$axios
      .post(process.env.webServiceUrl + '/event/join', data)
      .then(function(response) {
        if (response.data.success)
          commit(types.SET_ERROR_STATE, {
            status: true,
            message: response.data.message
          })
        commit(types.ADD_EVENT_JOIN_STATE, payload.id)
        // eslint-disable-next-line
        console.log(response.data)
      })
      .catch(function(error) {
        // eslint-disable-next-line
      console.log(error)
      })
  },
  // search
  search({ commit }, key) {
    commit(types.SET_SEARCH_KEY_STATE, key)
  },
  clearSearch({ commit }) {
    commit(types.DELETE_SEARCH_KEY_STATE)
  }
}
