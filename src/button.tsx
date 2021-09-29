import {PropType, Rx, RxComponent} from "./lib/rx";
import {IconKey, IconLibrary} from "./lib/icons";

var PropObject = {
    text: String
};

type Props = {
    text: string
};

@Rx("v-button", PropObject)
export class Menu extends RxComponent<Props> {
    constructor(props: Props) {
        super();
    }

    get mainStyle() : string {
        return "display: inline-block; margin-right: 0.5em;"
    }

    componentDidMount() {
        super.componentDidMount()
    }

    reactRender(props: Props) {
        let text = props.text || "empty";

        return <button class="m-0 flex cursor-pointer transition tracking-wide font-medium border-0 bg-[#1976D2] hover:bg-[#135BA4] text-white uppercase px-5 py-2">
            <v-icon name="Success" class="mt-[2px] pr-2" />
            <span class="flex-grow">{text}</span>
        </button>
    }
}
