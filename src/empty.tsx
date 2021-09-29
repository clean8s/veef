import {PropHints, PropType, Rx, RxComponent} from "./lib/rx";
import {IconKey, IconLibrary} from "./lib/icons";

var PropObject: PropHints = {
    text: {type: String, default: ""}
};

type Props = {
    text: string
};
// @ts-ignore
export const Demo = <v-empty text="This is a simple span">{<IconLibrary.Search />}</v-empty>

@Rx("v-empty", PropObject)
export class Menu extends RxComponent<Props> {
    constructor(props: Props) {
        super();
    }

    get mainStyle() : string {
        return "display: inline-block"
    }

    reactRender(props: Props) {
        let text = props.text || "";

        return <span class="select-text">{text} <slot/> </span>
    }
}
