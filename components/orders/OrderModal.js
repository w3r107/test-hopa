import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Dialog, DialogTitle, DialogContent, IconButton, Typography } from "@mui/material";
import { Close as CloseIcon } from "@mui/icons-material";
import { styled } from "@mui/material/styles";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Divider from "@mui/material/Divider";
import { MDBox, MDTypography, MDAvatar, MDButton } from "/components";
import { useRestaurant } from "store/restaurant/restaurant.slice";
import moment from "moment";
import { useMaterialUIController } from "context";
import { StatusDropdown } from "/components/orders";
import { useDispatch } from "react-redux";
import { getRestaurantId } from "utils/getRestuarantId";
import { updateOrderStatus } from "store/order/order.action";

const statusOptions = [
	{ value: "processing", color: "#ff8c00", typ: "open" },
	{ value: "ready", color: "#b3c100", typ: "open" },
	{ value: "delivered", color: "#0e6ba8", typ: "open" },
];


const Status = ({ color, text }) => {
	return (
		<div style={{ width: "100%" }}>
			<div
				style={{
					padding: "2px 10px",
					backgroundColor: color,
					fontWeight: "bold",
					color: "white",
					borderRadius: "20px",
					fontSize: "12px",
				}}
			>
				{text}
			</div>
		</div>
	);
};

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
	"& .MuiDialogContent-root": {
		padding: theme.spacing(2),
	},
	"& .MuiDialogActions-root": {
		padding: theme.spacing(1),
	},
}));

const BootstrapDialogTitle = (props) => {
	const { children, onClose, ...other } = props;
	return (
		<DialogTitle sx={{ m: 0, p: 2 }} {...other}>
			{children}
			{onClose ? (
				<IconButton
					aria-label="close"
					onClick={onClose}
					sx={{
						position: "absolute",
						right: 8,
						top: 8,
						color: (theme) => theme.palette.grey[500],
					}}
				>
					<CloseIcon />
				</IconButton>
			) : null}
		</DialogTitle>
	);
};

const OrderModal = ({ open, onClose, type, showSnackbar, setLoaderMessage }) => {
	const { t: translate } = useTranslation();
	const { data: restaurantData } = useRestaurant();
	const [{ language }] = useMaterialUIController();
	const dispatch = useDispatch();

	const [currentStatus, setCurrentStatus] = useState({});

	const [status, setStatus] = useState({});
	const [allStatus, setAllStatus] = useState([]);

	useEffect(() => {
		if (restaurantData?.statuses && restaurantData?.statuses?.constructor === Array) {
			setAllStatus([...statusOptions, ...restaurantData?.statuses])
		}
	}, [open?.status, restaurantData?.statuses])

	useEffect(() => {
		if (open?.status) {
			const findStatus = allStatus.find((st) => String(st.value).toLowerCase() === String(open?.status).toLowerCase());
			setStatus(findStatus);
			setCurrentStatus(findStatus)
		}
	}, [open?.status, allStatus.length]);

	const getStatuColor = (statusVal) => {
		return allStatus.find(st => st.value === statusVal)?.color || "#FF0000";
	}

	const updateStatus = () => {
		setLoaderMessage("LOADING.UPDATING_ORDER_STATUS")
		dispatch(updateOrderStatus({
			restaurantId: getRestaurantId(),
			data: {
				orderId: open?.id,
				status: String(status.value).toLowerCase(),
				userId: open?.userId
			}
		}))
			.unwrap()
			.then(() => {
				setCurrentStatus(status)
				showSnackbar(true, translate("TOAST.ORDER_STATUS_UPDATE_SUCCESS"))
			})
			.catch(() => {
				showSnackbar(false, translate("TOAST.ORDER_STATUS_UPDATE_FAILURE"))
			})
			.finally(() => {
				onClose()
				setLoaderMessage("")
			})
	}

	const calculateOneItemCost = (dish) => {
		let total = dish?.price;
		for (let i = 0; i < dish.changes.length; i++) {
			const c = dish.changes[i];
			for (let j = 0; j < c.options.length; j++) {
				const o = c.options[j];
				total += o.price;
			}
		}
		let unitTotal = total;
		total *= dish?.quantity || 1;
		return { total, unitTotal, quantity: dish.quantity };
	}


	return (
		<>
			<BootstrapDialog
				open={open}
				onClose={onClose}
				aria-labelledby="modal-modal-title"
				aria-describedby="modal-modal-description"
				fullWidth
				maxWidth={"sm"}
			>
				<BootstrapDialogTitle id="customized-dialog-title" onClose={onClose}>
					{translate("ORDERS.ORDER_DETAILS")}
				</BootstrapDialogTitle>
				<DialogContent dividers>
					<MDBox>
						<Grid container spacing={2} justifyContent="center">
							{/* //spacing={2} */}
							<Grid item xs={12} lg={12} >
								<MDBox
									style={{
										display: "flex",
										justifyContent: "space-between",
										alignItems: "center",
									}}
								>
									<MDTypography
										variant="button"
										fontWeight="regular"
										color="text"
										style={{
											fontSize: "13px",
										}}
									>
										{`${open?.id}`}
									</MDTypography>
									<MDTypography
										variant="button"
										fontWeight="bold"
										color="text"
										style={{
											fontSize: "13px",
										}}
									>
										{`${moment(open?.date).fromNow()}`}
									</MDTypography>
								</MDBox>
								<Divider />
								<Card>
									<MDBox>
										<MDBox mx={2}>
											<MDTypography variant="h6" fontWeight="medium">
												{translate("ORDERS.ORDER_ITEMS")}
											</MDTypography>
										</MDBox>
										{open?.items.map((item, index) => {

											const { total, unitTotal, quantity } = calculateOneItemCost(item);

											return (
												<MDBox key={index} my={1} sx={{ width: "100%" }}>
													<div className="groupGrid1x3">
														<MDBox>
															<MDAvatar
																src={
																	item?.image || restaurantData?.placeholder
																}
																size={"lg"}
																sx={{
																	"& .MuiAvatar-img": {
																		height: "100%",
																	},
																	ml: 2,
																}}
															/>
														</MDBox>
														<MDBox className={"orderDishFlexCol"}>
															<MDBox sx={{
																display: "flex",
																justifyContent: "space-between",
																width: "100%"
															}}>
																<MDBox
																	ml={1}
																	my={1}
																	style={{
																		display: "flex",
																		flexDirection: "column",
																	}}
																>
																	<MDTypography
																		variant="button"
																		fontWeight="bold"
																		color="text"
																		style={{
																			fontSize: "15px",
																			whiteSpace: "nowrap",
																			textTransform: "capitalize",
																			fontWeight: "600"
																		}}
																	>
																		{item?.name && item?.name[language]}
																		{/* {item?.quantity} */}
																	</MDTypography>
																	{/* <MDTypography
																		variant="button"
																		fontWeight="regular"
																		color="text"
																		style={{
																			fontSize: "11px",
																		}}
																	>
																		{`${open.currency} ${item?.price}`}
																	</MDTypography> */}
																</MDBox>
																<MDTypography
																	variant="button"
																	fontWeight="regular"
																	color="text"
																	style={{
																		margin: "8px",
																		fontSize: "12px",
																	}}
																>
																	{`${open.currency} ${item?.price}`}
																</MDTypography>
															</MDBox>
															<MDBox sx={{ p: 1, display: "flex", flexDirection: "column", rowGap: "10px" }}>
																{
																	item.changes &&
																	item.changes.map((c) => {

																		return (
																			<MDBox key={c.id}>
																				<Typography sx={{
																					fontSize: "13px",
																					fontWeight: "500"
																				}}>
																					{c?.title && c?.title[language]}
																				</Typography>
																				{
																					c?.options &&
																					c?.options.map((o) => {
																						return (
																							<MDBox
																								key={o?.id}
																								sx={{
																									display: "flex",
																									flexDirection: "row",
																									alignItems: "center",
																									justifyContent: "space-between"
																								}}>
																								<Typography sx={{ fontSize: "12px" }}>
																									{o?.content && o?.content[language]}
																								</Typography>
																								<Typography sx={{ fontSize: "12px" }}>
																									{restaurantData.currency} {o?.price || 0}
																								</Typography>
																							</MDBox>
																						)
																					})
																				}

																			</MDBox>
																		)
																	})
																}
															</MDBox>
															<MDBox sx={{
																px: 1
															}}>
																<MDBox sx={{
																	display: "flex",
																	flexDirection: "row",
																	alignItems: "center",
																	justifyContent: "space-between",
																	borderTop: "1px solid #7775",
																	pt: "6px"
																}}>
																	<Typography sx={{
																		fontSize: "12px",
																		fontWeight: 500
																	}}>
																		Item Total
																	</Typography>
																	<Typography sx={{
																		fontSize: "12px"
																	}}>
																		{restaurantData?.currency} {unitTotal}
																	</Typography>
																</MDBox>
																<MDBox sx={{
																	display: "flex",
																	flexDirection: "row",
																	alignItems: "center",
																	justifyContent: "space-between",
																	py: "6px"
																}}>
																	<Typography sx={{
																		fontSize: "12px",
																		fontWeight: 500
																	}}>
																		Quantity
																	</Typography>
																	<Typography sx={{
																		fontSize: "12px"
																	}}>
																		{item?.quantity}
																	</Typography>
																</MDBox>
																<MDBox sx={{
																	display: "flex",
																	flexDirection: "row",
																	alignItems: "center",
																	justifyContent: "space-between",
																	borderTop: "1px solid #7775",
																	borderBottom: "1px solid #7775",
																	py: "6px"
																}}>
																	<Typography sx={{
																		fontSize: "13px",
																		fontWeight: "bold"
																	}}>
																		Total
																	</Typography>
																	<Typography sx={{
																		fontSize: "13px"
																	}}>
																		{restaurantData?.currency} {total}
																	</Typography>
																</MDBox>
															</MDBox>
														</MDBox>

														{/* <Grid
															item
															xs={6}
															md={6}
															style={{
																display: "flex",
															}}
														>

															<MDBox
																ml={1}
																my={1}
																style={{
																	display: "flex",
																	flexDirection: "column",
																}}
															>
																<MDTypography
																	variant="button"
																	fontWeight="bold"
																	color="text"
																	style={{
																		fontSize: "14px",
																		whiteSpace: "nowrap",
																	}}
																>
																	{`${item?.name[language]} (${item?.quantity})`}
																</MDTypography>
																<MDTypography
																	variant="button"
																	fontWeight="regular"
																	color="text"
																	style={{
																		fontSize: "11px",
																	}}
																>
																	{`${open.currency} ${item?.price}`}
																</MDTypography>

																<MDBox sx={{ py: 1, display: "flex", flexDirection: "column", rowGap: "10px" }}>
																	{
																		item.changes &&
																		item.changes.map((c) => {
																			return (
																				<MDBox>
																					<Typography sx={{
																						fontSize: "12px",
																						fontWeight: "500"
																					}}>
																						{c?.title && c?.title[language]}
																					</Typography>
																					{
																						c?.options &&
																						c?.options.map((o) => {
																							return (
																								<MDBox sx={{
																									display: "flex",
																									flexDirection: "row",
																									alignItems: "center",
																									justifyContent: "space-between"
																								}}>
																									<Typography sx={{ fontSize: "11px" }}>
																										{o?.content && o?.content[language]}
																									</Typography>
																									<Typography sx={{ fontSize: "11px" }}>
																										{restaurantData.currency} {o?.price || 0}

																									</Typography>
																								</MDBox>
																							)
																						})
																					}
																				</MDBox>
																			)
																		})
																	}
																</MDBox>


															</MDBox>
														</Grid>
														<Grid
															item
															xs={6}
															md={6}
															style={{
																display: "flex",
																width: "100%",
																justifyContent: "flex-end",
																alignItems: "center",
															}}
														>
															<MDTypography
																variant="button"
																fontWeight="bold"
																color="text"
																style={{
																	fontSize: "15px",
																	margin: "1rem",
																}}
															>
																{`${open?.currency} ${item?.price * item?.quantity}`}
															</MDTypography>
														</Grid> */}
													</div>


												</MDBox>
											);
										})}
									</MDBox>
								</Card>
								<Card style={{ marginTop: "1rem" }}>
									<MDBox p={2}>
										<MDBox
											style={{
												display: "flex",
												justifyContent: "space-between",
											}}
										>
											<MDTypography variant="h6" fontWeight="medium">
												{translate("ORDERS.ORDER_SUMMARY")}
											</MDTypography>
											<MDBox>
												<Status color={getStatuColor(currentStatus?.value)} text={currentStatus?.value} />
											</MDBox>
										</MDBox>
										<MDBox>
											<MDTypography variant="caption" color="text">
												{translate("ORDERS.AMOUNT")}:&nbsp;&nbsp;&nbsp;
												<MDTypography variant="caption" fontWeight="medium">
													{`${open?.items && open?.currency} ${open?.total
														}`}
												</MDTypography>
											</MDTypography>
										</MDBox>
										<MDBox>
											<MDTypography variant="caption" color="text">
												{translate("ORDERS.PAYEMNT_ID")}:&nbsp;&nbsp;&nbsp;
												<MDTypography variant="caption" fontWeight="medium">
													{open?.paymentId}
												</MDTypography>
											</MDTypography>
										</MDBox>
										<MDBox>
											<MDTypography variant="caption" color="text">
												{translate("ORDERS.TIMESTAMP")}:&nbsp;&nbsp;&nbsp;
												<MDTypography variant="caption" fontWeight="medium">
													{moment(open?.date).format(
														"DD-MM-YYYY, HH:mm"
													)}
												</MDTypography>
											</MDTypography>
										</MDBox>
										<MDBox>
											<MDTypography variant="caption" color="text">
												{translate("ORDERS.ORDER_TABLE")}:&nbsp;&nbsp;&nbsp;
												<MDTypography variant="caption" fontWeight="medium">
													{open?.table}
												</MDTypography>
											</MDTypography>
										</MDBox>
									</MDBox>
								</Card>
								<MDBox my={2}>
									<Card>
										<MDBox p={2}>
											<MDBox>
												<MDTypography variant="h6" fontWeight="medium">
													{translate("ORDERS.CUSTOMER_DETAILS")}
												</MDTypography>
											</MDBox>
											<MDBox>
												<MDTypography variant="caption" color="text">
													{translate("ORDERS.NAME")}:&nbsp;&nbsp;&nbsp;
													<MDTypography variant="caption" fontWeight="medium">
														{open?.user?.name}
													</MDTypography>
												</MDTypography>
											</MDBox>
											<MDBox>
												<MDTypography variant="caption" color="text">
													{translate("ORDERS.EMAIL")}:&nbsp;&nbsp;&nbsp;
													<MDTypography variant="caption" fontWeight="medium">
														{open?.user?.email}
													</MDTypography>
												</MDTypography>
											</MDBox>
											<MDBox>
												<MDTypography variant="caption" color="text">
													{translate("ORDERS.PHONE_NUMBER")}:&nbsp;&nbsp;&nbsp;
													<MDTypography variant="caption" fontWeight="medium">
														{open?.user?.phone}
													</MDTypography>
												</MDTypography>
											</MDBox>
										</MDBox>
									</Card>
								</MDBox>
								<Card style={{ marginTop: "1rem" }}>
									<MDBox p={2}>
										<MDBox>
											<MDTypography
												variant="button"
												fontWeight="bold"
												color="text"
											>
												{translate("ORDERS.NOTES")}
											</MDTypography>
										</MDBox>
										<MDBox>
											<MDTypography
												variant="button"
												fontWeight="regular"
												color="text"
											>
												{open?.notes}
											</MDTypography>
										</MDBox>
									</MDBox>
								</Card>

								{type !== "no_update" && (
									<MDBox
										pt={3}
										style={{ display: "flex", justifyContent: "flex-end" }}
									>

<MDButton
											style={{
												marginRight: "0.5rem",
											}}
											variant="gradient"
											color="dark"
											size="small"
											onClick={() => updateStatus()}
										>
											{translate("ACTION.REFUND")}
										</MDButton>
										<StatusDropdown
											options={allStatus}
											onChange={(value) => setStatus(value)}
											label={translate("ORDERS.STATUS")}
											value={status}
										/>
										<MDButton
											style={{
												marginLeft: "0.5rem",
											}}
											variant="gradient"
											color="dark"
											size="small"
											onClick={() => updateStatus()}
										>
											{translate("ORDERS.CHANGE_STATUS")}
										</MDButton>
									</MDBox>
								)}
							</Grid>
						</Grid>
					</MDBox>
				</DialogContent >
			</BootstrapDialog >
		</>
	);
};

export default OrderModal;
