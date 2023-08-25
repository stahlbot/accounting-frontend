import {
  createSlice,
  createAsyncThunk,
  createEntityAdapter,
  createSelector,
} from "@reduxjs/toolkit";
import type { PayloadAction, Update } from "@reduxjs/toolkit";
// import type { RootState } from '../../app/store'
import { axiosInstance } from "../../api/api";
import { RootState } from "../../app/store";
import { sortStringsAndNumbers } from "../../app/sort";

interface Category {
  id: string;
  name: string;
  document: string;
}

const categoriesAdapter = createEntityAdapter<Category>({
  selectId: (category) => category.id,
  sortComparer: (a, b) => a.name.localeCompare(b.name),
});

const categoriesSlice = createSlice({
  name: "categoryTemplates",
  initialState: categoriesAdapter.getInitialState({
    status: "idle",
    error: null,
  }),
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(fetchCategories.pending, (state) => {
        state.status = "loading";
      })
      .addCase(
        fetchCategories.fulfilled,
        (state, action: PayloadAction<Category[]>) => {
          state.status = "succeeded";
          categoriesAdapter.upsertMany(state, action.payload);
        }
      )
      .addCase(fetchCategories.rejected, (state) => {
        state.status = "failed";
      })
      .addCase(addCategory.fulfilled, categoriesAdapter.addOne)
      .addCase(deleteCategory.fulfilled, categoriesAdapter.removeOne)
      .addCase(editCategory.fulfilled, (state, action) => {
        categoriesAdapter.updateOne(state, action.payload);
        // console.log(current(state.entities));
      });
  },
});

export default categoriesSlice.reducer;

export const {
  selectAll: selectAllCategories,
  selectById: selectCategoryById,
  selectIds: selectCategoryIds,
} = categoriesAdapter.getSelectors((state: RootState) => state.categories);

export const selectCategoryIdsSortedBy = createSelector(
  [selectAllCategories, (state, sortBy) => sortBy],
  (categories, sortBy) => {
    const categoriesSorted = categories.sort((a, b) =>
      sortStringsAndNumbers(a, b, sortBy)
    );
    return categoriesSorted.map((c) => c.id);
  }
);

export const fetchCategories = createAsyncThunk(
  "categories/fetchCategoryTemplates",
  async () => {
    const response = await axiosInstance.get("/api/v1/categories");
    // const response = await axios.get("/api/v1/users", {headers: {Authorization: `Bearer ${token}`}})
    return response.data;
  }
);

export const addCategory = createAsyncThunk(
  "categories/addCategory",
  async (category: { name: string; document: string }) => {
    const response = await axiosInstance.post("/api/v1/categories/", category);
    return response.data;
  }
);

export const editCategory = createAsyncThunk(
  "categories/editCategory",
  async (category: Update<Category>) => {
    const response = await axiosInstance.patch(
      `/api/v1/categories/${category.id}/`,
      category.changes
    );
    return category;
  }
);

export const deleteCategory = createAsyncThunk(
  "categories/deleteCategory",
  async (categoryId: string) => {
    const response = await axiosInstance.delete(
      `/api/v1/categories/${categoryId}`
    );
    return categoryId;
  }
);
