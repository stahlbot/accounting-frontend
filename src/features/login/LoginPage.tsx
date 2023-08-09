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

    const canSave: boolean = Object.values(form.values).every(Boolean) && loginRequestStatus === 'idle'

    const submit = form.onSubmit(
        async ({password, username}) => {
            if (canSave) {
                try {
                    setLoginRequestStatus('pending')
                    await dispatch(fetchToken({username, password})).unwrap()
                    .then()
                    
        
                } catch (err){
                    console.error('Failed to login: ', err)
                } finally {
                    setLoginRequestStatus('idle')
                }
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
            <Button 
                type="submit" 
                disabled={!canSave}
                >
                Login
            </Button>
        </form>
    )
}