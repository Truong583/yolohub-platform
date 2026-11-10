"use client";

import * as React from "react";
import {useForm} from "react-hook-form";
import dayjs from "dayjs";
import {Calendar as CalendarIcon} from "lucide-react";

import {Button} from "@/components/ui/button";
import {Calendar} from "@/components/ui/calendar";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {Switch} from "@/components/ui/switch";
import {Coupon, DiscountType} from "@/types/coupon";
import {useCreateCoupon, useUpdateCoupon} from "@/hooks/use-coupons";
import {useCourses} from "@/hooks/use-courses";
import {yupResolver} from "@hookform/resolvers/yup";
import {couponFormSchema, CouponSchema} from "@/validators/coupon.validator";

import {cn} from "@/lib/utils";
import {MultiSelect} from "@/components/multi-select";
import {toast} from "sonner";
import {NumericFormat} from "react-number-format";

interface CouponsActionDialogProps {
	mode?: "create" | "edit";
	coupon?: Coupon;
	open: boolean;
	onOpenChange: (open: boolean) => void;
}

const CouponsActionDialog = ({
	mode = "create",
	coupon,
	open,
	onOpenChange,
}: CouponsActionDialogProps) => {
	const createCouponMutation = useCreateCoupon();

	const updateCouponMutation = useUpdateCoupon();

	// Fetch courses for selection
	const {data: coursesData, isLoading: coursesLoading} = useCourses();

	const defaultValues = React.useMemo(
		() => ({
			title: "",
			code: "",
			discountType: DiscountType.PERCENT,
			discountValue: 10,
			courseIds: [],
			minPurchaseAmount: 0,
			maxUses: 100,
			startDate: new Date(),
			endDate: null,
			isActive: true,
		}),
		[]
	);

	const form = useForm<CouponSchema>({
		resolver: yupResolver(couponFormSchema),
		defaultValues,
		mode: "onChange",
	});

	const {
		formState: {isSubmitting},
		reset,
		watch,
	} = form;

	const discountType = watch("discountType");

	React.useEffect(() => {
		if (open && coupon) {
			const formDefaults = {
				title: coupon?.title || "",
				code: coupon?.code || "",
				discountType: coupon?.discountType || DiscountType.PERCENT,
				discountValue: coupon?.discountValue || 10,
				courseIds: coupon?.courseIds?.map((course) => course._id) || [],
				minPurchaseAmount: coupon?.minPurchaseAmount || 0,
				maxUses: coupon?.maxUses || 100,
				startDate: coupon?.startDate ? new Date(coupon.startDate) : new Date(),
				endDate: coupon?.endDate ? new Date(coupon.endDate) : null,
				isActive: coupon?.isActive ?? true,
			};

			reset(formDefaults);
		}
	}, [open, coupon, reset]);

	const onSubmit = (data: CouponSchema) => {
		const couponData = {
			...data,
			startDate: data.startDate?.toISOString(),
			endDate: data.endDate ? data.endDate.toISOString() : undefined,
		};

		if (mode === "create") {
			createCouponMutation.mutate(couponData, {
				onSuccess: () => {
					toast.success("Coupon created successfully!");
					onOpenChange(false);
				},
			});
		} else if (coupon) {
			updateCouponMutation.mutate(
				{
					id: coupon._id,
					...couponData,
				},
				{
					onSuccess: () => {
						toast.success("Coupon updated successfully!");
						onOpenChange(false);
					},
				}
			);
		}
	};

	const courses = coursesData?.courses || [];

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="sm:max-w-[900px] max-h-[90vh] flex flex-col">
				<DialogHeader className="flex-shrink-0">
					<DialogTitle>
						{mode === "create" ? "Create New Coupon" : "Edit Coupon"}
					</DialogTitle>
					<DialogDescription>
						{mode === "create"
							? "Create a new discount coupon for courses."
							: "Update coupon information and settings."}
					</DialogDescription>
				</DialogHeader>

				<div className="flex-1 overflow-y-auto px-1">
					<Form {...form}>
						<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
							{/* Basic Information Section */}
							<div className="space-y-4">
								<h3 className="text-lg font-semibold text-gray-900 border-b pb-2">
									Basic Information
								</h3>

								<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
									<FormField
										control={form.control}
										name="title"
										render={({field}) => (
											<FormItem>
												<FormLabel>
													Title <span className="text-red-500">*</span>
												</FormLabel>
												<FormControl>
													<Input {...field} placeholder="Coupon title" />
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>

									<FormField
										control={form.control}
										name="code"
										render={({field}) => (
											<FormItem>
												<FormLabel>
													Code <span className="text-red-500">*</span>
												</FormLabel>
												<FormControl>
													<Input
														{...field}
														placeholder="COUPON_CODE"
														className="font-mono"
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
								</div>

								<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
									<FormField
										control={form.control}
										name="discountType"
										render={({field}) => (
											<FormItem>
												<FormLabel>
													Discount Type <span className="text-red-500">*</span>
												</FormLabel>
												<Select
													value={field.value}
													onValueChange={field.onChange}
												>
													<FormControl>
														<SelectTrigger className="w-full">
															<SelectValue placeholder="Select discount type" />
														</SelectTrigger>
													</FormControl>
													<SelectContent>
														<SelectItem value={DiscountType.PERCENT}>
															Percentage (%)
														</SelectItem>
														<SelectItem value={DiscountType.FIXED}>
															Fixed Amount (đ)
														</SelectItem>
													</SelectContent>
												</Select>
												<FormMessage />
											</FormItem>
										)}
									/>

									<FormField
										control={form.control}
										name="discountValue"
										render={({field: {onChange, onBlur, name, value, ref}}) => (
											<FormItem>
												<FormLabel>
													Discount Value <span className="text-red-500">*</span>
												</FormLabel>
												<FormControl>
													<NumericFormat
														name={name}
														value={value}
														onBlur={onBlur}
														getInputRef={ref}
														customInput={Input}
														thousandSeparator=","
														decimalSeparator="."
														suffix={
															discountType === DiscountType.PERCENT
																? " %"
																: " ₫"
														}
														allowNegative={false}
														placeholder={
															discountType === DiscountType.PERCENT
																? "10 %"
																: "10 ₫"
														}
														isAllowed={(values) => {
															const {floatValue} = values;
															// For percentage, limit to 100
															if (discountType === DiscountType.PERCENT) {
																return !floatValue || floatValue <= 100;
															}
															// For fixed amount, no limit
															return true;
														}}
														onValueChange={(values) =>
															onChange(values.floatValue)
														}
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
								</div>
							</div>

							{/* Eligibility Section */}
							<div className="space-y-4">
								<h3 className="text-lg font-semibold text-gray-900 border-b pb-2">
									Eligibility & Restrictions
								</h3>

								<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
									<FormField
										control={form.control}
										name="minPurchaseAmount"
										render={({field: {onChange, onBlur, name, value, ref}}) => (
											<FormItem>
												<FormLabel>Minimum Purchase Amount</FormLabel>
												<FormControl>
													<NumericFormat
														name={name}
														value={value}
														onBlur={onBlur}
														getInputRef={ref}
														customInput={Input}
														thousandSeparator=","
														decimalSeparator="."
														suffix=" ₫"
														allowNegative={false}
														placeholder="0 ₫"
														onValueChange={(values) =>
															onChange(values.floatValue)
														}
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>

									<FormField
										control={form.control}
										name="maxUses"
										render={({field: {onChange, onBlur, name, value, ref}}) => (
											<FormItem>
												<FormLabel>Maximum Uses</FormLabel>
												<FormControl>
													<NumericFormat
														name={name}
														value={value}
														onBlur={onBlur}
														getInputRef={ref}
														customInput={Input}
														thousandSeparator=","
														allowNegative={false}
														placeholder="100"
														decimalScale={0}
														allowLeadingZeros={false}
														isAllowed={(values) => {
															const {floatValue} = values;
															return (
																!floatValue ||
																(floatValue >= 1 && floatValue <= 999999)
															);
														}}
														onValueChange={(values) =>
															onChange(values.floatValue)
														}
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
								</div>

								{/* Course Selection */}
								<FormField
									control={form.control}
									name="courseIds"
									render={({field}) => {
										// Transform courses into options for MultiSelect
										const courseOptions = courses.map((course) => ({
											label: `${
												course.title
											} - ${course.price.toLocaleString()} VND`,
											value: course._id,
										}));

										return (
											<FormItem>
												<FormLabel>Applicable Courses</FormLabel>
												<div className="text-sm text-muted-foreground mb-2">
													Select courses where this coupon can be applied. Leave
													empty for all courses.
												</div>
												<FormControl>
													{coursesLoading ? (
														<div className="flex items-center justify-center p-8 border border-dashed rounded-lg">
															<div className="text-sm text-muted-foreground">
																Loading courses...
															</div>
														</div>
													) : (
														<MultiSelect
															options={courseOptions}
															onValueChange={field.onChange}
															defaultValue={
																Array.isArray(field.value) ? field.value : []
															}
															placeholder="Select courses (leave empty for all)"
															variant="default"
															disabled={coursesLoading}
															modalPopover={true}
															popoverClassName="z-"
															resetOnDefaultValueChange={true}
														/>
													)}
												</FormControl>
												<FormMessage />
											</FormItem>
										);
									}}
								/>
							</div>

							{/* Validity Period Section */}
							<div className="space-y-4">
								<h3 className="text-lg font-semibold text-gray-900 border-b pb-2">
									Validity Period
								</h3>

								<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
									<FormField
										control={form.control}
										name="startDate"
										render={({field}) => (
											<FormItem className="flex flex-col">
												<FormLabel>
													Start Date <span className="text-red-500">*</span>
												</FormLabel>
												<Popover modal={true}>
													<PopoverTrigger asChild>
														<FormControl>
															<Button
																variant="outline"
																className={cn(
																	"w-full pl-3 text-left font-normal",
																	!field.value && "text-muted-foreground"
																)}
															>
																{field.value ? (
																	dayjs(field.value).format("MMM D, YYYY")
																) : (
																	<span>Pick a date</span>
																)}
																<CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
															</Button>
														</FormControl>
													</PopoverTrigger>
													<PopoverContent className="w-auto p-0">
														<Calendar
															mode="single"
															selected={field.value}
															onSelect={field.onChange}
															disabled={(date: Date) => {
																const today = new Date();
																today.setHours(0, 0, 0, 0);
																return date < today;
															}}
															initialFocus
														/>
													</PopoverContent>
												</Popover>
												<FormMessage />
											</FormItem>
										)}
									/>

									<FormField
										control={form.control}
										name="endDate"
										render={({field}) => {
											const startDate = watch("startDate");
											return (
												<FormItem className="flex flex-col">
													<FormLabel>End Date</FormLabel>
													<Popover modal={true}>
														<PopoverTrigger asChild>
															<FormControl>
																<Button
																	variant="outline"
																	className={cn(
																		"w-full pl-3 text-left font-normal",
																		!field.value && "text-muted-foreground"
																	)}
																>
																	{field.value ? (
																		dayjs(field.value).format("MMM D, YYYY")
																	) : (
																		<span>No expiration</span>
																	)}
																	<CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
																</Button>
															</FormControl>
														</PopoverTrigger>
														<PopoverContent className="w-auto p-0">
															<Calendar
																mode="single"
																selected={field.value || undefined}
																onSelect={field.onChange}
																disabled={(date: Date) => {
																	const today = new Date();
																	today.setHours(0, 0, 0, 0);
																	// Disable dates before today or before start date
																	if (date < today) return true;
																	if (startDate) {
																		const start = new Date(startDate);
																		start.setHours(0, 0, 0, 0);
																		return date <= start;
																	}
																	return false;
																}}
																initialFocus
															/>
															<div className="p-3 border-t">
																<Button
																	variant="ghost"
																	size="sm"
																	className="w-full"
																	onClick={() => field.onChange(null)}
																>
																	Clear (No expiration)
																</Button>
															</div>
														</PopoverContent>
													</Popover>
													<FormMessage />
												</FormItem>
											);
										}}
									/>
								</div>
							</div>

							{/* Status Section */}
							<div className="space-y-4">
								<FormField
									control={form.control}
									name="isActive"
									render={({field}) => (
										<FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
											<div className="space-y-0.5">
												<FormLabel className="text-base">
													Active Status
												</FormLabel>
												<div className="text-sm text-muted-foreground">
													Enable or disable this coupon
												</div>
											</div>
											<FormControl>
												<Switch
													checked={field.value}
													onCheckedChange={field.onChange}
												/>
											</FormControl>
										</FormItem>
									)}
								/>
							</div>
						</form>
					</Form>
				</div>

				<DialogFooter className="flex-shrink-0 border-t pt-4">
					<Button
						type="button"
						variant="outline"
						onClick={() => onOpenChange(false)}
					>
						Cancel
					</Button>
					<Button
						type="button"
						onClick={form.handleSubmit(onSubmit)}
						disabled={
							isSubmitting ||
							createCouponMutation.isPending ||
							updateCouponMutation.isPending
						}
					>
						{isSubmitting ||
						createCouponMutation.isPending ||
						updateCouponMutation.isPending
							? "Saving..."
							: mode === "create"
							? "Create Coupon"
							: "Update Coupon"}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
};

export default CouponsActionDialog;
