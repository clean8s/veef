import {PropType, Rx, RxComponent} from "./lib/rx";
import {IconKey, IconLibrary} from "./lib/icons";

var PropObject = {
    status: String,
    text: String
};

type Props = {
    status: string,
    text: string
};

type AlertClasses = "alert-info" | "alert-success" | "alert-warning" | "alert-error"

@Rx("v-infobox", PropObject)
export class Menu extends RxComponent<Props> {
    constructor(props: Props) {
        super();
    }

    get mainStyle() : string {
        return "display: block"
    }

    reactRender(props: Props) {
        let statusPair : {iconName: IconKey, alertClass: AlertClasses} = { iconName: "Warning", alertClass: "alert-warning" }

        if(props.status === 'info') {
            statusPair.iconName = "Info"
            statusPair.alertClass = "alert-info"
        }
        if(props.status === "success") {
            statusPair.iconName = "Success"
            statusPair.alertClass = "alert-success"
        }

        let text = props.text || "";

        return <div class={["alert", statusPair.alertClass].join(" ")}>
        <div class="flex-1">
            <v-icon name={statusPair.iconName} iconClass="w-6 h-6 mx-2 fill-current" />
          <label>{text}</label>
        </div>
      </div>      
    }
}
