import { useState } from 'react'
import {
  GestureResponderEvent,
  StyleProp,
  ViewStyle,
} from 'react-native'
import { ScrollView } from 'react-native-gesture-handler'

type Props = {
  children: JSX.Element
  pressDuration?: number
  minZoomScale?: number
  maxZoomScale?: number
  scrollable?: boolean
  onPress?: (event: GestureResponderEvent) => void
  onLongPress?: (event: GestureResponderEvent) => void
  setIsScrolling?: (event: boolean) => void
  style?: StyleProp<ViewStyle>
  containerStyle?: StyleProp<ViewStyle>
}
export default function ZoomableScrollView({
  children,
  minZoomScale = 0.5,
  maxZoomScale = 3,
  scrollable = true,
  pressDuration = 500,
  onPress,
  onLongPress,
  setIsScrolling = () => {},
  style,
  containerStyle,
}: Props): JSX.Element {
  const [duration, setDuration] = useState<number>(0)
  const [moved, setMoved] = useState<boolean>(false)
  const [tempInterval, setTempInterval] =
    useState<number>(0)

  return (
    <>
      <ScrollView
        minimumZoomScale={minZoomScale}
        maximumZoomScale={maxZoomScale}
        scrollEnabled={scrollable}
        onScroll={() => setIsScrolling(true)}
        onMomentumScrollEnd={() => setIsScrolling(false)}
        onTouchStart={() => {
          setMoved(false)
          setDuration(0)
          setTempInterval(
            setInterval(
              () => setDuration((d) => d + 100),
              100
            )
          )
        }}
        onTouchEnd={(event) => {
          clearInterval(tempInterval)
          if (moved) {
            setDuration(0)
            return
          }
          if (duration > pressDuration) {
            onLongPress?.(event)
          } else {
            onPress?.(event)
          }
        }}
        onTouchMove={() => setMoved(true)}
        style={style}
        contentContainerStyle={containerStyle}
      >
        {children}
      </ScrollView>
    </>
  )
}
