import { toClientGroup } from "~/server/models/groups.schema";
import { getGroupData } from "~/server/utils/groups";

export default defineEventHandler(async (event) => {
    const { group, member } = await getGroupData(event);

    return await toClientGroup(group, member.id);
});
