import { Title } from "@mantine/core"
import { useEffect } from "react"
import { useSelector } from "react-redux"
import type { RootState } from '../../app/store'
import { fetchUsers } from "./userSlice"
import { useAppDispatch } from "../../app/hooks"

export const UserPage = () => {
    const usersStatus = useSelector<RootState, string>(state => state.users.status)
    const dispatch = useAppDispatch()
    useEffect(() => {
        if (usersStatus === 'idle') {
            dispatch(fetchUsers())
        }
    },)


    return (
        <Title>
            User
        </Title>
    )
}