import { setTokenIfNeeded } from "../utils/auth";

export default defineEventHandler(async (event) => {
  setTokenIfNeeded(event);
})
