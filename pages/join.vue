<template>
  <v-container grid-list-xl="" fluid>
    <v-layout row wrap>
      <v-flex md12 class="mt-3">
        <v-layout row wrap>
          <v-flex v-for="(event, index) in events" :key="index" md3>
            <v-card hover>
              <v-img
                :src="'http://127.0.0.1:8000/' + event.image_url"
                aspect-ratio="1.75"
              />
              <v-card-title primary-title class="pb-0">
                <span class="title">{{ event.name }}</span>
              </v-card-title>
              <v-card-text class="pb-0">
                <v-layout row wrap>
                  <v-flex xs1 class="pb-0">
                    <v-icon size="23">place</v-icon>
                  </v-flex>
                  <v-flex xs11 class="pb-0">
                    <span>{{ event.address }}</span>
                  </v-flex>
                </v-layout>
                <v-layout row wrap>
                  <v-flex xs1 class="pt-0">
                    <v-icon size="23">access_time</v-icon>
                  </v-flex>
                  <v-flex xs11 class="pt-0">
                    <span>{{ event.date }}</span>
                  </v-flex>
                </v-layout>
              </v-card-text>
              <v-card-text>
                <span>
                  {{ event.description.substring(0, 100) + '. . .' }}
                </span>
              </v-card-text>
            </v-card>
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
      newEvent: {
        name: '',
        address: '',
        date: '',
        image: '',
        description: ''
      },
      imageFileName: '',
      deleteDialog: {
        visibility: false,
        eventName: '',
        eventId: ''
      }
    }
  },
  computed: {
    error() {
      return this.$store.getters.error
    },
    loading() {
      return this.$store.getters.load
    },
    events() {
      return this.$store.getters.eventjoin
    }
  }
}
</script>
