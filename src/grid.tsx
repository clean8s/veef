import {PropType, Rx, RxComponent} from "./lib/rx";
import {IconKey, IconLibrary} from "./lib/icons";

var PropObject = {
    x: {type: Number, default: 0}
};

type Props = PropType<typeof PropObject>;

@Rx("v-grid", PropObject)
export class Grid extends RxComponent<Props> {
    constructor(props: Props) {
        super();
        console.log(props)
    }

    get mainStyle() : string {
        return "display: grid"
    }

    reactRender(props: Props) {
        return <></>
    }
}
