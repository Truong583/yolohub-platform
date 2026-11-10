interface AdminHeadingProps {
	title: string;
	description: string;
}

const AdminHeading = ({title, description}: AdminHeadingProps) => {
	return (
		<div>
			<h2 className="text-2xl font-bold tracking-tight">{title}</h2>
			<p className="text-muted-foreground">{description}</p>
		</div>
	);
};

export default AdminHeading;
