import {AssetSourceComponentProps} from 'sanity'
import type {ComponentType} from 'react'
import {Control} from 'react-hook-form'
import type {FieldDefinitionBase} from '@sanity/types'
import {FieldErrors} from 'react-hook-form'
import type {FileDefinition} from '@sanity/types'
import type {FileOptions} from '@sanity/types'
import {ForwardRefExoticComponent} from 'react'
import type {ImageDefinition} from '@sanity/types'
import type {ImageOptions} from '@sanity/types'
import {InputProps} from 'sanity'
import {JSX as JSX_2} from 'react'
import {Plugin as Plugin_2} from 'sanity'
import {RefAttributes} from 'react'
import type {SanityAssetDocument} from '@sanity/client'
import type {SanityImageAssetDocument} from '@sanity/client'
import {SVGProps} from 'react'
import {UseFormRegister} from 'react-hook-form'
import type {WidenInitialValue} from '@sanity/types'
import type {WidenValidation} from '@sanity/types'
import * as z from 'zod'

declare type Asset = FileAsset | ImageAsset

declare type AssetFormData = z.infer<ReturnType<typeof getAssetFormSchema>>

/**
 * Input component that automatically applies media tags when an asset is selected or uploaded.
 *
 * Apply explicitly to image/file fields that should be auto-tagged:
 * ```ts
 * import {AutoTagInput} from 'sanity-plugin-media'
 *
 * defineField({
 *   type: 'image',
 *   options: { mediaTags: ['product'] },   // also pre-filters the media browser
 *   components: { input: AutoTagInput },
 * })
 * ```
 *
 * Pass `mediaTags` as a prop to override or use without `options`:
 * ```ts
 * components: { input: (props) => <AutoTagInput {...props} mediaTags={['product']} /> }
 * ```
 */
export declare function AutoTagInput(props: AutoTagInputProps): JSX_2

export declare type AutoTagInputProps = InputProps & {
  mediaTags?: string[]
}

declare type CustomFields = {
  altText?: LocalizedString
  description?: LocalizedString
  opt?: {
    media?: {
      tags?: SanityReference[]
    }
  }
  title?: LocalizedString
}

declare type DetailsProps = {
  formUpdating: boolean
  handleCreateTag: (title: string) => void
  control: Control<AssetFormData>
  errors: FieldErrors<AssetFormData>
  register: UseFormRegister<AssetFormData>
  allTagOptions: TagSelectOption[]
  assetTagOptions: TagSelectOption[] | null
  currentAsset: Asset
  creditLine?: {
    enabled: boolean
    excludeSources?: string | string[] | undefined
  }
  locales?: Locale_2[]
}

declare type FileAsset = SanityAssetDocument &
  CustomFields & {
    _type: 'sanity.fileAsset'
  }

declare type FileMediaFieldConfig = Omit<FileDefinition, 'options'> &
  FieldDefinitionBase & {
    name: string
    mediaTags: string[]
    options?: Omit<FileOptions, 'mediaTags'>
  }

declare function getAssetFormSchema(
  locales?: {
    id: string
  }[]
): z.ZodObject<
  {
    altText:
      | z.ZodOptional<z.ZodString>
      | z.ZodObject<
          Record<string, z.ZodTypeAny>,
          'passthrough',
          z.ZodTypeAny,
          z.objectOutputType<Record<string, z.ZodTypeAny>, z.ZodTypeAny, 'passthrough'>,
          z.objectInputType<Record<string, z.ZodTypeAny>, z.ZodTypeAny, 'passthrough'>
        >
    creditLine:
      | z.ZodOptional<z.ZodString>
      | z.ZodObject<
          Record<string, z.ZodTypeAny>,
          'passthrough',
          z.ZodTypeAny,
          z.objectOutputType<Record<string, z.ZodTypeAny>, z.ZodTypeAny, 'passthrough'>,
          z.objectInputType<Record<string, z.ZodTypeAny>, z.ZodTypeAny, 'passthrough'>
        >
    description:
      | z.ZodOptional<z.ZodString>
      | z.ZodObject<
          Record<string, z.ZodTypeAny>,
          'passthrough',
          z.ZodTypeAny,
          z.objectOutputType<Record<string, z.ZodTypeAny>, z.ZodTypeAny, 'passthrough'>,
          z.objectInputType<Record<string, z.ZodTypeAny>, z.ZodTypeAny, 'passthrough'>
        >
    opt: z.ZodObject<
      {
        media: z.ZodObject<
          {
            tags: z.ZodNullable<
              z.ZodArray<
                z.ZodObject<
                  {
                    label: z.ZodString
                    value: z.ZodString
                  },
                  'strip',
                  z.ZodTypeAny,
                  {
                    value: string
                    label: string
                  },
                  {
                    value: string
                    label: string
                  }
                >,
                'many'
              >
            >
          },
          'strip',
          z.ZodTypeAny,
          {
            tags:
              | {
                  value: string
                  label: string
                }[]
              | null
          },
          {
            tags:
              | {
                  value: string
                  label: string
                }[]
              | null
          }
        >
      },
      'strip',
      z.ZodTypeAny,
      {
        media: {
          tags:
            | {
                value: string
                label: string
              }[]
            | null
        }
      },
      {
        media: {
          tags:
            | {
                value: string
                label: string
              }[]
            | null
        }
      }
    >
    originalFilename: z.ZodString
    title:
      | z.ZodOptional<z.ZodString>
      | z.ZodObject<
          Record<string, z.ZodTypeAny>,
          'passthrough',
          z.ZodTypeAny,
          z.objectOutputType<Record<string, z.ZodTypeAny>, z.ZodTypeAny, 'passthrough'>,
          z.objectInputType<Record<string, z.ZodTypeAny>, z.ZodTypeAny, 'passthrough'>
        >
  },
  'strip',
  z.ZodTypeAny,
  {
    opt: {
      media: {
        tags:
          | {
              value: string
              label: string
            }[]
          | null
      }
    }
    originalFilename: string
    altText?:
      | string
      | z.objectOutputType<Record<string, z.ZodTypeAny>, z.ZodTypeAny, 'passthrough'>
      | undefined
    creditLine?:
      | string
      | z.objectOutputType<Record<string, z.ZodTypeAny>, z.ZodTypeAny, 'passthrough'>
      | undefined
    description?:
      | string
      | z.objectOutputType<Record<string, z.ZodTypeAny>, z.ZodTypeAny, 'passthrough'>
      | undefined
    title?:
      | string
      | z.objectOutputType<Record<string, z.ZodTypeAny>, z.ZodTypeAny, 'passthrough'>
      | undefined
  },
  {
    opt: {
      media: {
        tags:
          | {
              value: string
              label: string
            }[]
          | null
      }
    }
    originalFilename: string
    altText?:
      | string
      | z.objectInputType<Record<string, z.ZodTypeAny>, z.ZodTypeAny, 'passthrough'>
      | undefined
    creditLine?:
      | string
      | z.objectInputType<Record<string, z.ZodTypeAny>, z.ZodTypeAny, 'passthrough'>
      | undefined
    description?:
      | string
      | z.objectInputType<Record<string, z.ZodTypeAny>, z.ZodTypeAny, 'passthrough'>
      | undefined
    title?:
      | string
      | z.objectInputType<Record<string, z.ZodTypeAny>, z.ZodTypeAny, 'passthrough'>
      | undefined
  }
>

declare type ImageAsset = SanityImageAssetDocument &
  CustomFields & {
    _type: 'sanity.imageAsset'
    creditLine?: LocalizedString
  }

declare type ImageMediaFieldConfig = Omit<ImageDefinition, 'options'> &
  FieldDefinitionBase & {
    name: string
    mediaTags: string[]
    options?: Omit<ImageOptions, 'mediaTags'>
  }

declare type Locale_2 = {
  title: string
  id: string
  [key: string]: unknown
}

declare type LocalizedString = string | Record<string, string>

export declare const media: Plugin_2<void | MediaToolOptions>

export declare const mediaAssetSource: {
  component: (props: AssetSourceComponentProps) => JSX_2
  icon: ForwardRefExoticComponent<
    Omit<SVGProps<SVGSVGElement>, 'ref'> & RefAttributes<SVGSVGElement>
  >
  name: string
  title: string
}

/**
 * Defines an image or file field with automatic media tag application when an asset is selected.
 *
 * Pass `mediaTags` at the top level — they are moved into `options.mediaTags` (for media browser
 * pre-filtering) and wire up {@link AutoTagInput} as the field component automatically:
 * ```ts
 * import {mediaField} from 'sanity-plugin-media'
 *
 * mediaField({
 *   name: 'coverImage',
 *   type: 'image',
 *   mediaTags: ['product-cover'],
 *   options: { hotspot: true },
 * })
 * ```
 *
 * For file fields, set `type: 'file'`:
 * ```ts
 * mediaField({ name: 'drawing', type: 'file', mediaTags: ['model-drawing'] })
 * ```
 */
export declare function mediaField(
  config: ImageMediaFieldConfig
): MediaFieldResult<ImageMediaFieldConfig>

export declare function mediaField(
  config: FileMediaFieldConfig
): MediaFieldResult<FileMediaFieldConfig>

declare type MediaFieldResult<
  T extends {
    mediaTags: string[]
  }
> = Omit<T, 'mediaTags'> & {
  options: {
    mediaTags: string[]
  }
  components: {
    input: typeof AutoTagInput
  }
} & WidenValidation &
  WidenInitialValue

export declare type MediaFileOptions = FileOptions & MediaTagsFieldOptions

export declare type MediaImageOptions = ImageOptions & MediaTagsFieldOptions

export declare type MediaTagsFieldOptions = {
  mediaTags?: string[]
}

export declare type MediaToolOptions = {
  maximumUploadSize?: number
  createTagsOnUpload?: boolean
  components?: {
    details?: ComponentType<
      DetailsProps & {
        renderDefaultDetails: (props: DetailsProps) => JSX_2.Element
      }
    >
  }
  creditLine?: {
    enabled: boolean
    excludeSources?: string | string[]
  }
  directUploads?: boolean
  /**
   * Optional locales following Sanity recommended scheme: [{ id, title }]
   * https://www.sanity.io/docs/studio/localization#k4da239411955
   */
  locales?: Locale_2[]
}

declare type SanityReference = {
  _ref: string
  _type: 'reference'
  _weak?: boolean
}

declare const tagOptionSchema: z.ZodObject<
  {
    label: z.ZodString
    value: z.ZodString
  },
  'strip',
  z.ZodTypeAny,
  {
    value: string
    label: string
  },
  {
    value: string
    label: string
  }
>

declare type TagSelectOption = z.infer<typeof tagOptionSchema>

export {}
