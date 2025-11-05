import { useState, useEffect } from "react";
import s from "./CreateBoardModal.module.css";

interface Props {
  onConfirm: (name: string) => Promise<void> | void;
  onClose: () => void;
}

export default function CreateBoardModal({ onConfirm, onClose }: Props) {
  const [boardName, setBoardName] = useState("");
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  const handleConfirm = async () => {
    if (!boardName.trim()) return;

    try {
      setIsCreating(true);
      await onConfirm(boardName);
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className={s.backdrop}>
      <div className={s.modal}>
        <h3 className={s.heading}>Create a new board</h3>

        <input
          className={s.input}
          placeholder="Enter board name"
          value={boardName}
          onChange={(e) => setBoardName(e.target.value)}
        />

        <div className={s.actions}>
          <button
            onClick={onClose}
            className={s.cancelBtn}
            disabled={isCreating}
          >
            Cancel
          </button>

          <button
            onClick={handleConfirm}
            className={s.confirmBtn}
            disabled={isCreating || !boardName.trim()}
          >
            {isCreating ? "Creating..." : "Create"}
          </button>
        </div>
      </div>
    </div>
  );
}
