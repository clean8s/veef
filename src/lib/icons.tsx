import {VNode} from "preact";
export type Icon = (props: {size: number}) => VNode;
function sized(icon: any) : VNode {
    let IconComponent = (icon as Icon)
    return <IconComponent size={40} />
}

import Face from "@material-design-icons/svg/filled/face.svg"
export const FaceIcon = sized(Face);
