import { View, useWindowDimensions } from 'react-native'
import SkeletonPlaceholder from 'react-native-skeleton-placeholder'
import { useHeaderHeight } from '@react-navigation/elements'

export default function TranslatedTextShimmer(): JSX.Element {
  return (
    <SkeletonPlaceholder borderRadius={4}>
      <View
        style={{
          height: 40,
          width: 240,
          backgroundColor: 'black',
        }}
      ></View>
    </SkeletonPlaceholder>
  )
}
