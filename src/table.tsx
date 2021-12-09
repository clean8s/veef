import React from 'react'
import { render } from './style'
import { Attrs, Slottable, TmSlot } from './slottable'

@Attrs(["selectable", "sortable"], ["selectable", "sortable", "compare"])
export class Table extends Slottable {
  root: HTMLElement
  _selectable = true;
  _sortable = true;
  _autosort = 0;
  _compare = (el1: HTMLElement, el2: HTMLElement, colIndex: number) : number | undefined => {
    if(colIndex !== 3) return undefined;
    //@ts-ignore
    return parseInt(el1.getAttribute("data-sort")) - parseInt(el2.getAttribute("data-sort"));
  }
  
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

  setActive(cell: HTMLTableCellElement) : void {
    [...this.querySelectorAll('td,th')].forEach(x => x.classList.remove('vf-active'));
    cell.classList.add('vf-active')
  }

  render() {
    const parentPos = (c: HTMLElement): number => {
      //@ts-ignore
      return ([...c.parentElement.children] as HTMLElement[]).findIndex(x => x === c)
    }

    type El = HTMLElement
    const sortHandler = (e: MouseEvent) => {
      if(!this._sortable) return;

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
      if(colIndex === 0 && this._selectable) return;

      this.setActive(col)
      
      const ascending = col.classList.toggle('desc')

      let tbody: HTMLElement | null = this.querySelector("tbody");
      let theTable: HTMLElement = tbody as HTMLElement;
      if(tbody === null) {
        theTable = this.querySelector("table") as HTMLElement;
      }

      const nicerStr = (cell: HTMLTableCellElement) : string | number => {
        if(cell.textContent === null) return "";
        let N = parseFloat(cell.textContent.trim())
        if(!isNaN(N)) return N;
        return cell.textContent.trim();
      }

      let comparer = (a: Element, b: Element): number => {
        let col1 = a.children[colIndex] as HTMLTableCellElement;
        let col2 = b.children[colIndex] as HTMLTableCellElement;
        
        const maybeCmp = this._compare(col1, col2, colIndex)
        if(typeof maybeCmp !== 'undefined') return maybeCmp;

        let v1 = nicerStr(col1);
        let v2 = nicerStr(col2);
        if(typeof v1 === 'number' && typeof v2 === 'number') {
          return v1 - v2;
        }

        return v1.toString().localeCompare(v2.toString());
      }

      Array.from(this.querySelectorAll('tr:nth-child(n+2)'))
        .sort((a, b) => comparer(ascending ? a : b, ascending ? b : a))
        .map(tr => theTable.appendChild(tr))
        .map(x => x.children[colIndex].classList.add('vf-active'))
    }

    render(
      <>
      <div class="hidden"><slot name="A">pad a eb sin</slot></div>
        <div id='table' class='w-full mb-8 overflow-hidden rounded-lg shadow-lg' onClick={e => sortHandler(e)}>
          <slot></slot>
        </div>
      </>,
      this.root,
    )
    

    if(this._selectable) {
      this.wasSelectable = true;
      this.setupSelect()
    } else if(this.wasSelectable) {
      this.wasSelectable = false;
      this.removeSelect()
    }

    if (!this.everSorted && this.slottedByTag("", "table").length > 0) {
      let idx = parseInt(this._autosort.toString());
      if(!isNaN(idx) && idx >= 0)
      this.headerColByIndex(idx).click()
    }

    this.slotMutations()
  }
  wasSelectable = false;

  slotHandled = new WeakMap<HTMLElement, boolean>();
  slotMutations() {
    // TODO: Don't leak memory if user keeps reslotting?
    const unHandled = this.slottedAny("").filter(x => !this.slotHandled.has(x));

    unHandled.forEach(x => {
      new MutationObserver((e) => {
        const changedRows = (x: MutationRecord) => {
          return ([...x.removedNodes, ...x.addedNodes]).filter(x => x instanceof HTMLTableRowElement).length > 0;
        }
        const newRows = e.filter(x => x.type === "childList" && changedRows(x));
        if(newRows.length > 0) {
          this.removeSelect()
          this.setupSelect()
        }
      }).observe(x, {childList: true, subtree: true});
      this.slotHandled.set(x, true);
    });
  }

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
    const i = n + (this._selectable ? 2 : 1);
    return this.querySelector(`tr:first-child>td:nth-child(${i})`) as HTMLElement;
  }

  everSorted = false
}
