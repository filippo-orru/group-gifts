import { readBody } from 'h3';
import type { DbGroup, DbGroupMember } from '~/server/models/groups.schema';
import type { DbUserInGroup } from '~/server/models/userGroups.schema';
import { generateId } from '~/utils/utils';
import type { CreateGroup } from '~/utils/types';



export default defineEventHandler(async (event) => {
  const token = getToken(event);

  const body: CreateGroup = await readBody(event);

  if (!body.name || !body.memberNames || !body.date || body.memberNames.length < 2 ||
    body.memberNames.some((name) => !name)) {
    // TODO use library like zod
    throw new Error("Invalid request");
  }

  const members = body.memberNames.map((name): DbGroupMember => ({
    id: generateId(),
    name,
    wishlist: [],
    gifts: [],
    budget: [],
    responsibleMemberId: ''
  }));
  members.forEach((member, index) => {
    member.responsibleMemberId = members[(index + 1) % members.length].id;
  });

  const group: DbGroup = {
    name: body.name,
    inviteId: generateId(),
    members: members,
    date: new Date(body.date),
    createdDate: new Date(),
    transactions: [],
  };

  const dbGroup = await MongoGroups.create(group);

  const userGroupAssociation: DbUserInGroup = {
    token: token,
    groupId: dbGroup._id,
    memberId: group.members[0].id,
  };

  await MongoUserGroups.create(userGroupAssociation);

  return toClientGroup(dbGroup, group.members[0].id);
})
