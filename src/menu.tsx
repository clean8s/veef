import {PropType, Rx, RxComponent} from "./lib/rx";
import {IconKey, IconLibrary} from "./lib/icons";

var PropObject = {
    items: Object
};

type Props = {
    items: {[key: string]: (IconKey | {icon: IconKey, number: number})}
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

    get mainClasses() {
        return ["<md:translate-x-[-100%]", "transition-transform", "transform", "duration-300"];
        if((window as any).showMenu !== true) {
        return [ "flex", "<md:hidden"];
        }else{ 
        return [];
        }
    }

    get mainStyle() : string {
        return `position: fixed; inset: 0; z-index: 40; top: 70px; right: auto; flex-direction: column;`
    }

    reactRender(props: Props) {
        let items = props.items || [];

        return <div class="menu-big relative flex-grow" style="background: #fafafa">
            <div class="flex flex-col sm:flex-row sm:justify-around">
                <div class="w-72 h-screen">
                    <nav class="mt-10 px-6 ">

                        {Object.entries(items).map(([k, v]) => {
                            let right = <></>;
                            let iconkey = v;
                            //@ts-ignore
                            let j = <jail/>
                            if(typeof v == 'object') {
                                iconkey = v.icon;
                                right = ( <button type="button" class="w-6 h-6 text-xs  rounded-full text-white bg-red-500">
                                    <span class="p-1">
                                        {v.number} <slot name="number" />
                                    </span>
                                </button>);
                            }
                            let icon = IconLibrary[iconkey as any as IconKey]({size: 20})

                            return  <a class="hover:text-gray-800 hover:bg-gray-200 flex items-center p-2 my-6 transition-colors dark:hover:text-white dark:hover:bg-gray-600 duration-200  text-gray-600 dark:text-gray-400 rounded-lg " href="#">
                                {icon}
                                <span class="mx-4 text-lg font-normal">
                                    {k}</span>
                                <span class="flex-grow text-right">{right}</span>
                            </a>
                        })}

                    </nav>
                </div>
            </div>
        </div>;
    }
}

@Rx("v-navwrap")
class NavWrap extends RxComponent<{}> {
    get mainClasses() : string[] {
        let _ = <div class="md:grid md:grid-cols-[18rem,1fr,min-content]" />
        return ("md:grid md:grid-cols-[18rem,1fr,min-content] md:pt-[70px] <md:pt-[200px]".split(" "))
    }
    showMenu () {
         document.querySelector("v-menu")?.classList.add("!translate-x-[0]")
        // this.setState({menu: Math.random()})
    }
    reactRender(props: {}) {
        return <div>
            <div class="md:w-72">
            </div>
            <div class="md:hidden fixed l-10 t-10" onClick={() => this.showMenu()}>
                <IconLibrary.Menu size={40} />
            </div>
        </div>
    }
}