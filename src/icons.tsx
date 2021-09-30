import { PropType, Rx, RxComponent } from "./lib/rx";
import IconLibrary, { IconComponent } from "./lib/icons";
import { RenderableProps } from "preact";

const Props = {
    name: {type: String, default: "Bolt"},
    size: {type: Number, default: 20},
    iconClass: {type: String, default: "w-5 h-5 fill-current"}
}

@Rx("v-icon", Props)
export class Icon extends RxComponent<PropType<typeof Props>> {
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
        "v-icon": RenderableProps<{name: string, size?: number, iconClass?: string} | HTMLAttributes>;
      }
    }
  }