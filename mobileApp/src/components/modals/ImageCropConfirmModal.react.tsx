import {
  Image,
  Modal,
  Text,
  TouchableHighlight,
  View,
  useWindowDimensions,
} from 'react-native'
import { useHeaderHeight } from '@react-navigation/elements'
import { fetchApi } from '../../utils/apiHelper'

type Props = {
  isShown: boolean
  imageUri: string
  width: number
  height: number
  top: number
  left: number
  onHide: () => void
}

export default function ImageCropConfirmModal({
  isShown,
  imageUri,
  width,
  height,
  top,
  left,
  onHide,
}: Props): JSX.Element {
  const { height: imageHeight, width: imageWidth } =
    useWindowDimensions()
  const headerHeight = useHeaderHeight()

  return (
    <Modal transparent visible={isShown}>
      <View
        style={{
          display: 'flex',
          width: '100%',
          height: '100%',
          justifyContent: 'center',
          alignItems: 'center',
        }}
        onTouchEnd={(event) => event.stopPropagation()}
      >
        <View style={{ backgroundColor: 'purple' }}>
          <Text>Translate?</Text>
          <View
            style={{
              width,
              height,
              overflow: 'hidden',
            }}
          >
            <Image
              source={{ uri: imageUri }}
              style={{
                height: imageHeight - headerHeight - 80,
                width: imageWidth,
                top: -top,
                left: -left,
              }}
              resizeMode="contain"
            />
          </View>
          <TouchableHighlight
            onPress={() => {
              onHide()
            }}
          >
            <Text>Hide</Text>
          </TouchableHighlight>
          <TouchableHighlight
            onPress={async () => {
              const data = await fetchApi(
                'http://127.0.0.1:8000/translate',
                'POST',
                JSON.stringify({
                  image: {
                    width: imageWidth,
                    height: imageHeight - headerHeight - 80,
                    imageUri,
                  },
                  croppedArea: {
                    width,
                    height,
                    top,
                    left,
                  },
                })
              )
              console.log(data)
            }}
          >
            <Text>Yes</Text>
          </TouchableHighlight>
        </View>
      </View>
    </Modal>
  )
}
