import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import {
  Card,
  Backdrop,
  CircularProgress,
  Tabs,
  Tab,
  Box,
  Typography,
} from "@mui/material";
import DashboardLayout from "/layouts/DashboardLayout";
import { Grid } from "@mui/material";
import { Header, MDBox } from "/components";
import { useMaterialUIController } from "/context";

import PeopleIcon from "@mui/icons-material/People";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import LanguageIcon from "@mui/icons-material/Language";
import CategoryIcon from "@mui/icons-material/Category";
import FoodBankIcon from "@mui/icons-material/FoodBank";
import LoyaltyIcon from "@mui/icons-material/Loyalty";

import ComplexStatisticsCard from "/examples/Cards/StatisticsCards/ComplexStatisticsCard";
import VerticalBarChart from "/examples/Charts/BarCharts/VerticalBarChart";
import GradientLineChart from "/examples/Charts/LineCharts/GradientLineChart";
import { MDTypography } from "components";
import { useDispatch } from "react-redux";
import { getRestaurantInfo } from "store/restaurant/restaurant.slice";
import DataTable from "./../examples/Tables/DataTable";

import {
  allTimeTotalVisitors,
  getDishesIds,
  getGraphData,
  getTapsPerDishes,
  getDishesAvgViewTime,
  getTotalBadgeCount,
  getTotalCategoryCount,
  getTotalDishCount,
  getTotalLanguages,
  getTotalVisitorsCount,
  useDashboard,
} from "store/dashboard/dashboard.slice";
import { getRestaurantId } from "utils/getRestuarantId";
import CustomLoader from "components/elements/CustomLoader";

function TabPanel(props) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}
const GraphLoader = () => {
  return (
    <Box sx={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      width: "100%",
      minHeight: "300px"
    }}>
      <CustomLoader />
    </Box>
  )
}

const Dashboard = () => {
  const dispatch = useDispatch();
  const { t: translate } = useTranslation();

  const [value, setValue] = useState(0);
  const [loading, setLoading] = useState(false);
  const [{ language }] = useMaterialUIController();

  const [graphLoading, setGraphLoading] = useState("");

  const {
    totalVisitors,
    totalCategories,
    totalDishes,
    totalBadges,
    totalLanguages,
    weekData,
    dayData,
    monthData,
    allTimeVisitors
  } = useDashboard();

  // const [stats, setStats] = useState({
  //   totalVisitors: 0,
  //   averageDishesOpenedPerWeek: 0,
  //   totalAllowedLanguages: 0,
  //   totalCategories: 0,
  //   totalDishes: 0,
  //   totalBadges: 0,
  // });

  const [perPage, setPerPage] = useState(10)
  const [totalDocs, setTotalDocs] = useState(0)
  const [allDishInfo, setAllDishInfo] = useState([]);
  const [dishesAnalytics, setDishesAnalytics] = useState([]);
  const [dishInfoLoaded, setDishInfoLoaded] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);



  useEffect(() => {
    dispatch(getRestaurantInfo());
  }, []);

  // get total visitors 
  useEffect(() => {
    if (totalVisitors === 0) {
      dispatch(getTotalVisitorsCount({ restaurantId: getRestaurantId() }));
    }
    if (totalLanguages === 0) {
      dispatch(getTotalLanguages({ restaurantId: getRestaurantId() }));
    }
    if (totalDishes === 0) {
      dispatch(getTotalDishCount({ restaurantId: getRestaurantId() }));
    }
    if (totalBadges === 0) {
      dispatch(getTotalBadgeCount({ restaurantId: getRestaurantId() }));
    }
    if (totalCategories === 0) {
      dispatch(getTotalCategoryCount({ restaurantId: getRestaurantId() }));
    }
    if (allTimeVisitors === 0) {
      dispatch(allTimeTotalVisitors({ restaurantId: getRestaurantId() }));
    }
  }, [dispatch]);

  // load month data 
  useEffect(() => {
    if (!monthData.loaded) {
      setGraphLoading("month")
      dispatch(
        getGraphData({ scale: "month", restaurantId: getRestaurantId() })
      ).unwrap()
        .finally(() => {
          setGraphLoading("")
        })
    }
  }, [monthData.loaded]);


  // graph type change month/day/year 
  const handleChange = (e, newValue) => {
    setValue(newValue);
    if (newValue === 1 && !weekData.loaded) {
      setGraphLoading("week")
      dispatch(
        getGraphData({ scale: "week", restaurantId: getRestaurantId() })
      )
        .unwrap()
        .finally(() => {
          setGraphLoading("")
        })
    } else if (newValue === 2 && !dayData.loaded) {
      setGraphLoading("day")
      dispatch(getGraphData({ scale: "day", restaurantId: getRestaurantId() }))
        .unwrap()
        .finally(() => {
          setGraphLoading("")
        })
    }
  };

  const ViewingTimeFormat = (value) => {
    const timeSpent = parseFloat(value);
    if (timeSpent == 0)
      return "-"
    if (timeSpent < 60)
      return value + ' ' + translate("DASHBOARD.SECONDS");
    else
      return (timeSpent / 60).toFixed(2) + ' ' + translate("DASHBOARD.MINUTES")
  }

  const customerTableData = {
    columns: [
      {
        Header: translate("DASHBOARD.DISH_NAME"),
        accessor: "name",
        Cell: ({ value }) => {
          return <>{`${value[language]}`}</>;
        },
      },
      {
        Header: translate("DASHBOARD.PARENT_CATEGORY") + ' / ' + translate("DASHBOARD.CATEGORY"),
        accessor: "parentCategory",
        Cell: ({ row }) => {
          const parentCategory = row.original.parentCategory?.name
            ? row.original.parentCategory.name[language]
            : "";
          const category = row.original.category?.name
            ? ' / ' + row.original.category.name[language]
            : "";

          return <>{`${parentCategory}${category}`}</>;
        },
      },
      {
        Header: translate("DASHBOARD.VIEWING_TIME"),
        accessor: "avgViewTime",
        Cell: ({ value }) => {
          return <>
            {`${value ? ViewingTimeFormat(value) : "-"}`}
          </>;
        },
      },
      {
        Header: translate("DASHBOARD.TAPS"),
        accessor: "count",
      },
    ],
    rows: dishesAnalytics
  };


  useEffect(() => {
    const getAllDishIds = async () => {
      try {
        const allDish = await dispatch(getDishesIds({
          restaurantId: getRestaurantId()
        }));

        const { dishes } = allDish?.payload?.data;
        setAllDishInfo(dishes)
        setDishInfoLoaded(true)
        setTotalDocs(dishes.length)
      } catch (error) {
        console.log(error);
        setDishInfoLoaded(true)
      }

    }

    getAllDishIds()
  }, [dispatch])

  useEffect(() => {
    const fetchDishAnalytics = async () => {
      // Check if data is already stored
      const storedData = sessionStorage.getItem('dishesAnalytics');
      if (storedData) {
        setDishesAnalytics(JSON.parse(storedData));
        return;
      }
      const pageDishIds = [];

      pageDishIds = allDishInfo.map((d) => d.id);

      // Fetch both taps per dish and average view times
      Promise.all([
        dispatch(getTapsPerDishes({
          restaurantId: getRestaurantId(),
          data: { dishIds: pageDishIds }
        })).unwrap(),
        dispatch(getDishesAvgViewTime({
          restaurantId: getRestaurantId(),
          data: { dishIds: pageDishIds }
        })).unwrap()
      ])
        .then(([tapsResponse, viewTimesResponse]) => {
          const { dishCounts } = tapsResponse.data;
          const { dishesViewTimeAvg } = viewTimesResponse.data;

          let enrichedDishInfo = [];
          pageDishIds.forEach(dishId => {
            const getDish = allDishInfo.find(d => d.id === dishId);
            enrichedDishInfo.push({
              ...getDish,
              count: dishCounts[dishId],
              avgViewTime: dishesViewTimeAvg[dishId]
            });
          });

          // Sorting in descending order based on avgViewTime
          enrichedDishInfo.sort((a, b) => b.avgViewTime - a.avgViewTime);
          //Saving analytics in local storage
          sessionStorage.setItem('dishesAnalytics', JSON.stringify(enrichedDishInfo));

          setDishesAnalytics(enrichedDishInfo);
        })

    };

    if (dishInfoLoaded) {
      fetchDishAnalytics();
    }
  }, [dishInfoLoaded, allDishInfo, perPage])


  return (
    <>
      <DashboardLayout>
        <Header />
        <Card
          id="basic-info"
          sx={{
            overflow: "visible",
          }}
          style={{ minHeight: "calc(100vh - 120px)" }}
        >
          <MDBox py={1}>
            <Backdrop
              sx={{
                color: "#fff",
                zIndex: (theme) => theme.zIndex.drawer + 1,
              }}
              open={loading}
            >
              <CircularProgress color="inherit" />
            </Backdrop>
            <Grid container spacing={3} p={1} pt={3}>
              <Grid item xs={12} md={6} lg={4}>
                <MDBox mb={1.5}>
                  <ComplexStatisticsCard
                    color="dark"
                    icon={<PeopleIcon />}
                    title={translate("DASHBOARD.TOTAL_VISITORS")}
                    count={totalVisitors}
                    isCustomIcon={true}
                  />
                </MDBox>
              </Grid>
              <Grid item xs={12} md={6} lg={4}>
                <MDBox mb={1.5}>
                  <ComplexStatisticsCard
                    color="primary"
                    icon={<OpenInNewIcon />}
                    title={translate("DASHBOARD.ALL_TIME_TOTAL_VISITORS")}
                    count={allTimeVisitors}
                    isCustomIcon={true}
                  />
                </MDBox>
              </Grid>
              <Grid item xs={12} md={6} lg={4}>
                <MDBox mb={1.5}>
                  <ComplexStatisticsCard
                    color="success"
                    icon={<LanguageIcon />}
                    title={translate("DASHBOARD.LANGUAGES_PRESENTED")}
                    count={totalLanguages}
                    isCustomIcon={true}
                  />
                </MDBox>
              </Grid>
            </Grid>
            <Grid container spacing={3} p={1}>
              <Grid item xs={12} md={6} lg={4}>
                <MDBox mb={1.5}>
                  <ComplexStatisticsCard
                    color="dark"
                    icon={<CategoryIcon />}
                    title={translate("DASHBOARD.TOTAL_CATEGORIES")}
                    count={totalCategories}
                    isCustomIcon={true}
                  />
                </MDBox>
              </Grid>
              <Grid item xs={12} md={6} lg={4}>
                <MDBox mb={1.5}>
                  <ComplexStatisticsCard
                    color="primary"
                    icon={<FoodBankIcon />}
                    title={translate("DASHBOARD.TOTAL_DISHES")}
                    count={totalDishes}
                    isCustomIcon={true}
                  />
                </MDBox>
              </Grid>
              <Grid item xs={12} md={6} lg={4}>
                <MDBox mb={1.5}>
                  <ComplexStatisticsCard
                    color="primary"
                    icon={<LoyaltyIcon />}
                    title={translate("DASHBOARD.TOTAL_BADGES")}
                    count={totalBadges}
                    isCustomIcon={true}
                  />
                </MDBox>
              </Grid>
            </Grid>
            <MDBox p={2}>
              <Tabs value={value} onChange={handleChange}>
                <Tab

                  label={translate("DASHBOARD.VISITORS_PER_MONTH")}
                  {...a11yProps(0)}
                />
                <Tab
                  label={translate("DASHBOARD.VISITORS_PER_WEEK")}
                  {...a11yProps(1)}
                />
                <Tab
                  label={translate("DASHBOARD.VISITORS_PER_DAY")}
                  {...a11yProps(2)}
                />
              </Tabs>
              <TabPanel value={value} index={0}>
                {
                  graphLoading === "month" ? (
                    <GraphLoader />
                  ) : (
                    <VerticalBarChart
                      icon={{ color: "info", component: "leaderboard" }}
                      title={translate("DASHBOARD.VISITORS_PER_MONTH")}
                      description={translate(
                        "DASHBOARD.VISITORS_PER_MONTH_DESCRIPTION"
                      )}
                      chart={{
                        labels: monthData?.labels,
                        datasets: [
                          {
                            label: translate("DASHBOARD.TOTAL_VISITORS"),
                            color: "dark",
                            data: monthData?.count,
                          },
                        ],
                      }}
                    />
                  )
                }
              </TabPanel>
              <TabPanel value={value} index={1}>
                {
                  graphLoading === "week" ? (
                    <GraphLoader />
                  ) : (
                    <GradientLineChart
                      icon={{ color: "info", component: "leaderboard" }}
                      title={translate("DASHBOARD.VISITORS_PER_WEEK")}
                      description={translate(
                        "DASHBOARD.VISITORS_PER_WEEK_DESCRIPTION"
                      )}
                      chart={{
                        labels: weekData?.labels,
                        datasets: [
                          {
                            label: translate("DASHBOARD.TOTAL_VISITORS"),
                            color: "dark",
                            data: weekData?.data,
                          },
                        ],
                      }}
                    />
                  )
                }
              </TabPanel>
              <TabPanel value={value} index={2}>
                {
                  graphLoading === "day" ? (
                    <GraphLoader />
                  ) : (
                    <GradientLineChart
                      icon={{ color: "info", component: "leaderboard" }}
                      title={translate("DASHBOARD.VISITORS_PER_DAY")}
                      description={translate(
                        "DASHBOARD.VISITORS_PER_DAY_DESCRIPTION"
                      )}
                      chart={{
                        labels: dayData?.labels,
                        datasets: [
                          {
                            label: translate("DASHBOARD.TOTAL_VISITORS"),
                            color: "dark",
                            data: dayData?.data,
                          },
                        ],
                      }}
                    />
                  )
                }
              </TabPanel>
            </MDBox>
          </MDBox>
          <MDBox py={3}>
            <MDBox p={3} lineHeight={1}>
              <MDTypography variant="h5" fontWeight="medium">
                {translate("DASHBOARD.DISHES_INFO")}
              </MDTypography>
              <MDTypography variant="button" color="text">
                {translate("DASHBOARD.DISHES_INFO_DESCRIPTION")}
              </MDTypography>
            </MDBox>
            <DataTable
              table={customerTableData}
            />
          </MDBox>
        </Card>
      </DashboardLayout>
    </>
  );
};

Dashboard.auth = true;

export default Dashboard;
