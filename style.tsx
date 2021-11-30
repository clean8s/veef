import React from 'react'
import windiCss from 'virtual:windi'

export const mainCss = `
v-search {
	display: block;
	box-shadow: var(--tw-shadow);
	--tw-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.3), 0 -1px 2px 0 rgba(0, 0, 0, 0.2);
	display: block;
	border-radius: 4px;
}

v-search:focus {
	outline: none;
}

v-loader {
	display: inline-block;
	width: 40px;
	height: 40px;
}

v-icon {
	width: 1.3em;
	height: 1.3em;
	display: inline-block;
	vertical-align: middle;
}

v-icon[all] {
	width: auto;
	height: auto;
	color: #CC3366;
}

v-icon[data-intent="message"] {
	width: 64px;
	height: 64px;
	color: #0066FF;
	display: block;
	margin: 0 auto;
}

button[data-intent] {
	cursor: pointer;
	display: inline-block;
	width: auto;
	border-radius: 0.35rem;
	font-weight: 600;
	font-size: 0.9rem;
	line-height: 1.5rem;
	padding-top: 0.5rem;
	padding-bottom: 0.5rem;
	padding-left: 2rem;
	padding-right: 2rem;
	--tw-shadow-color: 0, 0, 0;
	--tw-shadow: 0 4px 6px -1px rgba(var(--tw-shadow-color), 0.25), 0 2px 4px -1px rgba(var(--tw-shadow-color), 0.1);
	box-shadow: var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);
	text-align: center;
	--tw-text-opacity: 1;
	color: rgba(255, 255, 255, var(--tw-text-opacity));
	-webkit-transition-property: background-color, border-color, color, fill, stroke, opacity, -webkit-box-shadow, -webkit-transform, filter, backdrop-filter;
	-o-transition-property: background-color, border-color, color, fill, stroke, opacity, box-shadow, transform, filter, backdrop-filter;
	transition-property: background-color, border-color, color, fill, stroke, opacity, box-shadow, -webkit-box-shadow, transform, -webkit-transform, filter, backdrop-filter;
	transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
	transition-duration: 150ms;
	transition-timing-function: cubic-bezier(0.4, 0, 1, 1);
	transition-duration: 200ms;
	border: 0;
	color: #3366CC;
	filter: brightness(var(--bg));
	background: #fff;
	--bg: 1;
}

button[data-intent="primary"] {
	background-color: #3366CC;
	color: #fff;
}

button[data-intent]:hover {
	--bg: 0.85;
}

button[data-intent]:focus {
	outline: 2px solid transparent;
	outline-offset: 2px;
	--tw-ring-offset-shadow: var(--tw-ring-inset) 0 0 0 var(--tw-ring-offset-width) var(--tw-ring-offset-color);
	--tw-ring-shadow: var(--tw-ring-inset) 0 0 0 calc(2px + var(--tw-ring-offset-width)) var(--tw-ring-color);
	box-shadow: var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow, 0 0 #0000);
	--tw-ring-offset-opacity: 1;
	--tw-ring-offset-color: rgba(199, 210, 254, var(--tw-ring-offset-opacity));
	--tw-ring-opacity: 1;
	--tw-ring-color: rgba(99, 102, 241, var(--tw-ring-opacity));
}

section[data-intent="actions"] {
	display: flex;
	grid-gap: 1rem;
	gap: 1rem;
	justify-content: space-between;
	align-items: center;
}

section[data-intent="actions"] button {
	width: 100% !important;
	display: block;
}

v-table {
	margin: 10px 0;
	display: block;
}

v-table dl:first-child {
	cursor: pointer;
	background: rgb(243, 244, 246);
	text-align: left;
	text-transform: uppercase;
	letter-spacing: 0.025em;
	display: table-row;
	border-color: rgb(75, 85, 99);
	border-bottom-width: 1px;
	font-weight: 600;
}

v-table dt.vf-active {
	color: #3366CC;
    font-weight: 700;
}

v-table dl:hover {
    background: #eaeaeaa0;
}

v-table dt.vf-active:after {
	content: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%233366CC' width='18' height='18'%3E%3Cpath d='M16.59 8.59 12 13.17 7.41 8.59 6 10l6 6 6-6z'%3E%3C/path%3E%3C/svg%3E");
	vertical-align: middle;
}

v-table dt.vf-active.desc:after {
	content: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%233366CC' width='18' height='18'%3E%3Cpath d='m12 8-6 6 1.41 1.41L12 10.83l4.59 4.58L18 14z'%3E%3C/path%3E%3C/svg%3E");
	vertical-align: middle;
}

v-table dl {
	display: table-row;
	color: rgb(55, 65, 81);
	border-bottom: 0;
}

v-table dt {
	padding: 0.75rem 1rem;
	display: table-cell;
	border: 1px solid #e5e7eb;
}

v-alert {
	margin: 10px 0;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: space-between;
	background-color: hsla(var(--info) / 0.1);
	padding: 1rem;
	border-radius: 1rem;
	--in: 207 89.8% 53.9%;
	--su: 174 100% 29%;
	--wa: 36 100% 50%;
	--er: 14 100% 57.1%;
}

v-alert[warning] {
	background-color: hsla(var(--wa) / 0.1);
	color: hsla(var(--wa) / 1);
}

v-alert[info] {
	background-color: hsla(var(--in) / 0.1);
	color: hsla(var(--in) / 1);
}

v-alert[success] {
	background-color: hsla(var(--su) / 0.1);
	color: hsla(var(--su)/1);
}

v-alert[error] {
	background-color: hsla(var(--er) / 0.1);
	color: hsla(var(--er)/1);
}

@media (min-width: 768px) {
	v-alert {
		flex-direction: row;
	}
}
`
import { render as preactRender } from 'preact'
export const objCss = windiCss + mainCss
export const render: typeof preactRender = (x, y) => {
  preactRender(
    <>
      <style>{objCss}</style>
      {x}
    </>,
    y,
  )
}
