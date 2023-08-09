import { useState } from "react"
import { useAppDispatch } from "../../app/hooks"
import { fetchToken } from "./userSlice"
import { Button, PasswordInput, TextInput } from "@mantine/core"
import { useForm } from '@mantine/form'



export const LoginPage = () => {
    const dispatch = useAppDispatch()

    const [loginRequestStatus, setLoginRequestStatus] = useState('idle')

    const form = useForm({
        initialValues: {
          password: '',
          username: ''
        },
      })

    const submit = form.onSubmit(
        async ({password, username}) => {
            try {
                console.log(`username: ${password}, password: ${username}`)
    
                setLoginRequestStatus('pending')
                await dispatch(fetchToken({username, password})).unwrap()
                
    
            } catch (err){
                console.error('Failed to save the post: ', err)
            } finally {
                setLoginRequestStatus('idle')
            }
        }
    )

    return (
        <form onSubmit={submit}>
            <TextInput
                placeholder="Username"
                label="Username"
                {...form.getInputProps('username')}
            />
            <PasswordInput
                placeholder="Password"
                label="Password"
                {...form.getInputProps('password')}
            />
            <Button type="submit">Submit</Button>
        </form>
    )
}