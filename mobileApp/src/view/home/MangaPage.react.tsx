import {
  NavigationProp,
  RouteProp,
  useNavigation,
  useRoute,
} from '@react-navigation/native'
import { useEffect, useState } from 'react'
import {
  Image,
  View,
  useWindowDimensions,
} from 'react-native'
import {
  SERVER_API_URL,
  SERVER_STATIC_URL,
} from '../../utils/config'
import useApiFetcher from '../../hooks/useApiFetcher'
import ShimmerPlaceholder from '../../components/ShimmerPlaceholder.react'
import PageShimmer from '../../components/shimmers/PageShimmer.react'
import ZoomableScrollView from '../../components/ZoomableScrollView.react'
import { useHeaderHeight } from '@react-navigation/elements'
import ImageCropper from '../../components/ImageCropper.react'

export default (): JSX.Element => {
  const route = useRoute<RouteProp<any>>()
  const { chapterID, pageID, pagePath } = route.params ?? {}
  const navigation = useNavigation<NavigationProp<any>>()
  const fetch = useApiFetcher()
  const { height, width } = useWindowDimensions()
  const headerHeight = useHeaderHeight()
  const [isCropping, setIsCropping] =
    useState<boolean>(false)

  useEffect(() => {
    const handleCreateHistory = async () =>
      await fetch(
        `${SERVER_API_URL}/history/${chapterID}/${pageID}`,
        'POST'
      )
    handleCreateHistory()
  }, [pageID])
  return (
    <View>
      <ZoomableScrollView
        scrollable={!isCropping}
        style={{
          width: width,
          height: height - headerHeight - 80,
        }}
        onPress={async (e) => {
          const { pageX } = e.nativeEvent
          let page
          if (pageX < width / 2) {
            const res = await fetch(
              `${SERVER_API_URL}/page/${pageID}/prev`,
              'GET'
            )
            page = res.page
          } else {
            const res = await fetch(
              `${SERVER_API_URL}/page/${pageID}/next`,
              'GET'
            )
            page = res.page
          }
          // TODO: handler no page found-> redirect to new page stating no page found
          navigation.navigate('MangaPage', {
            pageID: page.id,
            chapterID: page.chapterId,
            pagePath: page.path,
          })
        }}
      >
        <ImageCropper
          isCropping={isCropping}
          imageUri={`${SERVER_STATIC_URL}/${pagePath}`}
          setIsCropping={setIsCropping}
        >
          <ShimmerPlaceholder fallback={<PageShimmer />}>
            <Image
              style={{
                height: height - headerHeight - 80,
                width: width,
              }}
              source={{
                uri: `${SERVER_STATIC_URL}/${pagePath}`,
              }}
              resizeMode="contain"
            />
          </ShimmerPlaceholder>
        </ImageCropper>
      </ZoomableScrollView>
    </View>
  )
}
