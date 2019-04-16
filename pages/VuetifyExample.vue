<template>
  <div>
    <v-toolbar dark color="purple" class="text-md-center">
      <v-layout>
        <v-flex class="text-md-center">
          <span class="title font-weight-bold">Vuetify</span>
        </v-flex>
      </v-layout>
    </v-toolbar>
    <v-container>
      <v-layout>
        <v-flex md8 offset-md2>
          <v-card>
            <v-card-text
              primary-title
              class="subheading font-weight-bold text-md-center"
            >
              This is Example Layout build with Material UI
            </v-card-text>
            <v-card-text class="text-md-center text-xl-center">
              <v-btn
                to="/"
                dark
                color="blue"
                style="text-transform: none"
                class="font-weight-bold"
                >Go to Index!</v-btn
              >
            </v-card-text>
          </v-card>
        </v-flex>
      </v-layout>
    </v-container>
  </div>
</template>
