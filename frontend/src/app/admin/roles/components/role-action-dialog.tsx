"use client";

import * as React from "react";
import {useForm} from "react-hook-form";
import {yupResolver} from "@hookform/resolvers/yup";
import {Button} from "@/components/ui/button";
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
import {Textarea} from "@/components/ui/textarea";
import {Checkbox} from "@/components/ui/checkbox";
import {Separator} from "@/components/ui/separator";
import {Badge} from "@/components/ui/badge";
import {
	MultiSelectFacetedFilter,
	type Option,
} from "@/components/ui/multi-select-faceted-filter";
import {MdEdit, MdAdd} from "react-icons/md";
import {toast} from "sonner";
import {Permission, PERMISSION_GROUPS} from "@/configs/permission";
import {roleSchema, RoleSchema} from "@/validators/role.validator";

import {useCreateRole, useUpdateRole} from "@/hooks/use-roles";
import {IRole} from "@/types/role";

interface RoleActionDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	mode: "create" | "edit";
	role: IRole | null;
	availableRoles?: IRole[]; // Pass roles from parent to avoid duplicate API calls
}

const RoleActionDialog = ({
	open,
	onOpenChange,
	mode = "create",
	role,
	availableRoles = [],
}: RoleActionDialogProps) => {
	// Utility function to recursively get all permissions from a role
	const getAllRolePermissions = React.useCallback((role: IRole): string[] => {
		const allPermissions = new Set<string>();

		// Add direct permissions
		if (role.permissions) {
			role.permissions.forEach((permission) => {
				allPermissions.add(permission);
			});
		}

		// Recursively add permissions from inherited roles
		if (role.inherits && role.inherits.length > 0) {
			role.inherits.forEach((inheritedRole) => {
				const inheritedPermissions = getAllRolePermissions(inheritedRole);
				inheritedPermissions.forEach((permission) => {
					allPermissions.add(permission);
				});
			});
		}

		return Array.from(allPermissions);
	}, []);

	// API hooks
	const createRoleMutation = useCreateRole();
	const updateRoleMutation = useUpdateRole();

	// Filter available roles to exclude the current role (prevent circular inheritance)
	const inheritableRoles = React.useMemo(() => {
		return availableRoles.filter((r) => r._id !== role?._id);
	}, [availableRoles, role?._id]);

	// Helper function to get form values from role
	const getFormValues = React.useCallback(
		(role: IRole | null) => ({
			name: role?.name || "",
			description: role?.description || "",
			permissions: role?.permissions || [],
			inherits: role?.inherits?.map((r) => r._id) || [],
		}),
		[]
	);

	const isLoading =
		createRoleMutation.isPending || updateRoleMutation.isPending;

	// Initialize form with default values
	const form = useForm<RoleSchema>({
		resolver: yupResolver(roleSchema),
		defaultValues: getFormValues(role),
	});

	// Reset form when dialog opens/closes or role changes
	React.useEffect(() => {
		if (open && role) {
			form.reset(getFormValues(role));
		}
	}, [open, role, form, getFormValues]);

	const onSubmit = async (data: RoleSchema) => {
		const formData = {
			name: data.name,
			description: data.description,
			permissions: uniqueDirectPermissions as Permission[], // Only direct permissions, no duplicates with inherited
			inherits: data.inherits,
		};

		if (mode === "create") {
			createRoleMutation.mutate(
				{
					name: formData.name,
					description: formData.description,
					permissions: formData.permissions,
					inherits: formData.inherits,
				},
				{
					onSuccess: () => {
						toast.success("Role created successfully!");
						onOpenChange(false);
						form.reset();
					},
				}
			);
		} else if (role) {
			updateRoleMutation.mutate(
				{
					id: role._id,
					name: formData.name,
					description: formData.description,
					permissions: formData.permissions,
					inherits: formData.inherits,
				},
				{
					onSuccess: () => {
						toast.success("Role updated successfully!");
						onOpenChange(false);
						form.reset();
					},
				}
			);
		}
	};

	const title = mode === "create" ? "Create Role" : "Edit Role";
	const description =
		mode === "create"
			? "Create a new role with specific permissions and inheritance."
			: "Update the role information and permissions.";

	const watchedPermissions = form.watch("permissions");
	const watchedInherits = form.watch("inherits");

	// Get all inherited permissions from selected parent roles
	const inheritedPermissions = React.useMemo(() => {
		if (!watchedInherits || watchedInherits.length === 0) {
			return [];
		}

		const allInheritedPermissions = new Set<string>();

		// Process each selected parent role
		watchedInherits.forEach((roleId) => {
			const parentRole = inheritableRoles.find((r) => r._id === roleId);
			if (parentRole) {
				const permissions = getAllRolePermissions(parentRole);
				permissions.forEach((permission) => {
					allInheritedPermissions.add(permission);
				});
			}
		});

		return Array.from(allInheritedPermissions);
	}, [watchedInherits, inheritableRoles, getAllRolePermissions]);

	// Total permissions = direct permissions + inherited permissions
	const totalPermissions = React.useMemo(() => {
		const allPermissions = new Set([
			...(watchedPermissions || []),
			...inheritedPermissions,
		]);
		return Array.from(allPermissions);
	}, [watchedPermissions, inheritedPermissions]);

	// Calculate unique direct permissions (not inherited)
	const uniqueDirectPermissions = React.useMemo(() => {
		return (watchedPermissions || []).filter(
			(p) => !inheritedPermissions.includes(p)
		);
	}, [watchedPermissions, inheritedPermissions]);

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="sm:max-w-[700px] max-h-[90vh]">
				<DialogHeader>
					<DialogTitle className="flex items-center gap-2">
						{mode === "create" ? (
							<MdAdd className="h-5 w-5" />
						) : (
							<MdEdit className="h-5 w-5" />
						)}
						{title}
					</DialogTitle>
					<DialogDescription>{description}</DialogDescription>
				</DialogHeader>

				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
						<div className="max-h-[60vh] overflow-auto pr-4">
							<div className="space-y-6">
								{/* Basic Information */}
								<div className="space-y-4">
									<h3 className="text-sm font-medium">Basic Information</h3>

									{/* Role Name */}
									<FormField
										control={form.control}
										name="name"
										render={({field}) => (
											<FormItem>
												<FormLabel>Role Name *</FormLabel>
												<FormControl>
													<Input
														placeholder="Enter role name"
														{...field}
														disabled={isLoading}
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>

									{/* Description */}
									<FormField
										control={form.control}
										name="description"
										render={({field}) => (
											<FormItem>
												<FormLabel>Description *</FormLabel>
												<FormControl>
													<Textarea
														placeholder="Enter role description"
														rows={3}
														{...field}
														disabled={isLoading}
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
								</div>

								<Separator />

								{/* Role Inheritance */}
								<div className="space-y-4">
									<FormField
										control={form.control}
										name="inherits"
										render={({field}) => {
											// Calculate total permissions for each role (direct + inherited)
											const calculateTotalPermissions = (
												role: IRole
											): number => {
												return getAllRolePermissions(role).length;
											};

											const roleOptions: Option[] = inheritableRoles.map(
												(role) => ({
													label: role.name,
													value: role._id,
													count: calculateTotalPermissions(role),
												})
											);

											return (
												<FormItem>
													<FormLabel>Role Inheritance</FormLabel>
													<MultiSelectFacetedFilter
														placeholder="Select roles to inherit from"
														searchPlaceholder="Search roles..."
														options={roleOptions}
														selectedValues={field.value || []}
														onSelectionChange={field.onChange}
														disabled={isLoading}
														emptyMessage="No roles found."
														maxDisplayItems={2}
														showClearAll={true}
													/>
													<FormMessage />
												</FormItem>
											);
										}}
									/>
								</div>

								<Separator />

								{/* Permissions */}
								<div className="space-y-4">
									<div className="flex items-center justify-between">
										<h3 className="text-sm font-medium">
											Permissions (optional)
										</h3>
										<div className="flex items-center gap-2">
											<Badge variant="outline">
												{
													(watchedPermissions || []).filter(
														(p) => !inheritedPermissions.includes(p)
													).length
												}{" "}
												direct (unique)
											</Badge>
											{inheritedPermissions.length > 0 && (
												<Badge variant="secondary">
													{inheritedPermissions.length} inherited
												</Badge>
											)}
											<Badge variant="default">
												{totalPermissions.length} total
											</Badge>
										</div>
									</div>
									<p className="text-xs text-muted-foreground">
										Select specific permissions for this role. Permissions
										already inherited from parent roles will be automatically
										excluded to avoid duplicates. If no additional permissions
										are selected, the role will only have permissions inherited
										from parent roles.
									</p>

									<FormField
										control={form.control}
										name="permissions"
										render={({field}) => (
											<FormItem>
												<div className="space-y-4">
													{Object.entries(PERMISSION_GROUPS).map(
														([resource, group]) => (
															<div key={resource} className="space-y-2">
																<div className="flex items-center justify-between">
																	<h4 className="text-sm font-medium text-muted-foreground">
																		{group.label}
																	</h4>
																	<div className="flex items-center gap-2">
																		<Button
																			type="button"
																			variant="outline"
																			size="sm"
																			onClick={() => {
																				const currentPermissions =
																					field.value || [];
																				const allResourcePermissions =
																					group.permissions;

																				// Filter out inherited permissions for this resource
																				const directResourcePermissions =
																					allResourcePermissions.filter(
																						(p: string) =>
																							!inheritedPermissions.includes(p)
																					);

																				// Check if all non-inherited permissions are selected
																				const hasAllDirect =
																					directResourcePermissions.every(
																						(p: string) =>
																							currentPermissions.includes(p)
																					);

																				if (hasAllDirect) {
																					// Remove all direct permissions for this resource
																					field.onChange(
																						currentPermissions.filter(
																							(p) =>
																								!directResourcePermissions.includes(
																									p as Permission
																								)
																						)
																					);
																				} else {
																					// Add all direct permissions for this resource
																					const newPermissions = Array.from(
																						new Set([
																							...currentPermissions,
																							...directResourcePermissions,
																						])
																					);
																					field.onChange(newPermissions);
																				}
																			}}
																			disabled={isLoading}
																		>
																			{group.permissions
																				.filter(
																					(p: string) =>
																						!inheritedPermissions.includes(p)
																				)
																				.every((p: string) =>
																					field.value?.includes(p)
																				)
																				? "Deselect All"
																				: "Select All"}
																		</Button>
																	</div>
																</div>
																<div className="grid grid-cols-2 gap-2">
																	{group.permissions.map(
																		(permission: string) => {
																			const isDirectlySelected =
																				field.value?.includes(permission) ||
																				false;
																			const isInherited =
																				inheritedPermissions.includes(
																					permission
																				);
																			const isChecked =
																				isDirectlySelected || isInherited;

																			return (
																				<div
																					key={permission}
																					className="flex items-center space-x-2"
																				>
																					<Checkbox
																						id={permission}
																						checked={isChecked}
																						onCheckedChange={(checked) => {
																							if (checked && !isInherited) {
																								field.onChange([
																									...(field.value || []),
																									permission,
																								]);
																							} else if (
																								!checked &&
																								!isInherited
																							) {
																								field.onChange(
																									field.value?.filter(
																										(p) => p !== permission
																									) || []
																								);
																							}
																							// Don't allow unchecking inherited permissions
																						}}
																						disabled={isLoading || isInherited}
																					/>
																					<label
																						htmlFor={permission}
																						className={`text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer ${
																							isInherited
																								? "text-muted-foreground"
																								: ""
																						}`}
																					>
																						{permission.split(":")[1]}
																						{isInherited && (
																							<span className="ml-1 text-xs text-muted-foreground">
																								(inherited)
																							</span>
																						)}
																					</label>
																				</div>
																			);
																		}
																	)}
																</div>
															</div>
														)
													)}
												</div>
												<FormMessage />
											</FormItem>
										)}
									/>
								</div>
							</div>
						</div>

						<DialogFooter>
							<Button
								type="button"
								variant="outline"
								onClick={() => onOpenChange(false)}
								disabled={isLoading}
							>
								Cancel
							</Button>
							<Button type="submit" disabled={isLoading}>
								{isLoading
									? "Saving..."
									: mode === "create"
									? "Create Role"
									: "Update Role"}
							</Button>
						</DialogFooter>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
};

export default RoleActionDialog;
