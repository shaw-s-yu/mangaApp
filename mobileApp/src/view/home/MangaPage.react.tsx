import {
  RouteProp,
  useNavigation,
  useRoute,
} from '@react-navigation/native'
import { useEffect, useLayoutEffect, useState } from 'react'
import {
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from 'react-native'
import {
  SERVER_API_URL,
  SERVER_STATIC_URL,
} from '../../utils/config'
import useApiFetcher from '../../hooks/useApiFetcher'
import ShimmerPlaceholder from '../../components/shimmers/ShimmerPlaceholder.react'
import PageShimmer from '../../components/shimmers/PageShimmer.react'
import ZoomableScrollView from '../../components/ZoomableScrollView.react'
import { useHeaderHeight } from '@react-navigation/elements'
import ImageCropper from '../../components/ImageCropper.react'
import React from 'react'

const Image = React.lazy(() => import('./Image.react'))

export default (): JSX.Element | null => {
  const route = useRoute<RouteProp<any>>()
  const {
    chapterID: currentChapterID,
    pageID: currentPageID,
    pagePath: currentPagePath,
  } = route.params ?? {}
  const [chapterID, setChapterID] = useState<string>(
    currentChapterID
  )
  const naviation = useNavigation()
  const [pageID, setPageID] =
    useState<string>(currentPageID)
  const [pagePath, setPagePath] =
    useState<string>(currentPagePath)

  const fetch = useApiFetcher()
  const { height, width } = useWindowDimensions()
  const headerHeight = useHeaderHeight()
  const [isCropping, setIsCropping] =
    useState<boolean>(false)
  const [isScrolling, setIsScrolling] =
    useState<boolean>(false)
  const [pressedTime, setPressedTime] = useState<number>(0)
  useEffect(() => {
    const handleCreateHistory = async () =>
      await fetch(
        `${SERVER_API_URL}/history/${chapterID}/${pageID}`,
        'POST'
      )
    if (chapterID !== '' && pageID !== '') {
      handleCreateHistory()
    }
  }, [pageID, pagePath, chapterID])

  useLayoutEffect(() => {
    naviation.setOptions({
      headerRight: () =>
        pressedTime > 300 &&
        !isScrolling && (
          <View>
            <Text style={styles.headerRight}>Cropping</Text>
          </View>
        ),
    })
  }, [pressedTime, naviation])
  return pageID !== '' &&
    pagePath !== '' &&
    chapterID !== '' ? (
    <View>
      <ZoomableScrollView
        scrollable={!isCropping}
        setIsScrolling={setIsScrolling}
        style={{
          width: width,
          height: height - headerHeight - 80,
        }}
        pressedTime={pressedTime}
        onPress={async (e) => {
          const { pageX } = e.nativeEvent
          let page
          if (pageX < width / 2) {
            const res = await fetch(
              `${SERVER_API_URL}/page/${pageID}/prev`,
              'GET',
              ['manga_image']
            )
            page = res.page
          } else {
            const res = await fetch(
              `${SERVER_API_URL}/page/${pageID}/next`,
              'GET',
              ['manga_image']
            )
            page = res.page
          }
          // TODO: handler no page found-> redirect to new page stating no page found
          setChapterID(page.chapterId)
          setPageID(page.id)
          setPagePath(page.path)
        }}
      >
        <ImageCropper
          isCropping={isCropping}
          isScrolling={isScrolling}
          imageUri={`${SERVER_STATIC_URL}/${pagePath}`}
          pressedTime={pressedTime}
          setPressedTime={setPressedTime}
          setIsCropping={setIsCropping}
        >
          <ShimmerPlaceholder fallback={<PageShimmer />}>
            <Image
              key="manga_image"
              width={width}
              height={height - headerHeight - 80}
              imageUri={`${SERVER_STATIC_URL}/${pagePath}`}
            />
          </ShimmerPlaceholder>
        </ImageCropper>
      </ZoomableScrollView>
    </View>
  ) : null
}

const styles = StyleSheet.create({
  headerRight: {
    marginRight: 24,
    color: 'rgb(21, 92, 161)',
  },
})
