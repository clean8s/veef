import React from 'react'
import { render } from './style'
import { TmSlot } from './slottable'

export class Table extends TmSlot {
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
    return ['selectable']
  }

  private _selectable = false;

  get selectable() : boolean {
    return this._selectable;
  }

  set selectable(s: boolean) {
    this._selectable = s;
    this.render()
  }

  setActive(cell: HTMLTableCellElement) : void {
    [...this.querySelectorAll('td,th')].forEach(x => x.classList.remove('vf-active'));
    cell.classList.add('vf-active')
  }

  render() {
    const parentPos = (c: HTMLElement): number => {
      //@ts-ignore
      return ([...c.parentElement.children] as HTMLElement[]).findIndex(x => x.isEqualNode(c))
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
        <div id='table' class='w-full mb-8 overflow-hidden rounded-lg shadow-lg' onClick={e => clickHandle(e)}>
          <slot></slot>
        </div>
      </>,
      this.root,
    )

    if(this.selectable) {
      this.setupSelect()
    }

    if (!this.everSorted && '' in this.templates) {
      this.firstHeader().click()
    }
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
          if(selectAll === true) {
            ([...this.querySelectorAll('td.vf-checkbox input')] as HTMLInputElement[])
              .map((x) => x.checked = c.checked)
          }
        });
        return checkCol;
      }
      this.querySelectorAll('tr').forEach((x, idx) => x.prepend(checkbox(idx === 0)))
    }
  }

  firstHeader() : HTMLElement {
    const i = this.selectable ? 2 : 1;
    return this.querySelector(`tr:first-child>td:nth-child(${i})`) as HTMLElement;
  }

  everSorted = false
}
