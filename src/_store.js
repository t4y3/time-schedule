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
    this.__format();
    localStorage.setItem(KEY, JSON.stringify(this.data));
    this.emit('change');
  }

  remove(idx) {
    this.data.splice(idx, 1);
    this.__format();
    localStorage.setItem(KEY, JSON.stringify(this.data));
    this.emit('change');
  }

  update(idx, item) {
    this.data[idx] = Object.assign(this.data[idx], item);
    this.__format();
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



  __format() {
    const now = new Date();
    this.data = this.data.map(v => {
      const date = new Date(v.time);
      date.setFullYear(now.getFullYear());
      date.setMonth(now.getMonth());
      date.setDate(now.getDate());
      return {
        text: v.text,
        time: date.getTime()
      };
    });

    this.data = this.data.sort((a, b) => a.time - b.time);
  }
}

export default new Store();
