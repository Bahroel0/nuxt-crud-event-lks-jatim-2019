<template>
  <v-container grid-list-xl="" fluid>
    <v-layout row wrap>
      <v-flex v-if="admin" md10 offset-md1>
        <v-expansion-panel class="elevation-3" expand>
          <v-expansion-panel-content v-model="panel">
            <template v-slot:header>
              <span class="subheading">{{
                editStatus ? 'Edit Event' : 'Buat Event'
              }}</span>
            </template>
            <v-card>
              <v-card-text>
                <v-form ref="form" @submit.prevent="onSubmit">
                  <v-layout v-if="error.status">
                    <v-flex xs12 md12>
                      <alert
                        :text="error.message"
                        type="warning"
                        @dismissed="onDismissed"
                      />
                    </v-flex>
                  </v-layout>
                  <v-layout row wrap>
                    <v-flex xs12 sm6 md6>
                      <v-text-field
                        v-model="newEvent.name"
                        solo
                        flat
                        single-line
                        name="title"
                        placeholder="Nama event"
                        required
                        class="py-0"
                      />
                    </v-flex>
                    <v-flex xs12 sm6 md6>
                      <v-text-field
                        v-model="newEvent.address"
                        solo
                        flat
                        single-line
                        name="address"
                        placeholder="Alamat"
                        required
                        class="py-0"
                      />
                    </v-flex>
                    <v-flex xs12 sm12 md12>
                      <v-textarea
                        v-model="newEvent.description"
                        solo
                        flat
                        label="Deskripsi event..."
                        rows="3"
                      />
                    </v-flex>
                    <v-flex xs12 sm6 md6>
                      <v-menu>
                        <template>
                          <v-text-field
                            slot="activator"
                            :value="newEvent.date"
                            solo
                            flat
                            single-line
                            name="address"
                            label="Tanggal pelaksanaan"
                            required
                            class="py-0"
                          />
                        </template>
                        <v-date-picker v-model="newEvent.date" />
                      </v-menu>
                    </v-flex>
                    <v-flex xs12 sm6 md6>
                      <v-btn color="info" @click="onPickFile">Image</v-btn>
                      <input
                        ref="eventImage"
                        type="file"
                        style="display : none"
                        accept="image/*"
                        @change="onFilePicked"
                      />{{ imageFileName }}
                    </v-flex>
                    <v-flex xs12 sm12 md12>
                      <v-btn
                        block
                        color="primary"
                        :loading="loading"
                        @click="
                          editStatus ? editEvent(editEventId) : createEvent()
                        "
                      >
                        {{ editStatus ? 'Edit' : 'Tambahkan' }}
                      </v-btn>
                    </v-flex>
                  </v-layout>
                </v-form>
              </v-card-text>
            </v-card>
          </v-expansion-panel-content>
        </v-expansion-panel>
      </v-flex>
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

              <v-card-actions v-if="admin">
                <v-spacer />
                <v-btn icon color="info" :to="'/event/' + event.id">
                  <v-icon>zoom_in</v-icon>
                </v-btn>
                <v-btn icon color="warning" @click="setEditEvent(event)">
                  <v-icon>edit</v-icon>
                </v-btn>
                <v-btn
                  icon
                  color="error"
                  class="mr-3"
                  @click="setDeleteDialog(event)"
                >
                  <v-icon>delete</v-icon>
                </v-btn>
              </v-card-actions>
              <v-card-actions v-else class="pb-3 pr-3">
                <v-spacer />
                <v-btn dark color="primary" :to="'/event/' + event.id" small
                  >Lihat detail</v-btn
                >
              </v-card-actions>
            </v-card>
          </v-flex>
        </v-layout>
      </v-flex>
      <v-dialog v-model="deleteDialog.visibility" max-width="400">
        <v-card>
          <v-card-title class="headline">
            Hapus Event
          </v-card-title>

          <v-card-text class="subheading">
            Apakah anda yakin ingin menghapus event
            {{ deleteDialog.eventName }} ?
          </v-card-text>

          <v-card-actions>
            <v-spacer />
            <v-btn
              color="primary darken-1"
              flat="flat"
              @click="deleteDialog.visibility = false"
            >
              Batal
            </v-btn>
            <v-btn
              color="primary darken-1"
              flat="flat"
              @click="deleteEvent(deleteDialog.eventId)"
            >
              Ya
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
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
      editStatus: false,
      editEventId: null,
      imageFileName: '',
      panel: false,
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
    admin() {
      if (this.$store.getters.user == null) {
        return false
      } else {
        // eslint-disable-next-line
        return this.$store.getters.user.role_id == 1
      }
    },
    events() {
      return this.$store.getters.events
    }
  },
  methods: {
    onPickFile() {
      this.$refs.eventImage.click()
    },
    onFilePicked(event) {
      const file = event.target.files
      const fileName = file[0].name
      this.imageFileName = fileName
      this.newEvent.image = file[0]
    },
    onDismissed() {
      const data = {
        status: false,
        message: ''
      }
      this.$store.dispatch('setError', data)
    },
    createEvent() {
      this.$store.dispatch('addEvent', this.newEvent)
      this.panel = false
      this.$refs.eventImage.value = null
      this.imageFileName = ''
      this.$refs.form.reset()
    },
    setDeleteDialog(params) {
      this.deleteDialog.visibility = true
      this.deleteDialog.eventName = params.name
      this.deleteDialog.eventId = params.id
    },
    deleteEvent(params) {
      const data = {
        id: params
      }
      this.$store
        .dispatch('deleteEvent', data)
        .then((this.deleteDialog.visibility = false))
    },
    setEditEvent(params) {
      this.editStatus = true
      this.panel = true
      this.newEvent.name = params.name
      this.newEvent.address = params.address
      this.newEvent.description = params.description
      this.editEventId = params.id
    },
    editEvent(id) {
      this.$store.dispatch('editEvent', { ...this.newEvent, id: id })
      this.panel = false
      this.$refs.eventImage.value = null
      this.imageFileName = ''
      this.$refs.form.reset()
    }
  }
}
</script>
