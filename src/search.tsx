import {PropType, Rx, RxComponent} from "./lib/rx";
import {IconKey, IconLibrary} from "./lib/icons";

var PropObject = {
    text: String
};

type Props = {
    text: string
};

@Rx("v-search", PropObject)
export class Menu extends RxComponent<Props> {
    constructor(props: Props) {
        super();
    }

    get mainStyle() : string {
        return `box-shadow: var(--tw-shadow);
        --tw-shadow: 0 1px 3px 0 rgba(0,0,0, 0.3), 0 1px 2px 0 rgba(0,0,0, 0.1);
        display: block;`
    }

    componentDidMount() {
        super.componentDidMount()
    }

    reactRender(props: Props) {
        let text = props.text || "empty";

        return <div class="flex">
        <input class="w-full rounded p-2 outline-none focus:ring-2 focus:sibling:ring-2" type="text" placeholder="Search..." />
        <button class="bg-white w-auto flex justify-end items-center text-blue-500 p-2 hover:text-blue-400">
            <v-icon name="Search" />
        </button>
    </div>
    }
}
