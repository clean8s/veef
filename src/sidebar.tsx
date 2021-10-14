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
        add = ["md:sticky", "<md:fixed", "up-box-shadow", "<md:border-t-1", "border-[#bbb]", "border-solid", "left-0", "md:w-150", "flex-grow", "flex", "top-0", "bottom-0", "h-screen", "<md:top-[80%]", "<md:w-full"] // "<md:translate-x-[-100%]"
        return [...add, "z-35"];
    }

    reactRender(props: Props) {
        return <div class="menu-big relative flex-grow bg-gray-100">
            <div class="flex flex-col sm:flex-row sm:justify-around">
                    <nav class="mt-5 px-6 <md:flex <md:flex-row">

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
        </div>;
    }
}

declare global {
    namespace JSX {
        interface IntrinsicElements {
            "v-sidebar": RenderableProps<Partial<Props> | HTMLAttributes>;
        }
    }
}