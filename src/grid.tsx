import {PropType, Rx, RxComponent} from "./lib/rx";
import {IconKey, IconLibrary} from "./lib/icons";

var PropObject = {
    x: {type: Number, default: 0},
    cols: {type: Number, default: 1}
};

type Props = PropType<typeof PropObject>;

@Rx("v-grid", PropObject)
export class Grid extends RxComponent<Props> {
    constructor(props: Props) {
        super();
    }

    reactRender(props: Props) {
        return <></>
    }

    get mainClasses() : string[] {
        return [`gridn`, `n-${this.props.cols}`]
    }
}
