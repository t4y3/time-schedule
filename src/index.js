import store from './_store';
import App from './_app';

window.Promise.resolve()
  .then(() => store.init())
  .then(() => {
    const app = new App(store);
    app.__render();
  })
  .then(() => {
  });



