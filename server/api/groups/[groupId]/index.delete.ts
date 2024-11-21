import { getGroupData } from "~/server/utils/groups";
import type { Query } from "mongoose";

export default defineEventHandler(async (event) => {
    const { group } = await getGroupData(event);

    await MongoMessages.deleteMany({ groupId: group._id }).exec();

    await MongoUserGroups.deleteMany({ groupId: group._id }).exec();

    (group.deleteOne() as Query<any, any>).exec();
});