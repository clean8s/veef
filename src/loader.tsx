import {PropType, Rx, RxComponent} from "./lib/rx";
import {IconKey, IconLibrary} from "./lib/icons";
import {RenderableProps} from "preact";

var PropObject = {
    spinner: {type: Boolean, default: false}
};

type Props = PropType<typeof PropObject>;
@Rx("v-loader", PropObject)
export class Loader extends RxComponent<PropType<typeof PropObject>> {
    constructor(props: Props) {
        super();
        
    }

    reactRender(props: Props) {
        if(props.spinner) {
            return <div class="rounded-full border-r-[transparent] border-current border-solid border-w-[5px] border-r-transparent animate-spin w-10 h-10"></div>
        }
        return (  <div class="w-full h-2 bg-gray-400 rounded-full mt-3">
        <div class="w-3/4 h-full text-center text-xs text-white bg-green-500 rounded-full">
        </div>
    </div>)
    }
}

declare global {
    namespace JSX {
        interface IntrinsicElements {
            "v-loader": RenderableProps<Partial<Props> | HTMLAttributes>;
        }
    }
}