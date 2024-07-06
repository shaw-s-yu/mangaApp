import React, { useEffect, useState } from 'react'
import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'
import LoadingSpinner from '../../components/LoadingSpinner.react'
import { fetchApi } from '../../utils/apiHelper'
import {
  SERVER_API_URL,
  SERVER_STATIC_URL,
} from '../../utils/config'
import { useNavigation } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import MangaListShimmer from '../../components/shimmers/MangaListShimmer.react'
import ShimmerPlaceholder from '../../components/shimmers/ShimmerPlaceholder.react'
import useApiFetcher from '../../hooks/useApiFetcher'

type MangaType = {
  name: string
  previewImagePath: string
  description: string
  id: string
}

export default function RootScreen(): JSX.Element {
  const [mangas, setMangas] = useState<Array<MangaType>>([])
  const navigation =
    useNavigation<NativeStackNavigationProp<any>>()
  const fetch = useApiFetcher()

  useEffect(() => {
    const handleFetchMangas = async () => {
      const data = await fetch(
        `${SERVER_API_URL}/manga`,
        'GET',
        ['manga_list']
      )
      setMangas(
        (data?.mangas ?? []).map(
          ({
            name = '',
            previewImagePath = '',
            description = '',
            id = '',
          }) => ({
            name,
            previewImagePath,
            description,
            id,
          })
        )
      )
    }
    handleFetchMangas()
  }, [])

  return (
    <ShimmerPlaceholder fallback={<MangaListShimmer />}>
      <View style={styles.wrapper} key="manga_list">
        {mangas.map(
          ({ name, previewImagePath, description, id }) => (
            <View key={id}>
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate('MangaDetail', { id })
                }}
                style={styles.itemContainer}
              >
                <Image
                  style={styles.image}
                  source={{
                    uri: `${SERVER_STATIC_URL}/${previewImagePath}`,
                  }}
                />
                <Text>{name}</Text>
                <Text>{description}</Text>
              </TouchableOpacity>
            </View>
          )
        )}
      </View>
    </ShimmerPlaceholder>
  )
}

const styles = StyleSheet.create({
  image: {
    width: 160,
    height: 240,
    borderRadius: 18,
  },
  wrapper: {
    flexWrap: 'wrap',
    flexDirection: 'row',
    gap: 32,
    padding: 24,
  },
  itemContainer: {
    flexDirection: 'column',
    alignItems: 'center',
  },
})
