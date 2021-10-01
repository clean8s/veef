import {PropType, Rx, RxComponent} from "./lib/rx";
import {IconKey, IconLibrary} from "./lib/icons";
import {RenderableProps} from "preact";

var PropObject = {
    items: {type: Object, default: {}},
    mobileMenu: {type: Boolean, default: false}
};

type Props = PropType<typeof PropObject>;

const items : Props["items"] = {
    "Example Item": "Code",
    "SomeThing": "Like"
}

@Rx("v-sidebar", PropObject)
export class Menu extends RxComponent<PropType<typeof PropObject>> {
    constructor(props: Props) {
        super();
    }

    get mainClasses() {
        let add: string[] = [];
        if(!this.props.mobileMenu)
        add = ["transform", "<md:translate-x-[-100%]", "!<md:hidden"]
        return [...add, "md:sticky", "<md:fixed", "<md:z-50", "z-35"];
        if((window as any).showMenu !== true) {
        return [ "flex", "<md:hidden"];
        }else{ 
        return [];
        }
    }

    reactRender(props: Props) {
        return <div class="menu-big relative flex-grow bg-gray-100">
            <div class="flex flex-col sm:flex-row sm:justify-around">
                <div class="w-72 h-screen">
                    <nav class="mt-5 px-6 ">

                        {Object.entries(props.items).map(([k, v]) => {
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

                            return  <a class="hover:text-gray-800 hover:bg-gray-200 flex items-center p-2 my-4 transition-colors dark:hover:text-white dark:hover:bg-gray-600 duration-200  text-gray-600 dark:text-gray-400 rounded-lg " href="#">
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
        return ["flex"];
        let _ = <div class="md:grid md:grid-cols-[18rem,1fr,min-content] block" />
        return ("md:grid md:grid-cols-[18rem,1fr,min-content] block md:pt-[70px] <md:pt-[50px]".split(" "))
    }
    showMenu () {
        //@ts-expect-error
        document.querySelector("v-menu").mobileMenu = !document.querySelector("v-menu").mobileMenu;
        this.setState({menu: Math.random()})
    }
    reactRender(props: {}) {
        // return [];
        let Icon = IconLibrary.RightChevron;
        //@ts-expect-error
        if(document.querySelector("v-menu").mobileMenu) Icon = IconLibrary.LeftChevron;
        return (<button class="md:hidden fixed z-50 top-[6px] left-1 text-white p-1 bg-blue-600 rounded shadow block" onClick={() => this.showMenu()}>
        <Icon size={20} />
    </button>)
        return <div>
            <div class="md:w-72">
            </div>
            <button class="md:hidden fixed z-50 top-[10px] left-1 text-white p-1 bg-blue-900 rounded shadow block" onClick={() => this.showMenu()}>
                <Icon size={20} />
            </button>
        </div>
    }
}


declare global {
    namespace JSX {
        interface IntrinsicElements {
            "v-sidebar": RenderableProps<Partial<Props> | HTMLAttributes>;
        }
    }
}