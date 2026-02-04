import {useEffect, useRef} from 'react'
import {useClient, type ObjectInputProps} from 'sanity'
import {applyMediaTags} from '../../utils/applyMediaTags'
import {useToolOptions} from '../../contexts/ToolOptionsContext'

type AssetValue = {
  _type: 'image' | 'file'
  asset?: {
    _ref: string
    _type: 'reference'
  }
}

type MediaTagsOptions = {
  mediaTags?: string[]
}

/**
 * Wrapper component for image/file inputs that intercepts asset changes
 * to automatically apply media tags when assets are uploaded via
 * the native Sanity upload button.
 */
function AutoTagInputWrapper(props: ObjectInputProps) {
  const {renderDefault, value, schemaType} = props

  const client = useClient({apiVersion: '2022-10-01'})
  const {createTagsOnUpload} = useToolOptions()

  // Extract mediaTags from field options
  const mediaTags = (schemaType?.options as MediaTagsOptions | undefined)?.mediaTags

  // Track the previous asset ref to detect new uploads
  const prevAssetRef = useRef<string | undefined>(undefined)
  const isInitialMount = useRef(true)

  // Get current asset ref
  const currentAssetRef = (value as AssetValue | undefined)?.asset?._ref

  // Effect to detect when asset ref changes (new upload)
  useEffect(() => {
    // Skip on initial mount - we only want to catch new uploads, not existing values
    if (isInitialMount.current) {
      isInitialMount.current = false
      prevAssetRef.current = currentAssetRef
      return
    }

    const previousRef = prevAssetRef.current
    prevAssetRef.current = currentAssetRef

    // If we have a new asset ref and mediaTags are configured
    if (currentAssetRef && currentAssetRef !== previousRef && mediaTags && mediaTags.length > 0) {
      applyMediaTags({
        client,
        assetId: currentAssetRef,
        mediaTags,
        createTagsOnUpload
      }).catch(err => {
        // Log error but don't break the upload flow
        console.error('[sanity-plugin-media] Failed to apply auto-tags:', err)
      })
    }
  }, [currentAssetRef, mediaTags, client, createTagsOnUpload])

  // Always render default - no styling changes, purely functional wrapper
  return renderDefault(props)
}

export default AutoTagInputWrapper
