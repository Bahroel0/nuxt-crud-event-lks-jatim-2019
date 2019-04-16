<template>
  <v-app id="login" class="primary">
    <v-content>
      <v-container fluid fill-height>
        <v-layout align-center justify-center>
          <v-flex xs12 sm10 md8 lg6>
            <v-card class="elevation-1 px-5 py-3">
              <v-card-text>
                <div class="layout column align-center">
                  <v-img src="/v.png" width="80" height="80" />
                  <h1 class="flex my-1 primary--text">
                    Tech Event
                  </h1>
                </div>
                <v-layout v-if="error.status">
                  <v-flex xs12 md12>
                    <alert
                      :text="error.message"
                      type="warning"
                      @dismissed="onDismissed"
                    />
                  </v-flex>
                </v-layout>
                <form @submit.prevent="register">
                  <v-text-field
                    v-model="form.email"
                    append-icon="mail"
                    label="Email"
                    type="email"
                    required
                  />
                  <v-text-field
                    v-model="form.password"
                    append-icon="lock"
                    name="password"
                    label="Password"
                    type="password"
                    required
                  />
                  <v-text-field
                    v-model="form.repassword"
                    append-icon="vpn_key"
                    label="Konfirmasi Password"
                    type="password"
                    required
                    :rules="[comparePassword]"
                  />
                  <v-checkbox
                    v-model="form.roleId"
                    label="Daftar sebagai admin"
                  />
                  <v-layout row wrap>
                    <v-flex xs12 sm12 md12>
                      <v-btn
                        block
                        color="primary"
                        :loading="loading"
                        type="submit"
                      >
                        Daftar
                      </v-btn>
                    </v-flex>
                    <v-flex xs12 sm12 md12 class="text-xs-center">
                      <span class="subheading">Sudah pernah daftar ?</span>
                      <v-btn
                        flat
                        depressed
                        style="text-transform: none"
                        color="primary"
                        to="/login"
                      >
                        Login disini
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
      password: '',
      repassword: '',
      roleId: false
    }
  }),
  computed: {
    comparePassword() {
      return this.form.password !== this.form.repassword
        ? 'Password tidak sama'
        : ''
    },
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
        this.$router.push('/register')
      }
    }
  },
  methods: {
    register() {
      const data = {
        email: this.form.email,
        password: this.form.password,
        roleId: this.form.roleId ? '1' : '2'
      }
      this.$store.dispatch('register', data)
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
