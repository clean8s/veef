import React from 'react'
import { render } from './style'
import { Slottable, TmSlot } from './slottable'

export class Table extends Slottable {
  root: HTMLElement
  constructor() {
    super()
    this.root = this.attachShadow({ mode: 'open' }) as any as HTMLElement
  }

  connectedCallback() {
    this.render()
    this.slotSetup(this.root, () => this.render())
  }

  getTable(): HTMLElement {
    return this.root.querySelector('#table') as HTMLElement
  }

  static get observedAttributes() {
    return ['selectable', 'autosort']
  }

  private _selectable = false;

  get selectable() : boolean {
    return this._selectable;
  }

  set selectable(s: boolean) {
    this._selectable = s;
    this.render()
  }

  _autosort = 0;
  set autosort(i: number) {
    this._autosort = i;
    this.everSorted = false;
    this.render()
  }
  get autosort() {
    return this._autosort;
  }

  setActive(cell: HTMLTableCellElement) : void {
    [...this.querySelectorAll('td,th')].forEach(x => x.classList.remove('vf-active'));
    cell.classList.add('vf-active')
  }

  render() {
    const sl = this.shadowRoot.querySelector("slot");
    const parentPos = (c: HTMLElement): number => {
      //@ts-ignore
      return ([...c.parentElement.children] as HTMLElement[]).findIndex(x => x == (c))
    }

    type El = HTMLElement

    const clickHandle = (e: MouseEvent) => {
      this.everSorted = true

      // get the row that belongs to the clicked element
      let row = (e.target as El).closest('tr')
      if (!row) return

      // find location of row in respect to table
      const rowIndex = parentPos(row)
      if (rowIndex !== 0) return;

      // get the column that belongs to the clicked element
      let col = (e.target as El).closest('td')
      if (!col) return
      
      // find location of column in respect to table
      const colIndex = parentPos(col)

      // if we have a checkbox, ignore first column
      if(colIndex === 0 && this.selectable) return;

      this.setActive(col)
      
      const ascending = col.classList.toggle('desc')

      const getCellValue = (tr: HTMLTableRowElement, idx: number) : string => {
        if(typeof tr.children[idx] === 'undefined') return ''
        let td = tr.children[idx]

        if(td.hasAttribute("data-sort")) return td.getAttribute("data-sort") as string;
        if(td.textContent === null) return ''
        return td.textContent.trim()
      }

      type Comparer<T> = (a: T, b: T) => number

      // does a locale compare of two cells. can be plugged into .sort()
      const comparer: ((idx: number, asc: boolean) => Comparer<any>) = (idx: number, asc: boolean) =>
        (a, b) =>
          ((v1: any, v2: any) =>
            v1 !== '' && v2 !== '' && !isNaN(v1) && !isNaN(v2) ? v1 - v2 : v1.toString().localeCompare(v2))(
              getCellValue(asc ? a : b, idx),
              getCellValue(asc ? b : a, idx),
            )

      let tbody: HTMLElement | null = this.querySelector("tbody");
      let theTable: HTMLElement = tbody as HTMLElement;
      if(tbody === null) {
        theTable = this.querySelector("table") as HTMLElement;
      }

      Array.from(this.querySelectorAll('tr:nth-child(n+2)'))
        .sort(comparer(colIndex, ascending))
        .map(tr => theTable.appendChild(tr))
        .map(x => x.children[colIndex].classList.add('vf-active'))
    }

    render(
      <>
      <div class="hidden"><slot name="A">pad a eb sin</slot></div>
        <div id='table' class='w-full mb-8 overflow-hidden rounded-lg shadow-lg' onClick={e => clickHandle(e)}>
          <slot></slot>
        </div>
      </>,
      this.root,
    )

    if(this.selectable) {
      this.wasSelectable = true;
      this.setupSelect()
    } else if(this.wasSelectable) {
      this.wasSelectable = false;
      this.removeSelect()
    }

    if (!this.everSorted && this.slottedByTag("", "table").length > 0) {
      let idx = parseInt(this.autosort.toString());
      if(!isNaN(idx) && idx >= 0)
      this.headerColByIndex(idx).click()
    }
  }
  wasSelectable = false;

  removeSelect() {
    Array.from(this.querySelectorAll('td,th')).filter(x => x.classList.contains('vf-checkbox')).map(x => x.remove());
  }

  setupSelect() {
    const hasSelect: boolean = document.querySelector('.vf-checkbox') !== null;
    if(!hasSelect) {
      const checkbox = (selectAll?: boolean) => {
        const checkCol = document.createElement('td');
        checkCol.classList.add('vf-checkbox');
        const c = document.createElement('input');
        c.type = 'checkbox';
        checkCol.appendChild(c);
        checkCol.addEventListener('click', (e) => {
          if(!(e.target instanceof HTMLInputElement)) {
            c.checked = !c.checked;
          }
          const checkBoxes = ([...this.querySelectorAll('td.vf-checkbox input')] as HTMLInputElement[])
          checkBoxes.forEach(x => {
            if(selectAll === true) x.checked = c.checked;
          })
          const rows = checkBoxes.filter((x, idx) => idx != 0 && x.checked).map(x => x.closest('tr'));
          this.dispatchEvent(new CustomEvent('rowselect', {
            detail: rows
          }));
        });
        return checkCol;
      }
      this.querySelectorAll('tr').forEach((x, idx) => x.prepend(checkbox(idx === 0)))
    }
  }

  headerColByIndex(n: number) : HTMLElement {
    const i = n + (this.selectable ? 2 : 1);
    return this.querySelector(`tr:first-child>td:nth-child(${i})`) as HTMLElement;
  }

  everSorted = false
}
