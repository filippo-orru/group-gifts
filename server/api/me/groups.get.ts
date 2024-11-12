import type { GroupInfo } from "~/utils/common-types"

const giftNames = [
  'Scooter', 'Laptop', 'Smartphone', 'Book', 'Headphones', 'Socks', 'T-shirt', 'Shoes', 'Sweater', 'Hat'
]

function getRandomDate() {
  if (Math.random() > 0.5) {
    // yesterday
    return new Date(Date.now() - 24 * 60 * 60 * 1000);
  } else {
    const start = new Date(2024, 10, 1);
    const end = new Date(2024, 11, 25);
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
  }
}

export default defineEventHandler(async (event) => {
  const groups: GroupInfo[] = Array.from({ length: 10 }, (_, i) => (
    {
      id: i.toString(),
      name: `Christmas 202${i}`,
      description: 'Group Description',
      members: ['Martina', 'Lupi', 'Filippo', 'Miriam', 'Luigi'].map((name, i) => {
        return {
          id: i.toString(),
          name: name,
          myBudget: Math.random() > 0.3 ? Math.floor(Math.random() * 100) : null,
          totalBudget: Math.floor(Math.random() * 10) * 5 + 50,
          wishlist: Array.from({ length: 5 }, (_, i) => (
            {
              id: i.toString(),
              name: giftNames[Math.floor(Math.random() * giftNames.length)],
              bought: Math.random() > 0.7
            }
          )),
          gifts: Array.from({ length: 5 }, (_, i) => (
            {
              id: i.toString(),
              name: giftNames[Math.floor(Math.random() * giftNames.length)],
              date: getRandomDate().toISOString(),
              buyerId: Math.random() > 0.5 ? '1' : '2',
              price: Math.floor(Math.random() * 10) * 5 + 5
            }
          )),
          chat: {
            messages: Array.from({ length: 5 }, (_, i) => (
              {
                id: i.toString(),
                authorId: Math.random() > 0.5 ? '1' : '2',
                content: 'Hello, World!',
                date: getRandomDate().toISOString()
              }
            ))
          }
        };
      }),
      myWishlist: ['item-1', 'cool thing', 'very cool'],
      newMessages: Math.random() > 0.75 ? Math.floor(Math.random() * 10) : 0
    }
  ));

  return groups
});
