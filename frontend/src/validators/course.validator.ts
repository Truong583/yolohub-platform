import {CourseLevel, CourseStatus} from "@/types/course";
import * as yup from "yup";

const courseFormSchema = yup.object({
	title: yup
		.string()
		.required("Title is required")
		.min(3, "Title must be at least 3 characters")
		.max(100, "Title must be less than 100 characters"),

	slug: yup
		.string()
		.required("Slug is required")
		.matches(
			/^[a-z0-9-]+$/,
			"Slug must contain only lowercase letters, numbers, and hyphens"
		),

	excerpt: yup
		.string()
		.default("")
		.test(
			"max-length",
			"Excerpt must be less than 300 characters",
			(value) => !value || value.length <= 300
		),

	description: yup
		.string()
		.default("")
		.test(
			"min-length-if-provided",
			"Description must be at least 10 characters",
			(value) => !value || value.length >= 10
		),

	image: yup
		.string()
		.default("")
		.test(
			"is-url",
			"Must be a valid URL",
			(value) => !value || yup.string().url().isValidSync(value)
		),

	introUrl: yup
		.string()
		.default("")
		.test(
			"is-url",
			"Must be a valid URL",
			(value) => !value || yup.string().url().isValidSync(value)
		),

	price: yup
		.number()
		.transform((value) => (isNaN(value) ? 0 : value))
		.default(0)
		.test(
			"required-when-not-free",
			"Price is required for paid courses",
			function (value) {
				const {isFree} = this.parent;
				if (!isFree && (!value || value <= 0)) {
					return false;
				}
				return true;
			}
		)
		.test(
			"reasonable-price",
			"Price seems too high (maximum 1,000,000,000 ₫)",
			function (value) {
				const {isFree} = this.parent;
				if (!isFree && value) {
					return value <= 1000000000;
				}
				return true;
			}
		),

	oldPrice: yup
		.number()
		.transform((value) => (isNaN(value) ? 0 : value))
		.default(0)
		.test(
			"greater-than-price",
			"Old price should be greater than current price",
			function (value) {
				const {price, isFree} = this.parent;
				if (!isFree && value && value > 0 && price) {
					return value > price;
				}
				return true;
			}
		)
		.test(
			"reasonable-old-price",
			"Old price seems too high (maximum 1,000,000,000 ₫)",
			function (value) {
				if (value && value > 0) {
					return value <= 1000000000;
				}
				return true;
			}
		),

	isFree: yup.boolean().required("Free status is required"),

	status: yup
		.mixed<CourseStatus>()
		.oneOf(Object.values(CourseStatus))
		.required("Status is required"),

	categoryId: yup.string().required("Category is required"),

	level: yup
		.mixed<CourseLevel>()
		.oneOf(Object.values(CourseLevel))
		.required("Level is required"),
});

export type CourseSchema = yup.InferType<typeof courseFormSchema>;
export {courseFormSchema};
