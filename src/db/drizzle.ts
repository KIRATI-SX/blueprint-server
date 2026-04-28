import connectionPool from "./supabase";
import { drizzle } from "drizzle-orm/node-postgres";

export const db = drizzle(connectionPool);