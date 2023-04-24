import { useApiFetcherContext } from "../context/ApiFetcherContext"

type Props = {
    children: JSX.Element
    fallback: JSX.Element
}
export default function ShimmerPlaceholder(
    {children, fallback}: Props
):JSX.Element{
    const {loading} = useApiFetcherContext()

    return loading ? fallback: children
}