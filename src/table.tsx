import {PropType, Rx, RxComponent} from "./lib/rx";
// import Icons, {IconKey} from "./lib/icons";

var PropObject = {
    col: {type: Boolean, default: false},
    row: {type: Boolean, default: false},
    head: {type: Boolean, default: false},
    main: {type: Boolean, default: false}
};

type Props = {
    col: boolean,
    row: boolean,
    head: Boolean,
    main: Boolean
};
// @ts-ignore
export const Demo = <v-table><v-table col>asdfasdfsadf</v-table><v-table col>asdsaf</v-table></v-table>

import {htmBound} from "./lib/rx"
import {RenderableProps} from "preact";

@Rx("v-table", PropObject)
export class Menu extends RxComponent<Props> {
    constructor(props: Props) {
        super();
    }

    renderRow() {
        return <td class="px-4 py-3 border"></td>
    }

    componentWillUnmount() {
        console.log("Table has been unmounted [TODO]")
    }
    
    get mainClasses() : string[] {
        if(this.props.main)
        return `w-full mb-8 overflow-hidden rounded-lg shadow-lg table`.split(" ")
        
        if(this.props.row && this.props.head)
        return `text-md font-semibold tracking-wide text-left text-gray-900 bg-gray-100 uppercase border-b border-gray-600 table-row`.split(" ")
        else if(this.props.row)
        return [ `text-gray-700`, `table-row`]

        if(this.props.col)
        return `px-4 py-3 border table-cell`.split(" ")
        return [];
    }
    reactRender(props: Props) {
        if(props.main) {
            return <></>
        }
        if(props.head) {
            return <></>
        }
        if(props.head && props.row) {
            return <></>
        }
        return <></>
    }
}

declare global {
    namespace JSX {
        interface IntrinsicElements {
            "v-table": RenderableProps<Props | HTMLAttributes>;
        }
    }
}