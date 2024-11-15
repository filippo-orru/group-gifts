import { getGroupData } from "~/server/utils/groups";
import type { MemberWishlistItem, PutMyWishlist } from "~/utils/types";

export default defineEventHandler(async (event) => {
    const { group, member } = await getGroupData(event);

    const body: PutMyWishlist = await readBody(event);
    const items = body.items.filter(i => i.name);

    member.wishlist = items.map(item => {
        const existingItem = member.wishlist.find(w => w.id === item.id);

        return {
            id: item.id,
            name: item.name,
            bought: existingItem ? existingItem.bought : false,
        };
    });

    await group.save();

    return toClientGroup(group._id, group, member.id);
})
