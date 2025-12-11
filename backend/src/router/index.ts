import { t } from "../trpc/index.js";

export const appRouter = t.router({
  greeting: t.procedure.query(() => {
    return "Hello, world!";
  }),
});

export type AppRouter = typeof appRouter;
