import {
  NavigationProp,
  RouteProp,
  useNavigation,
  useRoute,
} from '@react-navigation/native'
import { useEffect, useState } from 'react'
import { Image, View } from 'react-native'
import { fetchApi } from '../../utils/apiHelper'
import {
  SERVER_API_URL,
  SERVER_STATIC_URL,
} from '../../utils/config'
import useApiFetcher from '../../hooks/useApiFetcher'
import ShimmerPlaceholder from '../../components/ShimmerPlaceholder.react'
import PageShimmer from '../../components/shimmers/PageShimmer.react'

export default (): JSX.Element => {
  const [wrapperLayout, setWrapperLayout] = useState<{
    x: number
    y: number
  }>({
    x: 0,
    y: 0,
  })
  const route = useRoute<RouteProp<any>>()
  const { chapterID, pageID, pagePath } = route.params ?? {}
  const navigation = useNavigation<NavigationProp<any>>()
  const fetch = useApiFetcher()

  useEffect(() => {
    fetch(
      `${SERVER_API_URL}/history/${chapterID}/${pageID}`,
      'POST'
    )
  }, [fetch])
  return (
    <ShimmerPlaceholder fallback={<PageShimmer />}>
      <View
        onLayout={(e) =>
          setWrapperLayout({
            x: e.nativeEvent.layout.width,
            y: e.nativeEvent.layout.height,
          })
        }
        onTouchStart={async (e) => {
          const { pageX } = e.nativeEvent
          let page
          if (pageX < wrapperLayout.x / 2) {
            const res = await fetch(
              `${SERVER_API_URL}/page/${pageID}/prev`,
              'GET'
            )
            console.log(res)
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
        <Image
          style={{ height: 1000, width: 800 }}
          source={{
            uri: `${SERVER_STATIC_URL}/${pagePath}`,
          }}
          resizeMode="contain"
        />
      </View>
    </ShimmerPlaceholder>
  )
}
