import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "./apiService";
import { toast } from "react-toastify";

const initialState = {
  books: [],
  favoriteBooks: [],
  loading: false,
  errorMessage: "",
  book: null,
};

export const getBooks = createAsyncThunk(
  "bookStore/getBooks",
  async ({ pageNum, limit, query }) => {
    // console.log(`${pageNum}-${query}`);
    let url = `/books?_page=${pageNum}&_limit=${limit}`;
    if (query) url += `&q=${query}`;
    const response = await api.get(url);
    return response.data;
  }
);

export const getDetailBook = createAsyncThunk(
  "bookStore/getDetailBook",
  async ({ bookId }) => {
    const response = await api.get(`/books/${bookId}`);
    return response.data;
  }
);

export const postFavorBook = createAsyncThunk(
  "bookStore/postFavorBook",
  async ({ addingBook }) => {
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
  async ({ removedBookId }) => {
    await api.delete(`/favorites/${removedBookId}`);
    // console.log(removedBookId);
    return removedBookId;
  }
);

export const bookStoreSlice = createSlice({
  name: "book-store",
  initialState,
  reducers: {
    // setQuery: (state, action) => {
    //   state.query = action.payload;
    // },
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
      .addCase(postFavorBook.fulfilled, (state, action) => {
        state.loading = false;
        state.favoriteBooks.push(action.payload);
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
        state.favoriteBooks = action.payload;
      })
      .addCase(getFavoriteBooks.rejected, (state, action) => {
        state.loading = false;
        toast.error(action.error.message);
      });

    builder
      .addCase(removeFavorBook.pending, (state) => {
        state.loading = true;
      })
      .addCase(removeFavorBook.fulfilled, (state, action) => {
        state.loading = false;
        state.favoriteBooks = state.favoriteBooks.filter(
          (item) => item.id !== action.payload
        );
        toast.success("The book has been removed");
      })
      .addCase(removeFavorBook.rejected, (state, action) => {
        state.loading = false;
        toast.error(action.error.message);
      });
  },
});

export const { setQuery } = bookStoreSlice.actions;
export default bookStoreSlice.reducer;
