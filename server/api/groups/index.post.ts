import { readBody } from 'h3';
import type { DbGroup } from '~/server/models/groups.schema';
import type { UserInGroup } from '~/server/models/userGroups.schema';
import { generateId } from '~/server/utils/utils';
import type { CreateGroup } from '~/utils/types';



export default defineEventHandler(async (event) => {
  const token = getToken(event);

  const body: CreateGroup = await readBody(event);

  if (!body.name || !body.memberNames || !body.date || body.memberNames.length < 2 ||
    body.memberNames.some((name) => !name)) {
    // TODO use library like zod
    throw new Error("Invalid request");
  }

  const group: DbGroup = {
    name: body.name,
    members: body.memberNames.map((name) => {
      return ({
        id: generateId(),
        name,
        wishlist: [],
        gifts: [],
        budget: []
      });
    }),
    date: new Date(body.date),
  };

  const dbGroup = await MongoGroups.create(group);

  const userGroupAssociation: UserInGroup = {
    token: token,
    groupId: dbGroup._id,
    memberId: group.members[0].id,
  };

  await MongoUserGroups.create(userGroupAssociation);

  return toClientGroup(dbGroup._id, dbGroup, group.members[0].id);
})
