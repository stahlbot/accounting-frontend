import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import axios from "axios"
import type { PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from '../../app/store'

interface UserState {
    username: string,
    access: string,
    refresh: string,
    status: string,
    id: string,
    isAuthenticated: boolean
}

interface ResponseState {
    refresh: string,
    access: string,
    username: string,
    id: number
}

interface InputState {
    username: string,
    password: string,
}

const initialState: UserState = {
    username: '',
    access: '', 
    refresh: '', 
    status: 'idle',
    id: '',
    isAuthenticated: false
}

const currentUserSlice = createSlice({
    name: 'currentUser',
    initialState,
    reducers: {
        loginFromLocalStorage(state: UserState, _action: PayloadAction) {
            const accesss = localStorage.getItem("access")
            const refresh = localStorage.getItem("access")
            const id = localStorage.getItem("userId")
            const username = localStorage.getItem("username")
            if (accesss && refresh && id && username) {
                state.access = accesss
                state.refresh = refresh
                state.id = refresh
                state.username = username
                state.isAuthenticated = true
            }

        }
    },
    extraReducers(builder) {
        builder
        .addCase(login.pending, (state) => {
            state.status = 'loading'
        })
        .addCase(login.fulfilled, (state, action: PayloadAction<ResponseState>) => {
            state.status = 'succeeded'
            const data = action.payload
            state.access = data.access
            state.refresh = data.refresh
            state.id = data.id.toString()
            state.username = data.username
            state.isAuthenticated = true

            localStorage.setItem('access', data.access)
            localStorage.setItem('refresh', data.refresh)
            localStorage.setItem('username', data.username)
            localStorage.setItem('userId', data.id.toString())

            // // respone.headers.set("set-cookie", 
            // cookie.serialize(
            //     'access', 
            //     data.access, 
            //     {
            //         httpOnly: true,
            //         secure: false,
            //         maxAge: 60 * 30, // TODO: change to jwt setting in django
            //         sameSite: 'strict',
            //         path: '/api/'
            //     })
            
            // // )
            // cookie.serialize(
            //     'access', 
            //     data.refresh, 
            //     {
            //         httpOnly: true,
            //         secure: false,
            //         maxAge: 60 * 60 * 24, // TODO: change to jwt setting in django
            //         sameSite: 'strict',
            //         path: '/api/'
            //     })
        })
        .addCase(login.rejected, (state) => {
            state.status = 'failed'
        })
    }
})


export const login = createAsyncThunk(
    'currentUser/login', 
    async (credentials: InputState) => {
        // third axios parameter is config that includes headers
        const response = await axios.post("/api/token/", credentials)
        return response.data
    }
)

// Other code such as selectors can use the imported `RootState` type
export const selectUser = (state: RootState) => state.currentUser.username
export const selectAccessToken = (state: RootState) => state.currentUser.access
export const selectISAuthenticated = (state: RootState) => state.currentUser.isAuthenticated

export const { loginFromLocalStorage } = currentUserSlice.actions

export default currentUserSlice.reducer
