import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "../../api/axios";

export interface Board {
  _id: string;
  name: string;
  columns: string[];
}

export interface BoardsState {
  activeBoard: Board | null;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: BoardsState = {
  activeBoard: null,
  status: "idle",
  error: null,
};

export const fetchBoardById = createAsyncThunk(
  "boards/fetchBoardById",
  async (boardId: string) => {
    const { data } = await api.get(`/boards/${boardId}`);
    return data.board;
  }
);

export const createBoard = createAsyncThunk(
  "boards/createBoard",
  async (name: string) => {
    const { data } = await api.post("/boards", { name });
    return data;
  }
);

const boardsSlice = createSlice({
  name: "boards",
  initialState,
  reducers: {
    clearActiveBoard(state) {
      state.activeBoard = null;
      state.status = "idle";
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBoardById.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchBoardById.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.activeBoard = action.payload;
      })
      .addCase(fetchBoardById.rejected, (state) => {
        state.status = "failed";
        state.error = "Board not found";
      })
      .addCase(createBoard.fulfilled, (state, action) => {
        state.activeBoard = action.payload;
      });
  },
});

export const { clearActiveBoard } = boardsSlice.actions;
export const boardsReducer = boardsSlice.reducer;
