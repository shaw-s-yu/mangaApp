import { Image } from 'react-native'

type Props = {
  width: number
  height: number
  imageUri: string
}
export default function MangaImage({
  width,
  height,
  imageUri,
}: Props): JSX.Element {
  return (
    <Image
      style={{
        height,
        width,
      }}
      source={{
        uri: imageUri,
      }}
      resizeMode="contain"
    />
  )
}
