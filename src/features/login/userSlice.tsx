import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import axios from "axios"
import type { PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from '../../app/store'

interface UserState {
    username: string,
    access: string,
    refresh: string,
    status: string
}

interface ResponseState {
    refresh: string,
    access: string
}

interface InputState {
    username: string,
    password: string
}

const initialState: UserState = {
    username: '',
    access: '', 
    refresh: '', 
    status: 'idle'
}

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {},
    extraReducers(builder) {
        builder
        .addCase(fetchToken.pending, (state) => {
            state.status = 'loading'
        })
        .addCase(fetchToken.fulfilled, (state, action: PayloadAction<ResponseState>) => {
            state.status = 'succeeded'
            const data = action.payload
            state.access = data.access
            state.refresh = data.refresh
        })
        .addCase(fetchToken.rejected, (state) => {
            state.status = 'failed'
        })
    }
})


export const fetchToken = createAsyncThunk(
    'user/fetchToken', 
    async (credentials: InputState) => {
        // third axios parameter is config that includes headers
        const response = await axios.post("/api/token/", credentials)
        return response.data
    }
)

// Other code such as selectors can use the imported `RootState` type
export const selectUser = (state: RootState) => state.user.username

export default userSlice.reducer
