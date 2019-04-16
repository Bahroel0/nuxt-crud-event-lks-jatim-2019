<template>
  <v-alert
    :value="true"
    error
    dismissible
    class=""
    :type="type"
    @input="onClose"
  >
    {{ text }}
  </v-alert>
</template>
<script>
export default {
  // eslint-disable-next-line
  props: ["text", "type"],
  methods: {
    onClose() {
      this.$emit('dismissed')
    }
  }
}
</script>
