import React from "react";
import {CategoryStatus} from "@/types/category";
import {CourseLevel} from "@/types/course";
import {DiscountType} from "@/types/coupon";
import {BlogStatus} from "@/types/blog";
import {CommentStatus} from "@/types/comment";

// Filter options for data tables
export const FILTER_OPTIONS = {
	// Category filters
	CATEGORY_STATUS: [
		{
			label: "Active",
			value: CategoryStatus.ACTIVE,
		},
		{
			label: "Inactive",
			value: CategoryStatus.INACTIVE,
		},
	],

	// Blog filters
	BLOG_STATUS: [
		{
			label: "Draft",
			value: BlogStatus.DRAFT,
		},
		{
			label: "Published",
			value: BlogStatus.PUBLISHED,
		},
	],

	// Course filters - updated to match new boolean-based structure
	COURSE_STATUS: [
		{
			label: "Draft",
			value: "draft",
		},
		{
			label: "Published",
			value: "published",
		},
	],

	COURSE_TYPE: [
		{
			label: "Free",
			value: "free",
		},
		{
			label: "Paid",
			value: "paid",
		},
	],

	COURSE_LEVEL: [
		{
			label: "Beginner",
			value: CourseLevel.BEGINNER,
		},
		{
			label: "Intermediate",
			value: CourseLevel.INTERMEDIATE,
		},
		{
			label: "Advanced",
			value: CourseLevel.ADVANCED,
		},
	],

	// Coupon filters
	COUPON_STATUS: [
		{
			label: "Active",
			value: "active",
		},
		{
			label: "Expired",
			value: "expired",
		},
		{
			label: "Inactive",
			value: "inactive",
		},
	],

	COUPON_DISCOUNT_TYPE: [
		{
			label: "Percentage",
			value: DiscountType.PERCENT,
		},
		{
			label: "Fixed Amount",
			value: DiscountType.FIXED,
		},
	],

	// User filters
	USER_STATUS: [
		{
			label: "Active",
			value: "active",
		},
		{
			label: "Inactive",
			value: "inactive",
		},
		{
			label: "Banned",
			value: "banned",
		},
	],

	USER_TYPE: [
		{
			label: "Default",
			value: "default",
		},
		{
			label: "Facebook",
			value: "facebook",
		},
		{
			label: "Google",
			value: "google",
		},
	],

	// Comment filters
	COMMENT_STATUS: [
		{
			label: "Pending",
			value: CommentStatus.PENDING,
		},
		{
			label: "Approved",
			value: CommentStatus.APPROVED,
		},
		{
			label: "Rejected",
			value: CommentStatus.REJECTED,
		},
	],
} as const;

// Filter configuration interface
export interface FilterOption {
	label: string;
	value: string;
	icon?: React.ComponentType<{className?: string}>;
}

// Type for category status filter values
export type CategoryStatusFilter = "active" | "inactive";
