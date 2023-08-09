import { Box, Button, TextField } from "@mui/material"
import { useState } from "react"
import { useAppDispatch } from "../../app/hooks"
import { fetchToken } from "./userSlice"
import { TextInput } from "@mantine/core"



export const LoginPage = () => {
    const dispatch = useAppDispatch()

    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [loginRequestStatus, setLoginRequestStatus] = useState('idle')

    const onUsernameChanged = e => setUsername(e.target.value)
    const onPasswordChanged = e => setPassword(e.target.value)

    const handleLoginClicked = async (e) => {
        // prevent site from refreshing after submit
        e.preventDefault() 
        try {
            console.log(`username: ${username}, password: ${password}`)

            setLoginRequestStatus('pending')
            await dispatch(fetchToken({username, password})).unwrap()
            

        } catch (err){
            console.error('Failed to save the post: ', err)
        } finally {
            setLoginRequestStatus('idle')
        }
        

    }

    return (
        <Box component="form" onSubmit={handleLoginClicked} >
            <TextField
                required
                id="username"
                label="Username"
                name="username"
                autoFocus
                value={username}
                onChange={onUsernameChanged}
            />
            <TextField 
                required
                id="password"
                name="password"
                label="Password"
                type="password"
                value={password}
                onChange={onPasswordChanged}
            />
            <Button variant="outlined" type="submit">
                Login
            </Button>
            <TextInput label="Test"/>
        </Box>
    )
}