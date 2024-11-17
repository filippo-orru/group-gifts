import { getGroupData } from "~/server/utils/groups";
import type { Query } from "mongoose";

export default defineEventHandler(async (event) => {
    const { group } = await getGroupData(event);
    // TODO only owner can delete group

    await MongoMessages.deleteMany({ groupId: group._id }).exec();
    // TODO test if messages are deleted

    await MongoUserGroups.deleteMany({ groupId: group._id }).exec();

    (group.deleteOne() as Query<any, any>).exec();
});