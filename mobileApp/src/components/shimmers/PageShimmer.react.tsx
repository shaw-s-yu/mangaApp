import { View, useWindowDimensions } from 'react-native'
import SkeletonPlaceholder from 'react-native-skeleton-placeholder'
import { useHeaderHeight } from '@react-navigation/elements'

export default function PageShimmer(): JSX.Element {
  const headerHeight = useHeaderHeight()
  const { height, width } = useWindowDimensions()

  return (
    <SkeletonPlaceholder borderRadius={4}>
      <View
        style={{
          height: height - headerHeight - 80,
          width,
        }}
      ></View>
    </SkeletonPlaceholder>
  )
}
