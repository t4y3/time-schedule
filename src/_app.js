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
    })

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
                <div class="hour__item"></div>
                <div class="hour__item"></div>
                ${
                  repeat(
                    Array.from({length: 24}, (v, i) => i),
                    item => html`
                      <div class="hour__item">${item}</div>                    
                    `
                  )
                }
                <div class="hour__item"></div>
                <div class="hour__item"></div>
              </div>
              <div class="time" @scroll="${this.handleTimeScroll}">
                <div class="time__item"></div>
                <div class="time__item"></div>
                ${
                  repeat(
                    Array.from({length: 60}, (v, i) => i),
                    item => html`
                      <div class="time__item">${item}</div>                    
                    `
                  )
                }
                <div class="time__item"></div>
                <div class="time__item"></div>
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
    const hour = Math.round(document.querySelector('.hour').scrollTop / 30);
    const time = Math.round(document.querySelector('.time').scrollTop / 30);
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
    this.handleHourScrollEnd(e);
  }

  handleTimeScroll(e) {
    // e.target.scrollTop
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
}
