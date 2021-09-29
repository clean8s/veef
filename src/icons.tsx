import { Rx, RxComponent } from "./lib/rx";
import IconLibrary, { IconComponent } from "./lib/icons";
import { RenderableProps } from "preact";

@Rx("v-icon", {name: String, size: Number, iconClass: String})
export class Icon extends RxComponent<{name: string, size: number, iconClass?: string}> {
    get mainStyle() {
        return "display: inline-block;"
    }
    reactRender() {
        let SingleIcon: IconComponent;
        if(this.props.name in IconLibrary) {
            const name : keyof typeof IconLibrary = this.props.name as any;
            SingleIcon = IconLibrary[name];
        } else {
            SingleIcon = IconLibrary.Bolt;
        }
        return <SingleIcon size={this.props.size || 20} className={this.props.iconClass || "w-5 h-5 fill-current"}/>
    }
}


declare global {
    namespace JSX {
      interface IntrinsicElements {
        "v-icon": RenderableProps<{name: string, size?: number, iconClass?: string}>;
      }
    }
  }