import {PropType, Rx, RxComponent} from "./lib/rx";
import Icons, {IconKey} from "./lib/icons";

var PropObject = {
    items: Object
};

type Props = {
    items: {[key: string]: IconKey}
};

const items : Props["items"] = {
    "Example Item": "Code",
    "SomeThing": "Favorite"
}
// @ts-ignore
export const Demo = <v-menu items={items}/>

// import joi from "joi"

@Rx("v-menu", PropObject)
export class Menu extends RxComponent<Props> {
    constructor(props: Props) {
        super();
    }

    get mainStyle() : string {
        return `position: fixed; inset: 0; right: auto; display: flex; flex-direction: column;`
    }

    reactRender(props: Props) {
        let items = props.items || [];

        return <div class="relative flex-grow" style="background: #fafafa">
            <div class="flex flex-col sm:flex-row sm:justify-around">
                <div class="w-72 h-screen">
                    <nav class="mt-10 px-6 ">

                        {Object.entries(items).map(([k, v]) => {
                            return  <a class="hover:text-gray-800 hover:bg-gray-100 flex items-center p-2 my-6 transition-colors dark:hover:text-white dark:hover:bg-gray-600 duration-200  text-gray-600 dark:text-gray-400 rounded-lg " href="#">
                                {Icons[v]({size: 20})}
                                <span class="mx-4 text-lg font-normal">
                                    {k}</span>
                                <span class="flex-grow text-right" />
                            </a>
                        })}

                        <a class="hover:text-gray-800 hover:bg-gray-100 flex items-center p-2 my-6 transition-colors dark:hover:text-white dark:hover:bg-gray-600 duration-200  text-gray-600 dark:text-gray-400 rounded-lg " href="#">
                            <svg width="20" height="20" fill="currentColor" class="m-auto" viewBox="0 0 2048 1792" xmlns="http://www.w3.org/2000/svg">
                                <path d="M960 0l960 384v128h-128q0 26-20.5 45t-48.5 19h-1526q-28 0-48.5-19t-20.5-45h-128v-128zm-704 640h256v768h128v-768h256v768h128v-768h256v768h128v-768h256v768h59q28 0 48.5 19t20.5 45v64h-1664v-64q0-26 20.5-45t48.5-19h59v-768zm1595 960q28 0 48.5 19t20.5 45v128h-1920v-128q0-26 20.5-45t48.5-19h1782z">
                                </path>
                            </svg>
                            <span class="mx-4 text-lg font-normal">
                        Commerce
                    </span>
                            <span class="flex-grow text-right">
                        <button type="button" class="w-6 h-6 text-xs  rounded-full text-white bg-red-500">
                            <span class="p-1">
                                7
                            </span>
                        </button>
                    </span>
                        </a>

                    </nav>
                </div>
            </div>
        </div>;
    }
}

@Rx("v-navwrap")
class NavWrap extends RxComponent<{}> {
    get mainClasses() : string[] {
        return ("grid grid-cols-[18rem,1fr,min-content]".split(" "))
    }
    reactRender(props: {}) {
        return <div>
            <div class="w-72">
            </div>
        </div>
    }
}