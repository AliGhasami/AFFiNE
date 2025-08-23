import { cssVarV2 } from '@blocksuite/affine-shared/theme';
type Color = {
  name: string;
  color: string;
};
export const colorList: Color[] = [
  {
    name: 'Blue',
    //color: cssVarV2.table.headerBackground.blue,
    color: 'rgb(var(--pt-blue-0))',
  },
  {
    name: 'Green',
    //color: cssVarV2.table.headerBackground.green,
    color: 'rgb(var(--pt-green-0))',
  },
  {
    name: 'Grey',
    //color: cssVarV2.table.headerBackground.grey,
    color: 'rgb(var(--mt-gray-1))',
  },
  {
    name: 'Orange',
    //color: cssVarV2.table.headerBackground.orange,
    color: 'rgb(var(--mt-orange-0))',
  },
  /*{
    name: 'Purple',
    color: cssVarV2.table.headerBackground.purple,
  },*/
  {
    name: 'Red',
    //color: cssVarV2.table.headerBackground.red,
    color: 'rgb(var(--mt-red-0))',
  },
  /*{
    name: 'Teal',
    color: cssVarV2.table.headerBackground.teal,
  },*/
  {
    name: 'Yellow',
    //color: cssVarV2.table.headerBackground.yellow,
    color: 'rgb(var(--mt-yellow-0))',
  },
];

const colorMap = Object.fromEntries(colorList.map(item => [item.color, item]));

export const getColorByColor = (color: string): Color | undefined => {
  return colorMap[color] ?? undefined;
};
