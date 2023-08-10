import axios from "axios"
import { useSelector } from "react-redux"
import { selectAccessToken } from "../features/login/currentUserSlice"
import { store } from "../app/store"

const configureAxios = (accessToken) => {
const axiosInstance = axios.create({
//   baseURL: "http://localhost:8000/api",
  headers: {
    "Content-Type": "application/json",
  },
})

axiosInstance.interceptors.request.use(function (config) {
    console.log("1")
    const token = accessToken
    console.log("2")
    config.headers.Authorization =  token ? `Bearer ${token}` : ''
    return config
  })

return axiosInstance
}
export default configureAxios