import { useState, useEffect } from "react";
import s from "./AddCardModal.module.css";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../redux/store";
import { createCard } from "../../redux/slices/cards";
import toast from "react-hot-toast";

type ColumnName = "todo" | "in-progress" | "done";

interface AddCardModalProps {
  column: ColumnName;
  onClose: () => void;
}

export default function AddCardModal({ column, onClose }: AddCardModalProps) {
  const dispatch = useDispatch<any>();
  const boardId = useSelector((s: RootState) => s.boards.activeBoard?._id);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleCreate = async () => {
    if (!title.trim()) {
      setError("Title cannot be empty");
      return;
    }

    if (!boardId) return;

    setError("");
    setLoading(true);
    try {
      await dispatch(
        createCard({ boardId, column, title, description })
      ).unwrap();

      toast.success("Card created successfully");
      
      setTitle("");
      setDescription("");
      onClose();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={s.backdrop}>
      <div className={s.modal}>
        <h3 className={s.heading}>Add new card</h3>

        <input
          className={`${s.input} ${error ? s.inputError : ""}`}
          placeholder="Card title"
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
            if (error) setError(""); 
          }}
        />

        {error && <div className={s.errorText}>{error}</div>}

        <textarea
          className={s.textarea}
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <div className={s.actions}>
          <button className={s.cancelBtn} onClick={onClose}>Cancel</button>
          <button className={s.confirmBtn} onClick={handleCreate} disabled={loading}>
            {loading ? "Creating..." : "Create"}
          </button>
        </div>
      </div>
    </div>
  );
}
