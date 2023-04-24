import { Button, Text, View } from 'react-native'
import {
  RouteProp,
  useRoute,
  useNavigation,
  NavigationProp,
} from '@react-navigation/native'
import { useEffect, useState } from 'react'
import { SERVER_API_URL } from '../../utils/config'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { useIsFocused } from '@react-navigation/native'
import useApiFetcher from '../../hooks/useApiFetcher'

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
  const fetch = useApiFetcher()
  useEffect(() => {
    const handleFetchChapters = async () => {
      const { chapters } = await fetch(
        `${SERVER_API_URL}/chapter/${id}`,
        'GET'
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
        'GET'
      )
      setHistoryChapter(chapter)
      setHistoryPage(page)
    }
    if (isFocused) {
      handleFetchChapters()
      handleFetchHistory()
    }
  }, [id, setHistoryChapter, setHistoryPage, isFocused])
  return (
    <View>
      {historyChapter != null && historyPage != null && (
        <Button
          onPress={async () => {
            const { page } = await fetch(
              `${SERVER_API_URL}/page/${historyPage?.id}/current`,
              'GET'
            )
            navigation.navigate('MangaPage', {
              pageID: page.id,
              pagePath: page.path,
              chapterID: page.chapterId,
            })
          }}
          title={`Resume read chapter ${historyChapter.name} page ${historyPage.index}`}
        />
      )}
      {chapters.map(({ name, id }) => (
        <View key={id}>
          <TouchableOpacity
            onPress={async () => {
              const { page } = await fetch(
                `${SERVER_API_URL}/page/${id}/first`,
                'GET'
              )
              console.log(page)
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
  )
}