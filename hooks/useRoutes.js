// MUI Imports
import Icon from "@mui/material/Icon";

// Redux Imports
import { useRestaurant } from "store/restaurant/restaurant.slice";
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
// Constants
const CUSTOMER_PATH = "https://menu.hopa.tech/";
// const CUSTOMER_PATH = "https://demo-dot-hopa-menu-02-386323.uc.r.appspot.com/";
//const CUSTOMER_PATH = "https://www.hopamenu.com/";
// const CUSTOMER_PATH = "http://localhost:3001/";

const useRoutes = () => {
  const { data, role } = useRestaurant();
  const allR = [
    {
      type: "collapse",
      name: "NAV.DASHBOARD",
      key: "dashboard",
      route: "/dashboard",
      icon: <Icon fontSize="medium">dashboard</Icon>,
      noCollapse: true,
      permission: ["RESTAURANT_ADMIN"]
    },
    {
      type: "collapse",
      name: "NAV.MENU",
      key: "menu",
      route: "/menu",
      icon: <Icon fontSize="medium">restaurant_menu</Icon>,
      noCollapse: true,
      permission: ["RESTAURANT_ADMIN"]
    },
    // {
    //   type: "collapse",
    //   name: "NAV.LIBRARY",
    //   key: "library",
    //   route: "/library",
    //   icon: <Icon fontSize="medium">collections</Icon>,
    //   noCollapse: true,
    //   permission: ["RESTAURANT_ADMIN"]
    // },
    {
      type: "collapse",
      name: "NAV.BADGES",
      key: "badges",
      route: "/badges",
      icon: <Icon fontSize="medium">loyalty</Icon>,
      noCollapse: true,
      permission: ["RESTAURANT_ADMIN"]
    },
    {
      type: "collapse",
      name: "NAV.CHANGES",
      key: "changes",
      route: "/changes",
      icon: <Icon fontSize="medium">adjust</Icon>,
      noCollapse: true,
      permission: ["RESTAURANT_ADMIN"]
    },
    {
      type: "collapse",
      name: "NAV.SERVICE_CALL",
      key: "service_calls",
      route: "/service_calls",
      icon: <Icon fontSize="medium">notificationsactive</Icon>,
      noCollapse: true,
      permission: ["RESTAURANT_ADMIN", "RESTAURANT_USER"]
    },

    {
      type: "collapse",
      name: "NAV.HOPA_ORDER",
      key: "management",
      icon: <ShoppingBagIcon fontSize="medium"></ShoppingBagIcon>,
      permission: ["RESTAURANT_ADMIN"], // Permission for the main dropdown
      collapse: [
        {
          name: "NAV.ORDERS",
          key: "orders",
          route: "/orders",
          icon: <Icon fontSize="medium">shopping_cart</Icon>,
          permission: ["RESTAURANT_ADMIN", "RESTAURANT_USER"], 
        },
        {
          name: "NAV.ORDER_HISTORY",
          key: "order_history",
          route: "/order_history",
          icon: <Icon fontSize="medium">history</Icon>,
          permission: ["RESTAURANT_ADMIN", "RESTAURANT_USER"], 
        },
        {
          name: "NAV.CUSTOMERS",
          key: "customers",
          route: "/customers",
          icon: <Icon fontSize="medium">people</Icon>,
          permission: ["RESTAURANT_ADMIN"], 
        },
        {
          name: "NAV.HOPA_ORDER_SETTINGS",
          key: "hopa_order",
          route: "/hopa_order",
          icon: <Icon fontSize="medium">settings</Icon>,
          permission: ["RESTAURANT_ADMIN"], 
        },

        // ... other items to include in the dropdown ...
      ],
    },



    // {
    //   type: "collapse",
    //   name: "NAV.ORDERS",
    //   key: "orders",
    //   route: "/orders",
    //   icon: <Icon fontSize="medium">shopping_cart</Icon>,
    //   noCollapse: true,
    //   permission: ["RESTAURANT_ADMIN", "RESTAURANT_USER"]
    // },
    // {
    //   type: "collapse",
    //   name: "NAV.ORDER_HISTORY",
    //   key: "order_history",
    //   route: "/order_history",
    //   icon: <Icon fontSize="medium">history</Icon>,
    //   noCollapse: true,
    //   permission: ["RESTAURANT_ADMIN", "RESTAURANT_USER"]
    // },
    // {
    //   type: "collapse",
    //   name: "NAV.HOPA_ORDER",
    //   key: "hopa-order",
    //   route: "/hopa-order",
    //   icon: <Icon fontSize="medium">settings</Icon>,
    //   noCollapse: true,
    //   permission: ["RESTAURANT_ADMIN"]
    // },
    // {
    //   type: "collapse",
    //   name: "NAV.CUSTOMERS",
    //   key: "customers",
    //   route: "/customers",
    //   icon: <Icon fontSize="medium">people</Icon>,
    //   noCollapse: true,
    //   permission: ["RESTAURANT_ADMIN"]
    // },

    {
      type: "collapse",
      name: "NAV.SETTINGS",
      key: "settings_tab",
      icon: <Icon fontSize="medium">settings</Icon>,
      permission: ["RESTAURANT_ADMIN"], // Permission for the main dropdown
      collapse: [
        {
          name: "NAV.THEME",
          key: "theme",
          route: "/theme",
          icon: <Icon fontSize="medium">dark_mode</Icon>,
          permission: ["RESTAURANT_ADMIN"], 
        },
        {
          name: "NAV.LANGUAGE_SETTINGS",
          key: "languages",
          route: "/languages",
          icon: <Icon fontSize="medium">language</Icon>,
          permission: ["RESTAURANT_ADMIN"], 
        },
        {
          name: "NAV.USERS",
          key: "users",
          route: "/users",
          icon: <Icon fontSize="medium">person</Icon>,
          permission: ["RESTAURANT_ADMIN"], 
        },
        {
          name: "NAV.GENERAL_SETTINGS",
          key: "general_settings",
          route: "/settings",
          icon: <Icon fontSize="medium">settings</Icon>,
          permission: ["RESTAURANT_ADMIN"], 
        },
        // ... other items to include in the dropdown ...
      ],
    },


    // {
    //   type: "collapse",
    //   name: "NAV.THEME",
    //   key: "theme",
    //   route: "/theme",
    //   icon: <Icon fontSize="medium">dark_mode</Icon>,
    //   noCollapse: true,
    //   permission: ["RESTAURANT_ADMIN"]
    // },
    // {
    //   type: "collapse",
    //   name: "NAV.LANGUAGE_SETTINGS",
    //   key: "languages",
    //   route: "/languages",
    //   icon: <Icon fontSize="medium">language</Icon>,
    //   noCollapse: true,
    //   permission: ["RESTAURANT_ADMIN"]
    // },
    // {
    //   type: "collapse",
    //   name: "NAV.STATUSES",
    //   key: "statuses",
    //   route: "/statuses",
    //   icon: <Icon fontSize="medium">pentagon</Icon>,
    //   noCollapse: true,
    //   permission: ["RESTAURANT_ADMIN"]
    // },
    // {
    //   type: "collapse",
    //   name: "NAV.SETTINGS",
    //   key: "settings",
    //   route: "/settings",
    //   icon: <Icon fontSize="medium">settings</Icon>,
    //   noCollapse: true,
    //   permission: ["RESTAURANT_ADMIN"]
    // },
    // {
    //   type: "collapse",
    //   name: "NAV.USERS",
    //   key: "users",
    //   route: "/users",
    //   icon: <Icon fontSize="medium">person</Icon>,
    //   noCollapse: true,
    //   permission: ["RESTAURANT_ADMIN"]
    // },

    { type: "divider", key: "divider-2", permission: ["RESTAURANT_ADMIN"] },

    {
      type: "collapse",
      name: "NAV.LIVE_MENU",
      permission: ["RESTAURANT_ADMIN"],
      key: "live_preview",
      route:
        Object.keys(data).length === 0
          ? CUSTOMER_PATH
          : CUSTOMER_PATH + localStorage.getItem("restaurantId"),
      hasRedirect: true,
      icon: <Icon fontSize="medium">preview</Icon>,
      noCollapse: true,
    },
  ];
  const filteredRoutes = allR.map(item => {
    if (item.children) {
      // Filter children based on their permissions
      item.children = item.children.filter(child => child.permission.includes(role));
    }
    return item;
  }).filter(item => item.permission.includes(role));

  return filteredRoutes;
};

export default useRoutes;
