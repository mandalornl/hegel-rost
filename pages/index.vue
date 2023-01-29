<template>
  <v-container>
    <v-overlay
      :value="$fetchState.pending"
      absolute
    >
      <v-progress-circular indeterminate />
    </v-overlay>
    <v-row>
      <v-col cols="6">
        <v-btn
          :color="power ? 'primary' : undefined"
          block
          large
          depressed
          @click="powerOn"
        >
          On
        </v-btn>
      </v-col>
      <v-col cols="6">
        <v-btn
          :color="!power ? 'primary' : undefined"
          block
          large
          depressed
          @click="powerOff"
        >
          Off
        </v-btn>
      </v-col>
      <v-col
        :class="[ 'text-center text-h4 user-select-none', { 'text--disabled': !power || mute } ]"
        cols="12"
      >
        {{ !power ? 0 : volume }}
      </v-col>
      <v-col cols="4">
        <v-btn
          :disabled="!power"
          :color="mute || volume === 0 ? 'primary' : undefined"
          block
          large
          depressed
          @click="toggleMute"
        >
          <v-icon>mdi-volume-off</v-icon>
        </v-btn>
      </v-col>
      <v-col cols="4">
        <v-btn
          :disabled="!power || volume === 0"
          block
          large
          depressed
          @click="volumeDown"
        >
          <v-icon>mdi-volume-medium</v-icon>
        </v-btn>
      </v-col>
      <v-col cols="4">
        <v-btn
          :disabled="!power || volume === 100"
          block
          large
          depressed
          @click="volumeUp"
        >
          <v-icon>mdi-volume-high</v-icon>
        </v-btn>
      </v-col>
      <v-col cols="12">
        <v-divider />
      </v-col>
      <v-col
        v-for="{ label, value } in inputs"
        :key="label"
        cols="6"
        sm="4"
      >
        <v-btn
          :disabled="!power"
          :color="input === value ? 'primary' : undefined"
          block
          large
          depressed
          @click="selectInput(value)"
        >
          {{ label }}
        </v-btn>
      </v-col>
      <template v-if="presets.length > 0">
        <v-col cols="12">
          <v-divider />
        </v-col>
        <v-col
          v-for="({ label }, index) in presets"
          :key="label"
          cols="6"
          sm="4"
        >
          <v-btn
            :disabled="!power"
            block
            large
            depressed
            @click="selectPreset(index)"
          >
            {{ label }}
          </v-btn>
        </v-col>
      </template>
    </v-row>
    <v-snackbar
      v-model="snackbar"
      text
      bottom
      color="error"
    >
      An error occurred
    </v-snackbar>
  </v-container>
</template>

<script>
import axios from 'axios';

export default {
  name: 'IndexPage',

  data: () => ({
    power: 0,
    mute: 0,
    volume: 20,
    input: 4,
    reset: '~',
    inputs: [
      { label: 'Balanced', value: 1 },
      { label: 'Analogue 1', value: 2 },
      { label: 'Analogue 2', value: 3 },
      { label: 'Coaxial', value: 4 },
      { label: 'Optical 1', value: 5 },
      { label: 'Optical 2', value: 6 },
      { label: 'Optical 3', value: 7 },
      { label: 'USB', value: 8 },
      { label: 'Network', value: 9 }
    ],
    presets: [],
    snackbar: false,
    timeoutId: null,
    volumeSafeThreshold: 65,
    exceedSafeThreshold: false
  }),

  async fetch() {
    await this.loadPresets();
    await this.loadStatus();
  },

  methods: {
    async powerOn() {
      if (this.power) {
        return;
      }

      await this.doRequest('/command/p/1');
      await this.loadStatus();
    },

    async powerOff() {
      if (!this.power) {
        return;
      }

      await this.doRequest('/command/p/0', ({ p }) => {
        this.power = p;
      });
    },

    async toggleMute() {
      if (this.volume === 0) {
        return;
      }

      await this.doRequest('/command/m/t', ({ m }) => {
        this.mute = m;
      });
    },

    async volumeUp() {
      if (
        !this.exceedSafeThreshold
        && this.volume >= this.volumeSafeThreshold
        && !confirm('Are you sure you want to exceed the safety threshold?')
      ) {
        return;
      }

      this.exceedSafeThreshold = this.volume >= this.volumeSafeThreshold;

      await this.doRequest('/command/v/u', ({ v }) => {
        this.volume = v;
        this.mute = 0;
      });
    },

    async volumeDown() {
      await this.doRequest('/command/v/d', ({ v }) => {
        this.volume = v;
        this.mute = v === 0 ? 1 : 0;
      });
    },

    async selectInput(value) {
      if (this.input === value) {
        return;
      }

      await this.doRequest(`/command/i/${value}`, ({ i }) => {
        this.input = i;
      });
    },

    async selectPreset(index) {
      await this.doRequest(`/preset/${index}`, ({
        i,
        v
      }) => {
        this.volume = v;
        this.input = i;
      });
    },

    async loadStatus() {
      await this.doRequest('/status', ({
        p,
        m,
        v,
        i,
        r
      }) => {
        this.power = p;
        this.volume = v;
        this.mute = m;
        this.input = i;
        this.reset = r;
      });
    },

    async loadPresets() {
      await this.doRequest('/presets', (data) => {
        this.presets = data
      });
    },

    async doRequest(url, fn) {
      this.snackbar = false;

      try {
        await axios
          .get(url, {
            baseURL: this.$config.isDev ? 'http://localhost:43931/api' : '/api',
            timeout: 3000
          })
          .then((response) => fn?.(response.data));
      } catch (error) {
        console.error(error.message);

        this.snackbar = true;
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.user-select-none {
  user-select: none;
}
</style>
