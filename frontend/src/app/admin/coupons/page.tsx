"use client";

import AdminHeading from "@/components/admin/admin-heading";
import {ProtectedRoute} from "@/components/auth/protected-route";
import DataTableSkeleton from "@/components/table/data-table-skeleton";
import {Button} from "@/components/ui/button";
import {OPERATIONS, RESOURCES} from "@/configs/permission";
import {usePermissions} from "@/hooks/use-permissions";
import dynamic from "next/dynamic";
import {useState} from "react";
import {MdAdd} from "react-icons/md";

const CouponsTable = dynamic(() => import("./components/coupons-table"), {
	loading: () => <DataTableSkeleton />,
	ssr: false,
});

const CouponsActionDialog = dynamic(
	() => import("./components/coupons-action-dialog"),
	{
		ssr: false,
	}
);

const CouponsPage = () => {
	const [createDialogOpen, setCreateDialogOpen] = useState(false);
	const {CREATE} = usePermissions(RESOURCES.COUPON, [OPERATIONS.CREATE]);

	const handleCreateClick = () => {
		setCreateDialogOpen(true);
	};

	return (
		<ProtectedRoute resource={RESOURCES.COUPON} action={OPERATIONS.READ}>
			<div className="space-y-6">
				<div className="flex items-center justify-between">
					<AdminHeading
						title="Coupons"
						description="Manage discount coupons and promotional codes"
					/>
					{CREATE && (
						<Button onClick={handleCreateClick}>
							<MdAdd className="mr-2 h-4 w-4" />
							Add Coupon
						</Button>
					)}
				</div>

				<CouponsTable />

				{CREATE && createDialogOpen && (
					<CouponsActionDialog
						mode="create"
						open={createDialogOpen}
						onOpenChange={setCreateDialogOpen}
					/>
				)}
			</div>
		</ProtectedRoute>
	);
};

export default CouponsPage;
