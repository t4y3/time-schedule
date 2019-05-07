import {html, render} from "lit-html";
import {repeat} from "lit-html/directives/repeat";
import {classMap} from "lit-html/directives/class-map";
import debounce from './_debounce';

export default class App {
  constructor(store) {
    this.store = store;
    this.store.on('change', () => {
      this.list = this.store.get();
      this.__render();
    });

    this.list = this.store.get();
    this.selectedNo = -1;
    this.handleItemClick = this.handleItemClick.bind(this);
    this.handleAddClick = this.handleAddClick.bind(this);
    this.handleLayerClick = this.handleLayerClick.bind(this);
    this.handleSaveClick = this.handleSaveClick.bind(this);
    this.handleHourScroll = this.handleHourScroll.bind(this);
    this.handleTimeScroll = this.handleTimeScroll.bind(this);
    this.handleDeleteClick = this.handleDeleteClick.bind(this);
    this.handleTimeClick = this.handleTimeClick.bind(this);
    this.handleTextChange = this.handleTextChange.bind(this);
    this.handleHourScrollEnd = debounce(this.handleHourScrollEnd.bind(this), 100);
    this.handleTimeScrollEnd = debounce(this.handleTimeScrollEnd.bind(this), 100);
    this.handleHourItemTap = this.handleHourItemTap.bind(this);
    this.handleTimeItemTap = this.handleTimeItemTap.bind(this);

    this.root = document.querySelector('#app');
    const style = window.getComputedStyle(this.root);
    this.cpPickerRowHeight = Number(style.getPropertyValue('--ts-picker-row-height').split('px')[0]);
    this.cpPickerRows = Number(style.getPropertyValue('--ts-picker-rows'));
  }

  __template() {
    return html`
      <div class="container">
        <div class="body">
          <div class="list">
            ${
              repeat(
                this.list,
                (item, i) => {
                  const date = new Date(item.time);
                  return html`
                    <div
                      class="${classMap({
                        list__item: true,
                        item: true,
                        'item--selected': this.selectedNo === i
                      })}"
                      index="${i}"
                      @click="${this.handleItemClick}"
                    >
                      <div
                        class="item__time"
                        @click="${this.handleTimeClick}"
                        index="${i}"
                      >
                        ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}
                      </div>
                      <div class="item__text">
                        <input
                          type="text"
                          value="${item.text}"
                          placeholder="テキストを入力"
                          index="${i}"
                          @change="${this.handleTextChange}"
                        >
                      </div>
                      <div class="item__delete" index="${i}" @click="${this.handleDeleteClick}"><i class="material-icons">delete_forever</i></div>
                    </div>
                  `
                }
              )
          }
          </div>
          <div class="add" @click="${this.handleAddClick}"><i class="material-icons">add_circle</i></div>
        </div>
        <div class="tail"></div>
        <div class="${
          classMap({
            sheet: true,
            'sheet--active': this.selectedNo > -1
          })}"
          @click="${this.handleLayerClick}"
        >
          <div class="sheet__container">
            <div class="wrap">
              <div class="hour" @scroll="${this.handleHourScroll}">
                ${this.__getDummyPickerHourItem()}
                ${
                  repeat(
                    Array.from({length: 24}, (v, i) => i),
                    (item, i) => html`
                      <div class="hour__item" index="${i}" @click="${this.handleHourItemTap}">${item}</div>                    
                    `
                  )
                }
                ${this.__getDummyPickerHourItem()}
              </div>
              <div class="time" @scroll="${this.handleTimeScroll}">
                ${this.__getDummyPickerTimeItem()}
                ${
                  repeat(
                    Array.from({length: 60}, (v, i) => i),
                    (item, i) => html`
                      <div class="time__item" index="${i}" @click="${this.handleTimeItemTap}">${item}</div>                    
                    `
                  )
                }
                ${this.__getDummyPickerTimeItem()}
              </div>
            </div>
            <div class="save" @click="${this.handleSaveClick}">save</div>
          </div>
        </div>
`
  }

  __render() {
    render(this.__template(), document.getElementById('app'));
  }

  handleItemClick(e) {
    // this.selectedNo = Number(e.currentTarget.getAttribute('index'));
    // this.__render();
  }

  handleTimeClick(e) {
    this.selectedNo = Number(e.currentTarget.getAttribute('index'));
    const date = new Date(this.list[this.selectedNo].time);
    this.__moveHourPicker(date.getHours());
    this.__moveTimePicker(date.getMinutes());
    this.__render();
  }

  handleAddClick() {
    this.store.add({
      time: Date.now(),
      text: ''
    });
  }

  handleSaveClick() {
    const selectedNo = this.selectedNo;
    this.selectedNo = -1;
    const hour = Math.round(document.querySelector('.hour').scrollTop / this.cpPickerRowHeight);
    const time = Math.round(document.querySelector('.time').scrollTop / this.cpPickerRowHeight);
    const date = new Date();
    date.setHours(hour);
    date.setMinutes(time);
    this.store.update(selectedNo, {
      time: date.getTime()
    });
  }

  handleLayerClick(e) {
    if (e.target.classList.contains('sheet') ) {
      this.selectedNo = -1;
      this.__render();
    }
  }

  handleHourScroll(e) {
    // e.target.scrollTop
    // console.log(e.target.scrollTop / this.cpPickerRowHeight);
    this.handleHourScrollEnd(e);
  }

  handleTimeScroll(e) {
    // e.target.scrollTop
    // console.log(e.target.scrollTop / this.cpPickerRowHeight);
    this.handleTimeScrollEnd(e);
  }

  handleHourScrollEnd(e) {
    console.log(e)
    console.log('Hour End', this.selectedNo);
  }

  handleTimeScrollEnd(e) {
    console.log('Time End', this.selectedNo);
  }

  handleDeleteClick(e) {
    e.stopPropagation();
    const index = Number(e.currentTarget.getAttribute('index'));
    this.store.remove(index);
  }

  handleTextChange(e) {
    const index = Number(e.currentTarget.getAttribute('index'));
    this.store.update(index, {
      text: e.target.value
    })
  }

  handleHourItemTap(e) {
    const index = Number(e.currentTarget.getAttribute('index'));
    this.__moveHourPicker(index);
  }

  handleTimeItemTap(e) {
    const index = Number(e.currentTarget.getAttribute('index'));
    this.__moveTimePicker(index);
  }

  __moveHourPicker(index) {
    this.root.querySelector('.hour').scrollTo(0, index * this.cpPickerRowHeight);
  }

  __moveTimePicker(index) {
    this.root.querySelector('.time').scrollTo(0, index * this.cpPickerRowHeight);
  }

  __getDummyPickerHourItem() {
    return html`
      ${
        repeat(
          Array.from({length: Math.floor(this.cpPickerRows / 2)}, (v, i) => i),
          () => html`
            <div class="hour__item hour__item--dummy"></div>              
          `
        )
      }
    `;
  }

  __getDummyPickerTimeItem() {
    return html`
      ${
        repeat(
          Array.from({length: Math.floor(this.cpPickerRows / 2)}, (v, i) => i),
          () => html`
            <div class="time__item time__item--dummy"></div>              
          `
        )
      }
    `;
  }
}
