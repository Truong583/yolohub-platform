"use client";

import {ProtectedRoute} from "@/components/auth/protected-route";
import {Button} from "@/components/ui/button";
import {usePermissions} from "@/hooks/use-permissions";

import dynamic from "next/dynamic";
import {useMemo, useState} from "react";
import {MdAdd} from "react-icons/md";

import {OPERATIONS, RESOURCES} from "@/configs/permission";
import {useRoles} from "@/hooks/use-roles";
import {IRole} from "@/types/role";

// Dynamic imports for heavy components
const RoleActionDialog = dynamic(
	() => import("./components/role-action-dialog"),
	{
		ssr: false,
	}
);

const RolesGrid = dynamic(() => import("./components/roles-grid"), {
	loading: () => <RolesSkeleton view="grid" />,
	ssr: false,
});

const RolesList = dynamic(() => import("./components/roles-list"), {
	loading: () => <RolesSkeleton view="list" />,
	ssr: false,
});

const RolesHeader = dynamic(() => import("./components/roles-header"), {
	loading: () => (
		<div className="flex items-center justify-between gap-4 p-4 border rounded-lg">
			<div className="flex items-center gap-4">
				<div className="w-64 h-10 bg-muted animate-pulse rounded" />
				<div className="w-32 h-10 bg-muted animate-pulse rounded" />
			</div>
			<div className="flex items-center gap-2">
				<div className="w-20 h-10 bg-muted animate-pulse rounded" />
				<div className="w-20 h-10 bg-muted animate-pulse rounded" />
			</div>
		</div>
	),
	ssr: false,
});

// Import skeleton statically as it's lightweight and needed for loading states
import RolesSkeleton from "./components/role-skeletons";

const RolesPage = () => {
	const [currentView, setCurrentView] = useState<"grid" | "list">("grid");
	const [searchQuery, setSearchQuery] = useState("");
	const [sortBy, setSortBy] = useState<
		"name" | "permissionsCount" | "createdAt"
	>("name");
	const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
	const [dialogOpen, setDialogOpen] = useState(false);
	const [dialogMode, setDialogMode] = useState<"create" | "edit">("create");
	const [editingRole, setEditingRole] = useState<IRole | null>(null);

	// Permission hooks
	const {CREATE} = usePermissions("role", ["create"]);

	// API hooks
	const {data: rolesData, isLoading} = useRoles();

	// Client-side sorting and filtering as fallback
	const roles = useMemo(() => {
		if (!rolesData) return [];

		let filteredRoles = [...rolesData];

		// Apply search filter
		if (searchQuery) {
			filteredRoles = filteredRoles.filter(
				(role) =>
					role.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
					role.description.toLowerCase().includes(searchQuery.toLowerCase())
			);
		}

		// Apply sorting
		filteredRoles.sort((a, b) => {
			let aValue: string | number | Date;
			let bValue: string | number | Date;

			switch (sortBy) {
				case "name":
					aValue = a.name.toLowerCase();
					bValue = b.name.toLowerCase();
					break;
				case "permissionsCount":
					// Since userCount doesn't exist in IRole, use permissions count as fallback
					aValue = a.permissions?.length || 0;
					bValue = b.permissions?.length || 0;
					break;
				case "createdAt":
					aValue = new Date(a.createdAt);
					bValue = new Date(b.createdAt);
					break;
				default:
					aValue = a.name.toLowerCase();
					bValue = b.name.toLowerCase();
			}

			if (aValue < bValue) return sortOrder === "asc" ? -1 : 1;
			if (aValue > bValue) return sortOrder === "asc" ? 1 : -1;
			return 0;
		});

		return filteredRoles;
	}, [rolesData, searchQuery, sortBy, sortOrder]);

	const handleSearchChange = (search: string) => {
		setSearchQuery(search);
	};

	const handleSortChange = (sort: string) => {
		// Parse sort string to extract field and order
		const [field, order] = sort.includes("-desc")
			? [sort.replace("-desc", ""), "desc" as const]
			: [sort, "asc" as const];

		if (
			field === "name" ||
			field === "permissionsCount" ||
			field === "createdAt"
		) {
			setSortBy(field);
			setSortOrder(order);
		}
	};

	const handleViewChange = (view: "grid" | "list") => {
		setCurrentView(view);
	};

	const handleEditRole = (role: IRole) => {
		setEditingRole(role);
		setDialogMode("edit");
		setDialogOpen(true);
	};

	const handleCreateRole = () => {
		setEditingRole(null);
		setDialogMode("create");
		setDialogOpen(true);
	};

	const handleDialogClose = () => {
		setDialogOpen(false);
		setEditingRole(null);
	};

	// Default roles page view
	return (
		<ProtectedRoute resource={RESOURCES.ROLE} action={OPERATIONS.READ}>
			<div className="space-y-6">
				{/* Page Header */}
				<div className="flex items-center justify-between">
					<div>
						<h2 className="text-2xl font-bold tracking-tight">Roles</h2>
						<p className="text-muted-foreground">
							Manage user roles and permissions across the platform
						</p>
					</div>
					<div className="flex items-center gap-2">
						{CREATE && (
							<Button className="gap-2" onClick={handleCreateRole}>
								<MdAdd className="h-4 w-4" />
								Add Role
							</Button>
						)}
					</div>
				</div>

				{/* Controls */}
				<RolesHeader
					onSearchChange={handleSearchChange}
					onSortChange={handleSortChange}
					onViewChange={handleViewChange}
					currentView={currentView}
				/>

				{/* Content */}
				{isLoading ? (
					<RolesSkeleton view={currentView} />
				) : currentView === "grid" ? (
					<RolesGrid roles={roles} onEditRole={handleEditRole} />
				) : (
					<RolesList roles={roles} onEditRole={handleEditRole} />
				)}

				{/* Role Action Dialog - Handles both Create and Edit */}
				{dialogOpen && (
					<RoleActionDialog
						open={dialogOpen}
						onOpenChange={(open) => {
							if (!open) handleDialogClose();
						}}
						mode={dialogMode}
						role={editingRole}
						availableRoles={rolesData || []} // Pass all roles for inheritance selection
					/>
				)}
			</div>
		</ProtectedRoute>
	);
};

export default RolesPage;
