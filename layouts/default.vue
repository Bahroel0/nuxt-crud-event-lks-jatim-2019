<template>
  <v-app>
    <v-navigation-drawer v-if="!admin" v-model="drawer" clipped app>
      <v-list>
        <v-list-tile
          v-for="item in items"
          :key="item.title"
          :to="item.to"
          exact
          router
        >
          <v-list-tile-action>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>{{ item.title }}</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
    </v-navigation-drawer>
    <v-toolbar
      app
      fixed
      clipped-left
      dark
      color="primary"
      style="border-bottom: 1px solid #aeaeae; background: white"
      flat
    >
      <v-toolbar-side-icon
        v-if="user && !admin"
        @click.stop="drawer = !drawer"
      />
      <v-btn icon to="/" class="hidden-xs-only">
        <v-avatar size="36">
          <v-img src="/v.png" alt="John" />
        </v-avatar>
      </v-btn>
      <v-toolbar-title class="mr-3">Tech Event</v-toolbar-title>
      <v-text-field
        v-model="searchKey"
        solo
        light
        label="Cari event"
        prepend-inner-icon="search"
        clearable
        class="ml-5 mt-2 hidden-xs-only"
        style="border-radius: 100%"
        @input="onSearch()"
        @click:clear="onClearSearch()"
      />
      <v-spacer />
      <v-spacer />
      <v-btn v-if="!user" dark flat to="/login">Login</v-btn>
      <v-btn v-if="!user" dark flat to="/register">Daftar</v-btn>
      <v-menu
        v-if="user"
        v-model="menu"
        :close-on-content-click="false"
        :nudge-width="400"
        offset-y
        bottom
        nudge-bottom="20"
        class="mr-3"
      >
        <template>
          <v-btn slot="activator" icon>
            <v-avatar size="36">
              <v-img src="/person.png" alt="John" />
            </v-avatar>
          </v-btn>
        </template>
        <v-card>
          <v-list>
            <v-list-tile avatar class="mt-3">
              <v-list-tile-avatar size="100">
                <v-img src="/person.png" alt="John" />
              </v-list-tile-avatar>

              <v-list-tile-content class="ml-3">
                <v-list-tile-title>{{ user.email }}</v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>
          </v-list>
          <v-card-actions class="pa-3">
            <v-spacer></v-spacer>
            <v-btn color="error" @click="logout">Logout</v-btn>
          </v-card-actions>
        </v-card>
      </v-menu>
    </v-toolbar>
    <v-content>
      <nuxt />
    </v-content>
  </v-app>
</template>
<script>
export default {
  data() {
    return {
      drawer: false,
      items: [
        { title: 'Event', icon: 'event', to: '/' },
        { title: 'Joined', icon: 'beenhere', to: '/join' }
      ],
      menu: false,
      search: null,
      searchMobile: false,
      searchKey: null
    }
  },
  computed: {
    user() {
      return this.$store.getters.user
    },
    admin() {
      if (this.$store.getters.user == null) {
        return false
      } else {
        // eslint-disable-next-line
      return this.$store.getters.user.role_id == 1
      }
    }
  },
  methods: {
    logout() {
      this.$store.dispatch('logout').then(location.reload())
    },
    onSearch() {
      const key = this.searchKey
      this.$store.dispatch('search', key)
    },
    onClearSearch() {
      this.$store.dispatch('clearSearch')
    }
  }
}
</script>
