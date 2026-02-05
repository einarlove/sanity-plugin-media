import type {MutationEvent, SanityClient} from '@sanity/client'
import groq from 'groq'
import {useEffect} from 'react'
import {useDispatch} from 'react-redux'
import type {AssetSourceComponentProps} from 'sanity'
import type {Dispatch} from 'redux'

import {TAG_DOCUMENT_NAME} from '../../constants'
import {assetsActions} from '../../modules/assets'
import {tagsActions} from '../../modules/tags'
import type {Asset, Tag} from '../../types'

import {getMediaTagNames, seedMediaTagFacets} from './prefilterByMediaTags'

function createAssetHandler(dispatch: Dispatch) {
  return (update: MutationEvent) => {
    const {documentId, result, transition} = update

    switch (transition) {
      case 'appear':
        dispatch(assetsActions.listenerCreateQueue({asset: result as Asset}))
        break
      case 'disappear':
        dispatch(assetsActions.listenerDeleteQueue({assetId: documentId}))
        break
      case 'update':
        dispatch(assetsActions.listenerUpdateQueue({asset: result as Asset}))
        break
      default:
        break
    }
  }
}

function createTagHandler(dispatch: Dispatch) {
  return (update: MutationEvent) => {
    const {documentId, result, transition} = update

    switch (transition) {
      case 'appear':
        dispatch(tagsActions.listenerCreateQueue({tag: result as Tag}))
        break
      case 'disappear':
        dispatch(tagsActions.listenerDeleteQueue({tagId: documentId}))
        break
      case 'update':
        dispatch(tagsActions.listenerUpdateQueue({tag: result as Tag}))
        break
      default:
        break
    }
  }
}

/**
 * Initializes the browser: loads assets (with optional mediaTags prefiltering),
 * fetches all tags, and subscribes to real-time updates.
 */
export function useBrowserInit(
  client: SanityClient,
  schemaType?: AssetSourceComponentProps['schemaType']
): void {
  const dispatch = useDispatch()

  useEffect(() => {
    const loadAssets = () => dispatch(assetsActions.loadPageIndex({pageIndex: 0}))

    // Initialize: prefilter by mediaTags if configured, otherwise load all assets
    const tagNames = getMediaTagNames(schemaType)

    if (tagNames.length) {
      seedMediaTagFacets(client, dispatch, tagNames)
        .then(seeded => {
          if (!seeded) loadAssets()
        })
        .catch(() => {
          loadAssets()
        })
    } else {
      loadAssets()
    }

    // Fetch all tags for the tags panel
    dispatch(tagsActions.fetchRequest())

    // Subscribe to real-time changes
    // Note: Sanity listeners ignore joins, order clauses, and projections
    const assetSubscription = client
      .listen(
        groq`*[_type in ["sanity.fileAsset", "sanity.imageAsset"] && !(_id in path("drafts.**"))]`
      )
      .subscribe(createAssetHandler(dispatch))

    const tagSubscription = client
      .listen(groq`*[_type == "${TAG_DOCUMENT_NAME}" && !(_id in path("drafts.**"))]`)
      .subscribe(createTagHandler(dispatch))

    return () => {
      assetSubscription.unsubscribe()
      tagSubscription.unsubscribe()
    }
  }, [client, dispatch, schemaType])
}
