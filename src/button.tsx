import {PropType, Rx, RxComponent} from "./lib/rx";
import {IconKey, IconLibrary} from "./lib/icons";
import {RenderableProps} from "preact";

var PropObject = {
    text: {type: String, default: "empty"},
    disabled: {type: Boolean, default: false}
};
type Props = PropType<typeof PropObject>;

@Rx("v-button", PropObject)
export class Menu extends RxComponent<Props> {
    componentDidMount() {
        super.componentDidMount()
    }

    reactRender(props: Props) {
        props
        let text = props.text || "empty";

        return <button {...this.props.disabled} class="m-0 flex rounded cursor-pointer transition tracking-wide font-medium border-0 bg-[#1976D2] hover:bg-[#135BA4] text-white uppercase px-5 py-2">
            <v-icon name="Success" class="mt-[2px] pr-2" />
            <span class="flex-grow">{text}</span>
        </button>
    }
}

declare global {
    namespace JSX {
        interface IntrinsicElements {
            "v-button": RenderableProps<Props | HTMLAttributes>;
        }
    }
}