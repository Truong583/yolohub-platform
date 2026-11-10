"use client";

import {Badge} from "@/components/ui/badge";
import {Button} from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {usePermissions} from "@/hooks/use-permissions";
import {
	MdAdminPanelSettings,
	MdDelete,
	MdEdit,
	MdMoreVert,
	MdPeople,
	MdPersonOutline,
	MdSecurity,
	MdShield,
} from "react-icons/md";

import {OPERATIONS, RESOURCES, SYSTEM_ROLE_NAMES} from "@/configs/permission";
import {IRole} from "@/types/role";

// Role icons mapping - aligned with actual system roles
const roleIcons = {
	[SYSTEM_ROLE_NAMES.ADMIN]: MdSecurity,
	[SYSTEM_ROLE_NAMES.SUPER_ADMIN]: MdAdminPanelSettings,
	[SYSTEM_ROLE_NAMES.STUDENT]: MdPeople,
	[SYSTEM_ROLE_NAMES.GUEST]: MdPersonOutline,
} as const;

// Role color mapping - aligned with actual system roles
const roleColors = {
	[SYSTEM_ROLE_NAMES.ADMIN]: "bg-red-100 text-red-800 border-red-200",
	[SYSTEM_ROLE_NAMES.SUPER_ADMIN]:
		"bg-purple-100 text-purple-800 border-purple-200",
	[SYSTEM_ROLE_NAMES.STUDENT]: "bg-green-100 text-green-800 border-green-200",
	[SYSTEM_ROLE_NAMES.GUEST]: "bg-gray-100 text-gray-800 border-gray-200",
} as const;

// Helper function to get role icon with fallback logic
function getRoleIcon(roleName: string) {
	// Try exact match first
	if (roleIcons[roleName as keyof typeof roleIcons]) {
		return roleIcons[roleName as keyof typeof roleIcons];
	}

	// Default fallback
	return MdShield;
}

// Helper function to get role color with fallback logic
function getRoleColor(roleName: string) {
	// Try exact match first
	if (roleColors[roleName as keyof typeof roleColors]) {
		return roleColors[roleName as keyof typeof roleColors];
	}

	// Default fallback
	return "bg-gray-100 text-gray-800 border-gray-200";
}

interface RolesGridProps {
	roles?: IRole[];
	onEditRole?: (role: IRole) => void;
}

interface RoleCardProps {
	role: IRole;
	onEditRole?: (role: IRole) => void;
}

function RoleCard({role, onEditRole}: RoleCardProps) {
	const {UPDATE, DELETE} = usePermissions(RESOURCES.ROLE, [
		OPERATIONS.UPDATE,
		OPERATIONS.DELETE,
	]);

	const IconComponent = getRoleIcon(role.name);
	const colorClass = getRoleColor(role.name);

	const handleEditRole = (e: React.MouseEvent) => {
		e.stopPropagation();
		onEditRole?.(role);
	};

	const hasActions = UPDATE || DELETE;

	return (
		<Card className="group hover:shadow-lg transition-shadow duration-200">
			<CardHeader>
				<div className="flex items-start justify-between gap-3">
					<div className="flex items-start gap-3 flex-1 min-w-0">
						<div className={`p-2.5 rounded-lg ${colorClass} flex-shrink-0`}>
							<IconComponent className="h-5 w-5" />
						</div>
						<div className="flex-1 min-w-0 space-y-1">
							<CardTitle className="text-lg font-semibold capitalize leading-tight">
								{role.name.replace("_", " ")}
							</CardTitle>
							<div className="flex items-center gap-2 text-sm text-muted-foreground">
								<div className="flex items-center gap-1">
									<MdPeople className="h-3.5 w-3.5" />
									<span>{role?.totalUsers || 0} users</span>
								</div>
								<span>•</span>
								<span className="text-xs">
									{new Date(role.createdAt).toLocaleDateString()}
								</span>
							</div>
						</div>
					</div>
					{hasActions && (
						<DropdownMenu modal={false}>
							<DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
								<Button
									variant="ghost"
									size="icon"
									className="opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8 flex-shrink-0"
								>
									<MdMoreVert className="h-4 w-4" />
								</Button>
							</DropdownMenuTrigger>
							<DropdownMenuContent align="end" className="w-48">
								{UPDATE && (
									<DropdownMenuItem onClick={handleEditRole} className="gap-2">
										<MdEdit className="h-4 w-4" />
										Edit Role
									</DropdownMenuItem>
								)}
								{DELETE && (
									<DropdownMenuItem
										className="text-destructive gap-2"
										onClick={(e) => e.stopPropagation()}
									>
										<MdDelete className="h-4 w-4" />
										Delete Role
									</DropdownMenuItem>
								)}
							</DropdownMenuContent>
						</DropdownMenu>
					)}
				</div>
			</CardHeader>

			<CardContent className="pt-0 space-y-4">
				{/* Description */}
				<CardDescription className="text-sm leading-relaxed line-clamp-2">
					{role.description}
				</CardDescription>

				{/* Permissions Count */}
				<div className="flex items-center justify-between py-2 px-3 bg-muted/50 rounded-lg">
					<span className="text-sm font-medium">Permissions</span>
					<Badge variant="secondary" className="font-semibold">
						{role.permissions.length}
					</Badge>
				</div>

				{/* Role Inheritance */}
				{role.inherits && role.inherits.length > 0 && (
					<div className="space-y-2">
						<div className="flex items-center justify-between">
							<span className="text-sm font-medium text-muted-foreground">
								Inherited Roles
							</span>
							<Badge variant="outline" className="text-xs">
								{role.inherits.length}
							</Badge>
						</div>
						<div className="flex flex-wrap gap-1.5">
							{role.inherits.map((inheritedRole) => (
								<Badge
									key={inheritedRole._id}
									variant="secondary"
									className="text-xs px-2 py-0.5"
								>
									{inheritedRole.name}
								</Badge>
							))}
						</div>
					</div>
				)}
			</CardContent>
		</Card>
	);
}

const RolesGrid = ({roles = [], onEditRole}: RolesGridProps) => {
	return (
		<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
			{roles?.length > 0 &&
				roles?.map((role) => (
					<RoleCard key={role._id} role={role} onEditRole={onEditRole} />
				))}
		</div>
	);
};

export default RolesGrid;
