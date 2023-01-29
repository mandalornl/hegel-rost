export const state = () => ({
  dark: false
});

export const mutations = {
  setDark(state, value) {
    state.dark = !!value;
  }
};
