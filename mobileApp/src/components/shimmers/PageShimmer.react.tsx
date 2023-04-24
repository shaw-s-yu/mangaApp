import { View } from 'react-native'
import SkeletonPlaceholder from 'react-native-skeleton-placeholder'

export default function PageShimmer(): JSX.Element {
  return (
    <SkeletonPlaceholder borderRadius={4}>
      <View style={{ height: 1000, width: 800 }}></View>
    </SkeletonPlaceholder>
  )
}
