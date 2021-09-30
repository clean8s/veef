import { PropType, Rx, RxComponent} from "./lib/rx";
import {IconKey, IconLibrary} from "./lib/icons";

var PropObject = {
    text: {type: String, default: ""},
};

type Props = PropType<typeof PropObject>;

@Rx("v-search", PropObject)
export class Menu extends RxComponent<Props> {
    constructor(props: Props) {
        super();
    }

    componentDidMount() {
        super.componentDidMount()
    }

    reactRender(props: Props) {
        let text = props.text || "empty";

        return <div class="flex">
        <input class="w-full rounded p-2 outline-none focus:ring-2 focus:sibling:ring-2" type="text" placeholder="Search..." />
        <button class="bg-white w-auto flex rounded-r justify-end items-center ring- text-blue-500 p-2 hover:text-blue-400">
            <v-icon name="Search" />
        </button>
    </div>
    }
}
