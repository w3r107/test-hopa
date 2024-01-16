// Reducer Imports
import restaurant from "./restaurant/restaurant.slice";
// import menu from "./menu/menu.slice";
import dashboard from "./dashboard/dashboard.slice";
import auth from "./auth/auth.slice";
import category from "./category/category.slice";
import parentCategory from "./parentCategory/parentCategory.slice";
import dish from "./dish/dish.slice";
import badge from "./badge/badge.slice";
import order from "./order/order.slice";
import library from "./library/library.slice";
import customer from "./customer/customer.slice";
import changes from "./changes/changes.slice";

const rootReducer = {
  restaurant,
  dashboard,
  auth,
  parentCategory,
  category,
  dish,
  badge,
  order,
  library,
  customer,
  changes
};

// Exporting Root Reducer
export default rootReducer;
