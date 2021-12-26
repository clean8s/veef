import React from 'react'
import { render } from './style'
import { Attrs, Props, OnAttr, Slottable, TmSlot } from './slottable'
import { Transformable } from './transformable';

@OnAttr(["sortable"], (t) => t.sortable = true)
@Props(["compare", "sortable"], "doRender")
export class Table extends Transformable {
  sortCol = 0;
  asc = true;
  _compare = (el1: HTMLElement, el2: HTMLElement, colIndex: number) : number | undefined => {
    if(!el1.hasAttribute("data-sort") || !el2.hasAttribute("data-sort")) return undefined;
    //@ts-ignore
    return parseInt(el1.getAttribute("data-sort")) - parseInt(el2.getAttribute("data-sort"));
  }
  _sortable = false;

  selectedIdx: Record<number, boolean> = {};

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

    let Check = (props: {idx: number, part: string}) => {
      const maybeChecked = {};
      if(this.selectedIdx[props.idx] === true) maybeChecked['checked'] = true;

      return <div part={props.part} onClick={(e) => { 
        if(!e.target) return;
        if(e.target.tagName == "input") {

        } else {
          const inp = e.target.querySelector('input');
          if(!inp) return;
          inp.checked = !inp.checked;
          inp.dispatchEvent(new Event("change"))
        }}} class={"cursor-pointer px-4 w-[20px] py-3 border table-cell " }>
          <input type="checkbox" onChange={(e) => {
            const checked = e.target!.checked;
            if(props.idx === -1) {
              this.selectedIdx = {};
              for(let i = 0; i < R.length; i++) {
                this.selectedIdx[i] = checked;
              }
            }
            if(checked)
              this.selectedIdx[props.idx] = true;
            else {
              delete this.selectedIdx[props.idx];
            }
            this.doRender()
          }} class="cursor-pointer" {...maybeChecked} />
      </div>;
    }

    return <div class="w-full mb-8 overflow-hidden rounded-lg shadow-lg table">
        <div part="row row-header" class="text-md cursor-pointer select-none font-semibold tracking-wide text-left text-gray-900 bg-gray-100 hover:bg-[#00000010] uppercase border-b border-gray-600 table-row">
          <Check part="cell cell-header" idx={-1}/>
        {this.virtual("tr:first-child > td,th").map((y, idx) => {
          const x = y.virtual;
          const active = this._sortable ? this.sortCol == idx : false;
            return <div part={"cell cell-header " + (active ? " cell-active" : "")} class={"px-4 py-3 border table-cell " + (active ? "bg-[#FF660010]" : "")} tabIndex="0" onClick={(e) => {
              this.sortCol = idx;
              this.asc = !this.asc;
              this.doRender();
              e.preventDefault()
            }}>{x}
            {active ? <v-icon name={this.asc ? "Expand" : "Collapse"} /> : ""}
            </div>
        })}
        </div>

        {/* Table body begin */}

        {this.virtual("tr:not(:first-child)").map((x, idx) => {
          return <div part="row" class="table-row hover:bg-[#00000010]">
            <Check idx={orderMap[idx]} part="cell" />
            {this.virtual("tr:nth-child(" + (orderMap[idx] + 2) + ") > td").map((x, idx) => {
              const active = this._sortable ? idx == this.sortCol : false;
              return <div part={"cell" + (active ? " cell-active" : "")}
                          class={"px-4 py-3 border table-cell " + (active ? "font-bold bg-[#FF660010] border-[#FF660030]" : "") }>
                <this.Portal>{x.virtual}</this.Portal>
              </div>
            })}
            </div>
        })}
    </div>
  }
}