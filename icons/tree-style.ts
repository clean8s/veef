import { StylingFunction, Base16Theme, Theme  } from 'react-base16-styling';
export const monokai = {
    scheme: 'monokai',
    author: 'wimer hazenberg (http://www.monokai.nl)',
    base00: '#272822',
    base01: '#383830',
    base02: '#49483e',
    base03: '#75715e',
    base04: '#a59f85',
    base05: '#f8f8f2',
    base06: '#f5f4f1',
    base07: '#f9f8f5',
    base08: '#f92672',
    base09: '#fd971f',
    base0A: '#f4bf75',
    base0B: '#a6e22e',
    base0C: '#a1efe4',
    base0D: '#66d9ef',
    base0E: '#ae81ff',
    base0F: '#cc6633',
  }

  const ArrowStyle = ({ style }: {style: any}, nodeType: string, expanded: boolean) => ({
    style: {
      // display: 'none'
    },
    className: `arrow arrow-${expanded ? "open" : "closed"}`
  });
  const ArrowWrapStyle = ({ style }: {style: any}, nodeType: string, expanded: boolean) => ({
    style: {
      ...style,
      'padding-right': 0,
      'vertical-align': 'middle'
    },
    className: `arr-wrap`
  });

export const VeefTheme = {
    extend: monokai,
    arrowSign: ArrowStyle,
    arrowContainer: ArrowWrapStyle,
    tree: (s) => {
      return {
        style: {...s.style, padding: '10px'},
        className: 'vf-tree'
      }
    }
} as Theme 