import { Draggable } from "@hello-pangea/dnd";
import s from "./Card.module.css";
import { useState } from "react";
import EditCardModal from "../EditCardModal/EditCardModal";

interface CardProps {
  card: {
    _id: string;
    title: string;
    description: string;
  };
  index: number;
  onEdit: (card: any) => void;
  onDelete: (id: string) => void;
}

export default function Card({ card, index, onEdit, onDelete }: CardProps) {
  const [showEdit, setShowEdit] = useState(false);

  return (
    <>
      <Draggable draggableId={card._id} index={index}>
        {(provided) => (
          <div
            className={s.card}
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
          >
            <div className={s.header}>
              <h4 className={s.title}>{card.title}</h4>
              <p className={s.desc}>{card.description || "No description"}</p>
            </div>

            <div className={s.actions}>
              <button className={s.iconBtn} onClick={() => onEdit(card)}>
                <svg className={s.icon} width={18} height={18}>
                  <use href="/icons.svg#pencil" />
                </svg>
              </button>

              <button className={s.iconBtn} onClick={() => onDelete(card._id)}>
                <svg className={s.icon} width={18} height={18}>
                  <use href="/icons.svg#trash" />
                </svg>
              </button>
            </div>
          </div>
        )}
      </Draggable>

      {showEdit && (
        <EditCardModal card={card} onClose={() => setShowEdit(false)} />
      )}
    </>
  );
}
