import { AlertAPI } from "@/components/Alert";
import sf from "promise-singleflight";
import { DefaultClient } from "./client";

declare module "axios" {
  interface AxiosRequestConfig {
    iWantToHandleSessionExpire?: boolean;
  }
}

class SessionService {
  // FIXME: the typedef of singleflight is broken
  private singleflight = (sf as any).createPromiseSingleflight();

  // Will be filled only after a successful bootstrap
  private sessionId?: string;

  public registerInvalidSessionHandler() {
    DefaultClient.AxiosInstance.interceptors.response.use(
      undefined,
      (err: any) => {
        const { response, config } = err;
        if (
          !config?.iWantToHandleSessionExpire &&
          response?.data?.statusCode === 401
        ) {
          // Session is invalid
          console.log(err);
          this.clearSession();
          AlertAPI.show({
            title: "Session is expired",
            type: "info",
            message: (
              <div className="prose-sm">
                <p>
                  Due to inactivity, your current SQL sandbox was destroyed.
                </p>
                <p>
                  You can execute the SQL statements again, which will be
                  running in a fresh sandbox.
                </p>
              </div>
            ),
          });
          // TODO: Automatically send request again here.
          err.message = "Sandbox destroyed, needs re-run.";
          err.handled = true;
        }
        return Promise.reject(err);
      }
    );
  }

  public async getSessionId() {
    // We wait the bootstrap process to finish. And if bootstrap was not succeeded,
    // we bootstrap again.
    if (!(await this.tryBootstrap())) {
      throw new Error("Sandbox environment is not ready");
    }

    // Note: even we reach here, the session may be still invalid, for example,
    // a sessionId is expired while the page is still active.
    // This case is handled globally by registering axios interceptors.
    return this.sessionId!;
  }

  private async clearSession() {
    console.log("Clearing local stored session");
    this.sessionId = undefined;
    sessionStorage.removeItem("playground_session_id");
  }

  private async bootstrapExistingSession(sessionId: string): Promise<boolean> {
    // E.g. the browser tab is reloaded
    console.log("Resume last session, id = ", sessionId);
    try {
      await DefaultClient.API.sessionVerify(
        { sessionId },
        {
          iWantToHandleError: true,
          // Silently create a new session without notifying the user when existing session is down
          iWantToHandleSessionExpire: true,
        }
      );
      this.sessionId = sessionId;
      return true;
    } catch (err: any) {
      if (err?.response?.data?.statusCode === 401) {
        this.clearSession();
        console.log("Resume session failed, session is invalid", err);
        return await this.bootstrapNewSession();
      } else {
        // Maybe server side errors.
        throw err;
      }
    }
  }

  private async bootstrapNewSession(): Promise<boolean> {
    console.log("Creating new session");
    const resp = await DefaultClient.API.sessionCreate({
      iWantToHandleError: true,
    });
    this.sessionId = resp.data.sessionId;
    sessionStorage.setItem("playground_session_id", this.sessionId);
    console.log("New session initialized, id = ", this.sessionId);
    return true;
  }

  // Initialize a new session if there is no existing sessions.
  public async tryBootstrap(): Promise<boolean> {
    if (this.sessionId) {
      return true;
    }
    return this.singleflight("boostrap", async () => {
      const id = sessionStorage.getItem("playground_session_id");
      try {
        if (id) {
          return await this.bootstrapExistingSession(id);
        } else {
          return await this.bootstrapNewSession();
        }
      } catch (err: any) {
        console.log("Bootstrap session error", err);
        AlertAPI.error({
          title: "Playground Service Error",
          message: (
            <div className="prose-sm">
              <p>
                Cannot spawn a sandbox environment for you. Please try again
                later.
              </p>
              <p>Error: {err.message}</p>
            </div>
          ),
        });
        return false;
      }
    });
  }
}

export const DefaultSession = new SessionService();
