<template>
  <v-app>
    <v-app-bar app>
      <v-spacer />
      <img
        :src="$vuetify.theme.dark ? '/logo-dark.svg' : '/logo-light.svg'"
        alt="Hegel Music Systems - Röst"
        width="112"
        height="48"
        class="ml-7"
      >
      <v-spacer />
      <v-btn
        icon
        small
        @click="$vuetify.theme.dark = !$vuetify.theme.dark"
      >
        <v-icon small>
          {{ $vuetify.theme.dark ? 'mdi-weather-night' : 'mdi-white-balance-sunny' }}
        </v-icon>
      </v-btn>
    </v-app-bar>
    <v-main>
      <nuxt />
    </v-main>
    <v-footer>Copyright &copy; {{ year }}</v-footer>
  </v-app>
</template>

<script>
export default {
  name: 'DefaultLayout',

  computed: {
    year() {
      return new Date().getFullYear();
    }
  },

  watch: {
    '$vuetify.theme.dark'(value) {
      this.$store.commit('theme/setDark', value);
    }
  },

  mounted() {
    this.$vuetify.theme.dark = this.$store.state.theme.dark;
  }
}
</script>
