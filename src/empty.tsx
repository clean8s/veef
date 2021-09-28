import {PropType, Rx, RxComponent} from "./lib/rx";
import Icons, {IconKey} from "./lib/icons";

var PropObject = {
    text: String
};

type Props = {
    text: string
};
// @ts-ignore
export const Demo = <v-empty text="This is a simple span">{<Icons.Search />}</v-empty>

@Rx("v-empty", PropObject)
export class Menu extends RxComponent<Props> {
    constructor(props: Props) {
        super();
    }

    static get mainStyle() : string {
        return "display: inline-block"
    }

    reactRender(props: Props) {
        let text = props.text || "";

        return <span class="select-text">{text} <slot/> </span>
    }
}
