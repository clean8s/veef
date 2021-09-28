import {PropType, Rx, RxComponent} from "./lib/rx";
import Icons, {IconKey} from "./lib/icons";

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
                            let right = <></>;
                            let iconkey = v;
                            if(typeof v == 'object') {
                                iconkey = v.icon;
                                right = ( <button type="button" class="w-6 h-6 text-xs  rounded-full text-white bg-red-500">
                                    <span class="p-1">
                                        {v.number}
                                    </span>
                                </button>);
                            }
                            let icon = Icons[iconkey as any]({size: 20})

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
        return ("grid grid-cols-[18rem,1fr,min-content]".split(" "))
    }
    reactRender(props: {}) {
        return <div>
            <div class="w-72">
            </div>
        </div>
    }
}