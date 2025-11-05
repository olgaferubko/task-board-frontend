import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "../../api/axios";

interface CreateCardPayload {
  boardId: string;
  column: "todo" | "in-progress" | "done";
  title: string;
  description: string;
}

interface Card {
  _id: string;
  boardId: string;
  column: string;
  title: string;
  description: string;
}

export const fetchCards = createAsyncThunk(
  "cards/fetchCards",
  async (boardId: string) => {
    const { data } = await api.get(`/cards/${boardId}`);
    return { boardId, cards: data };
  }
);

export const createCard = createAsyncThunk(
  "cards/createCard",
  async ({ boardId, column, title, description }: CreateCardPayload) => {
    const { data } = await api.post(`/cards`, {
      boardId,
      column,
      title,
      description,
    });

    return { boardId, card: data };
  }
);

export const updateCard = createAsyncThunk(
  "cards/updateCard",
  async ({ cardId, updates }: { cardId: string; updates: any }) => {
    const { data } = await api.patch(`/cards/${cardId}`, updates);
    return data;
  }
);

export const moveCard = createAsyncThunk(
  "cards/moveCard",
  async ({ cardId, toColumn, newOrder }: any) => {
    const { data } = await api.patch(`/cards/${cardId}/move`, {
      toColumn,
      newOrder,
    });
    return data;
  }
);

export const deleteCard = createAsyncThunk(
  "cards/deleteCard",
  async (cardId: string) => {
    await api.delete(`/cards/${cardId}`);
    return cardId;
  }
);

interface CardsState {
  byBoard: Record<string, Card[]>;
  status: "idle" | "loading" | "succeeded" | "failed";
  error?: string | null;
}

const initialState: CardsState = {
  byBoard: {},
  status: "idle"
};

const cardsSlice = createSlice({
  name: "cards",
  initialState,
  reducers: {
    registerBoard(state, action) {
      const boardId = action.payload;
      if (!state.byBoard[boardId]) {
        state.byBoard[boardId] = [];
      }
    },

    optimisticMove(state, action) {
      const { cardId, toColumn, newIndex, boardId } = action.payload;

      const cards = state.byBoard[boardId] || [];
      const card = cards.find(c => c._id === cardId);
      if (!card) return;
      state.byBoard[boardId] = cards.filter(c => c._id !== cardId);
      card.column = toColumn;
      state.byBoard[boardId].splice(newIndex, 0, card);
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCards.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchCards.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.byBoard[action.payload.boardId] = action.payload.cards;
      })
      .addCase(createCard.fulfilled, (state, action) => {
        const { boardId, card } = action.payload;
        if (!state.byBoard[boardId]) {
          state.byBoard[boardId] = [];
        }
        state.byBoard[boardId].push(card);
      })
      .addCase(updateCard.fulfilled, (state, action) => {
        const updatedCard = action.payload;
        const boardId = updatedCard.boardId;
        state.byBoard[boardId] = state.byBoard[boardId].map((c) =>
          c._id === updatedCard._id ? updatedCard : c
        );
      })
      .addCase(moveCard.fulfilled, (state, action) => {
        const updated = action.payload;
        const boardId = updated.boardId;

        state.byBoard[boardId] = state.byBoard[boardId]
          .filter((c) => c._id !== updated._id);

        state.byBoard[boardId].splice(updated.order, 0, updated);
      })
      .addCase(deleteCard.fulfilled, (state, action) => {
        const cardId = action.payload;
        for (const boardId of Object.keys(state.byBoard)) {
          state.byBoard[boardId] = state.byBoard[boardId].filter(
            (c) => c._id !== cardId
          );
        }
      });
  },
});

export const cardsReducer = cardsSlice.reducer;
export const { registerBoard, optimisticMove } = cardsSlice.actions;