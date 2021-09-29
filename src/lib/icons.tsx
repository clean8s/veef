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
import HeroIconStrings from "./heroicons";
import BrandSvgStrings from "./brands";

export type Icon = (props: { size: number, className: string }) => VNode;

function sized(icon: string): IconComponent {
    // let IconComponent = (icon as Icon as IconComponent)
    const component = (props: RenderableProps<{size?: number, className?: string}>): VNode<any> => {
        let sizes: {width: number, height: number} | {} = {};
        if(typeof props.size === 'number') {
            sizes = {width: props.size, height: props.size}
        }
        return ParseSvgString(icon, {class: props.className || "fill-current", ...sizes})
    }
    return component
}

export type IconComponent = FunctionComponent<{size?: number, className?: string}>;

const IconLibrary = {
    "Home": sized(Home),
    "Add": sized(Add),
    "Search": sized(Search),
    "Bolt": sized(Bolt),
    "Code": sized(Code),
    "Edit": sized(Edit),
    "Save": sized(Save),
    "Pin": sized(Pin),
    "Person": sized(Person),
    "Notification": sized(Notification),
    "Close": sized(Close),
    "Menu": sized(Menu),
    "Expand": sized(Expand),
    "Collapse": sized(Collapse),
    "LeftChevron": sized(LeftChevron),
    "RightChevron": sized(RightChevron),
    "Logout": sized(Logout),
    "Login": sized(Login),
    "List": sized(List),
    "Like": sized(Favorite),
    "Delete": sized(Delete),


    "Warning": sized(HeroIconStrings.Warning),
    "Success": sized(HeroIconStrings.Success),
    "Info": sized(HeroIconStrings.Info),
    "Refresh": sized(HeroIconStrings.Refresh),
    "Left": sized(HeroIconStrings.Left),
    "Right": sized(HeroIconStrings.Right),
    "Down": sized(HeroIconStrings.Down),
    "Up": sized(HeroIconStrings.Up),
    "Upload": sized(HeroIconStrings.Upload),
    "Wifi": sized(HeroIconStrings.Wifi),
    "Settings": sized(HeroIconStrings.Settings),
    "Chart": sized(HeroIconStrings.Chart),
    "Time": sized(HeroIconStrings.Time),
    "Storage": sized(HeroIconStrings.Storage),
    "Zoomin": sized(HeroIconStrings.Zoomin),
    "Zoomout": sized(HeroIconStrings.Zoomout),
    "Link": sized(HeroIconStrings.Link),
    "Copy": sized(HeroIconStrings.Copy),
    "Lock": sized(HeroIconStrings.Lock),
    "Discord": sized(BrandSvgStrings.Discord),
    "Slack": sized(BrandSvgStrings.Slack),
    "Messenger": sized(BrandSvgStrings.Messenger),
    "Facebook": sized(BrandSvgStrings.Facebook),
    "Whatsapp": sized(BrandSvgStrings.Whatsapp),
    "Youtube": sized(BrandSvgStrings.Youtube),
    "Instagram": sized(BrandSvgStrings.Instagram),
    "Twitter": sized(BrandSvgStrings.Twitter),
    "Tiktok": sized(BrandSvgStrings.Tiktok)
}

export const ParseSvgString = (svgString: string, wantedProps: RenderableProps<any>) : VNode => {
    const [_, viewBox, svgStr] = svgString.match(/<svg.*?viewBox="(.*?)".*?>(.*?)<\/svg>/s) as string[];
    //@ts-ignore
    return <svg dangerouslySetInnerHTML={{__html: svgStr}} {...wantedProps} viewBox={viewBox} />
}

export type IconKey = keyof typeof IconLibrary;
export { IconLibrary };

export default IconLibrary