import {useState} from 'react';
import {
  Button,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import LoadingSpinnerReact from '../../components/LoadingSpinner.react';
import {fetchApi} from '../../utils/apiHelper';
import {SERVER_API_URL} from '../../utils/config';
import {launchImageLibrary} from 'react-native-image-picker';

const styles = StyleSheet.create({
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },
  image: {
    width: 240,
    height: 360,
  },
});

export default (): JSX.Element => {
  const [mangaName, setMangaName] = useState('');
  const [mangaDescription, setMangaDescription] =
    useState('');
  const [path, setPath] = useState('');
  const [previewImage, setPreviewImage] = useState<any>();
  const [loading, setLoading] = useState(false);

  return (
    <View>
      <Text>Create Manga Collection</Text>
      <Text>
        You need to have manga files in server system first
      </Text>
      <Text>Manga Name:</Text>
      <TextInput
        style={styles.input}
        onChangeText={setMangaName}
        placeholder="Enter Manga Name"
        value={mangaName}
      />
      <Text>Manga Description:</Text>
      <TextInput
        style={styles.input}
        onChangeText={setMangaDescription}
        placeholder="Enter Manga Description"
        value={mangaDescription}
      />
      <Button
        title="Select Preview Image"
        onPress={async () => {
          try {
            const {assets} = await launchImageLibrary({
              mediaType: 'photo',
            });
            const {fileName, type, uri} = assets?.[0] ?? {};
            setPreviewImage({
              name: fileName,
              type,
              uri,
            });
          } catch (e) {
            console.warn(e);
          }
        }}
      />
      <Text>{previewImage?.name}</Text>
      <Text>Manga Collection Path:</Text>
      <TextInput
        style={styles.input}
        onChangeText={setPath}
        placeholder="Enter Manga Collection Path"
        value={path}
      />
      <TouchableOpacity
        disabled={
          mangaName == null ||
          mangaDescription == null ||
          previewImage == null ||
          path == null
        }
        onPress={async () => {
          setLoading(true);
          const formdata = new FormData();
          formdata.append('previewImage', previewImage);
          formdata.append('mangaName', mangaName);
          formdata.append(
            'mangaDescription',
            mangaDescription,
          );
          formdata.append('path', path);
          const response = await fetchApi(
            `${SERVER_API_URL}/manga`,
            'POST',
            formdata,
          );
          setLoading(false);
          console.log(response);
        }}>
        <View>
          <Text>
            {loading && <LoadingSpinnerReact />}Submit
          </Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};
