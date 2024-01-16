const searchDishes = (searchText, language, category) => {
  const dishes = category.dishes;
  const matchingDishes = [];
  for (const dish of dishes) {
    const dishName = dish.dish[language];
    const dishDescription = dish.dishDescription[language];
    if (
      dishName.toLowerCase().includes(searchText.toLowerCase()) ||
      dishDescription.toLowerCase().includes(searchText.toLowerCase())
    ) {
      matchingDishes.push(dish);
    }
  }
  return matchingDishes;
};

export const filterSeach = (searchText, categories, language) => {
  const filteredCategories = [];
  for (let i = 0; i < categories.length; i++) {
    const category = { ...categories[i] };
    const dishes = searchDishes(searchText, language, category);
    const updatedCategories = { ...category, dishes };
    if (updatedCategories.dishes.length > 0) {
      filteredCategories.push(updatedCategories);
    }
  }
  return filteredCategories;
};

export const filterSearch = (
  categories,
  searchText,
  dishFilter,
  badgeFilter,
  language
) => {
  let updatedCategories = categories;
  if (searchText) {
    updatedCategories = filterSeach(searchText, categories, language);
  }
  if (dishFilter === "Visible-Items") {
    updatedCategories = updatedCategories.map((item) => ({
      ...item,
      dishes: item?.dishes.filter((dish) => dish?.isVisible),
    }));
  }
  if (dishFilter === "Cart-Ability") {
    updatedCategories = updatedCategories.map((item) => ({
      ...item,
      dishes: item?.dishes.filter((dish) => dish?.isShowCartOption),
    }));
  }
  if (dishFilter === "Have-Badge") {
    updatedCategories = updatedCategories.map((item) => ({
      ...item,
      dishes: item?.dishes.filter(
        (dish) => item?.badges && item?.badges?.length > 0
      ),
    }));
  }
  if (badgeFilter !== "All") {
    updatedCategories = updatedCategories.map((item) => ({
      ...item,
      dishes: item?.dishes.filter((dish) =>
        dish?.badges?.find((item)=>item.id===badgeFilter)
      ),
    }));
  }
  return updatedCategories;
};
