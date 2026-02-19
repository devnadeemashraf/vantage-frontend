/**
 * aiChatSlice — Redux slice for AI chat state
 * Layer: Feature Slice (ai-search)
 * Pattern: Redux slice
 *
 * Stores messages array and isLoading flag. Reducers: addMessage, setLoading,
 * clearMessages. Used by AiSearchContainer to persist conversation state
 * across renders. Registered in the root store as aiChat reducer.
 */

import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

import type { ChatMessage } from '../types';

interface AiChatState {
  messages: ChatMessage[];
  isLoading: boolean;
}

const initialState: AiChatState = {
  messages: [],
  isLoading: false,
};

export const aiChatSlice = createSlice({
  name: 'aiChat',
  initialState,
  reducers: {
    addMessage(state, action: PayloadAction<ChatMessage>) {
      state.messages.push(action.payload);
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.isLoading = action.payload;
    },
    clearMessages(state) {
      state.messages = [];
    },
  },
});

export const { addMessage, setLoading, clearMessages } = aiChatSlice.actions;
export default aiChatSlice.reducer;
