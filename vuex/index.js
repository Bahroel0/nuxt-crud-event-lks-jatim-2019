import getters from './getters'
import mutations from './mutations'
import actions from './actions'

const state = () => ({
  load: false,
  error: {
    status: false,
    message: ''
  },
  user: null,
  events: null,
  eventjoin: null
})

export default {
  state,
  getters,
  actions,
  mutations
}
