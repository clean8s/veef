import {PropType, Rx, RxComponent} from "./lib/rx";
import {IconKey, IconLibrary} from "./lib/icons";

var PropObject = {
    text: {type: String, default: ""}
};

type Props = {
    text: string
};
// @ts-ignore
export const Demo = <v-empty text="This is a simple span">{<IconLibrary.Search />}</v-empty>

@Rx("v-nav", PropObject)
export class Menu extends RxComponent<Props> {
    constructor(props: Props) {
        super();
    
    }

    get mainClasses() {
        return `block bg-white shadow dark:bg-gray-800 z-40 sticky top-0 left-0 right-0`.split(" ")
    }
    reactRender(props: Props) {
        return (<nav class="bg-white shadow dark:bg-gray-800">
        <div class="w-[95%] max-w-320 px-6 py-2 mx-auto md:flex">
            <div class="flex items-center justify-between">
                <div>
                    <slot name="logo" />
                </div>
            
                <div class="flex md:hidden relative">
                    <button type="button" class="text-gray-500 dark:text-gray-200 hover:text-gray-600 dark:hover:text-gray-400 focus:outline-none focus:text-gray-600 dark:focus:text-gray-400" aria-label="toggle menu">
                        <svg viewBox="0 0 24 24" class="w-6 h-6 fill-current">
                            <path fill-rule="evenodd" d="M4 5h16a1 1 0 0 1 0 2H4a1 1 0 1 1 0-2zm0 6h16a1 1 0 0 1 0 2H4a1 1 0 0 1 0-2zm0 6h16a1 1 0 0 1 0 2H4a1 1 0 0 1 0-2z"></path>
                        </svg>
                    </button>
                    <label for={"menu-checkbox-" + this.customElement.getObjectId()} class="absolute inset-0 w-6 h-6 block opacity-[0]">m</label>
                </div>
            </div>
            <input type="checkbox" id={"menu-checkbox-" + this.customElement.getObjectId()} class="absolute hidden <md:peer-checked:block" />
            <div class="w-full md:flex md:items-center md:justify-between <md:hidden">
                <div class="flex flex-col px-2 py-3 -mx-4 md:flex-row md:mx-0 md:py-0">
                    <slot name="left" class="inline" />
                </div>
                
                <div class="relative">
                    <slot name="right" />
                </div>
            </div>
        </div>
    </nav>);
        let text = props.text || "";

        return <span class="select-text">{text} <slot/> </span>
    }
}
