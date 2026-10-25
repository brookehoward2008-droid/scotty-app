import { createTRPCReact } from "@trpc/react-query";
import { httpBatchLink } from "@trpc/client";
import superjson from "superjson";
import type { AppRouter } from "@/server/routers";
import { getApiBaseUrl } from "@/constants/oauth";
import * as Auth from "@/lib/_core/auth";
import { observable } from "@trpc/server/observable";
import { TRPCClientError, type TRPCLink } from "@trpc/client";
import { DEMO_MODE, browserDemoOperation } from "./scotty-demo";

const demoLink: TRPCLink<AppRouter> =
  () =>
  ({ op, next }) => {
    if (!op.path.startsWith("scotty.")) return next(op);
    return observable((observer) => {
      let disposed = false;
      browserDemoOperation(op.path.slice("scotty.".length), op.input)
        .then((data) => {
          if (!disposed) {
            observer.next({ result: { data } });
            observer.complete();
          }
        })
        .catch((error) => {
          if (!disposed) observer.error(TRPCClientError.from(error));
        });
      return () => {
        disposed = true;
      };
    });
  };

/**
 * tRPC React client for type-safe API calls.
 *
 * IMPORTANT (tRPC v11): The `transformer` must be inside `httpBatchLink`,
 * NOT at the root createClient level. This ensures client and server
 * use the same serialization format (superjson).
 */
export const trpc = createTRPCReact<AppRouter>();

/**
 * Creates the tRPC client with proper configuration.
 * Call this once in your app's root layout.
 */
export function createTRPCClient() {
  return trpc.createClient({
    links: [
      ...(DEMO_MODE ? [demoLink] : []),
      httpBatchLink({
        url: `${getApiBaseUrl()}/api/trpc`,
        // tRPC v11: transformer MUST be inside httpBatchLink, not at root
        transformer: superjson,
        async headers() {
          const token = await Auth.getSessionToken();
          return token ? { Authorization: `Bearer ${token}` } : {};
        },
        // Custom fetch to include credentials for cookie-based auth
        fetch(url, options) {
          return fetch(url, {
            ...options,
            credentials: "include",
          });
        },
      }),
    ],
  });
}
