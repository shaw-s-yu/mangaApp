import { useState } from 'react'
import {
  GestureResponderEvent,
  StyleProp,
  Text,
  View,
  ViewStyle,
} from 'react-native'
import { ScrollView } from 'react-native-gesture-handler'

type Props = {
  children: JSX.Element
  pressDuration?: number
  pressedTime: number
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
  pressDuration = 300,
  pressedTime,
  onPress,
  onLongPress,
  setIsScrolling = () => {},
  style,
  containerStyle,
}: Props): JSX.Element {
  const [moved, setMoved] = useState<boolean>(false)
  return (
    <>
      <ScrollView
        minimumZoomScale={minZoomScale}
        maximumZoomScale={maxZoomScale}
        pinchGestureEnabled={scrollable}
        scrollEnabled={scrollable}
        onScroll={() => setIsScrolling(true)}
        onTouchStart={() => {
          setMoved(false)
        }}
        onTouchEnd={(event) => {
          setIsScrolling(false)
          if (moved) {
            return
          }
          if (pressedTime > pressDuration) {
            onLongPress?.(event)
          } else {
            onPress?.(event)
          }
          setMoved(false)
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
