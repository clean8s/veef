import {Component, FunctionComponent, RenderableProps, VNode} from "preact";
import Search from "@material-design-icons/svg/filled/search.svg"
import Settings from "@material-design-icons/svg/filled/settings.svg"
import Delete from "@material-design-icons/svg/filled/delete.svg"
import Favorite from "@material-design-icons/svg/filled/favorite.svg"
import Login from "@material-design-icons/svg/filled/login.svg"
import Logout from "@material-design-icons/svg/filled/logout.svg"
import List from "@material-design-icons/svg/filled/list.svg"
import Code from "@material-design-icons/svg/filled/code.svg"

import Close from "@material-design-icons/svg/filled/close.svg"
import Menu from "@material-design-icons/svg/filled/menu.svg"
import Expand from "@material-design-icons/svg/filled/expand_more.svg"
import Collapse from "@material-design-icons/svg/filled/expand_less.svg"
import LeftChevron from "@material-design-icons/svg/filled/chevron_left.svg"
import RightChevron from "@material-design-icons/svg/filled/chevron_right.svg"

import Add from "@material-design-icons/svg/filled/add.svg"
import Bolt from "@material-design-icons/svg/filled/bolt.svg"
import Edit from "@material-design-icons/svg/filled/create.svg"
import Save from "@material-design-icons/svg/filled/save.svg"
import Home from "@material-design-icons/svg/filled/home.svg"
import Pin from "@material-design-icons/svg/filled/pin.svg"

import Person from "@material-design-icons/svg/filled/person.svg"
import Notification from "@material-design-icons/svg/filled/notifications.svg"
import HeroIcons from "./heroicons";

export type Icon = (props: { size: number, className: string }) => VNode;

function sized(icon: string): IconComponent {
    // let IconComponent = (icon as Icon as IconComponent)
    const component = (props: RenderableProps<{size: number, className?: string}>): VNode<any> => {
        return ParseSvgString(icon, {width: props.size, height: props.size, class: props.className || "fill-current"})
    }
    return component
}

export type IconComponent = FunctionComponent<{size: number, className?: string}>;

const IconLibrary: {[k: string]: IconComponent} = {
    "Home": sized(Home),
    "Add": sized(Add),
    "Search": sized(Search),
    "Bolt": sized(Bolt),
    "Code": sized(Code),
    "Collapse": sized(Collapse),
    "Edit": sized(Edit),
    "Save": sized(Save),
    "Pin": sized(Pin),
    "Person": sized(Person),
    "Notification": sized(Notification),
    "Close": sized(Close),
    "Menu": sized(Menu),
    "Expand": sized(Expand),
    "LeftChevron": sized(LeftChevron),
    "RightChevron": sized(RightChevron),
    "Logout": sized(Logout),
    "Login": sized(Login),
    "List": sized(List),
    "Favorite": sized(Favorite),
    "Settings": sized(Settings),
    "Delete": sized(Delete),
    ...HeroIcons
}

export const ParseSvgString = (svgString: string, wantedProps: RenderableProps<any>) : VNode => {
    const svgStr = svgString.replace(/<svg.*?>(.*?)<\/svg>/gs, (m, match) => {
     return match;
    })
    //@ts-ignore
    return <svg dangerouslySetInnerHTML={{__html: svgStr}} {...wantedProps} />
}

export type IconKey = keyof typeof IconLibrary;
export { IconLibrary };