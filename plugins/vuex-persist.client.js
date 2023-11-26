import VuexPersistence from 'vuex-persist';

export default ({ store }) => {
  new VuexPersistence({
    key: 'hegel',
    storage: localStorage,
    modules: [
      'theme'
    ]
  }).plugin(store);
};
