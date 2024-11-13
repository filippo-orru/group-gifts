import type { GroupInfo } from "~/utils/common-types"

const names = [
  'Martina', 'Lupi', 'Filippo', 'Miriam', 'Luigi', 'Giulia', 'Nici', 'Harald', 'Anne', 'Jan',
  'Peter', 'Paul', 'Mary', 'John', 'Alice', 'Bob', 'Eve', 'Charlie', 'David', 'Frank',
]

const giftNames = [
  'Scooter', 'Laptop', 'Smartphone', 'Book', 'Headphones', 'Socks', 'T-shirt', 'Shoes', 'Sweater', 'Hat'
]

const randomPickDistinct = (list: string[], n: number): string[] => {
  const result: string[] = [];
  const all = [...list];
  for (let i = 0; i < n; i++) {
    const index = Math.floor(Math.random() * all.length);
    result.push(all[index]);
    all.splice(index, 1);
  }
  return result;
}

const chatMessages = [
  'What do you think about this?', 'I like it!', 'I don\'t like it', 'I\'m not sure',
  'Well, now we have to decide', 'I think we should buy it', 'I think we should not buy it', 'I agree', 'I disagree',
  'This is a long message that should be wrapped because it is too long to fit in one line',
]

function getRandomDate() {
  if (Math.random() > 0.5) {
    // yesterday
    return new Date(Date.now() - 24 * (Math.floor(Math.random() * 100) * 3 * 1000));
  } else {
    const start = new Date(2024, 9, 1);
    const end = new Date(2024, 10, 10);
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
  }
}

export default defineEventHandler(async (event) => {
  const myId = '1';

  const groups: GroupInfo[] = Array.from({ length: 10 }, (_, i) => {
    const memberNames = randomPickDistinct(names, Math.floor(Math.random() * 5) + 2);
    const members = memberNames.map((name, i) => {
      return {
        id: i.toString(),
        name: name,
        myBudget: Math.random() > 0.4 ? Math.floor(Math.random() * 100) : null,
        totalBudget: Math.floor(Math.random() * 10) * 5 + 50,
        wishlist: randomPickDistinct(giftNames, 5).map((gift, i) => (
          {
            id: i.toString(),
            name: gift,
            bought: Math.random() > 0.7
          }
        )),
        gifts: randomPickDistinct(giftNames, 3).map((gift, i) => (
          {
            id: i.toString(),
            name: giftNames[Math.floor(Math.random() * giftNames.length)],
            date: getRandomDate().getTime(),
            buyerId: Math.floor(Math.random() * memberNames.length).toString(),
            price: Math.floor(Math.random() * 10) * 5 + 5
          }
        )),
        chat: {
          messages: Math.random() < 0.3 ? [] : Array.from({ length: 25 }, (_, i) => {
            const date = getRandomDate().getTime();
            return {
              id: i.toString(),
              authorId: Math.floor(Math.random() * memberNames.length).toString(),
              content: chatMessages[Math.floor(Math.random() * chatMessages.length)],
              date: date,
              isRead: date < Date.now() - 24 * 60 * 60 * 1000,
            };
          })
        }
      };
    });
    return {
      id: i.toString(),
      name: `Christmas 202${i}`,
      description: 'Group Description',
      members,
      myWishlist: randomPickDistinct(giftNames, 5),
      newMessages: members.reduce((acc, member) => acc + member.chat.messages.filter(m => !m.isRead).length, 0)
    }
  });

  return groups;
});
