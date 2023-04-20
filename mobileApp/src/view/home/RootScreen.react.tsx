import React, {useEffect, useState} from 'react';
import {
  Image,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import LoadingSpinner from '../../components/LoadingSpinner.react';
import {API_METHOD, fetchApi} from '../../utils/apiHelper';
import {
  SERVER_API_URL,
  SERVER_STATIC_URL,
} from '../../utils/config';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';

type MangaType = {
  name: string;
  previewImagePath: string;
  description: string;
  id: string;
};

export default function RootScreen(): JSX.Element {
  const [loadingData, setLoadingData] =
    useState<boolean>(true);
  const [mangas, setMangas] = useState<Array<MangaType>>(
    [],
  );
  const navigation =
    useNavigation<NativeStackNavigationProp<any>>();

  useEffect(() => {
    const handleFetchMangas = async () => {
      const data = await fetchApi(
        `${SERVER_API_URL}/manga`,
        'GET',
      );
      setMangas(
        (data?.mangas ?? []).map(
          ({
            name = '',
            previewImagePath = '',
            description = '',
            id = '',
          }) => ({name, previewImagePath, description, id}),
        ),
      );
      setLoadingData(false);
    };
    handleFetchMangas();
  }, []);

  return (
    <View>
      <Text>Home</Text>
      {loadingData && <LoadingSpinner />}
      {mangas.map(
        ({name, previewImagePath, description, id}) => (
          <View key={id}>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate('MangaDetail', {id});
              }}>
              <Image
                style={{width: 480, height: 560}}
                source={{
                  uri: `${SERVER_STATIC_URL}/${previewImagePath}`,
                }}
              />
              <Text>{name}</Text>
              <Text>{description}</Text>
            </TouchableOpacity>
          </View>
        ),
      )}
    </View>
  );
}
