import { Rx, RxComponent } from "./lib/rx";
import IconLibrary, { IconComponent } from "./lib/icons";
import { RenderableProps } from "preact";

@Rx("v-icon", {name: String, size: Number, iconClass: String})
export class Icon extends RxComponent<{name: string, size: number, iconClass?: string}> {
    reactRender() {
        let SingleIcon: IconComponent;
        if(this.props.name in IconLibrary) {
            const name : keyof typeof IconLibrary = this.props.name as any;
            SingleIcon = IconLibrary[name];
        } else {
            SingleIcon = IconLibrary.Bolt;
        }
        return <SingleIcon size={this.props.size || undefined} className={this.props.iconClass || undefined}/>
    }
}


declare global {
    namespace JSX {
      interface IntrinsicElements {
        "v-icon": RenderableProps<{name: string, size?: number, iconClass?: string}>;
      }
    }
  }