import { clerkClient } from "@clerk/nextjs";
import { createTRPCRouter, publicProcedure } from "../trpc";
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { filterUserForClient } from "~/server/helpers/filterUserForClient";

export const profileRouter = createTRPCRouter({
  getUserByUsername: publicProcedure
    .input(z.object({ username: z.string() }))
    .query(async ({ctx, input}) => {
      const [user] = await clerkClient.users.getUserList({
        username: [input.username]
      })

      if (!user) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "User not found."
        })
      }
      
      return filterUserForClient(user);
    }),
});
