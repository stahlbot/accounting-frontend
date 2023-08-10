import { createSlice, createAsyncThunk, createEntityAdapter } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
// import type { RootState } from '../../app/store'
import axios from 'axios'
import configureAxios from '../../api/api'
import { useSelector } from 'react-redux'
import { selectAccessToken } from '../login/currentUserSlice'
import { RootState } from '../../app/store'


type User = { id: string, username: string}
const usersAdapter = createEntityAdapter<User>({
    selectId: (user) => user.id,
    sortComparer: (a,b) => a.username.localeCompare(b.username)
})

interface UsersState {
    id: string, username: string
}

const usersSlice = createSlice({
    name: "users",
    initialState: usersAdapter.getInitialState({
        status: "idle",
        error: null
    }),
    reducers: {

    },
    extraReducers(builder) {
        builder
        .addCase(fetchUsers.pending, (state) => {
            state.status = 'loading'
        })
        .addCase(fetchUsers.fulfilled, (state, action: PayloadAction<UsersState[]>) => {
            state.status = 'succeeded'
            usersAdapter.upsertMany(state, action.payload)
        })
        .addCase(fetchUsers.rejected, (state) => {
            state.status = 'failed'
        })
    }
})

export default usersSlice.reducer

export const fetchUsers = createAsyncThunk(
    'users/fetchUsers', 
    async (_, {getState}) => {

        // third axios parameter is config that includes headers
        console.log(1)
        // const token = useSelector<RootState, string>(state => state.currentUser.access)
        const state = getState() as RootState;
        const token = state.currentUser.access
        console.log(2)
        // const axiosInstance = configureAxios(token)
        // const response = await axiosInstance.get("/api/v1/users/")
        const response = await axios.get("/api/v1/users", {headers: {Authorization: `Bearer ${token}`}})
        return response.data
    }
)

