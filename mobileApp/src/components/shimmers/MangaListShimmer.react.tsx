import { StyleSheet, View } from 'react-native'
import SkeletonPlaceholder from 'react-native-skeleton-placeholder'

export default function MangaListShimmer(): JSX.Element {
  return (
    <SkeletonPlaceholder borderRadius={4}>
      <View style={styles.wrapper}>
        {[...Array(30).keys()].map((_, index) => (
          <View style={styles.itemContainer} key={index}>
            <View style={styles.image}></View>
            <View style={styles.text} />
            <View style={styles.text} />
          </View>
        ))}
      </View>
    </SkeletonPlaceholder>
  )
}

const styles = StyleSheet.create({
  image: {
    width: 160,
    height: 240,
    borderRadius: 18,
  },
  wrapper: {
    flexWrap: 'wrap',
    flexDirection: 'row',
    gap: 32,
    padding: 24,
  },
  itemContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    gap: 4,
  },
  text: {
    height: 18,
    width: 120,
  },
})
