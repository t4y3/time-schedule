import {observable, autorun, computed, action} from "mobx";
const KEY = 'time-schedule';

export interface TsItem {
  text: string;
  time: number;
  checked: boolean;
}

export class Store {
  @observable plans: TsItem[];
  handler: {};

  constructor() {
    const storage = localStorage.getItem(KEY);
    if (storage) {
      this.plans = this.sort(JSON.parse(storage));
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
  remove(index) {
    this.plans = this.plans.filter((plan, i) => i !== index);
  }

  @action
  update(index, plan) {
    console.log(index, plan)
    this.plans[index] = Object.assign(this.plans[index], plan);
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
