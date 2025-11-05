import { useState, useEffect } from "react";
import s from "./EditCardModal.module.css";
import { useDispatch } from "react-redux";
import { updateCard } from "../../redux/slices/cards";
import toast from "react-hot-toast";

interface EditCardModalProps {
  card: {
    _id: string;
    title: string;
    description: string;
  };
  onClose: () => void;
}

export default function EditCardModal({ card, onClose }: EditCardModalProps) {
  const dispatch = useDispatch<any>();
  const [title, setTitle] = useState(card.title);
  const [description, setDescription] = useState(card.description);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  const handleSave = async () => {
    try {
      setIsSaving(true);

      await dispatch(
        updateCard({
          cardId: card._id,
          updates: { title, description },
        })
      ).unwrap();

      toast.success("Card updated successfully");
      onClose();
    } catch {
      toast.error("Failed to update card");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className={s.backdrop}>
      <div className={s.modal}>
        <h3 className={s.heading}>Edit card</h3>

        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className={s.input}
          disabled={isSaving}
        />

        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className={s.textarea}
          disabled={isSaving}
        />

        <div className={s.actions}>
          <button
            className={s.cancelBtn}
            onClick={onClose}
            disabled={isSaving}
          >
            Cancel
          </button>
          <button
            className={s.saveBtn}
            onClick={handleSave}
            disabled={isSaving}
          >
            {isSaving ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}
