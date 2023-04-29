import { useState } from 'react'
import {
  Image,
  Modal,
  Text,
  TouchableHighlight,
  View,
  useWindowDimensions,
} from 'react-native'
import ImageCropConfirmModal from './modals/ImageCropConfirmModal.react'
import { useHeaderHeight } from '@react-navigation/elements'

type Props = {
  children: JSX.Element
  isCropping: boolean
  imageUri: string
  pressDuration?: number
  setIsCropping: (cropping: boolean) => void
}

export default function ImageCropper({
  children,
  isCropping,
  imageUri,
  pressDuration = 1000,
  setIsCropping,
}: Props): JSX.Element {
  const [cropStartX, setCropStartX] = useState<
    number | null
  >(null)
  const [cropStartY, setCropStartY] = useState<
    number | null
  >(null)
  const [cropEndX, setCropEndX] = useState<number | null>(
    null
  )
  const [cropEndY, setCropEndY] = useState<number | null>(
    null
  )

  const [isModalShown, setIsModalShown] =
    useState<boolean>(false)

  const [duration, setDuration] = useState<number>(0)
  const [tempInterval, setTempInterval] =
    useState<number>(0)

  const { height: imageHeight, width: imageWidth } =
    useWindowDimensions()
  const headerHeight = useHeaderHeight()

  return (
    <>
      {cropStartX !== null &&
        cropStartY !== null &&
        cropEndX !== null &&
        cropEndY !== null && (
          <ImageCropConfirmModal
            isShown={isModalShown}
            imageUri={imageUri}
            width={Math.abs(cropEndX - cropStartX)}
            height={Math.abs(cropEndY - cropStartY)}
            left={Math.min(cropStartX, cropEndX)}
            top={Math.min(cropStartY, cropEndY)}
            onHide={() => {
              setIsModalShown(false)
            }}
          />
        )}
      <View
        onTouchStart={(event) => {
          const { locationX, locationY } = event.nativeEvent
          setCropEndX(locationX)
          setCropEndY(locationY)
          setCropStartX(locationX)
          setCropStartY(locationY)
          setDuration(0)
          setTempInterval(
            setInterval(
              () => setDuration((d) => d + 100),
              100
            )
          )
        }}
        onTouchMove={(event) => {
          //   console.log('hi')
          //   event.stopPropagation()
          if (duration < pressDuration) {
            return
          }
          const { locationX, locationY } = event.nativeEvent
          setIsCropping(true)
          setCropEndX(locationX)
          setCropEndY(locationY)
        }}
        onTouchEnd={(event) => {
          if (isCropping) {
            event.stopPropagation()
            setIsModalShown(true)
          }
          setIsCropping(false)
          clearInterval(tempInterval)
        }}
      >
        {children}
        {cropStartX !== null &&
          cropStartY !== null &&
          cropEndX !== null &&
          cropEndY !== null &&
          isCropping && (
            <View
              onTouchStart={(event) =>
                event.preventDefault()
              }
              style={{
                position: 'absolute',
                left: Math.min(cropStartX, cropEndX),
                top: Math.min(cropStartY, cropEndY),
                backgroundColor: 'red',
                opacity: 0.5,
                width: Math.abs(cropEndX - cropStartX),
                height: Math.abs(cropEndY - cropStartY),
                overflow: 'hidden',
              }}
            ></View>
          )}
      </View>
    </>
  )
}
