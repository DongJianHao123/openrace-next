import { webRequest } from "@/services/request"
import { useUserStore } from "@/store/user.store"
import { IUser, IUserInfoByLogin } from "@/types/user"

export const apiUserLogin = ({ phone, code, password, type }: { phone: string, code?: string, password?: string, type: 'code' | 'password' | 'email' }) => {
    if (type === 'code') {
        return webRequest.post<IUser>('/user/login', { phone, code })
    }
    if (type === 'password') {
        return webRequest.post<IUser>('/user/passwordLogin', { phone, password })
    }
}

export const apiSendVerificationCode = (phone: string) => {
    return webRequest.post<void>('/user/sendSms', { phone })
}

export const apiGetUserInfo = () => {
    return webRequest.post<IUser>('/user/get')
}

export const apiUpdateUser = async ({ name, avatar }: IUser) => {
    const currentUser = useUserStore.getState().user
    const res = await webRequest.post('/user/update', { userId: currentUser?.userId, name, avatar })
    if (res.result === 1) {
        useUserStore.setState({ user: { ...currentUser, name, avatar } })
    }
    return res
}

export const apiGetUserInfoByLogin = (params: { login: string, userConfigField: string }) => {
    const { login, userConfigField } = params
    return webRequest.post<IUserInfoByLogin>(`/user/getInfoByLogin?login=${login}`, { userConfigField })
}