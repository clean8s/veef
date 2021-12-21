import React from 'react'
import { render } from './style'
import { Attrs, Props, Slottable, TmSlot } from './slottable'
import { Transformable } from './transformable';

@Props(["compare"], "doRender")
export class Table extends Transformable {
  sortCol = 0;
  asc = true;
  _compare = (el1: HTMLElement, el2: HTMLElement, colIndex: number) : number | undefined => {
    if(!el1.hasAttribute("data-sort") || !el2.hasAttribute("data-sort")) return undefined;
    //@ts-ignore
    return parseInt(el1.getAttribute("data-sort")) - parseInt(el2.getAttribute("data-sort"));
  }

  render() {
    const nicerStr = (cell: HTMLTableCellElement) : string | number => {
      if(cell.textContent === null) return "";
      let N = parseFloat(cell.textContent.trim())
      if(!isNaN(N)) return N;
      return cell.textContent.trim();
    }

    let cmp = (v1: string | number, v2: string | number) => {
      if(typeof v1 === 'number' && typeof v2 === 'number') {
        return v1 - v2;
      }

      return v1.toString().localeCompare(v2.toString());
    }

    const R = [...this.querySelectorAll("tr:not(:first-child)")].map((x, idx) => {
      return {el:x.children[this.sortCol] as HTMLTableCellElement, str: nicerStr(x.children[this.sortCol] as HTMLTableCellElement), idx }
    });
    
    R.sort((a, b) => {
      const maybeCmp = this._compare(a.el, b.el, this.sortCol)
      if(typeof maybeCmp !== 'undefined') return maybeCmp * (this.asc ? 1 : -1); 
      return cmp(a.str, b.str) * (this.asc ? 1 : -1);
    })
    const orderMap = Object.fromEntries(R.map((x, idx) => {
      return [idx, x.idx]
    }));

    let Check = () => {
      return <div onClick={(e) => { 
        if(!e.target) return;
        if(e.target.tagName == "input") {

        } else {
          e.target.querySelector('input').checked = !e.target.querySelector('input').checked;
        }}} class={"cursor-pointer px-4 w-[20px] py-3 border table-cell " }>
          <input type="checkbox" class="cursor-pointer" />
      </div>;
    }

    return <div class="w-full mb-8 overflow-hidden rounded-lg shadow-lg table">
        <div class="text-md cursor-pointer select-none font-semibold tracking-wide text-left text-gray-900 bg-gray-100 uppercase border-b border-gray-600 table-row">
          <Check/>
        {this.virtual("tr:first-child > td,th").map((x, idx) => {
            return <div class={"px-4 py-3 border table-cell " + (this.sortCol == idx ? "bg-[#FF660010]" : "")} tabIndex="0" onClick={(e) => {
              this.sortCol = idx;
              this.asc = !this.asc;
              this.doRender();
              e.preventDefault()
            }}>{x}
            {this.sortCol == idx ? <v-icon name={this.asc ? "Expand" : "Collapse"} /> : ""}
            </div>
        })}
        </div>
        {this.virtual("tr:not(:first-child)").map((x, idx) => {
          return <div class="table-row">
            <Check/>
            {this.virtual("tr:nth-child(" + (orderMap[idx] + 2) + ") > td").map((x, idx) => {
              return <div class={"px-4 py-3 border table-cell " + (idx == this.sortCol ? "font-bold bg-[#FF660010] border-[#FF660030]" : "") }><this.Portal>{x}</this.Portal></div>
            })}
            </div>
        })}
    </div>
  }
}