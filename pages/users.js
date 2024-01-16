import React, { useState } from 'react'

import DashboardLayout from 'layouts/DashboardLayout'
import { Header, Loader, MDBox, MDButton, MDTypography } from 'components'
import { Card, Icon } from '@mui/material'
import { useTranslation } from 'react-i18next'
import DataTable from 'examples/Tables/DataTable'
import AddUserModal from 'components/users/AddUserModal'
import { deleteRestaurantUser, getRestaurantUsers, useRestaurant } from 'store/restaurant/restaurant.slice'
import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { toast } from 'react-toastify'
import DeleteUserModal from 'components/users/deleteUserModal'

const users = () => {
    const { t: translate } = useTranslation();
    const dispatch = useDispatch();

    const { users, data } = useRestaurant();
    const [userModalState, setUserModalState] = useState(false);
    const [isDeleteModal, setIsDeleteModal] = useState(null);
    const [modalData, setModalData] = useState({});

    const [isLoading, setIsLoading] = useState({
        state: false,
        message: ""
    });

    useEffect(() => {
        if (!data?.id) return;
        dispatch(getRestaurantUsers({
            restaurantId: data?.id
        }))
    }, [dispatch, data?.id])

    const showLoader = (state, msg) => {
        setIsLoading({
            state,
            message: msg
        })
    }


    const deleteRUser = (uid) => {
        showLoader(true, "DELETING_RESTAURANT_USER")
        dispatch(deleteRestaurantUser({
            userId: uid,
            restaurantId: data?.id
        }))
            .unwrap()
            .then(() => {
                toast.success(translate("TOAST.RESTAURANT_USER_DELETED_SUCCESS"))
                setIsDeleteModal(null)
            })
            .catch(() => {
                toast.error(translate("TOAST.RESTAURANT_USER_DELETED_FAILED"))
            })
            .finally(() => {
                showLoader(false)
            })
    }

    const openUpdateModal = (userId) => {
        const getU = users.find((us) => us.userId === userId);
        if (!getU) return;
        setUserModalState("edit")
        setModalData(getU)
    }

    const customerTableData = {
        columns: [
            {
                Header: translate("USER.USER_NAME"),
                accessor: "name",
                Cell: ({ value }) => {
                    return <>{value}</>;
                },
            },
            {
                Header: translate("USER.USER_EMAIL"),
                accessor: "email",
                Cell: ({ value }) => {
                    return <>{value}</>;
                },
            },
            {
                Header: translate("USER.ACTIONS"),
                accessor: "userId",
                Cell: ({ row, value }) => {
                    return (
                        <MDBox
                            sx={{
                                display: "flex",
                                gap: "10px",
                                alignItems: "center"
                            }}
                        >
                            <MDButton
                                sx={{ my: 2 }}
                                variant="outline"
                                color="dark"
                                size="small"
                                onClick={() => openUpdateModal(value)}

                            >
                                <Icon>edit</Icon>&nbsp;
                                {translate("BUTTON.EDIT_USER")}
                            </MDButton>
                            <MDButton
                                sx={{ my: 2, color: "red" }}
                                variant="outline"
                                
                                size="small"
                                onClick={() => setIsDeleteModal(value)}
                            >
                                <Icon>delete</Icon>&nbsp;
                                {translate("BUTTON.DELETE_USER")}
                            </MDButton>
                        </MDBox>
                    );
                },
            },
        ],
        rows: users
    };

    return (
        <DashboardLayout>
            <Header />

            {isLoading.state && <Loader message={translate(isLoading?.message)} />}

            <AddUserModal
                showLoader={showLoader}
                modalState={userModalState}
                modalData={modalData}
                onClose={() => setUserModalState("")}
            />

            <DeleteUserModal
                isOpen={isDeleteModal !== null}
                handleClose={() => setIsDeleteModal(null)}
                onDeleleteDish={() => deleteRUser(isDeleteModal)}
            />

            <MDTypography sx={{ my: 1, ml: 1, mt: 2, fontSize: 17 }}>
                {translate("USER.USERS_ACTIONS")}
            </MDTypography>
            <Card
                sx={{
                    width: "100%",
                    my: 1,
                    py: 2,
                    px: 1,
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                    flexWrap: "wrap",
                }}
            >
                <MDBox
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        width: "100%",
                    }}
                >
                    <MDBox
                        sx={{
                            width: "100%",
                        }}
                    >

                        <MDButton
                            onClick={() => setUserModalState("add")}
                            variant="gradient"
                            color="light"
                            size="medium"
                            sx={{ m: 1, px: 1, textTransform: "none" }}
                        >
                            <Icon>add</Icon>&nbsp;
                            {translate("BUTTON.ADD_USER")}
                        </MDButton>




                    </MDBox>

                </MDBox>
            </Card>

            <DataTable
                table={customerTableData}
            />

        </DashboardLayout>
    )
}

users.auth = true

export default users