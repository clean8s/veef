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
import Repeat from '@material-design-icons/svg/filled/repeat.svg'
import Headset from '@material-design-icons/svg/filled/headset.svg'
import MusicNote from '@material-design-icons/svg/filled/audiotrack.svg'
import Disabled from '@material-design-icons/svg/outlined/disabled_visible.svg'

import Error from '@material-design-icons/svg/filled/error.svg'
import Notification from '@material-design-icons/svg/filled/notifications.svg'
import Person from '@material-design-icons/svg/filled/person.svg'

import BrandSvgStrings from './brands'
import HeroIconStrings from './heroicons'

import { VNode } from 'preact'
import { extraIcons } from '../spinner'

export type Icon = React.FunctionComponent<{ size: number, className?: string }>

export function sized(icon: string, extra?: object): IconComponent {
  if (typeof extra == 'undefined') {
    extra = {}
  }

  const component = (props: {}): React.ReactElement => {
    return ParseSvgString(icon, { style: 'width: 100%; height: 100%; fill: currentColor;', ...extra })
  }

  return component
}

export type IconComponent = FunctionComponent<{}>

const heroIcons: { [k in keyof typeof HeroIconStrings]: IconComponent } = Object.fromEntries(
  Object.entries(HeroIconStrings).map(([k, v]) => [k, sized(v)]),
) as any
const brandIcons: { [k in keyof typeof BrandSvgStrings]: IconComponent } = Object.fromEntries(
  Object.entries(BrandSvgStrings).map(([k, v]) => [k, sized(v)]),
) as any

import Repeat from '@material-design-icons/svg/filled/repeat.svg'
import Headset from '@material-design-icons/svg/filled/headset.svg'
import MusicNote from '@material-design-icons/svg/filled/audiotrack.svg'

const IconLibrary = {
  'Home': sized(Home),
  'Add': sized(Add),
  'Search': sized(Search),
  'Bolt': sized(Bolt),
  'Code': sized(Code),
  'Edit': sized(Edit),
  'Save': sized(Save),
  'Pin': sized(Pin),
  'Person': sized(Person),
  'Notification': sized(Notification),
  'Close': sized(Close),
  'Menu': sized(Menu),
  'Expand': sized(Expand),
  'Collapse': sized(Collapse),
  'LeftChevron': sized(LeftChevron),
  'RightChevron': sized(RightChevron),
  'Logout': sized(Logout),
  'Login': sized(Login),
  'List': sized(List),
  'Like': sized(Favorite),
  'Bold': sized(Bold),
  'Italic': sized(Italic),
  'Circle': sized(Circle),
  'CircleFilled': sized(CircleFilled),
  'Pause': sized(Pause),
  'Stop': sized(Stop),
  'Start': sized(Start),
  'Repeat': sized(Repeat),
  'Headset': sized(Headset),
  'MusicNote': sized(MusicNote),
  'Delete': sized(Delete),
  'Help': sized(Help),
  'Error': sized(Error),
  'Disabled': sized(Disabled),

  ...heroIcons,
  ...brandIcons,
  ...extraIcons,
}

export const ParseSvgString = (svgString: any, wantedProps: object): ReactElement => {
  // return svgString;
  const [_, viewBox, svgStr] = svgString.match(/<svg.*?viewBox="(.*?)".*?>(.*?)<\/svg>/s) as string[]
  //@ts-ignore
  return <svg dangerouslySetInnerHTML={{ __html: svgStr }} {...wantedProps} viewBox={viewBox} />
}

type IconToIcon = { [k in IconKey]: string }
export const IconNames: IconToIcon = Object.fromEntries(
  ([...Object.keys(IconLibrary)] as IconKey[]).map((x: IconKey) => [x, x]),
) as IconToIcon

export type IconKey = keyof typeof IconLibrary
export { IconLibrary }

export default IconLibrary
