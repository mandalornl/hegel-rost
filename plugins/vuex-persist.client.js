import VuexPersistence from 'vuex-persist';

export default ({ store }) => {
  new VuexPersistence({
    key: 'hegel',
    storage: localStorage,
    reducer: (state) => ({
      theme: state.theme
    })
  }).plugin(store);
};
