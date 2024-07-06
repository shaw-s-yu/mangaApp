import {
  Button,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native'
import {
  RouteProp,
  useRoute,
  useNavigation,
  NavigationProp,
} from '@react-navigation/native'
import { useEffect, useLayoutEffect, useState } from 'react'
import { SERVER_API_URL } from '../../utils/config'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { useIsFocused } from '@react-navigation/native'
import useApiFetcher from '../../hooks/useApiFetcher'
import MangaDetailShimmer from '../../components/shimmers/MangaDetailShimmer.react'
import ShimmerPlaceholder from '../../components/shimmers/ShimmerPlaceholder.react'
import Icon from 'react-native-vector-icons/Ionicons'

type ChapterType = {
  name: string
  id: string
}

export default (): JSX.Element => {
  const route = useRoute<RouteProp<any>>()
  const isFocused = useIsFocused()
  const navigation = useNavigation<NavigationProp<any>>()
  const { id } = route.params ?? {}
  const [chapters, setChapters] = useState<
    Array<ChapterType>
  >([])
  const [historyChapter, setHistoryChapter] =
    useState<any>()
  const [historyPage, setHistoryPage] = useState<any>()
  const [chapterOrderASC, setChapterOrderASC] =
    useState<boolean>(true)
  const fetch = useApiFetcher()
  useEffect(() => {
    const handleFetchChapters = async () => {
      const { chapters } = await fetch(
        `${SERVER_API_URL}/chapter/${id}`,
        'GET',
        ['detail_page']
      )
      setChapters([
        ...chapters.map(({ name = '', id = '' }) => ({
          name,
          id,
        })),
      ])
    }
    const handleFetchHistory = async () => {
      const { chapter, page } = await fetch(
        `${SERVER_API_URL}/history/${id}`,
        'GET',
        ['detail_page']
      )
      setHistoryChapter(chapter)
      setHistoryPage(page)
    }
    if (isFocused) {
      handleFetchChapters()
      handleFetchHistory()
    }
  }, [id, setHistoryChapter, setHistoryPage, isFocused])
  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity
          onPress={() => {
            setChapterOrderASC((datum) => !datum)
            setChapters((datum) => datum.reverse())
          }}
          style={styles.headerRightArrow}
        >
          <Icon
            name={
              chapterOrderASC
                ? 'chevron-up-outline'
                : 'chevron-down-outline'
            }
            size={24}
            color="rgb(21, 92, 161)"
          />
        </TouchableOpacity>
      ),
    })
  }, [navigation, setChapterOrderASC, chapterOrderASC])
  return (
    <ShimmerPlaceholder fallback={<MangaDetailShimmer />}>
      <View key="detail_page">
        {historyChapter != null && historyPage != null && (
          <Button
            onPress={async () => {
              console.log(historyPage)
              navigation.navigate('MangaPage', {
                pageID: historyPage.id,
                pagePath: historyPage.path,
                chapterID: historyPage.chapterId,
              })
            }}
            title={`Resume read chapter ${historyChapter.name} page ${historyPage.index}`}
          />
        )}
        <ScrollView>
          <View style={styles.chaptersContainer}>
            {chapters.map(({ name, id }) => (
              <View key={id} style={styles.chapterBox}>
                <TouchableOpacity
                  onPress={async () => {
                    const { page } = await fetch(
                      `${SERVER_API_URL}/page/${id}/first`,
                      'GET'
                    )
                    navigation.navigate('MangaPage', {
                      pageID: page.id,
                      pagePath: page.path,
                      chapterID: page.chapterId,
                    })
                  }}
                >
                  <Text>{name}</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        </ScrollView>
      </View>
    </ShimmerPlaceholder>
  )
}

const styles = StyleSheet.create({
  chaptersContainer: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 24,
    padding: 24,
    alignItems: 'stretch',
  },
  chapterBox: {
    borderStyle: 'solid',
    borderColor: 'black',
    borderWidth: 1,
    padding: 8,
    borderRadius: 10,
    width: 48,
    alignItems: 'center',
  },
  headerRightArrow: {
    marginRight: 16,
  },
})
