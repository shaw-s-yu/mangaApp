import { useState } from 'react'
import { View, useWindowDimensions } from 'react-native'
import ImageCropConfirmModal from './modals/ImageCropConfirmModal.react'
import { useHeaderHeight } from '@react-navigation/elements'

type Props = {
  children: JSX.Element
  isCropping: boolean
  isScrolling: boolean
  imageUri: string
  pressDuration?: number
  pressedTime: number
  setPressedTime: React.Dispatch<
    React.SetStateAction<number>
  >
  setIsCropping: (cropping: boolean) => void
}

export default function ImageCropper({
  children,
  isCropping,
  isScrolling,
  imageUri,
  pressDuration = 300,
  pressedTime,
  setPressedTime,
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

  const [tempInterval, setTempInterval] = useState<
    Array<number>
  >([])
  //   console.log(pressedTime, tempInterval)
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
          setPressedTime(0)
          setTempInterval((intervals) => {
            const intervalNumber = setInterval(
              () => setPressedTime((time) => time + 100),
              100
            )
            return [...intervals, intervalNumber]
          })
        }}
        onTouchMove={(event) => {
          if (pressedTime < pressDuration || isScrolling) {
            return
          }
          const { locationX, locationY } = event.nativeEvent
          setIsCropping(true)
          setCropEndX(locationX)
          setCropEndY(locationY)
        }}
        onTouchEnd={(event) => {
          tempInterval.forEach((interval) =>
            clearInterval(interval)
          )
          setTempInterval([])
          setIsCropping(false)
          setPressedTime(0)
          if (isCropping) {
            event.stopPropagation()
            setIsModalShown(true)
          }
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
