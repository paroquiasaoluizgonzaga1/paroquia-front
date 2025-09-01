import { loginApi } from "@/services/api";
import { create } from "zustand";
import Cookies from "js-cookie";
import { jwtDecode, type JwtPayload } from "jwt-decode";
import { ROLES } from "@/constants/Roles";
import type { AxiosResponse } from "axios";
import { sidebarStore } from "./sidebarStore";

interface ISignInCredentials {
  email: string;
  password: string;
}

interface User {
  id: string;
  name: string;
  role: string;
}

interface AuthProps {
  user: User | undefined;
  isAdmin: boolean;
  isManager: boolean;
  isAuthenticated: boolean;
}

interface IAuthState extends AuthProps {
  signIn: (credentials: ISignInCredentials, redirect?: string) => Promise<void>;
  signOut: () => void;
  // fetchMemberId: () => Promise<void>;
}

interface IMember {
  fullName: string;
  email: string;
}

interface LoginResponse {
  member: IMember;
  token: string;
}

interface TokenPayload extends JwtPayload {
  "http://schemas.microsoft.com/ws/2008/06/identity/claims/role": keyof typeof ROLES;
  "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier": string;
  "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name": string;
  MemberId: string;
}

// eslint-disable-next-line react-refresh/only-export-components
const InitialProps = (): AuthProps => {
  const cookies = Cookies.get("proj.parish.token");

  if (cookies) {
    const data: LoginResponse = JSON.parse(cookies);

    try {
      const {
        "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier":
          id,
        "http://schemas.microsoft.com/ws/2008/06/identity/claims/role": role,
      } = jwtDecode<TokenPayload>(data.token);

      const { setMenu } = sidebarStore.getState();

      const strRole = role.toString();

      setMenu(strRole);

      return {
        user: {
          id,
          name: data.member.fullName,
          role,
        },
        isAdmin: strRole === ROLES.Admin,
        isManager: [ROLES.Admin, ROLES.Manager].some((x) => x === strRole),
        isAuthenticated: true,
      };
    } catch {
      Cookies.remove("proj.parish.token");
      window.location.href = "/login";
    }
  }

  return {
    user: undefined,
    isAdmin: false,
    isManager: false,
    isAuthenticated: false,
  };
};

export const authStore = create<IAuthState>((set) => {
  return {
    ...InitialProps(),
    signIn: async (
      { email, password }: ISignInCredentials,
      redirect?: string
    ): Promise<void> => {
      const { data } = await loginApi.post<
        ISignInCredentials,
        AxiosResponse<LoginResponse>
      >("members/login", {
        email,
        password,
      });

      const { setMenu } = sidebarStore.getState();

      Cookies.set("proj.parish.token", JSON.stringify(data), {
        expires: 2,
        secure: false,
        sameSite: "Strict",
      });

      const {
        "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier":
          id,
        "http://schemas.microsoft.com/ws/2008/06/identity/claims/role": role,
      } = jwtDecode<TokenPayload>(data.token);

      const strRole = role.toString();

      setMenu(strRole);

      set(() => ({
        user: {
          id,
          memberId: "",
          name: data.member.fullName,
          role,
        },
        isAdmin: strRole === ROLES.Admin,
        isManager: [ROLES.Admin, ROLES.Manager].some((x) => x === strRole),
        isAuthenticated: true,
      }));

      window.location.href = redirect ?? "";
    },
    signOut: () => {
      Cookies.remove("proj.parish.token");
      const currentPath = window.location.pathname;
      window.location.href = `/login?redirect=${encodeURIComponent(
        currentPath
      )}`;
      // set({
      //     user: undefined,
      //     isAdmin: false,
      //     isManager: false,
      //     isAuthenticated: false,
      // });
      // window.location.href = '/login';
    },
    // fetchMemberId: async (): Promise<void> => {
    //   const response = await api.get<IGetMemberResponse>(`/members/id`);
    //   const member = response.data;

    //   set((state) => ({
    //     user: state.user
    //       ? {
    //           ...state.user,
    //           memberId: member.memberId,
    //         }
    //       : undefined,
    //     canManageContracts: member.canManageContracts,
    //   }));
    // },
  };
});
