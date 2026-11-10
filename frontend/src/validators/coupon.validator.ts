import {DiscountType} from "@/types/coupon";
import * as yup from "yup";

const couponFormSchema = yup
	.object({
		title: yup
			.string()
			.required("Title is required")
			.min(3, "Title must be at least 3 characters")
			.max(100, "Title must be less than 100 characters"),

		code: yup
			.string()
			.required("Code is required")
			.min(3, "Code must be at least 3 characters")
			.max(50, "Code must be less than 50 characters")
			.matches(
				/^[A-Z0-9_-]+$/,
				"Code must contain only uppercase letters, numbers, hyphens, and underscores"
			),

		discountType: yup
			.string()
			.oneOf(Object.values(DiscountType))
			.required("Discount type is required"),

		discountValue: yup
			.number()
			.transform((value) => (isNaN(value) ? 0 : value))
			.required("Discount value is required")
			.min(0.01, "Discount value must be greater than 0")
			.test(
				"valid-percentage",
				"Percentage must be between 1 and 100",
				function (value) {
					const {discountType} = this.parent;
					if (discountType === DiscountType.PERCENT && value > 100) {
						return false;
					}
					return true;
				}
			),

		courseIds: yup.array().of(yup.string().required()).default([]),

		minPurchaseAmount: yup
			.number()
			.transform((value) => (isNaN(value) ? 0 : value))
			.min(0, "Minimum purchase amount must be positive")
			.default(0),

		maxUses: yup
			.number()
			.transform((value) => (isNaN(value) ? 0 : value))
			.min(1, "Maximum uses must be at least 1")
			.required("Maximum uses is required"),

		startDate: yup
			.date()
			.required("Start date is required")
			.default(() => new Date()),

		endDate: yup
			.date()
			.nullable()
			.default(null)
			.test(
				"end-after-start",
				"End date must be after start date",
				function (value) {
					const {startDate} = this.parent;
					if (value && startDate && new Date(value) <= new Date(startDate)) {
						return false;
					}
					return true;
				}
			),

		isActive: yup.boolean().default(true),
	})
	.required();

export type CouponSchema = yup.InferType<typeof couponFormSchema>;
export {couponFormSchema};
