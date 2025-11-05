import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import s from "./HomePage.module.css";

import { fetchBoardById, createBoard } from "../../redux/slices/boards";
import { fetchCards, registerBoard } from "../../redux/slices/cards";

import { RootState } from "../../redux/store";
import Board from "../../components/Board/Board";
import CreateBoardModal from "../../components/CreateBoardModal/CreateBoardModal";

export default function HomePage() {
  const dispatch = useDispatch<any>();

  const [boardIdInput, setBoardIdInput] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);

  const { activeBoard, status, error, lastBoardId } = useSelector(
    (state: RootState) => state.boards
  );

  useEffect(() => {
    if (!lastBoardId) return;           

    setBoardIdInput(lastBoardId);      
    dispatch(fetchBoardById(lastBoardId));
    dispatch(fetchCards(lastBoardId));
  }, [lastBoardId, dispatch]);

  const handleLoad = async () => {
    if (!boardIdInput.trim()) return;

    try {
      const board = await dispatch(fetchBoardById(boardIdInput)).unwrap();
      dispatch(registerBoard(board._id));
      await dispatch(fetchCards(board._id));
    } catch {
      setBoardIdInput(boardIdInput);
    }
  };

  const handleCreateBoard = async (name: string) => {
    try {
      const created = await dispatch(createBoard(name)).unwrap();

      dispatch(registerBoard(created._id));
      setBoardIdInput(created._id);
      setShowCreateModal(false);

      await dispatch(fetchBoardById(created._id));
      await dispatch(fetchCards(created._id));
    } catch (err) {
      console.error("Failed to create board:", err);
    }
  };

return (
  <div className={s.wrapper}>
    <div className={s.container}>
      <div className={s.top}>
        <input
          className={s.input}
          placeholder="Enter a board ID here..."
          value={boardIdInput}
          onChange={(e) => setBoardIdInput(e.target.value)}
        />

        <button className={s.loadBtn} onClick={handleLoad}>
          Load
        </button>

        <button
          className={s.createBtn}
          onClick={() => setShowCreateModal(true)}
        >
          New board
        </button>
      </div>

      {status === "loading" && <p className={s.stateText}>Loading...</p>}
      {error && <p className={s.error}>{error}</p>}

      {activeBoard ? (
        <Board boardId={activeBoard._id} />
      ) : (
        <p className={s.stateText}>Enter a board ID or create a new one</p>
      )}

      {showCreateModal && (
        <CreateBoardModal
          onConfirm={handleCreateBoard}
          onClose={() => setShowCreateModal(false)}
        />
      )}
    </div>
  </div>
);
}
