import { useApiFetcherContext } from '../../context/ApiFetcherContext'

type Props = {
  children: JSX.Element
  fallback: JSX.Element
}
export default function ShimmerPlaceholder({
  children,
  fallback,
}: Props): JSX.Element {
  const { loadingMap } = useApiFetcherContext()
  return loadingMap[children.key ?? '']
    ? fallback
    : children
}
