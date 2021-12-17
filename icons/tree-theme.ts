import { StylingConfig, Base16Theme, Theme, StylingValue  } from 'react-base16-styling';
import monokai from "base16";
export { monokai };

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
    tree: (s: any) => {
      return {
        style: {...s.style, margin: undefined, padding: undefined},
        className: 'vf-tree',
      };
    },

    value: (s, x, y, z) => {
      return {
        style: {...s.style, 'margin-left': '1.2em'},
        className: `vf-tree-value-${JSON.stringify([x,y, z])}`,
      };
    },

    label: (s, x, y) => {
      return {
        style: {...s.style},
        className: `vf-tree-label`,
      }
    },
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