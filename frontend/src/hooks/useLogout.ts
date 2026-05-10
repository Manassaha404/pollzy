

import api from '#/api/axios'
import { useNavigate } from "@tanstack/react-router";
import { useUserInfoStore } from "#/store/userInfoStore";


export const useLogout = () => {
    const navigate = useNavigate();

    const logout = async () => {
        await api.post('/user/logout');
        useUserInfoStore.getState().setUserInfo({
            id: undefined,
            email: undefined,
            fullname: undefined,
            accessToken: undefined,
        });
        navigate({ to: '/' });
    };

    return logout;
};
  