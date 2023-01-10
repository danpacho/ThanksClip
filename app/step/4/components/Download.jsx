"use client"

import { useCallback, useEffect, useState } from "react"
import { ArrowPathIcon } from "@heroicons/react/24/outline"
import { Button } from "../../../common/Button"
/**@typedef {Awaited<import("../../../../api/video").RenderingProgress>} Progress*/

const byteToSize = ({ byte, type = "kb", ceilOn = 1 }) => {
    const conversionFactors = {
        kb: 1024,
        mb: 1024 ** 2,
    }
    const ceilUnit = 10 ** ceilOn
    const conversion = conversionFactors[type] || 1
    const rounded = (val) => Math.ceil(val * ceilUnit) / ceilUnit

    return `${rounded(byte / conversion)}${type}`
}

/**
 * @param {{ encode: {renderId: string | null; bucketName: string | null; region: string | null;} }} downloadProps
 * @returns
 */
const Download = ({ encode }) => {
    /**@type {[Progress, Dispatch<SetStateAction<Progress>>]} */
    const [progress, setProgress] = useState({
        type: "progress",
        downloadUrl: null,
        errorMessage: null,
        outputSize: null,
    })

    const progressRequest = useCallback(() => {
        const getVideoProgress = async () => {
            const res = await fetch("/api/rendering", {
                method: "POST",
                body: JSON.stringify(encode),
            })

            /**@type {Progress} */
            const progress = await res.json()
            setProgress(progress)
        }

        const cleanupProgressRequest = setTimeout(() => {
            getVideoProgress()
        }, 500)

        return cleanupProgressRequest
    }, [encode, setProgress])

    useEffect(() => {
        /**@type {NodeJS.Timeout} */
        let cleanup
        if (progress.type === "progress") {
            cleanup = progressRequest()
        }
        return () => clearTimeout(cleanup)
    }, [progress, progress.type, progressRequest])

    return (
        <>
            {progress.type === "success" ? (
                <a href={progress.downloadUrl} download={"thanks clip"}>
                    <Button color="red">
                        다운로드 {byteToSize({ byte: progress.outputSize })}
                    </Button>
                </a>
            ) : (
                <Button disabled color="gray">
                    <ArrowPathIcon className="animate-spin h-8 w-8" />
                </Button>
            )}
        </>
    )
}

export { Download }
