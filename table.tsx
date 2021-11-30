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

  extractValue(x: HTMLElement, col: number): any {
    return x.textContent.trim()
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

  render() {
    const parentPos = (c: HTMLElement): number => {
      //@ts-ignore
      return ([...c.parentElement.children] as HTMLElement[]).findIndex(x => x.isEqualNode(c))
    }

    type El = HTMLElement

    const clickHandle = (e: PointerEvent) => {
      this.everSorted = true

      let row: El = (e.target as El).closest('tr')
      const rowIndex = parentPos(row)
      if (rowIndex !== 0) return;
      let col = (e.target as El).closest('td')
      const colIndex = parentPos(col)
      if(colIndex === 0 && this.selectable) return;
      [...this.querySelectorAll('td,th')].map(x => x.classList.remove('vf-active'))
      col?.classList.add('vf-active')
      const ascending = col.classList.toggle('desc')

      const getCellValue = (tr: El, idx: number) => tr.children[idx].textContent.trim()

      const comparer = (idx: number, asc: boolean) =>
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
              [...this.querySelectorAll('td.vf-checkbox input')].map((x) => x.checked = c.checked)
            }
          });
          return checkCol;
        }
        this.querySelectorAll('tr').forEach((x, idx) => x.prepend(checkbox(idx === 0)))
      }
    }

    if (!this.everSorted && '' in this.templates) {
      this.firstHeader().click()
    }
  }

  firstHeader() : HTMLElement {
    const i = this.selectable ? 2 : 1;
    return this.querySelector(`tr:first-child>td:nth-child(${i})`) as HTMLElement;
  }

  everSorted = false
}
