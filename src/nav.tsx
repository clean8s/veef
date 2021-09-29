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

@Rx("v-nav", PropObject)
export class Menu extends RxComponent<Props> {
    constructor(props: Props) {
        super();
    
    }

    get mainClasses() {
        return `bg-white shadow dark:bg-gray-800 z-50 fixed left-0 right-0`.split(" ")
    }
    reactRender(props: Props) {
        return (<nav class="bg-white shadow dark:bg-gray-800">
        <div class="w-[95%] max-w-320 px-6 py-2 mx-auto md:flex">
            <div class="flex items-center justify-between">
                <div>
                    <object name="logo" />
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
                    <a href="#" class="px-2 py-1 text-sm font-medium text-gray-700 transition-colors duration-200 transform rounded dark:text-gray-200 hover:bg-gray-900 hover:text-gray-100 md:mx-2">Home</a>
                    <a href="#" class="px-2 py-1 text-sm font-medium text-gray-700 transition-colors duration-200 transform rounded dark:text-gray-200 hover:bg-gray-900 hover:text-gray-100 md:mx-2">About</a>
                    <a href="#" class="px-2 py-1 text-sm font-medium text-gray-700 transition-colors duration-200 transform rounded dark:text-gray-200 hover:bg-gray-900 hover:text-gray-100 md:mx-2">Contact</a>
                </div>
                
                <div class="relative">
                    <span class="absolute inset-y-0 left-0 flex items-center pl-3">
                        <svg class="w-5 h-5 text-gray-400" viewBox="0 0 24 24" fill="none">
                            <path d="M21 21L15 15M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
                        </svg>
                    </span>

                    <input type="text" class="w-full py-3 pl-10 pr-4 text-gray-700 bg-white border border-gray-300 rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-500 focus:outline-none focus:ring" placeholder="Search" />
                </div>
            </div>
        </div>
    </nav>);
        let text = props.text || "";

        return <span class="select-text">{text} <slot/> </span>
    }
}
