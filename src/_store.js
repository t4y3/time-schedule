const KEY = 'time-schedule';

class Store {
  constructor() {
    this.data = [];
    this.handler = {};
  }

  init() {
    const storage = localStorage.getItem(KEY);
    let data = [];
    if (!!storage) {
      data = JSON.parse(storage);
    }
    this.data = new Proxy(data, {
      set: (target, prop, value) => {
        localStorage.setItem(KEY, JSON.stringify(target));
        this.emit('change');
        return Reflect.set(target, prop, value);
      }
    });
  }

  get() {
    return this.data;
  }

  add(data) {
    this.data.push(data);
  }

  remove(idx) {
    this.data = this.data.filter((val, i) => i !== idx);
  }

  on(name, fn) {
    if (!this.handler[name]) {
      this.handler[name] = [];
    }
    this.handler[name].push(fn);
  }

  emit(name) {
    this.handler[name].forEach(fn => {
      fn();
    });
  }
}

export default new Store();
