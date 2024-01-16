import { firestore } from "Api/firebaseConfiguration";
import { doc, getDoc } from "firebase/firestore";

export const updateBadgesDetailInMenu = async (data) => {
  const uid = localStorage.getItem("uid");
  const docRef = doc(firestore, "RestaurantMenu", uid);
  const snapshot = await getDoc(docRef);
  const restaurant = snapshot.data();
  for (let i = 0; i < restaurant.categories.length; i++) {
    const singleCategory = restaurant.categories[i];
    for (let j = 0; j < singleCategory.dishes.length; j++) {
      const singleDish = singleCategory.dishes[j];
      if (singleDish.badges) {
        for (let k = 0; k < singleDish.badges.length; k++) {
          const singleBadge = singleDish.badges[k];
          if (singleBadge.id === data.id) {
            restaurant.categories[i].dishes[j].badges[k] = data;
          }
        }
      }
    }
  }
  return restaurant
};