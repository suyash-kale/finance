import { useSessionStore } from "@/store/session";
import axios, {
  AxiosHeaders,
  type AxiosRequestConfig,
  type AxiosResponse,
  type RawAxiosRequestHeaders,
} from "axios";
import { toast } from "sonner";

export const service = async <T = unknown, D = unknown>(
  config: AxiosRequestConfig<D>,
): Promise<T> => {
  try {
    const { user } = useSessionStore.getState();

    const headers: RawAxiosRequestHeaders | AxiosHeaders = {
      "Content-Type": "application/json",
      Accept: "application/json",
      ...config.headers,
    };
    if (user) {
      headers.Authorization = `Bearer ${user.token}`;
    }

    const req = await axios.request<T, AxiosResponse<T>, D>({
      ...config,
      headers,
    });

    return req.data;
  } catch (e) {
    if (axios.isAxiosError(e)) {
      toast.error(e.response?.data?.message || "An error occurred.");
      throw new Error(e.response?.data?.message || "An error occurred.");
    }
    throw new Error("An unexpected error occurred.");
  }
};
