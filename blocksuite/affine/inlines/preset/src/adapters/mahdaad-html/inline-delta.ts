//import { linkDeltaToHtmlAdapterMatcher } from '@blocksuite/affine-inline-link';
//import { referenceDeltaToHtmlAdapterMatcher } from '@blocksuite/affine-inline-reference';
import type {
  InlineHtmlAST,
  //MahdaadHtmlASTToDeltaExtension,
  //InlineDeltaToHtmlAdapterExtension,
  //MahdaadInlineDeltaToHtmlAdapterExtension,
  //InlineDeltaToMarkdownAdapterExtension,
} from '@blocksuite/affine-shared/adapters';
import { MahdaadInlineDeltaToHtmlAdapterExtension } from '@blocksuite/affine-shared/adapters';
import { ThemeProvider } from '@blocksuite/affine-shared/services';

const EventIcon = `<svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" role="img" width="1em" height="1em" viewBox="0 0 24 24" class="iconify iconify--tabler"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 5a2 2 0 0 1 4 0a7 7 0 0 1 4 6v3a4 4 0 0 0 2 3H4a4 4 0 0 0 2-3v-3a7 7 0 0 1 4-6M9 17v1a3 3 0 0 0 6 0v-1m6-10.273A11.05 11.05 0 0 0 18.206 3M3 6.727A11.05 11.05 0 0 1 5.792 3"></path></svg>`;

export const boldDeltaToMahdaadHtmlAdapterMatcher =
  MahdaadInlineDeltaToHtmlAdapterExtension({
    name: 'bold',
    match: delta => !!delta.attributes?.bold,
    toAST: (_, context) => {
      return {
        type: 'element',
        tagName: 'strong',
        properties: {},
        children: [context.current],
      };
    },
  });

export const italicDeltaToMahdaadHtmlAdapterMatcher =
  MahdaadInlineDeltaToHtmlAdapterExtension({
    name: 'italic',
    match: delta => !!delta.attributes?.italic,
    toAST: (_, context) => {
      return {
        type: 'element',
        tagName: 'em',
        properties: {},
        children: [context.current],
      };
    },
  });

export const strikeDeltaToMahdaadHtmlAdapterMatcher =
  MahdaadInlineDeltaToHtmlAdapterExtension({
    name: 'strike',
    match: delta => !!delta.attributes?.strike,
    toAST: (_, context) => {
      return {
        type: 'element',
        tagName: 'del',
        properties: {},
        children: [context.current],
      };
    },
  });

export const inlineCodeDeltaToMahdaadHtmlAdapterMatcher =
  MahdaadInlineDeltaToHtmlAdapterExtension({
    name: 'inlineCode',
    match: delta => !!delta.attributes?.code,
    toAST: (_, context) => {
      return {
        type: 'element',
        tagName: 'code',
        properties: {},
        children: [context.current],
      };
    },
  });

export const underlineDeltaToMahdaadHtmlAdapterMatcher =
  MahdaadInlineDeltaToHtmlAdapterExtension({
    name: 'underline',
    match: delta => !!delta.attributes?.underline,
    toAST: (_, context) => {
      return {
        type: 'element',
        tagName: 'u',
        properties: {},
        children: [context.current],
      };
    },
  });

export const highlightBackgroundDeltaToMahdaadHtmlAdapterMatcher =
  MahdaadInlineDeltaToHtmlAdapterExtension({
    name: 'highlight-background',
    match: delta => !!delta.attributes?.background,
    toAST: (delta, context, provider) => {
      const hast: InlineHtmlAST = {
        type: 'element',
        tagName: 'span',
        properties: {},
        children: [context.current],
      };
      if (!provider || !delta.attributes?.background) {
        return hast;
      }

      const theme = provider.getOptional(ThemeProvider);
      if (!theme) {
        return hast;
      }

      const backgroundVar = delta.attributes?.background.substring(
        'var('.length,
        delta.attributes?.background.indexOf(')')
      );
      const background = theme.getCssVariableColor(backgroundVar);
      return {
        type: 'element',
        tagName: 'mark',
        properties: {
          style: `background-color: ${background};`,
        },
        children: [context.current],
      };
    },
  });

export const highlightColorDeltaToMahdaadHtmlAdapterMatcher =
  MahdaadInlineDeltaToHtmlAdapterExtension({
    name: 'highlight-color',
    match: delta => !!delta.attributes?.color,
    toAST: (delta, context, provider) => {
      const hast: InlineHtmlAST = {
        type: 'element',
        tagName: 'span',
        properties: {},
        children: [context.current],
      };
      if (!provider || !delta.attributes?.color) {
        return hast;
      }

      const theme = provider.getOptional(ThemeProvider);
      if (!theme) {
        return hast;
      }

      const colorVar = delta.attributes?.color.substring(
        'var('.length,
        delta.attributes?.color.indexOf(')')
      );
      const color = theme.getCssVariableColor(colorVar);
      return {
        type: 'element',
        tagName: 'mark',
        properties: {
          style: `color: ${color};background-color: transparent`,
        },
        children: [context.current],
      };
    },
  });

export const mentionDeltaToMahdaadHtmlAdapterMatcher =
  MahdaadInlineDeltaToHtmlAdapterExtension({
    name: 'mention',
    match: delta => !!delta.attributes?.mention,
    toAST: (delta, context) => {
      const userId = delta.attributes.mention.user_id;
      let user: string = '';
      //@ts-ignore
      const userList: any[] = context.configs.has('mahdaad_config')
        ? context.configs.get('mahdaad_config').userList
        : []; //get(context,'configs.mahdaad_config.userList',[])
      //console.log("111",userList)
      const temp = userList.find(item => item._id == userId);
      if (temp) {
        user = temp.name as string;
      }
      return {
        type: 'element',
        tagName: 'span',
        properties: {
          className: ['mahdaad-mention'],
        },
        children: [
          {
            type: 'element',
            tagName: 'span',
            children: [
              {
                type: 'text',
                value: '@',
              },
            ],
          },
          {
            type: 'element',
            tagName: 'span',
            children: [
              {
                type: 'text',
                value: user,
              },
            ],
          },
        ],
      };
    },
  });

export const dateTimeDeltaToMahdaadHtmlAdapterMatcher =
  MahdaadInlineDeltaToHtmlAdapterExtension({
    name: 'date',
    match: delta => !!delta.attributes?.date,
    toAST: (delta, context) => {
      console.log('this is context ^^', context, delta);
      //@ts-ignore
      const convertDateTime =
        context.configs.get('mahdaad_config')?.convertDateTime;
      const _dateTime = delta.attributes?.date;
      let _date = _dateTime?.date;
      if (convertDateTime) {
        _date = convertDateTime(
          delta.attributes?.date.date,
          delta.attributes?.date.time
        );
      }
      const children = [];
      children.push({
        type: 'element',
        tagName: 'span',
        properties: {
          className: ['date'],
        },
        children: [
          {
            type: 'text',
            value: _date,
          },
        ],
      });

      if (_date) {
        /*if(_date.time) {
          children.push({
            type:'element',
            tagName:'span',
            properties: {
              className: ['time'],
            },
            children:[{
              type:'text',
              value:`- ${_date.time}`
            }]
          })
        }*/

        if (_dateTime?.event_at) {
          children.push({
            type: 'element',
            tagName: 'span',
            properties: {
              className: ['event'],
            },
            children: [
              {
                type: 'raw',
                value: EventIcon,
              },
            ],
          });
        }

        if (_dateTime?.meta) {
          const temp = JSON.parse(_dateTime?.meta);
          if (temp.title) {
            children.push({
              type: 'element',
              tagName: 'span',
              children: [
                {
                  type: 'text',
                  value: temp.title,
                },
              ],
            });
          }
        }
      }
      return {
        type: 'element',
        tagName: 'span',
        properties: {
          className: ['mahdaad-date-time'],
        },
        children,
      };
    },
  });

export const objectDeltaToMahdaadHtmlAdapterMatcher =
  MahdaadInlineDeltaToHtmlAdapterExtension({
    name: 'object',
    match: delta => !!delta.attributes?.mahdaadObjectLink,
    toAST: (delta, context) => {
      //const userId=delta.attributes.mention.user_id
      //let user : string= ''
      //@ts-ignore
      //const userList : any[]=context.configs.has('mahdaad_config') ? context.configs.get('mahdaad_config').userList : [] //get(context,'configs.mahdaad_config.userList',[])
      //console.log("111",userList)
      //const temp=userList.find(item=> item._id==userId)
      /*if(temp) {
        user=temp.name as string
      }*/

      //const {  walkerContext } = context;
      const objectId = delta.attributes?.mahdaadObjectLink?.object_id;
      //@ts-ignore
      const objectList: any[] = context.configs.has('mahdaad_config')
        ? context.configs.get('mahdaad_config')?.objectList ?? []
        : [];
      const object = objectList.find(item => item._id == objectId);
      if (
        !object ||
        (object.status && (object.status == '403' || object.status == '404'))
      )
        return;

      //@ts-ignore
      const storageUrl =
        context.configs.get('mahdaad_config')?.storageUrl ?? '';
      //@ts-ignore
      const minioStorageImageUrl =
        context.configs.get('mahdaad_config')?.minioStorageImageUrl ?? '';

      //@ts-ignore
      //const storageUrl=context.configs.get('mahdaad_config')?.storageUrl ?? ''
      //console.log("object",object,o.node.props);
      const children = [];

      if (object.object_type == 'image') {
        /*const _blockContainerWidth =   //blockContainerWidth.value - 15
        const imageOriginalSize = getImageOriginalSize()
        const temp = meta.value.width
          ? Math.min(convertVWToPX(meta.value.width), _blockContainerWidth)
          : Math.min(imageOriginalSize.width, _blockContainerWidth)
        element.value.width = temp.toString() //imageOriginalSize.width.toString()
        element.value.height = (
          meta.value.width
            ? +element.value.width * meta.value.aspectRatio
            : +element.value.width * imageOriginalSize.aspectRatio
        ).toString()*/
        const meta = delta.attributes?.mahdaadObjectLink?.meta ?? {};

        const width = convertVWToPX(meta.width);

        const style = meta.width
          ? `width:${width}px;height:${width * meta.aspectRatio}px`
          : ``;
        console.log('1111', meta, style);

        children.push(
          ...[
            {
              type: 'element',
              tagName: 'img',
              properties: {
                src:
                  object.meta && object.meta.bucket_name
                    ? `${minioStorageImageUrl}/${object.meta.storage}`
                    : `${storageUrl}/${object.meta.storage}`,
                style,
              },
            },
          ]
        );
      } else {
        children.push(
          ...[
            {
              type: 'element',
              tagName: 'span',
              properties: {
                className: ['icon'],
              },
              children: [
                {
                  type: 'raw',
                  value: object.iconSVG ?? '',
                },
              ],
            },
            {
              type: 'element',
              tagName: 'span',
              children: [
                {
                  type: 'text',
                  value: object.title,
                },
              ],
            },
          ]
        );
      }

      return {
        type: 'element',
        tagName: 'span',
        properties: {
          className: [
            'mahdaad-object-link-inline',
            object?.object_type,
            object.object_type == 'file' ? object.meta.type : '',
          ],
        },
        children,
      };
    },
  });

export const linkDeltaToMahdaadHtmlAdapterMatcher =
  MahdaadInlineDeltaToHtmlAdapterExtension({
    name: 'link',
    match: delta => !!delta.attributes?.link,
    toAST: (delta, _) => {
      const hast: InlineHtmlAST = {
        type: 'text',
        value: delta.insert,
      };
      const link = delta.attributes?.link;
      if (!link) {
        return hast;
      }
      return {
        type: 'element',
        tagName: 'a',
        properties: {
          href: link,
        },
        children: [hast],
      };
    },
  });

export const InlineDeltaToMahdaadHtmlAdapterExtensions = [
  boldDeltaToMahdaadHtmlAdapterMatcher,
  italicDeltaToMahdaadHtmlAdapterMatcher,
  strikeDeltaToMahdaadHtmlAdapterMatcher,
  underlineDeltaToMahdaadHtmlAdapterMatcher,
  highlightBackgroundDeltaToMahdaadHtmlAdapterMatcher,
  highlightColorDeltaToMahdaadHtmlAdapterMatcher,
  inlineCodeDeltaToMahdaadHtmlAdapterMatcher,
  mentionDeltaToMahdaadHtmlAdapterMatcher,
  dateTimeDeltaToMahdaadHtmlAdapterMatcher,
  objectDeltaToMahdaadHtmlAdapterMatcher,
  linkDeltaToMahdaadHtmlAdapterMatcher,
  //referenceDeltaToHtmlAdapterMatcher,
];
