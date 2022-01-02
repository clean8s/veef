import Code from '@material-design-icons/svg/filled/code.svg'
import Delete from '@material-design-icons/svg/filled/delete.svg'
import Favorite from '@material-design-icons/svg/filled/favorite.svg'
import List from '@material-design-icons/svg/filled/list.svg'
import Login from '@material-design-icons/svg/filled/login.svg'
import Logout from '@material-design-icons/svg/filled/logout.svg'
import Search from '@material-design-icons/svg/filled/search.svg'
import Settings from '@material-design-icons/svg/filled/settings.svg'
import { Component, FunctionComponent, ReactComponentElement, ReactElement, ReactNode, ReactPropTypes } from 'react'
import React from 'react'

import LeftChevron from '@material-design-icons/svg/filled/chevron_left.svg'
import RightChevron from '@material-design-icons/svg/filled/chevron_right.svg'
import Close from '@material-design-icons/svg/filled/close.svg'
import Collapse from '@material-design-icons/svg/filled/expand_less.svg'
import Expand from '@material-design-icons/svg/filled/expand_more.svg'
import Menu from '@material-design-icons/svg/filled/menu.svg'

import Add from '@material-design-icons/svg/filled/add.svg'
import Bolt from '@material-design-icons/svg/filled/bolt.svg'
import CircleFilled from '@material-design-icons/svg/filled/circle.svg'
import Edit from '@material-design-icons/svg/filled/create.svg'
import Bold from '@material-design-icons/svg/filled/format_bold.svg'
import Italic from '@material-design-icons/svg/filled/format_italic.svg'
import Help from '@material-design-icons/svg/filled/help.svg'
import Home from '@material-design-icons/svg/filled/home.svg'
import Pause from '@material-design-icons/svg/filled/pause.svg'
import Pin from '@material-design-icons/svg/filled/place.svg'
import Start from '@material-design-icons/svg/filled/play_arrow.svg'
import Circle from '@material-design-icons/svg/filled/radio_button_unchecked.svg'
import Save from '@material-design-icons/svg/filled/save.svg'
import Stop from '@material-design-icons/svg/filled/stop.svg'
import Disabled from '@material-design-icons/svg/outlined/disabled_visible.svg'
import TeamGroup from '@material-design-icons/svg/filled/groups.svg'

import Error from '@material-design-icons/svg/filled/error.svg'
import Notification from '@material-design-icons/svg/filled/notifications.svg'
import Person from '@material-design-icons/svg/filled/person.svg'

import CreditCard from '@material-design-icons/svg/filled/credit_card.svg'
import Key from '@material-design-icons/svg/filled/vpn_key.svg'
import Lock from "@material-design-icons/svg/filled/lock.svg";
import Job from '@material-design-icons/svg/filled/work.svg'
import Calendar from '@material-design-icons/svg/filled/calendar_month.svg'
import Like from '@material-design-icons/svg/filled/thumb_up.svg'
import Dislike from '@material-design-icons/svg/filled/thumb_down.svg'
import Email from '@material-design-icons/svg/filled/alternate_email.svg'
import Phone from '@material-design-icons/svg/filled/phone.svg'
import Star from '@material-design-icons/svg/filled/star.svg'
import Speaker from '@material-design-icons/svg/filled/volume_up.svg'
import SpeakerOff from '@material-design-icons/svg/filled/volume_off.svg'
import CloudLine from '@material-design-icons/svg/filled/cloud.svg'
import Sun from '@material-design-icons/svg/filled/light_mode.svg'
import Brush from '@material-design-icons/svg/filled/brush.svg'
import Verified from '@material-design-icons/svg/filled/verified.svg'

import * as material  from "../material"

import BrandSvgStrings from './brands'
import HeroIconStrings from './heroicons'

import { VNode } from 'preact'
import { SpinComponent } from '../spinner'

export type Icon = React.FunctionComponent<{ size: number, className?: string }>

export function sized(icon: string, extra?: object): IconComponent {
  if (typeof extra == 'undefined') {
    extra = {}
  }

  const component = (): React.ReactElement => {
    return CreateSvgElement(icon, { style: 'width: 100%; height: 100%; fill: currentColor;', ...extra })
  }

  return component
}

export type IconComponent = FunctionComponent<{}>

import { ProgSvgStrings } from './programmingIcons'

const UnorderedSvgStrings: Record<string, string> = {
  'Home': Home,
  'Add': Add,
  'Search': Search,
  'Bolt': Bolt,
  'Code': Code,
  'Edit': Edit,
  'Save': Save,
  'Pin': Pin,
  'TeamGroup': TeamGroup,
  'Job': Job,
  'Person': Person,
  'Accessibility': material.filled_accessible,
  'Calendar': Calendar,
  'Notification': Notification,
  'Cloud': CloudLine,
  'Email': Email,
  'Watch': material.filled_watch,
  'Laptop': material.filled_laptop,
  'Phone': Phone,
  'Close': Close,
  'Menu': Menu,
  'Table': material.filled_table_view,
  'Form': material.filled_input,
  'Tree': material.filled_account_tree,
  'Grid': material.filled_grid_4x4,
  'Tabs': material.filled_tab,
  'Array': material.filled_data_array,
  'Expand': Expand,
  'Collapse': Collapse,
  'LeftChevron': LeftChevron,
  'RightChevron': RightChevron,
  'Logout': Logout,
  'Login': Login,
  'Password': material.filled_password,
  'List': List,
  'Bold': Bold,
  'Italic': Italic,
  'Checkmark': material.filled_check,
  'Circle': Circle,
  'CircleFilled': CircleFilled,
  'Pause': Pause,
  'Stop': Stop,
  'Start': Start,
  'Repeat': material.filled_repeat,
  'Headset': material.filled_headset,
  'MusicNote': material.filled_audiotrack,
  'Brush': Brush,
  'Delete': Delete,
  'Help': Help,
  'Error': Error,
  'Disabled': Disabled,
  'Preview': material.filled_visibility,
  'Fingerprint': material.filled_fingerprint,
  'CreditCard': CreditCard,
  'Key': Key,
  'Lock': Lock,
  'Speaker': Speaker,
  'SpeakerOff': SpeakerOff,
  'Sun': Sun,

  ...HeroIconStrings,
  ...BrandSvgStrings,
  'Verified': Verified,
  'Heart': Favorite,
  'Like': Like,
  'Dislike': Dislike,
  'Star': Star,
  ...ProgSvgStrings,
}

function reorder() : Record<string, IconComponent> {
  let IconLibraryEntries: [string, IconComponent][] = Object.entries(UnorderedSvgStrings).map(([k, v]) => [k, sized(v)]);
  let positions = Object.fromEntries(Object.keys(UnorderedSvgStrings).map((k, idx) => [k, idx]))
  positions["Moon"] = positions["Sun"];
  ["Left", "Right", "Down", "Up"].map(x => {
    positions[x] = positions["RightChevron"];
  })
  positions["Help"] = positions["Info"];
  positions["Error"] = positions["Info"]
  positions["Link"] = positions["Italic"]
  positions["Copy"] = positions["Italic"]
  positions["DotsVertical"] = positions["Close"]
  positions["Dots"] = positions["Close"]
  positions["Delete"] = positions["Save"]
  positions["Github"] = positions["Php"]
  positions["Chat"]  = positions["Phone"]
  positions["Video"] = positions["Chat"]
  positions["Photo"] = positions["Chat"]
  IconLibraryEntries.sort((a, b) => {
    const k1 = a[0];
    const k2 = b[0];
    return  positions[k1] - positions[k2];
  })
  return {Spinner: SpinComponent, ...Object.fromEntries(IconLibraryEntries)};
}

const IconLibrary = reorder()
export { IconLibrary }
export default IconLibrary


export const CreateSvgElement = (svgString: any, wantedProps: object): ReactElement => {
  // return svgString;
  const [_, viewBox, svgStr] = svgString.match(/<svg.*?viewBox="(.*?)".*?>(.*?)<\/svg>/s) as string[]
  //@ts-ignore
  return <svg dangerouslySetInnerHTML={{ __html: svgStr }} {...wantedProps} viewBox={viewBox} />
}

export type IconKey = keyof typeof IconLibrary

