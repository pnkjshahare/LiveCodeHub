import { useChatRoom } from "@/context/ChatContext"
import { useViews } from "@/context/ViewContext"
import { VIEWS } from "@/types/view"
import { Tooltip } from "react-tooltip"
import { useState, useEffect } from "react"
import { tooltipStyles, buttonStyles } from "../tooltipStyles"
import useWindowDimensions from "@/hooks/useWindowDimensions"

interface ViewButtonProps {
    viewName: VIEWS
    icon: JSX.Element
}

const ViewButton = ({ viewName, icon }: ViewButtonProps) => {
    const { activeView, setActiveView, isSidebarOpen, setIsSidebarOpen } =
        useViews()
    const { isNewMessage } = useChatRoom()
    const { width } = useWindowDimensions() // Get the screen width and height from the hook
    const [showTooltip, setShowTooltip] = useState(true)

    useEffect(() => {
        setShowTooltip(width > 1024)
    }, [width])

    const handleViewClick = (viewName: VIEWS) => {
        if (viewName === activeView) {
            setIsSidebarOpen(!isSidebarOpen)
        } else {
            setIsSidebarOpen(true)
            setActiveView(viewName)
        }
    }

    // Dynamically adjust button size based on screen width
    const buttonSize =
        width < 361
            ? "w-9 h-9"
            : width < 600
              ? "w-11 h-11"
              : width < 1024
                ? "w-12 h-12"
                : "w-12 h-12"

    return (
        <div className="relative flex flex-col items-center">
            <button
                onClick={() => handleViewClick(viewName)}
                onMouseEnter={() => setShowTooltip(true)} // Show tooltip again on hover
                className={`${buttonStyles.base} ${buttonStyles.hover} ${buttonSize}`}
                {...(showTooltip && {
                    "data-tooltip-id": `tooltip-${viewName}`,
                    "data-tooltip-content": viewName,
                })}
            >
                <div className="flex items-center justify-center">{icon}</div>
                {/* Show dot for new message in chat View Button */}
                {viewName === VIEWS.CHATS && isNewMessage && (
                    <div className="absolute right-0 top-0 h-3 w-3 rounded-full bg-primary"></div>
                )}
            </button>
            {/* render the tooltip */}
            {showTooltip && (
                <Tooltip
                    id={`tooltip-${viewName}`}
                    place="right"
                    offset={25}
                    className="!z-50"
                    style={tooltipStyles}
                    noArrow={false}
                    positionStrategy="fixed"
                    float={true}
                />
            )}
        </div>
    )
}

export default ViewButton
