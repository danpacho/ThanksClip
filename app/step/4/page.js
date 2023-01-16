import { cookies } from "next/headers"
import { COOKIE_KEY } from "../../../constant/cookie.js"
import {
    encodeVideo,
    transformVideoProps,
} from "../../../pages/api/rendering.js"
import { ClipPreview } from "./components/ClipPreview.jsx"
import { Download } from "./components/Download.jsx"
import { LetterButton } from "./components/LetterButton"
import { LetterToName } from "./components/LetterToName"

/**
 * tag text 추출
 * ```ts
 * type Tag = { id: number, text: string }
 * type Tags = Tag[]
 * ```
 * */
const toStringTags = (tags) => tags.map((tag) => tag.text)

export default async function Step4() {
    const nextCookies = cookies()

    /**@type {import("../../../atoms/letter".Letter)} */
    const pureVideoClientProps = JSON.parse(nextCookies.get(COOKIE_KEY)?.value)
    const videoClientProps = {
        ...pureVideoClientProps,
        tags: toStringTags(pureVideoClientProps.tags),
    }
    const transformedVideoProps = await transformVideoProps(videoClientProps)

    const encode = await encodeVideo(transformedVideoProps)

    return (
        <>
            <LetterToName />
            <ClipPreview videoClientProps={videoClientProps} />
            <LetterButton urlParams={{ ...encode, to: videoClientProps.to }} />
            <Download
                encode={encode}
                transformedVideoProps={transformedVideoProps}
            />
        </>
    )
}
