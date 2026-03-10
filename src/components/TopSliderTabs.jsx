import { HiChevronLeft, HiChevronRight } from "react-icons/hi";
import "../styles/topSliderTabs.css";

export default function TopSliderTabs({ active, setActive }) {
  const tabs = [
    { id: "notify", label: "Notifications" },
    { id: "sessions", label: "Upcoming Classes" },
    { id: "assign", label: "Assignment" },
    { id: "quiz", label: "Quiz" },
    { id: "calendar", label: "Calendar" },
    { id: "schedule", label: "Schedule" },
  ];

  const currentIndex = tabs.findIndex((t) => t.id === active);
  const safeIndex = currentIndex === -1 ? 0 : currentIndex;
  const currentTab = tabs[safeIndex];

  const goPrev = () => {
    if (safeIndex > 0) {
      setActive(tabs[safeIndex - 1].id);
    }
  };

  const goNext = () => {
    if (safeIndex < tabs.length - 1) {
      setActive(tabs[safeIndex + 1].id);
    }
  };

  return (
    <div className="topSingleSlider">
      <button
        className="singleArrow"
        onClick={goPrev}
        disabled={safeIndex === 0}
      >
        <HiChevronLeft />
      </button>

      <div className="singleTitle">
        {currentTab.label}
      </div>

      <button
        className="singleArrow"
        onClick={goNext}
        disabled={safeIndex === tabs.length - 1}
      >
        <HiChevronRight />
      </button>
    </div>
  );
}