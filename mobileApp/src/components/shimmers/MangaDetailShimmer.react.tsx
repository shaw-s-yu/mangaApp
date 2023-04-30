import { StyleSheet, View } from 'react-native'
import SkeletonPlaceholder from 'react-native-skeleton-placeholder'

export default function MangaDetailShimmer(): JSX.Element {
  return (
    <SkeletonPlaceholder borderRadius={4}>
      <View style={styles.wrapper}>
        <View style={styles.history}></View>
        <View style={styles.chaptersContainer}>
          {[...Array(400).keys()].map((_, index) => (
            <View
              key={index}
              style={styles.chapterBox}
            ></View>
          ))}
        </View>
      </View>
    </SkeletonPlaceholder>
  )
}

const styles = StyleSheet.create({
  wrapper: {
    display: 'flex',
    alignItems: 'center',
  },
  history: {
    width: 2,
    height: 32,
  },
  chaptersContainer: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 24,
    padding: 24,
  },
  chapterBox: {
    borderStyle: 'solid',
    borderColor: 'black',
    borderWidth: 1,
    padding: 8,
    borderRadius: 10,
    width: 24,
    height: 24,
  },
})
