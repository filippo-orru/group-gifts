import type { PutTransaction } from "~/utils/types";

export default defineEventHandler(async (event) => {
  const { group, member } = await getGroupData(event);

  const body: PutTransaction = await readBody(event);

  const transactionId = getRouterParams(event).transactionId;

  const transaction = group.transactions.find((t) => t.id === transactionId);
  if (transaction) {
    transaction.completed = body.completed;
  } else {
    group.transactions.push({
      id: transactionId,
      completed: true,
    });
  }

  await group.save();
})
