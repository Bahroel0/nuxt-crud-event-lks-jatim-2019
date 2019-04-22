<template>
  <v-container align-center>
    <v-layout v-if="error.status">
      <v-flex xs12 md10 offset-md1>
        <alert :text="error.message" type="success" @dismissed="onDismissed" />
      </v-flex>
    </v-layout>
    <v-layout row wrap>
      <v-flex xs12 md10 offset-md1>
        <v-card flat>
          <v-img
            :src="'http://127.0.0.1:8000/' + event.image_url"
            aspect-ratio="3.75"
          />
          <v-card-title primary-title class="pb-0">
            <span class="title">{{ event.name }}</span>
          </v-card-title>
          <v-card-text class="pb-0">
            <v-layout row wrap>
              <v-flex md4>
                <v-layout>
                  <v-flex xs2>
                    <v-icon size="23">place</v-icon>
                  </v-flex>
                  <v-flex xs10>
                    {{ event.address }}
                  </v-flex>
                </v-layout>
              </v-flex>
              <v-flex md3>
                <v-layout row wrap>
                  <v-flex xs2>
                    <v-icon size="23">access_time</v-icon>
                  </v-flex>
                  <v-flex xs10>
                    <span>{{ event.date }}</span>
                  </v-flex>
                </v-layout>
              </v-flex>
            </v-layout>
          </v-card-text>
          <v-card-text>
            <span>
              {{ event.description }}
            </span>
          </v-card-text>
          <v-card-actions v-if="!admin" class="pb-3 pr-3">
            <v-spacer />
            <v-btn
              v-if="!registered"
              color="primary"
              :disabled="!user"
              @click="registerEvent(event.id)"
              >Join</v-btn
            >
          </v-card-actions>
        </v-card>
      </v-flex>
    </v-layout>
    <v-layout v-if="admin" row wrap class="mt-5">
      <v-flex xs12 md10 offset-md1>
        <v-layout row wrap>
          <v-flex xs12 sm12 md12>
            <h3>User Pendaftar</h3>
          </v-flex>
          <v-flex xs12 sm12 md12>
            <v-data-table
              :headers="headers"
              :items="items"
              hide-actions
              class="elevation-1"
            >
              <template slot="items" slot-scope="props">
                <td>{{ props.item.users.email }}</td>
                <td class="text-xs-center">{{ props.item.created_at }}</td>
              </template>
            </v-data-table>
          </v-flex>
        </v-layout>
      </v-flex>
    </v-layout>
  </v-container>
</template>
<script>
export default {
  data() {
    return {
      favorite: true,
      headers: [
        {
          text: 'Email',
          align: 'left',
          sortable: false
        },
        {
          text: 'Tanggal terdaftar',
          value: 'created_at',
          align: 'center',
          sortable: false
        }
      ]
    }
  },
  computed: {
    error() {
      return this.$store.getters.error
    },
    loading() {
      return this.$store.getters.load
    },
    admin() {
      if (this.$store.getters.user == null) {
        return false
      } else {
        // eslint-disable-next-line
        return this.$store.getters.user.role_id == 1
      }
    },
    user() {
      return this.$store.getters.user
    },
    registered() {
      const eventjoin = this.$store.getters.eventjoin

      if (eventjoin != null) {
        for (let i = 0; i < eventjoin.length; i++) {
          // eslint-disable-next-line
        if (eventjoin[i].id == this.$route.params.id) {
            
            return true
          }
        }
      }
      return false
    },
    events() {
      return this.$store.getters.events
    },
    event() {
      const events = this.$store.getters.events
      // eslint-disable-next-line
      const event = events.find(obj => obj.id == this.$route.params.id)
      return event
    }
  },
  asyncData(context) {
    if (context.store.getters.user == null) {
      return {
        items: []
      }
    } else {
      return context.$axios
        .get(
          `http://127.0.0.1:8000/event/member/${context.params.id}` +
            '?api_token=' +
            context.store.getters.user.api_token
        )
        .then(res => {
          return { items: res.data.data }
        })
    }
  },
  methods: {
    registerEvent(params) {
      const data = {
        id: params
      }
      this.$store.dispatch('registerEvent', data)
    },
    onDismissed() {
      const data = {
        status: false,
        message: ''
      }
      this.$store.dispatch('setError', data)
    }
  }
}
</script>
