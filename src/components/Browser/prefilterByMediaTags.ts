import type {SanityClient} from '@sanity/client'
import groq from 'groq'
import type {Dispatch} from 'redux'
import type {AssetSourceComponentProps} from 'sanity'

import {inputs} from '../../config/searchFacets'
import {TAG_DOCUMENT_NAME} from '../../constants'
import {searchActions} from '../../modules/search'
import type {Tag} from '../../types'

/**
 * Extracts and normalizes mediaTags from schema field options.
 * Returns unique, trimmed, non-empty tag names.
 */
export function getMediaTagNames(schemaType?: AssetSourceComponentProps['schemaType']): string[] {
  const mediaTags = (schemaType?.options as {mediaTags?: string[]} | undefined)?.mediaTags
  if (!mediaTags?.length) return []

  const unique = new Set(
    mediaTags.map(t => t?.trim()).filter((t): t is string => Boolean(t?.length))
  )
  return Array.from(unique)
}

/**
 * Resolves tag names to tag documents, then seeds search facets.
 * Returns true if facets were seeded (assets will load via search epic),
 * or false if caller should trigger a default load.
 */
export async function seedMediaTagFacets(
  client: SanityClient,
  dispatch: Dispatch,
  tagNames: string[]
): Promise<boolean> {
  if (!tagNames.length) return false

  const resolvedTags = await client.fetch<Array<Pick<Tag, '_id' | 'name'>>>(
    groq`*[
      _type == "${TAG_DOCUMENT_NAME}"
      && name.current in $tagNames
      && !(_id in path("drafts.**"))
    ]{ _id, name }`,
    {tagNames}
  )

  if (!resolvedTags?.length) return false

  const tagFacetInput = inputs.tag
  if (tagFacetInput.type !== 'searchable') return false

  for (const tag of resolvedTags) {
    dispatch(
      searchActions.facetsAdd({
        facet: {
          ...tagFacetInput,
          operatorType: 'references',
          value: {label: tag.name.current, value: tag._id}
        }
      })
    )
  }

  // Facets were seeded — assetsSearchEpic will trigger the initial load
  return true
}
