import { useRoomContext } from "@livekit/components-react";
import { useState } from "react";

export default function RaiseHandButton() {
  const room = useRoomContext();
  const [raised, setRaised] = useState(false);

  const toggleHand = async () => {
    // ✅ FIX: use lowercase to match ClassroomUI listener
    const type = raised ? "lower-hand" : "raise-hand";

    try {
      const encoder = new TextEncoder();
      await room.localParticipant.publishData(
        encoder.encode(JSON.stringify({ type })),
        { reliable: true }
      );
      setRaised(!raised);
    } catch (e) {
      console.error("raise-hand failed", e);
    }
  };

  return (
    <button
      className={`raise-hand-btn ${raised ? "raised" : ""}`}
      onClick={toggleHand}
      title={raised ? "Lower hand" : "Raise hand"}
    >
      {raised ? "👇 Lower Hand" : "✋ Raise Hand"}
    </button>
  );
}
