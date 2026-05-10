import { drizzle } from 'drizzle-orm/node-postgres';
import {env} from "../app/common/config/envValidate.js"



export const db = drizzle(env.DATABASE_URL!);