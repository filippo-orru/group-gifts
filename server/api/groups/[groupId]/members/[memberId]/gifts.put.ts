import { getGroupData } from "~/server/utils/groups";
import type { PutGifts } from "~/utils/types";

export default defineEventHandler(async (event) => {
    const { group, member } = await getGroupData(event);

    const body: PutGifts = await readBody(event);
    body.gifts = body.gifts.filter((g) => g.id && g.name && g.date && g.buyerId);

    const targetMemberId = getRouterParams(event).memberId;
    const targetMember = group.members.find((m) => m.id === targetMemberId)
    if (!targetMember) {
        throw new Error("Member not found in group");
    }
    targetMember.gifts = body.gifts.map((g) => ({
        id: g.id,
        name: g.name,
        date: new Date(g.date),
        buyerId: g.buyerId,
        price: g.price,
    }));

    await group.save();

    // Notify others that gifts were updated
    const usersInGroup = (await MongoUserGroups.find({ groupId: group.id }).exec())
        .filter((u) => u.memberId !== member.id && u.memberId !== targetMemberId);
    const messagingTokens = await MongoMessagingTokens.find({ _id: { $in: usersInGroup.map((u) => u.token) } }).exec();

    await sendNotification(
        messagingTokens.map((t) => t.messagingToken),
        {
            title: "Gifts updated",
            body: `${member.name} updated gifts for ${targetMember.name}`
        },
    );

    return toClientGroup(group, member.id);
})
