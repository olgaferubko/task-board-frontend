import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../redux/store";
import Column from "../Column/Column";
import s from "./Board.module.css";
import { DragDropContext, DropResult } from "@hello-pangea/dnd";
import { moveCard } from "../../redux/slices/cards";

interface Props {
  boardId: string;
}

export default function Board({ boardId }: Props) {
  const dispatch = useDispatch<any>();
  const cards = useSelector((state: RootState) => state.cards.byBoard[boardId] || []);
  const boardTitle = useSelector((state: RootState) => state.boards.activeBoard?.name);
  const handleDragEnd = async (result: DropResult) => {
  const { draggableId, destination, source } = result;

  if (!destination) return;
  if (
    destination.droppableId === source.droppableId &&
    destination.index === source.index
  ) return;

  const fromColumn = source.droppableId;
  const toColumn = destination.droppableId;

  dispatch({
    type: "cards/optimisticMove",
    payload: {
      cardId: draggableId,
      fromColumn,
      toColumn,
      newIndex: destination.index,
      boardId
    }
  });

  dispatch(moveCard({
    cardId: draggableId,
    toColumn,
    newOrder: destination.index
  }));
};

  return (
    <>
      <h1 className={s.boardTitle}>{boardTitle}</h1>
      <DragDropContext onDragEnd={handleDragEnd}>
        
        <div className={s.boardWrapper}>
          <div className={s.board}>
            <Column title="To Do" status="todo" boardId={boardId} cards={cards.filter(c => c.column === "todo")} />
            <Column title="In Progress" status="in-progress" boardId={boardId} cards={cards.filter(c => c.column === "in-progress")} />
            <Column title="Done" status="done" boardId={boardId} cards={cards.filter(c => c.column === "done")} />
          </div>
        </div>

      </DragDropContext>
    </>
  );
}
