const KEY = 'time-schedule';

class Store {
  constructor() {
    this.data = [];
    this.handler = {};
  }

  init() {
    const storage = localStorage.getItem(KEY);
    if (!!storage) {
      this.data = JSON.parse(storage);
    }
  }

  get() {
    return [...this.data];
  }

  add(data) {
    this.data.push(data);
    localStorage.setItem(KEY, JSON.stringify(this.data));
    this.emit('change');
  }

  remove(idx) {
    this.data.splice(idx, 1);
    localStorage.setItem(KEY, JSON.stringify(this.data));
    this.emit('change');
  }

  update(idx, item) {
    this.data[idx] = Object.assign(this.data[idx], item);
    localStorage.setItem(KEY, JSON.stringify(this.data));
    this.emit('change');
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
