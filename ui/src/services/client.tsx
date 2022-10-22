import axios from "axios";
import * as API from "@/api";
import { AlertAPI } from "@/components/Alert";

const apiBase = (() => {
  if (import.meta.env.VITE_API_BASE_URL) {
    return import.meta.env.VITE_API_BASE_URL;
  }
  if (import.meta.env.PROD) {
    return "/api";
  }
  return "http://127.0.0.1:1345/api";
})();

console.log("Using API base %s", apiBase);

declare module "axios" {
  interface AxiosRequestConfig {
    iWantToHandleError?: boolean;
  }
}

class ClientService {
  public AxiosInstance = axios.create();
  public API = new API.DefaultApi(
    new API.Configuration({
      basePath: apiBase,
    }),
    undefined,
    this.AxiosInstance
  );

  public prettyPrintResponseError(err: any) {
    if (err?.response?.data?.statusCode === 500) {
      return (
        <>
          <p>Internal Server Error</p>
          <p>Error details: {err?.response?.data?.message}</p>
        </>
      );
    } else {
      return (
        <p>{err?.response?.data?.message || err.message || "Internal error"}</p>
      );
    }
  }

  // An alert will be displayed when meeting errors, if `iWantToHandleError` is not set.
  // In this way we don't need to write error handlers everywhere.
  public registerAlertForErrors() {
    this.AxiosInstance.interceptors.response.use(undefined, (err: any) => {
      if (!err?.config?.iWantToHandleError && err.handled !== true) {
        console.log(err);
        AlertAPI.error({
          title: "Request Error",
          message: (
            <div className="prose-sm">{this.prettyPrintResponseError(err)}</div>
          ),
        });
        err.handled = true;
      }
      return Promise.reject(err);
    });
  }
}

export const DefaultClient = new ClientService();
