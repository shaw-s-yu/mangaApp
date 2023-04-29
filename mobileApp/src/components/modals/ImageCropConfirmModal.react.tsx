import {
  Image,
  Modal,
  Text,
  TouchableHighlight,
  View,
  useWindowDimensions,
  StyleSheet,
} from 'react-native'
import { useHeaderHeight } from '@react-navigation/elements'
import { Suspense, useState } from 'react'
import ShimmerPlaceholder from '../shimmers/ShimmerPlaceholder.react'
import TranslatedTextShimmer from '../shimmers/TranslatedTextShimmer.react'
import useApiFetcher from '../../hooks/useApiFetcher'

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
  const [original, setOriginal] = useState<string>('')
  const [english, setEnglish] = useState<string>('')
  const [mandarin, setMandarin] = useState<string>('')
  const fetchApi = useApiFetcher()
  return (
    <Modal transparent visible={isShown}>
      <View
        style={styles.modal}
        onTouchEnd={(event) => event.stopPropagation()}
      >
        <View style={styles.modalContainer}>
          <Text style={styles.title}>Translate</Text>
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

          <View>
            <View>
              {original !== '' && (
                <Text style={styles.textContainer}>
                  Original:
                </Text>
              )}
              <ShimmerPlaceholder
                fallback={<TranslatedTextShimmer />}
              >
                <Text
                  key="text_original"
                  style={styles.textContainer}
                >
                  {original}
                </Text>
              </ShimmerPlaceholder>
            </View>
            <View>
              {english !== '' && (
                <Text style={styles.textContainer}>
                  English:
                </Text>
              )}
              <ShimmerPlaceholder
                fallback={<TranslatedTextShimmer />}
              >
                <Text
                  key="text_english"
                  style={styles.textContainer}
                >
                  {english}
                </Text>
              </ShimmerPlaceholder>
            </View>
            <View>
              {mandarin !== '' && (
                <Text style={styles.textContainer}>
                  中文:
                </Text>
              )}
              <ShimmerPlaceholder
                fallback={<TranslatedTextShimmer />}
              >
                <Text
                  key="text_chinese"
                  style={styles.textContainer}
                >
                  {mandarin}
                </Text>
              </ShimmerPlaceholder>
            </View>
          </View>
          <View style={styles.buttonGroups}>
            <TouchableHighlight
              style={styles.buttonLeft}
              onPress={() => {
                setEnglish('')
                setMandarin('')
                setOriginal('')
                onHide()
              }}
            >
              <Text style={styles.button}>Hide</Text>
            </TouchableHighlight>
            <TouchableHighlight
              style={styles.buttonRight}
              onPress={async () => {
                const { english, mandarin, original } =
                  await fetchApi(
                    'http://192.168.0.127:8000/translate',
                    'POST',
                    [
                      'text_english',
                      'text_chinese',
                      'text_original',
                    ],
                    JSON.stringify({
                      image: {
                        width: imageWidth,
                        height:
                          imageHeight - headerHeight - 80,
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
                setEnglish(english)
                setMandarin(mandarin)
                setOriginal(original)
              }}
            >
              <Text style={styles.button}>Yes</Text>
            </TouchableHighlight>
          </View>
        </View>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  buttonGroups: {
    display: 'flex',
    flexDirection: 'row',
    borderTopColor: 'black',
    borderStyle: 'solid',
    borderTopWidth: 1,
    width: 250,
  },
  buttonLeft: {
    width: 125,
    height: 32,
    borderRightWidth: 0.5,
    borderRightColor: 'black',
    borderstyle: 'solid',
    alignItems: 'center',
    justifyContent: 'center',
    display: 'flex',
  },
  buttonRight: {
    width: 125,
    height: 32,
    borderLeftWidth: 0.5,
    borderLeftColor: 'black',
    borderstyle: 'solid',
    alignItems: 'center',
    justifyContent: 'center',
    display: 'flex',
  },
  modal: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    borderRadius: 10,
    backgroundColor: '#e8e8e8',
    opacity: 1,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    rowGap: 8,
  },
  textContainer: {
    width: 250,
    padding: 8,
  },
  button: {
    fontFamily: 'arial',
    color: 'rgb(21, 92, 161)',
  },
  title: {
    fontFamily: 'arial',
    color: 'rgb(21, 92, 161)',
    fontSize: 24,
  },
})
