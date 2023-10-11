import { createTRPCRouter, publicProcedure } from "../trpc";
import { z } from "zod";

export const postsRouter = createTRPCRouter({
  getAll: publicProcedure.query(({ctx}) => {
    return ctx.db.post.findMany();
  })
})