import {observable, autorun, computed, action} from "mobx";
const KEY = 'time-schedule';

export interface TsItem {
  id: string,
  text: string;
  time: number;
  checked: boolean;
  add: boolean;
  delete: boolean;
}

export class Store {
  @observable plans: TsItem[];
  handler: {};

  constructor() {
    const storage = localStorage.getItem(KEY);
    if (storage) {
      // 初期の整形
      const plans = JSON.parse(storage);
      this.plans = this.deleteAdd(this.sort(plans)).filter(v => !v.delete);
    } else {
      this.plans = [];
    }
    this.handler = {};
  }

  init() {
    //
  }

  @computed get all() {
    return this.plans;
  }

  @action
  add(plan) {
    let plans = [].concat(this.plans, [plan]);
    this.plans = this.sort(plans);
  }

  @action
  remove(id) {
    this.plans = this.plans.map((plan, i) => {
      if (plan.id === id) {
        return {
          ...plan,
          add: false,
          delete: true
        };
      }
      return plan;
    });
  }

  @action
  removeAll() {
    this.plans = [];
  }

  @action
  update(id, plan) {
    const foundIndex = this.plans.findIndex(v => v.id === id);
    this.plans[foundIndex] = Object.assign(this.plans[foundIndex], plan);
  }

  sort(plans) {
    const now = new Date();
    plans = plans.map(v => {
      const date = new Date(v.time);
      date.setFullYear(now.getFullYear());
      date.setMonth(now.getMonth());
      date.setDate(now.getDate());
      return {
        ...v,
        time: date.getTime()
      };
    });
    return plans.sort((a, b) => a.time - b.time);
  }

  deleteAdd(plans) {
    return plans.map(v => {
      return {
        ...v,
        add: false
      }
    });
  }

  on(name, fn) {
    if (!this.handler[name]) {
      this.handler[name] = [];
    }
    this.handler[name].push(fn);
  }

  emit(name) {
    if (!this.handler[name]) {
      return;
    }

    this.handler[name].forEach(fn => {
      fn();
    });
  }
}

const store = new Store();

autorun( reaction => {
  // reaction.dispose();
  localStorage.setItem(KEY, JSON.stringify(store.plans));
  store.emit('change');
});

export default store;
