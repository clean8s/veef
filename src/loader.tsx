import {PropType, Rx, RxComponent} from "./lib/rx";
import {IconKey, IconLibrary} from "./lib/icons";

var PropObject = {

};

type Props = {

};

@Rx("v-loader", PropObject)
export class Menu extends RxComponent<PropType<typeof PropObject>> {
    constructor(props: Props) {
        super();
    }

    static get mainStyle() : string {
        return "display: inline-block"
    }

    reactRender(props: Props) {
        return (  <div class="w-full h-2 bg-gray-400 rounded-full mt-3">
        <div class="w-3/4 h-full text-center text-xs text-white bg-green-500 rounded-full">
        </div>
    </div>)
    }
}
