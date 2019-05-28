<template>
  <v-app>
    <v-toolbar app>
      <img src="logo.svg" width="112" height="48" alt="Hegel Music Systems - Röst">
    </v-toolbar>
    <v-content>
      <v-container grid-list-sm>
        <v-layout row wrap>
          <v-flex xs6>
            <v-btn block large :color="toggleColor(power)" @click="powerOn">
              On
            </v-btn>
          </v-flex>
          <v-flex xs6>
            <v-btn block large :color="toggleColor(!power)" @click="powerOff">
              Off
            </v-btn>
          </v-flex>
          <v-flex xs12>
            <span :class="`volume${!power ? ' disabled' : ''}`">{{ volume }}</span>
          </v-flex>
          <v-flex xs4>
            <v-btn block large :color="toggleColor(mute)" :disabled="!power" @click="muteToggle">
              <v-icon>volume_off</v-icon>
            </v-btn>
          </v-flex>
          <v-flex xs4>
            <v-btn block large :disabled="!power" @click="volumeDown">
              <v-icon>volume_down</v-icon>
            </v-btn>
          </v-flex>
          <v-flex xs4>
            <v-btn block large :disabled="!power" @click="volumeUp">
              <v-icon>volume_up</v-icon>
            </v-btn>
          </v-flex>
          <v-flex xs12 v-if="presets.length">
            <v-divider class="mt-3 mb-1"></v-divider>
          </v-flex>
          <v-flex v-for="(item, index) in inputs" :key="`input${index}`" xs6 sm4>
            <v-btn
              block
              large
              :color="toggleColor(input === item.value)"
              :disabled="!power"
              @click="selectInput(item.value)"
            >
              {{ item.label }}
            </v-btn>
          </v-flex>
          <v-flex xs12 v-if="presets.length">
            <v-divider class="mt-3 mb-1"></v-divider>
          </v-flex>
          <v-flex v-for="(item, index) in presets" :key="`preset${index}`" xs6 sm4>
            <v-btn block large :disabled="!power" @click="selectPreset(index)">
              {{ item.label }}
            </v-btn>
          </v-flex>
        </v-layout>
      </v-container>
    </v-content>
    <v-footer class="px-3">Copyright &copy; {{ year }}</v-footer>
    <v-snackbar v-model="errored" bottom color="error">
      An error occurred.
      <v-btn flat @click="errored = false">Hide</v-btn>
    </v-snackbar>
  </v-app>
</template>

<script>
  import fetch from '@/util/fetch';

  export default {
    data: () => ({
      power: 0,
      mute: 0,
      volume: 0,
      input: 0,

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

      errored: false
    }),

    computed: {
      year: () => new Date().getFullYear()
    },

    async created() {
      await this.loadStatus();
      await this.loadPresets();
    },

    methods: {
      toggleColor: value => value ? 'primary' : '',

      async powerOn() {
        if (this.power) {
          return;
        }

        const response = await fetch('/code/p/1');

        if (!response) {
          this.errored = true;

          return;
        }

        this.power = 1;
      },

      async powerOff() {
        if (!this.power) {
          return;
        }

        const response = await fetch('/code/p/0');

        if (!response)
        {
          this.errored = true;

          return;
        }

        this.power = 0;
      },

      async muteToggle() {
        const response = await fetch('/code/m/t');

        if (!response) {
          this.errored = true;

          return;
        }

        this.mute = response.data.m;
      },

      async volumeUp() {
        if (this.volume >= 100) {
          return;
        }

        const response = await fetch('/code/v/u');

        if (!response) {
          this.errored = true;

          return;
        }

        this.volume = response.data.v;
        this.mute = 0;
      },

      async volumeDown() {
        if (this.volume <= 0) {
          return;
        }

        const response = await fetch('/code/v/d');

        if (!response) {
          this.errored = true;

          return;
        }

        this.volume = response.data.v;
        this.mute = 0;
      },

      async selectInput(value) {
        const response = await fetch(`/code/i/${value}`);

        if (!response) {
          this.errored = true;

          return;
        }

        this.input = value;
      },

      async selectPreset(value) {
        const response = await fetch(`/preset/${value}`);

        if (!response) {
          this.errored = true;

          return;
        }

        this.input = response.data.i;
        this.volume = response.data.v;
      },

      async loadStatus() {
        const response = await fetch('/status');

        if (!response) {
          this.errored = true;
        } else {
          this.power = response.data.p;
          this.mute = response.data.m;
          this.volume = response.data.v;
          this.input = response.data.i;
        }

        setTimeout(async () => await this.loadStatus(), 1000);
      },

      async loadPresets() {
        const response = await fetch('/presets');

        if (!response) {
          this.errored = true;

          return;
        }

        this.presets = response.data;
      }
    }
  };
</script>

<style lang="scss">
  .volume {
    display: block;

    text-align: center;

    font-size: 2rem;

    user-select: none;

    &.disabled {
      color: #ccc;
    }
  }

  .v-toolbar .v-toolbar__content {
    justify-content: center;
  }
</style>
