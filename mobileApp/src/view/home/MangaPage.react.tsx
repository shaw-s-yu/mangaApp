import {
  Link,
  NavigationProp,
  RouteProp,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import {useEffect, useState} from 'react';
import {Image, View} from 'react-native';
import {fetchApi} from '../../utils/apiHelper';
import {
  SERVER_API_URL,
  SERVER_STATIC_URL,
} from '../../utils/config';
export default (): JSX.Element => {
  const [wrapperLayout, setWrapperLayout] = useState<{
    x: number;
    y: number;
  }>({
    x: 0,
    y: 0,
  });
  const route = useRoute<RouteProp<any>>();
  const {chapterID, pageID, pagePath} = route.params ?? {};
  const navigation = useNavigation<NavigationProp<any>>();
  useEffect(() => {
    const handleCreateHistory = async () => {
      await fetchApi(
        `${SERVER_API_URL}/history/${chapterID}/${pageID}`,
        'POST',
      );
    };
    handleCreateHistory();
  }, [chapterID, pageID]);
  return (
    <View
      onLayout={e =>
        setWrapperLayout({
          x: e.nativeEvent.layout.width,
          y: e.nativeEvent.layout.height,
        })
      }
      onTouchStart={async e => {
        const {pageX} = e.nativeEvent;
        let page;
        if (pageX < wrapperLayout.x / 2) {
          const res = await fetchApi(
            `${SERVER_API_URL}/page/${pageID}/prev`,
            'GET',
          );
          page = res.page;
        } else {
          const res = await fetchApi(
            `${SERVER_API_URL}/page/${pageID}/next`,
            'GET',
          );
          page = res.page;
        }
        // TODO: handler no page found-> redirect to new page stating no page found
        navigation.navigate('MangaPage', {
          pageID: page.id,
          chapterID: page.chapterId,
          pagePath: page.path,
        });
      }}>
      <Image
        style={{height: 1000, width: 800}}
        source={{uri: `${SERVER_STATIC_URL}/${pagePath}`}}
        resizeMode="contain"
      />
    </View>
  );
};
