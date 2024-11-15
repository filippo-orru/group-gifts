import { MongoGroups, toClientGroup } from "~/server/models/groups.schema";
import { MongoUserGroups } from "~/server/models/userGroups.schema";
import { getToken } from "~/server/utils/auth";
import { getGroupData } from "~/server/utils/groups";

export default defineEventHandler(async (event) => {
    const { group, member } = await getGroupData(event);

    return toClientGroup(group._id, group, member.id);
});
