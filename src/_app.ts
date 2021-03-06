import { html, render, svg } from 'lit-html';
import { repeat } from 'lit-html/directives/repeat';
import { classMap } from 'lit-html/directives/class-map';
// import debounce from './_debounce';
import { Store, TsItem } from './_store';

export default class App {
  store: Partial<Store>;
  list: TsItem[];
  selectedId: string;
  isSheetActive: boolean;
  root: HTMLElement;
  cpPickerRowHeight: number;
  cpPickerRows: number;

  constructor(store) {
    this.store = store;
    this.store.on('change', () => {
      this.list = this.store.all;
      this.__updateCustomProperty();
      this.__render();
    });

    this.list = this.store.all;
    this.selectedId = '';
    this.isSheetActive = false;

    // DOM・CustomProperty
    this.root = document.querySelector('#app');
    this.__getCustomProperty();
    this.__updateCustomProperty();


    // hanler系
    this.handleAddClick = this.handleAddClick.bind(this);
    this.handleLayerClick = this.handleLayerClick.bind(this);
    this.handleSaveClick = this.handleSaveClick.bind(this);
    this.handleDeleteClick = this.handleDeleteClick.bind(this);
    this.handleTimeClick = this.handleTimeClick.bind(this);
    this.handleTextChange = this.handleTextChange.bind(this);
    this.handleHourItemTap = this.handleHourItemTap.bind(this);
    this.handleTimeItemTap = this.handleTimeItemTap.bind(this);
    this.handleCheckClick = this.handleCheckClick.bind(this);
    this.handleTextFocus = this.handleTextFocus.bind(this);
    this.handleTextBlur = this.handleTextBlur.bind(this);
    this.handleAllDelete = this.handleAllDelete.bind(this);
  }

  $(selector) {
    return this.root.querySelector(selector);
  }

  $$(selector) {
    return this.root.querySelectorAll(selector);
  }

  __template() {
    return html`
      <div class="container">
        <div class="head">
          <div class="head__icon">
            ${svg`
              <svg viewBox="0 0 373.929 500">
                <g transform="translate(-64.548 0)">
                  <path class="cls-1" d="M256,343.319A23.283,23.283,0,0,0,269.556,301.1l-8.42-112.928c-.225-3.032-2.456-5.37-5.137-5.37s-4.911,2.338-5.136,5.37L242.443,301.1A23.283,23.283,0,0,0,256,343.319Z" transform="translate(-4.487 -6.241)"/>
                  <path class="cls-2" d="M423.778,242.355A187.656,187.656,0,0,0,96.49,210.841a184.458,184.458,0,0,0-17.244,175.9A186.922,186.922,0,0,0,195.923,491.66a187.665,187.665,0,0,0,210.611-73.41,184.437,184.437,0,0,0,17.243-175.9ZM251.512,173.2A142.652,142.652,0,0,1,369.69,235.533a140.617,140.617,0,0,1,13.133,134.026,143.022,143.022,0,0,1-249.486,24A140.609,140.609,0,0,1,120.2,259.539,142.568,142.568,0,0,1,251.512,173.2Z" transform="translate(0)"/>
                  <path class="cls-1" d="M431.28,140.634l-28.532-23.956-29.969,35.716,28.54,23.956Z" transform="translate(-8.974 -3.095)"/>
                  <path class="cls-2" d="M228.578,99.74v16.938h54.843V99.74a53.653,53.653,0,1,0-54.843,0Zm0-30.664V83c-.334-.308-.668-.617-.994-.943a40.189,40.189,0,1,1,56.839,0c-.334.326-.668.635-1,.943V69.076Z" transform="translate(-4.487)"/>
                </g>
              </svg>
            `}
          </div>
        </div>
        <div class="body">
          <div class="list">
            ${repeat(this.list, (item, i) => {
              const date = new Date(item.time);
              return html`
                <div
                  class="${classMap({
                    list__item: true,
                    item: true,
                    'item--selected': this.selectedId === item.id,
                    'item--add': !!item.add,
                    'item--delete': !!item.delete
                  })}"
                >
                  <div class="item__checkWrap" id="${item.id}" @click="${this.handleCheckClick}">
                    <div
                      class="${classMap({
                        item__check: true,
                        'item__check--checked': !!item.checked
                      })}"
                    >
                      <i class="material-icons">check</i>
                    </div>
                  </div>
                  <div class="item__timeWrap" id="${item.id}" @click="${this.handleTimeClick}">
                    <div class="item__time">
                      ${String(date.getHours()).padStart(2, '0')}:${String(
                        date.getMinutes()
                      ).padStart(2, '0')}
                    </div>
                  </div>
                  <div class="item__text">
                    <input
                      type="text"
                      .value="${item.text}"
                      placeholder="テキストを入力"
                      id="${item.id}"
                      @change="${this.handleTextChange}"
                      @focus="${this.handleTextFocus}"
                      @blur="${this.handleTextBlur}"
                    />
                  </div>
                  <div
                    class="item__delete"
                    id="${item.id}"
                    @click="${this.handleDeleteClick}"
                  >
                    <i class="material-icons">delete_outline</i>
                  </div>
                </div>
              `;
            })}
          </div>
          <div class="add" @click="${this.handleAddClick}">
            <i class="material-icons">add_circle</i>
          </div>
        </div>
        <div class="tail">
          <div class="tail__item" @click="${this.handleAllDelete}">
            <i class="material-icons">delete</i>
          </div>
        </div>
        <div
          class="${classMap({
            sheet: true,
            'sheet--active': this.isSheetActive
          })}"
          @click="${this.handleLayerClick}"
        >
          <div class="sheet__container">
            <div class="wrap">
              <div class="hour">
                ${this.__getDummyPickerHourItem()}
                ${repeat(
                  Array.from({ length: 24 }, (v, i) => i),
                  (item, i) => html`
                    <div
                      class="hour__item"
                      index="${i}"
                      @click="${this.handleHourItemTap}"
                    >
                      ${item}
                    </div>
                  `
                )}
                ${this.__getDummyPickerHourItem()}
              </div>
              <div class="time">
                ${this.__getDummyPickerTimeItem()}
                ${repeat(
                  Array.from({ length: 60 }, (v, i) => i),
                  (item, i) => html`
                    <div
                      class="time__item"
                      index="${i}"
                      @click="${this.handleTimeItemTap}"
                    >
                      ${item}
                    </div>
                  `
                )}
                ${this.__getDummyPickerTimeItem()}
              </div>
            </div>
            <div class="save" @click="${this.handleSaveClick}">save</div>
          </div>
        </div>
      </div>
    `;
  }

  __render() {
    render(this.__template(), document.getElementById('app'));
  }

  /**
   * 時間の押下時
   * @param e
   */
  handleTimeClick(e) {
    this.selectedId = e.currentTarget.getAttribute('id');
    this.isSheetActive = true;
    const found = this.list.find(v => v.id === this.selectedId);
    const date = new Date(found.time);
    this.__moveHourPicker(date.getHours());
    this.__moveTimePicker(date.getMinutes());
    this.__render();
  }

  /**
   * 追加押下時
   */
  handleAddClick() {
    const now = Date.now();
    this.store.add({
      id: `ts_${now}`,
      time: now,
      text: '',
      add: true
    });
  }

  /**
   * 保存押下時
   */
  handleSaveClick() {
    const selectedId = this.selectedId;
    this.selectedId = '';
    this.isSheetActive = false;
    const hour = Math.round(
      this.$('.hour').scrollTop / this.cpPickerRowHeight
    );
    const time = Math.round(
      this.$('.time').scrollTop / this.cpPickerRowHeight
    );
    const date = new Date();
    date.setHours(hour);
    date.setMinutes(time);
    this.store.update(selectedId, {
      time: date.getTime()
    });
  }

  /**
   * Sheetのレイヤー押下時
   * @param e
   */
  handleLayerClick(e) {
    if (e.target.classList.contains('sheet')) {
      this.selectedId = '';
      this.isSheetActive = false;
      this.__render();
    }
  }

  /**
   * 削除ボタン押下時
   * @param e
   */
  handleDeleteClick(e) {
    e.stopPropagation();
    const id = e.currentTarget.getAttribute('id');
    this.store.remove(id);
  }

  /**
   * テキストの変更時
   * @param e
   */
  handleTextChange(e) {
    const id = e.currentTarget.getAttribute('id');
    this.store.update(id, {
      text: e.target.value
    });
  }

  /**
   * HourPickerの押下時
   * @param e
   */
  handleHourItemTap(e) {
    const index = Number(e.currentTarget.getAttribute('index'));
    this.__moveHourPicker(index);
  }

  /**
   * TimePickerの押下時
   * @param e
   */
  handleTimeItemTap(e) {
    const index = Number(e.currentTarget.getAttribute('index'));
    this.__moveTimePicker(index);
  }

  /**
   * チェックボックスの押下時
   * @param e
   */
  handleCheckClick(e) {
    const id = e.currentTarget.getAttribute('id');
    const fount = this.list.find(v => v.id === id);
    this.store.update(id, {
      checked: !fount.checked
    });
  }

  /**
   * textのfocus時
   * @param e
   */
  handleTextFocus(e) {
    this.selectedId = e.currentTarget.getAttribute('id');
    this.__render();
  }

  /**
   * textのblur時
   * @param e
   */
  handleTextBlur(e) {
    this.selectedId = '';
    this.__render();
  }

  /**
   * 全削除
   */
  handleAllDelete() {
    this.store.removeAll();
  }

  /**
   * Custom Propertyを取得
   * @private
   */
  __getCustomProperty() {
    const style = window.getComputedStyle(this.root);
    this.cpPickerRowHeight = Number(
      style.getPropertyValue('--ts-picker-row-height').split('px')[0]
    );
    this.cpPickerRows = Number(style.getPropertyValue('--ts-picker-rows'));
  }

  /**
   * Custom Propertyを更新
   * @private
   */
  __updateCustomProperty() {
    const now = new Date().getTime();
    const list = this.list.filter(v => !v.delete);
    const endedList = list.filter(v => v.time < now);
    this.root.style.setProperty('--ts-ended-bar-height', `${endedList.length}`);
    // listの要素数を設定
    this.root.style.setProperty('--ts-list-rows', `${list.length}`);
  }

  /**
   * HourPickerの更新
   * @param index
   * @private
   */
  __moveHourPicker(index) {
    this.$('.hour').scrollTo(0, index * this.cpPickerRowHeight);
  }

  /**
   * TimePickerの更新
   * @param index
   * @private
   */
  __moveTimePicker(index) {
    this.$('.time').scrollTo(0, index * this.cpPickerRowHeight);
  }

  /**
   * pickerのダミー用のtemplateを取得
   * @private
   */
  __getDummyPickerHourItem() {
    return html`
      ${repeat(
        Array.from({ length: Math.floor(this.cpPickerRows / 2) }, (v, i) => i),
        () => html`
          <div class="hour__item hour__item--dummy"></div>
        `
      )}
    `;
  }

  /**
   * pickerのダミー用のtemplateを取得
   * @private
   */
  __getDummyPickerTimeItem() {
    return html`
      ${repeat(
        Array.from({ length: Math.floor(this.cpPickerRows / 2) }, (v, i) => i),
        () => html`
          <div class="time__item time__item--dummy"></div>
        `
      )}
    `;
  }
}
