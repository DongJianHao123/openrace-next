import { SafeAny } from "../types";
import { useUserStore } from "@/store/user.store";
import { redirect } from "next/navigation"; // 服务端路由跳转
import { isClient } from "@/utils";
import { cookies } from "next/headers";

// 类型定义（移除 admin 相关）
interface IRequestOptions {
    url: string;
    method: "GET" | "POST" | "PUT" | "DELETE";
    data?: SafeAny;
    params?: SafeAny;
    headers?: HeadersInit;
    /** 缓存时间（秒） */
    revalidate?: number | false;
}

export interface IResponse<T = SafeAny> extends SafeAny {
    code: number;
    message: string;
    data?: T;
}


// 消息提示封装（区分环境）
const showMessage = (content: string, type: "error" | "success" = "error") => {
    console[type === "error" ? "error" : "log"](content); // 服务端打印日志
};

class HttpClient {
    private readonly baseURL: string;

    constructor(baseURL?: string) {
        this.baseURL = baseURL || "";
    }

    /**
     * 获取请求头（仅 web-token，兼容 SSR/CSR）
     */
    private async getHeaders(headers?: HeadersInit): Promise<HeadersInit> {
        let token = "";
        // 客户端：从 headers 参数或 localStorage 获取 web-token
        // 安全地从 HeadersInit 联合类型中提取 token
        if (typeof Headers !== "undefined" && headers instanceof Headers) {
            token = headers.get("Token") || headers.get("token") || "";
        } else if (Array.isArray(headers)) {
            const found = headers.find(([k]) => k.toLowerCase() === "token");
            token = found ? found[1] : "";
        } else if (headers && typeof headers === "object") {
            token =
                (headers as Record<string, string>)["Token"] ||
                (headers as Record<string, string>)["token"] ||
                "";
        }
        if (!token) {
            token = (await cookies()).get("web-token")?.value || "";
        }
        return {
            "Content-Type": "application/json",
            ...headers,
            token, // 仅携带 web 端 token
        };
    }
    private async handleResponse(response: Response): Promise<IResponse> {
        const data = await response.json();

        // 401 登录过期处理（仅 web 端跳转 /login）
        if (data.result === 401) {
            showMessage("登录已过期，请重新登录");

            // 退出登录 + 清除 token（区分环境）
            if (isClient()) {
                useUserStore.getState().logout();
                (await cookies()).set("web-token", "");
                // 客户端路由跳转
                redirect("/login");
            } else {
                // 服务端重定向
                redirect("/login");
            }
            return { code: 401, message: "登录过期", data: null };
        }

        // 业务错误处理
        if (data.result !== 1) {
            showMessage(data.msg || "请求失败");
            return {
                code: data.result || response.status,
                message: data.msg || "请求失败",
                data: null,
            };
        }

        // 成功响应
        return {
            code: response.status,
            message: data.msg || "请求成功",
            data: data.data || data,
        };
    }

    /**
     * 处理请求错误
     */
    private handleError(error: SafeAny): IResponse {
        showMessage(error.message || "请求失败");
        return {
            code: error.status || 500,
            message: error.message || "请求失败",
            data: null,
        };
    }

    /**
     * 核心请求方法（兼容 SSR/CSR）
     */
    public async request<T = SafeAny>({
        url,
        method,
        data,
        params,
        headers,
        /** 缓存时间（秒） */
        revalidate,
    }: IRequestOptions): Promise<IResponse<T>> {
        try {
            // 拼接完整 URL
            const fullUrl = (process.env.HTTP_BASEURL ? (process.env.HTTP_BASEURL + this.baseURL) : this.baseURL) + url;
            // 处理 POST/PUT 分页参数转换（保留原有逻辑）
            let requestData = data;
            if (["POST", "post"].includes(method)) {
                requestData = { ...data };
                if (requestData?.current && !requestData?.page) {
                    requestData.page = requestData.current;
                    delete requestData.current;
                }
                if (requestData?.pageSize && !requestData?.limit) {
                    requestData.limit = requestData.pageSize;
                    delete requestData.pageSize;
                }
            }

            // 构建 Fetch 请求配置
            const fetchOptions: RequestInit = {
                method: method.toUpperCase(),
                headers: await this.getHeaders(headers),
                // 仅 POST/PUT/DELETE 携带 body
                ...(["POST", "PUT", "DELETE"].includes(method.toUpperCase()) && {
                    body: JSON.stringify(requestData || {}),
                }),
                credentials: "include", // 携带 cookie
            };
            if (revalidate || revalidate === 0) {
                if (revalidate > 0) {
                    fetchOptions.next = {
                        revalidate
                    }
                } else {
                    fetchOptions.cache = 'no-store'
                }
            } else {
                fetchOptions.cache = 'force-cache'
            }
            // 发送请求
            const response = await fetch(fullUrl, fetchOptions);
            // 处理响应
            return this.handleResponse(response) as Promise<IResponse<T>>;
        } catch (error) {
            return Promise.reject(this.handleError(error));
        }
    }

    /**
     * POST 请求封装
     */
    public post<T = SafeAny>(
        url: string,
        data?: SafeAny,
        /** 缓存时间（秒） */
        revalidate?: number | false,
        headers?: HeadersInit,
    ): Promise<IResponse<T>> {
        return this.request<T>({ url, method: "POST", data, headers, revalidate });
    }

    /**
     * GET 请求封装
     */
    public get<T = SafeAny>(
        url: string,
        params?: SafeAny,
        headers?: HeadersInit
    ): Promise<IResponse<T>> {
        return this.request<T>({ url, method: "GET", params, headers });
    }

    /**
     * PUT 请求封装（可选）
     */
    public put<T = SafeAny>(
        url: string,
        data?: SafeAny,
        headers?: HeadersInit
    ): Promise<IResponse<T>> {
        return this.request<T>({ url, method: "PUT", data, headers });
    }

    /**
     * DELETE 请求封装（可选）
     */
    public delete<T = SafeAny>(
        url: string,
        params?: SafeAny,
        headers?: HeadersInit
    ): Promise<IResponse<T>> {
        return this.request<T>({ url, method: "DELETE", params, headers });
    }
}

// 仅导出 web 端实例（移除 adminRequest）
export const serverRequest = new HttpClient("/api");
