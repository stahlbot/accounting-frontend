import { useState } from "react";
import { useAppDispatch } from "../../app/hooks";
import { login, selectISAuthenticated } from "./currentUserSlice";
import {
  Button,
  Container,
  Paper,
  PasswordInput,
  TextInput,
  Title,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

export const LoginPage = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [loginRequestStatus, setLoginRequestStatus] = useState("idle");
  // const isAuthenticated = useSelector(selectISAuthenticated)
  const isAuthenticated = localStorage.getItem("isAuthenticated");

  const form = useForm({
    initialValues: {
      password: "",
      username: "",
    },
  });

  const canSave: boolean =
    Object.values(form.values).every(Boolean) && loginRequestStatus === "idle";

  const submit = form.onSubmit(async ({ password, username }) => {
    if (canSave) {
      try {
        setLoginRequestStatus("pending");
        await dispatch(login({ username, password })).unwrap();
        console.log(isAuthenticated);
        navigate("/user");
      } catch (err) {
        console.error("Failed to login: ", err);
      } finally {
        setLoginRequestStatus("idle");
      }
    }
  });

  return (
    <form onSubmit={submit}>
      <Container size={420}>
        <Title align="center">Login</Title>
        <Paper withBorder shadow="md" p={30} mt={30} radius="md">
          <TextInput
            placeholder="Username"
            label="Username"
            required
            {...form.getInputProps("username")}
          />
          <PasswordInput
            placeholder="Password"
            label="Password"
            mt="md"
            required
            {...form.getInputProps("password")}
          />
          <Button type="submit" disabled={!canSave} mt={"md"} fullWidth>
            Login
          </Button>
        </Paper>
      </Container>
    </form>
  );
};
