import ChatbotInput from "@/components/chatbot/ChatbotInput"
import useResponsive from "@/hooks/useResponsive"
function ChatbotView() {
    const { viewHeight } = useResponsive()

    return (
        <div
            className="flex max-h-full min-h-[400px] w-full flex-col gap-2 p-4"
            style={{ height: viewHeight }}
        >
            <h1 className="view-title">Code AI</h1>
            {/* Chat list */}
            {/* <ChatList /> */}
            {/* Chat input */}

            {/* <ChatInput /> */}
            <ChatbotInput />
        </div>
    )
}

export default ChatbotView
