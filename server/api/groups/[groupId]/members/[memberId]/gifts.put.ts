import { getGroupData } from "~/server/utils/groups";
import type { PutGifts } from "~/utils/types";

export default defineEventHandler(async (event) => {
    const { group, member } = await getGroupData(event);

    const body: PutGifts = await readBody(event);
    body.gifts = body.gifts.filter((g) => g.id && g.name && g.date && g.buyerId && g.price);

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

    return toClientGroup(group._id, group, member.id);
})
