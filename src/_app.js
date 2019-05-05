import {html, render} from "lit-html";
import {repeat} from "lit-html/directives/repeat";
import {classMap} from "lit-html/directives/class-map";

export default class App {
  constructor(store) {
    this.store = store;
    this.store.on('change', () => {
      this.__render();
    })

    this.list = this.store.get();
    this.selectedNo = -1;
    this.handleItemClick = this.handleItemClick.bind(this);
    this.handleAddClick = this.handleAddClick.bind(this);
    this.handleLayerClick = this.handleLayerClick.bind(this);
    this.handleSaveClick = this.handleSaveClick.bind(this);
  }

  __template() {
    return html`
      <div class="container">
        <div class="body">
          <div class="list">
            ${
              repeat(
                this.list,
                item => {
                  const date = new Date(item.time);
                  return html`
                    <div class="list__item item" @click="${this.handleItemClick}">
                      <div class="item__time">${date.getHours()}:${date.getMinutes()}</div>
                      <div class="item__text">${item.text}</div>
                    </div>
                  `
                }
              )
          }
          </div>
          <div class="add" @click="${this.handleAddClick}">追加</div>
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
              <div class="hour">
                ${
                  repeat(
                    Array.from({length: 24}, (v, i) => i),
                    item => html`
                      <div class="hour__item">${item}</div>                    
                    `
                  )
                }
                
              </div>
              <div class="time">
                ${
                  repeat(
                    Array.from({length: 60}, (v, i) => i),
                    item => html`
                      <div class="time__item">${item}</div>                    
                    `
                  )
                }  
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

  handleItemClick() {
    this.selectedNo = 1;
    this.__render();
  }

  handleAddClick() {
    this.selectedNo = 1;
    this.__render();
  }

  handleSaveClick() {
    this.store.add({
      time: Date.now(),
      text: 'clickkkkkk'
    });
    this.selectedNo = -1;
    this.__render();
  }

  handleLayerClick(e) {
    if (e.target.classList.contains('sheet') ) {
      this.selectedNo = -1;
      this.__render();
    }
  }
}
