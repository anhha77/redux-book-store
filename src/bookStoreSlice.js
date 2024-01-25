import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "./apiService";
import { toast } from "react-toastify";

const initialState = {
  books: [],
  pageNum: 1,
  totalPage: 10,
  limit: 10,
  loading: false,
  query: "",
  errorMessage: "",
  book: null,
};

export const getBooks = createAsyncThunk(
  "bookStore/getBooks",
  async ({ getState }) => {
    const state = getState();
    let url = `/books?_page=${state.pageNum}&_limit=${state.limit}`;
    if (state.query) url += `&q=${state.query}`;
    const response = await api.get(url);
    // console.log(response.data);
    return response.data;
  }
);

export const getDetailBook = createAsyncThunk(
  "bookStore/getDetailBook",
  async (bookId) => {
    const response = await api.get(`/books/${bookId}`);
    return response.data;
  }
);

export const postFavorBook = createAsyncThunk(
  "bookStore/postFavorBook",
  async (addingBook) => {
    const response = await api.post(`/favorites`, addingBook);
    return response.data;
  }
);

export const getFavoriteBooks = createAsyncThunk(
  "bookStore/getFavoriteBooks",
  async () => {
    const response = await api.get(`/favorites`);
    return response.data;
  }
);

export const removeFavorBook = createAsyncThunk(
  "bookStore/removeFavorBook",
  async (removedBookId) => {
    const response = await api.delete(`/favorites/${removedBookId}`);
    return response.data;
  }
);

export const bookStoreSlice = createSlice({
  name: "book-store",
  initialState,
  reducers: {
    setQuery: (state, action) => {
      state.query = action.payload;
    },
    setPageNum: (state, action) => {
      state.pageNum = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getBooks.pending, (state) => {
        state.loading = true;
      })
      .addCase(getBooks.fulfilled, (state, action) => {
        state.loading = false;
        state.errorMessage = "";
        state.books = action.payload;
      })
      .addCase(getBooks.rejected, (state, action) => {
        state.loading = false;
        state.errorMessage = action.error.message;
      });

    builder
      .addCase(getDetailBook.pending, (state) => {
        state.loading = true;
      })
      .addCase(getDetailBook.fulfilled, (state, action) => {
        state.loading = false;
        state.book = action.payload;
      })
      .addCase(getDetailBook.rejected, (state, action) => {
        state.loading = false;
        toast.error(action.error.message);
      });

    builder
      .addCase(postFavorBook.pending, (state) => {
        state.loading = true;
      })
      .addCase(postFavorBook.fulfilled, (state) => {
        state.loading = false;
        toast.success("The book has been added to the reading list!");
      })
      .addCase(postFavorBook.rejected, (state, action) => {
        state.loading = false;
        toast.error(action.error.message);
      });

    builder
      .addCase(getFavoriteBooks.pending, (state) => {
        state.loading = true;
      })
      .addCase(getFavoriteBooks.fulfilled, (state, action) => {
        state.loading = false;
        state.books = action.payload;
      })
      .addCase(getFavoriteBooks.rejected, (state, action) => {
        state.loading = false;
        toast.error(action.error.message);
      });

    builder
      .addCase(removeFavorBook.pending, (state) => {
        state.loading = true;
      })
      .addCase(removeFavorBook.fulfilled, (state) => {
        state.loading = false;
        toast.success("The book has been removed");
      })
      .addCase(removeFavorBook.rejected, (state, action) => {
        state.loading = false;
        toast.error(action.error.message);
      });
  },
});

export const { setQuery, setPageNum } = bookStoreSlice.actions;
export default bookStoreSlice.reducer;
