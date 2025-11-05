import { Droppable } from "@hello-pangea/dnd";
import Card from "../Card/Card";
import s from "./Column.module.css";
import AddCardModal from "../AddCardModal/AddCardModal";
import EditCardModal from "../EditCardModal/EditCardModal";
import { useState } from "react";
import { useAppDispatch } from "../../redux/store";
import { deleteCard } from "../../redux/slices/cards";
import toast from "react-hot-toast";

interface ColumnProps {
  title: string;
  status: "todo" | "in-progress" | "done";
  boardId: string;
  cards: {
    _id: string;
    title: string;
    description: string;
  }[];
}

const emptyMessages: Record<string, string> = {
  "todo": "Nothing to do yet",
  "in-progress": "Nothing in progress",
  "done": "Nothing completed yet"
};

export default function Column({ title, status, boardId, cards }: ColumnProps) {
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingCard, setEditingCard] = useState<any | null>(null);
  const dispatch = useAppDispatch();

  const handleDelete = async (id: string) => {
    try {
      await dispatch(deleteCard(id)).unwrap();
      toast.success("Card deleted");
    } catch {
      toast.error("Failed to delete card");
    }
  };

  const handleEdit = (card: any) => {
    setEditingCard(card);
  };

  return (
    <div className={s.column}>
      <h2 className={s.heading}>{title}</h2>

      <Droppable droppableId={status}>
        {(provided) => (
          <div className={s.list} ref={provided.innerRef} {...provided.droppableProps}>

            {cards.length === 0 && (
              <div className={s.empty}>
                {emptyMessages[status]}
              </div>
            )}

            {cards?.map((card, index) => (
              <Card
                key={card._id}
                card={card}
                index={index}
                onEdit={() => handleEdit(card)}
                onDelete={handleDelete}
              />
            ))}

            {provided.placeholder}
          </div>
        )}
      </Droppable>

      {status === "todo" && (
        <button className={s.addBtn} onClick={() => setShowAddModal(true)}>
          <svg className={s.icon} width={18} height={18}>
            <use href="/icons.svg#plus" />
          </svg>
        </button>
      )}

      {showAddModal && status === "todo" && (
        <AddCardModal column={status} onClose={() => setShowAddModal(false)} />
      )}

      {editingCard && (
        <EditCardModal
          card={editingCard}
          onClose={() => setEditingCard(null)}
        />
      )}
    </div>
  );
}
