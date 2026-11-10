"use client";

import dynamic from "next/dynamic";
import {ProtectedRoute} from "@/components/auth/protected-route";
import {RESOURCES, OPERATIONS} from "@/configs/permission";
import AdminHeading from "@/components/admin/admin-heading";
import DataTableSkeleton from "@/components/table/data-table-skeleton";

const OrdersTable = dynamic(() => import("./components/orders-table"), {
	loading: () => <DataTableSkeleton />,
	ssr: false,
});

const OrdersPage = () => {
	return (
		<ProtectedRoute resource={RESOURCES.ORDER} action={OPERATIONS.READ}>
			<div className="space-y-6">
				<AdminHeading
					title="Orders"
					description="Manage customer orders and order status"
				/>

				<OrdersTable />
			</div>
		</ProtectedRoute>
	);
};

export default OrdersPage;
