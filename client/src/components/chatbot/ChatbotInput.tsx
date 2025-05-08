import React, { useRef, useState } from "react"
import { LuSendHorizonal } from "react-icons/lu"
import { GoogleGenerativeAI } from "@google/generative-ai"

const ChatbotInput: React.FC = () => {
    const inputRef = useRef<HTMLTextAreaElement | null>(null)
    const [parsedResponse, setParsedResponse] = useState<JSX.Element[]>([])
    const [loading, setLoading] = useState<boolean>(false)

    const parseResponse = (text: string) => {
        const lines = text.split("\n")
        const elements: JSX.Element[] = []
        let isCodeBlock = false
        let codeBuffer: string[] = []

        lines.forEach((line, idx) => {
            const trimmed = line.trim()

            if (trimmed.startsWith("```")) {
                if (!isCodeBlock) {
                    isCodeBlock = true
                    codeBuffer = []
                } else {
                    isCodeBlock = false
                    elements.push(
                        <pre
                            key={`code-${idx}`}
                            className="mb-6 overflow-x-auto whitespace-pre-wrap rounded-md bg-[#1e1e1e] p-4 font-mono text-sm text-[#dcdcdc]"
                        >
                            <code>{codeBuffer.join("\n")}</code>
                        </pre>,
                    )
                }
                return
            }

            if (isCodeBlock) {
                codeBuffer.push(line)
            } else if (/^#+\s/.test(trimmed)) {
                const cleanText = trimmed.replace(/^#+\s*/, "")
                const level = Math.min(trimmed.match(/^#+/)![0].length, 6)
                const HeadingTag = `h${level}` as keyof JSX.IntrinsicElements

                elements.push(
                    <HeadingTag
                        key={`heading-${idx}`}
                        className="mb-2 mt-4 font-bold text-white"
                    >
                        {cleanText}
                    </HeadingTag>,
                )
            } else if (trimmed) {
                const cleanLine = trimmed.replace(/[`*]/g, "")
                elements.push(
                    <p key={`para-${idx}`} className="mb-4 text-white">
                        {cleanLine}
                    </p>,
                )
            }
        })

        setParsedResponse(elements)
    }

    const handleGenerate = async (e: React.FormEvent) => {
        e.preventDefault()
        const userInput = inputRef.current?.value?.trim()
        if (!userInput) return

        setLoading(true)
        setParsedResponse([])

        try {
            const genAI = new GoogleGenerativeAI(
                import.meta.env.VITE_GEMINI_API_KEY as string,
            )
            const model = genAI.getGenerativeModel({
                model: "gemini-2.0-flash",
            })

            const result = await model.generateContent(userInput)
            const response = result.response.text()
            parseResponse(response)
        } catch (error) {
            console.error("Gemini API error:", error)
            setParsedResponse([
                <p key="error" className="italic text-red-500">
                    ❌ Failed to get a response.
                </p>,
            ])
        } finally {
            setLoading(false)
            if (inputRef.current) inputRef.current.value = ""
        }
    }

    return (
        <div className="mx-auto flex h-[90vh] w-full max-w-2xl flex-col justify-between rounded-lg bg-dark p-4 shadow-md">
            {/* Response Section */}
            <div className="mb-4 max-h-[70vh] overflow-y-auto rounded-md border border-gray-700 bg-neutral-800 p-4">
                {loading ? (
                    <p className="italic text-gray-400">🤖 Thinking...</p>
                ) : parsedResponse.length > 0 ? (
                    parsedResponse
                ) : (
                    <p className="italic text-gray-500">
                        Enter a prompt below and click "Generate" to see the
                        result here.
                    </p>
                )}
            </div>

            {/* Input Section */}
            <form
                onSubmit={handleGenerate}
                className="flex justify-between rounded-md border border-primary"
            >
                <textarea
                    ref={inputRef}
                    placeholder="Enter a prompt..."
                    className="max-h-40 w-full flex-grow resize-none overflow-y-auto rounded-md border-none bg-dark p-2 text-white outline-none"
                    rows={1}
                    onInput={(e) => {
                        const target = e.currentTarget
                        target.style.height = "auto"
                        target.style.height = `${target.scrollHeight}px`
                    }}
                />
                <button
                    className="flex items-center justify-center rounded-r-md bg-primary p-2 text-black"
                    type="submit"
                    disabled={loading}
                >
                    <LuSendHorizonal size={24} />
                </button>
            </form>
        </div>
    )
}

export default ChatbotInput
