<template>
  <v-app id="login" class="primary">
    <v-content>
      <v-container fluid fill-height>
        <v-layout align-center justify-center>
          <v-flex xs12 sm10 md8 lg6>
            <v-card class="elevation-1 px-5 pt-3">
              <v-card-text>
                <div class="layout column align-center">
                  <img src="/v.png" width="80" height="80" />
                  <h1 class="flex my-4 primary--text">
                    Tech Event
                  </h1>
                </div>
                <v-layout v-if="error.status">
                  <v-flex xs12 md12>
                    <alert
                      :text="error.message"
                      type="error"
                      @dismissed="onDismissed"
                    />
                  </v-flex>
                </v-layout>
                <form @submit.prevent="login">
                  <v-text-field
                    v-model="form.email"
                    append-icon="mail"
                    name="email"
                    label="Email"
                    type="email"
                    required
                  />
                  <v-text-field
                    id="password"
                    v-model="form.password"
                    append-icon="lock"
                    name="password"
                    label="Password"
                    type="password"
                    required
                  />
                  <v-layout row wrap>
                    <v-flex xs12 sm12 md12>
                      <v-btn
                        block
                        color="primary"
                        :loading="loading"
                        type="submit"
                      >
                        Login
                      </v-btn>
                    </v-flex>
                    <v-flex xs12 sm12 md12 class="text-xs-center">
                      <span class="subheading">Belum punya akun ?</span>
                      <v-btn
                        flat
                        style="text-transform: none"
                        color="primary"
                        to="/register"
                      >
                        Daftar disini
                      </v-btn>
                    </v-flex>
                  </v-layout>
                </form>
              </v-card-text>
            </v-card>
          </v-flex>
        </v-layout>
      </v-container>
    </v-content>
  </v-app>
</template>

<script>
export default {
  layout: 'none',
  middleware: ['auth'],
  data: () => ({
    form: {
      email: '',
      password: ''
    }
  }),
  computed: {
    user() {
      return this.$store.getters.user
    },
    error() {
      return this.$store.getters.error
    },
    loading() {
      return this.$store.getters.load
    }
  },
  watch: {
    user(value) {
      if (value !== null && value !== undefined) {
        this.$router.push('/')
      } else {
        this.$router.push('/login')
      }
    }
  },
  methods: {
    login() {
      this.loading = true
      this.$store.dispatch('login', { ...this.form })
    },
    onDismissed() {
      this.error = null
    }
  }
}
</script>
<style scoped lang="css">
#login {
  height: 50%;
  width: 100%;
  position: absolute;
  top: 0;
  left: 0;
  content: "";
  z-index: 0;
}
</style>
