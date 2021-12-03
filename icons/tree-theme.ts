import { StylingConfig, Base16Theme, Theme, StylingValue  } from 'react-base16-styling';
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

const clsGen = (cls: string) => {
  return (s: any) => {
    return {
      ...s,
      className: cls,
    };
  }
}
  
const getDefaultThemeStyling = (theme: Base16Theme): StylingConfig => {
  return {
    tree: {...clsGen('vf-tree'),
      padding: '10px'
    },

    value: clsGen('vf-tree-value'),

    // label: {
    //   display: 'inline-block',
    //   color: colors.LABEL_COLOR,
    // },

    // valueLabel: {
    //   margin: '0 0.5em 0 0',
    // },

    valueText: clsGen('vf-tree-value-text'),

    itemRange: clsGen('vf-tree-item-range'),

    arrowSign: ArrowStyle,
    arrowContainer: ArrowWrapStyle,

    nestedNode: (
      { style },
    ) => ({
      style: {
        ...style,
      },
      className: 'vf-tree-nested-node',
    }),

    nestedNodeLabel: ({ style }, keyPath, nodeType, expanded, expandable) => ({
      style: {
        ...style,
      },
      className: 'vf-tree-node-label',
    }),

    nestedNodeItemString: ({ style }, keyPath, nodeType, expanded) => ({
      style: {
        ...style,
      },
      className: 'vf-tree-item-string',
    }),

    nestedNodeChildren: ({ style }, nodeType, expanded) => ({
      style: {
        ...style,
      },
      className: 'vf-tree-nested-node-children',
    }),

    rootNodeChildren: ({ style }) => ({
      style: {
        ...style,
      },
      className: 'vf-tree-root-node-children',
    }),
  };
};

  const ArrowStyle: StylingValue  = (s, x, open) => ({
    style: {
      // display: 'none'
    },
    className: `arrow arrow-${open ? "open" : "closed"}`
  });
  const ArrowWrapStyle: StylingValue = (s) => ({
    style: {
      ...s.style,
      'padding-right': 0,
      'vertical-align': 'middle'
    },
    className: `arr-wrap`
  });

export function VeefTheme(colors: Base16Theme): StylingConfig {
  return {
    extend: {...colors},
    ...getDefaultThemeStyling(colors)
  }
}