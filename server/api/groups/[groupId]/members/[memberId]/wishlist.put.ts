import { getGroupData } from "~/server/utils/groups";
import type { PutOtherWishlist } from "~/utils/types";

export default defineEventHandler(async (event) => {
    const { group, member } = await getGroupData(event);
    const targedMemberId = getRouterParams(event).memberId;
    if (member.id === targedMemberId) {
        throw new Error('You can not change your own wishlist');
    }

    const targetMember = group.members.find((m) => m.id === targedMemberId);

    if (!targetMember) {
        throw new Error('Member not found');
    }

    const body: PutOtherWishlist = await readBody(event);

    targetMember.wishlist.forEach((item) => {
        const newWishlistItem = body.find((i) => i.id === item.id);
        if (newWishlistItem) {
            item.bought = newWishlistItem.bought;
            console.log('item.bought', item.bought);
        } else {
            console.log('item not bought', item.bought);
        }
    });

    await group.save();

    return toClientGroup(group, member.id);
})
