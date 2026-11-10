"use client";

import {Button} from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {Input} from "@/components/ui/input";
import {Separator} from "@/components/ui/separator";
import {cn} from "@/lib/utils";
import {useEditorStore} from "@/stores/use-editor-store";

import {
	AlignCenterIcon,
	AlignJustifyIcon,
	AlignLeftIcon,
	AlignRightIcon,
	BaselineIcon,
	BoldIcon,
	CodeIcon,
	Heading1Icon,
	Heading2Icon,
	Heading3Icon,
	Heading4Icon,
	Heading5Icon,
	Heading6Icon,
	HeadingIcon,
	HighlighterIcon,
	ImageIcon,
	ItalicIcon,
	Link2Icon,
	ListIcon,
	ListOrderedIcon,
	PilcrowIcon,
	Redo2Icon,
	SearchIcon,
	UnderlineIcon,
	Undo2Icon,
	UploadIcon,
	type LucideIcon,
} from "lucide-react";
import {ReactElement, useState, type FC} from "react";
import {HexColorPicker, HexColorInput} from "react-colorful";

const HeadingButton = () => {
	const {editor} = useEditorStore();

	const headings = [
		{
			label: "Paragraph",
			icon: PilcrowIcon,
			isActive: () => editor?.isActive("paragraph"),
			onClick: () => editor?.chain().focus().setParagraph().run(),
		},
		{
			label: "Heading 1",
			icon: Heading1Icon,
			isActive: () => editor?.isActive("heading", {level: 1}),
			onClick: () => editor?.chain().focus().toggleHeading({level: 1}).run(),
		},
		{
			label: "Heading 2",
			icon: Heading2Icon,
			isActive: () => editor?.isActive("heading", {level: 2}),
			onClick: () => editor?.chain().focus().toggleHeading({level: 2}).run(),
		},
		{
			label: "Heading 3",
			icon: Heading3Icon,
			isActive: () => editor?.isActive("heading", {level: 3}),
			onClick: () => editor?.chain().focus().toggleHeading({level: 3}).run(),
		},
		{
			label: "Heading 4",
			icon: Heading4Icon,
			isActive: () => editor?.isActive("heading", {level: 4}),
			onClick: () => editor?.chain().focus().toggleHeading({level: 4}).run(),
		},
		{
			label: "Heading 5",
			icon: Heading5Icon,
			isActive: () => editor?.isActive("heading", {level: 5}),
			onClick: () => editor?.chain().focus().toggleHeading({level: 5}).run(),
		},
		{
			label: "Heading 6",
			icon: Heading6Icon,
			isActive: () => editor?.isActive("heading", {level: 6}),
			onClick: () => editor?.chain().focus().toggleHeading({level: 6}).run(),
		},
	];

	const currentHeading = headings.find((h) => h.isActive());
	const CurrentIcon = currentHeading?.icon || HeadingIcon;

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<button
					type="button"
					className="h-7 min-w-9 shrink-0 flex items-center justify-center rounded-sm hover:bg-neutral-200/80 px-2 overflow-hidden text-sm"
				>
					<CurrentIcon className="size-4" />
				</button>
			</DropdownMenuTrigger>
			<DropdownMenuContent className="p-0">
				{headings.map(({label, icon: Icon, onClick, isActive}) => (
					<button
						key={label}
						type="button"
						onClick={onClick}
						className={cn(
							"flex items-center gap-x-2 px-2 py-1 w-full hover:bg-neutral-200/80",
							isActive() && "bg-neutral-200/80"
						)}
					>
						<Icon className="size-4" />
						<span className="text-sm">{label}</span>
					</button>
				))}
			</DropdownMenuContent>
		</DropdownMenu>
	);
};

const ListButton = () => {
	const {editor} = useEditorStore();

	const lists = [
		{
			label: "Bullet List",
			icon: ListIcon,
			isActive: () => editor?.isActive("bulletList"),
			onClick: () => editor?.chain().focus().toggleBulletList().run(),
		},
		{
			label: "Ordered List",
			icon: ListOrderedIcon,
			isActive: () => editor?.isActive("orderedList"),
			onClick: () => editor?.chain().focus().toggleOrderedList().run(),
		},
	];

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<button
					type="button"
					className="h-7 min-w-9 shrink-0 flex items-center justify-center rounded-sm hover:bg-neutral-200/80 px-2 overflow-hidden text-sm"
				>
					<ListIcon className="size-4" />
				</button>
			</DropdownMenuTrigger>
			<DropdownMenuContent className="p-0">
				{lists.map(({label, icon: Icon, onClick, isActive}) => (
					<button
						key={label}
						type="button"
						onClick={onClick}
						className={cn(
							"flex items-center gap-x-2 px-2 py-1 w-full hover:bg-neutral-200/80",
							isActive() && "bg-neutral-200/80"
						)}
					>
						<Icon className="size-4" />
						<span className="text-sm">{label}</span>
					</button>
				))}
			</DropdownMenuContent>
		</DropdownMenu>
	);
};

const AlignButton = () => {
	const {editor} = useEditorStore();

	const alignments = [
		{
			label: "Align Left",
			value: "left",
			icon: AlignLeftIcon,
		},
		{
			label: "Align Center",
			value: "center",
			icon: AlignCenterIcon,
		},
		{
			label: "Align Right",
			value: "right",
			icon: AlignRightIcon,
		},
		{
			label: "Align Justify",
			value: "justify",
			icon: AlignJustifyIcon,
		},
	];

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<button
					type="button"
					className="h-7 min-w-9 shrink-0 flex items-center justify-center rounded-sm hover:bg-neutral-200/80 px-2 overflow-hidden text-sm"
				>
					<AlignLeftIcon className={"size-4"} />
				</button>
			</DropdownMenuTrigger>
			<DropdownMenuContent className="p-0">
				{alignments.map(({label, value, icon: Icon}) => (
					<button
						key={value}
						type="button"
						onClick={() => {
							editor?.chain().focus().setTextAlign(value).run();
						}}
						className={cn(
							"flex items-center gap-x-2 px-2 py-1 w-full hover:bg-neutral-200/80",
							editor?.isActive("textAlign", {value}) && "bg-neutral-200/80"
						)}
					>
						<Icon className="size-4" />
						<span className="text-sm">{label}</span>
					</button>
				))}
			</DropdownMenuContent>
		</DropdownMenu>
	);
};

const ImageButton = () => {
	const {editor} = useEditorStore();
	const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
	const [imageUrl, setImageUrl] = useState("");

	const onChange = (src: string) => {
		editor?.chain().focus().setImage({src}).run();
	};

	const onUpload = () => {
		const input = document.createElement("input");
		input.type = "file";
		input.accept = "image/*";

		input.onchange = (e) => {
			const file = (e.target as HTMLInputElement).files?.[0];
			if (file) {
				const imageUrl = URL.createObjectURL(file);
				onChange(imageUrl);
			}
		};

		input.click();
	};

	const handleImageUrlSubmit = () => {
		if (imageUrl) {
			onChange(imageUrl);
			setImageUrl("");
			setIsDialogOpen(false);
		}
	};

	return (
		<>
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<button
						type="button"
						className="h-7 min-w-9 shrink-0 flex items-center justify-center rounded-sm hover:bg-neutral-200/80 px-2 overflow-hidden text-sm"
					>
						<ImageIcon className={"size-4"} />
					</button>
				</DropdownMenuTrigger>
				<DropdownMenuContent>
					<DropdownMenuItem onClick={onUpload}>
						<UploadIcon className="mr-2 h-4 w-4" />
						Upload
					</DropdownMenuItem>
					<DropdownMenuItem onClick={() => setIsDialogOpen(true)}>
						<SearchIcon className="mr-2 h-4 w-4" />
						Paste image URL
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>

			<Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Paste image URL</DialogTitle>
					</DialogHeader>
					<Input
						placeholder="Insert image URL"
						value={imageUrl}
						onChange={(e) => setImageUrl(e.target.value)}
						onKeyDown={(e) => e.key === "Enter" && handleImageUrlSubmit()}
					/>
					<DialogFooter>
						<Button onClick={handleImageUrlSubmit}>Insert</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</>
	);
};

const LinkButton = () => {
	const {editor} = useEditorStore();
	const [value, setValue] = useState("");

	const onChange = (href: string) => {
		editor?.chain().focus().extendMarkRange("link").setLink({href}).run();
		setValue("");
	};
	return (
		<DropdownMenu
			onOpenChange={(open) =>
				open && setValue(editor?.getAttributes("link").href || "")
			}
		>
			<DropdownMenuTrigger asChild>
				<button
					type="button"
					className="h-7 min-w-9 shrink-0 flex items-center justify-center rounded-sm hover:bg-neutral-200/80 px-2 overflow-hidden text-sm"
				>
					<Link2Icon className={"size-4"} />
				</button>
			</DropdownMenuTrigger>
			<DropdownMenuContent className="p-2.5 flex items-center gap-x-2">
				<Input
					placeholder="https://"
					value={value}
					onChange={(e) => setValue(e.target.value)}
				/>
				<Button onClick={() => onChange(value)} disabled={!value}>
					Apply
				</Button>
			</DropdownMenuContent>
		</DropdownMenu>
	);
};

const HighlightColorButton = () => {
	const {editor} = useEditorStore();
	const [color, setColor] = useState(
		editor?.getAttributes("highlight").color || "#ffff00"
	);

	const onChange = (newColor: string) => {
		setColor(newColor);
		editor?.chain().focus().setHighlight({color: newColor}).run();
	};

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<button
					type="button"
					className="h-7 min-w-9 shrink-0 flex items-center justify-center rounded-sm hover:bg-neutral-200/80 px-2 overflow-hidden text-sm"
				>
					<HighlighterIcon className={"size-4"} />
				</button>
			</DropdownMenuTrigger>
			<DropdownMenuContent className="p-3 w-64">
				<div className="space-y-3">
					<HexColorPicker color={color} onChange={onChange} />
					<div className="flex items-center gap-2">
						<HexColorInput
							color={color}
							onChange={onChange}
							className="flex-1 px-2 py-1 text-sm border rounded"
							prefixed
						/>
						<div
							className="w-6 h-6 rounded border"
							style={{backgroundColor: color}}
						/>
					</div>
				</div>
			</DropdownMenuContent>
		</DropdownMenu>
	);
};

const TextColorButton = () => {
	const {editor} = useEditorStore();
	const [color, setColor] = useState(
		editor?.getAttributes("textStyle").color || "#000000"
	);

	const onChange = (newColor: string) => {
		setColor(newColor);
		editor?.chain().focus().setColor(newColor).run();
	};

	// Common colors for quick selection
	const commonColors = [
		"#000000",
		"#ffffff",
		"#ff0000",
		"#00ff00",
		"#0000ff",
		"#ffff00",
		"#ff00ff",
		"#00ffff",
		"#808080",
		"#800000",
		"#008000",
		"#000080",
	];

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<button
					type="button"
					className="h-7 min-w-9 shrink-0 flex items-center justify-center rounded-sm hover:bg-neutral-200/80 px-2 overflow-hidden text-sm"
				>
					<BaselineIcon className="size-4" style={{color}} />
				</button>
			</DropdownMenuTrigger>
			<DropdownMenuContent className="p-3 w-64">
				<div className="space-y-3">
					{/* Quick color selection */}
					<div className="grid grid-cols-6 gap-1">
						{commonColors.map((commonColor) => (
							<button
								key={commonColor}
								type="button"
								className={`w-6 h-6 rounded border-2 hover:scale-110 transition-transform ${
									color === commonColor ? "border-gray-400" : "border-gray-200"
								}`}
								style={{backgroundColor: commonColor}}
								onClick={() => onChange(commonColor)}
							/>
						))}
					</div>

					{/* Custom color picker */}
					<HexColorPicker color={color} onChange={onChange} />
					<div className="flex items-center gap-2">
						<HexColorInput
							color={color}
							onChange={onChange}
							className="flex-1 px-2 py-1 text-sm border rounded"
							prefixed
						/>
						<div
							className="w-6 h-6 rounded border"
							style={{backgroundColor: color}}
						/>
					</div>
				</div>
			</DropdownMenuContent>
		</DropdownMenu>
	);
};

interface ToolbarButtonProps {
	onClick: () => void;
	isActive?: boolean;
	icon: LucideIcon;
}

const ToolbarButton: FC<ToolbarButtonProps> = ({
	onClick,
	isActive,
	icon: Icon,
}): ReactElement => {
	return (
		<button
			type="button"
			onClick={onClick}
			className={cn(
				"text-sm h-7 min-w-7 flex items-center justify-center rounded-sm hover:bg-neutral-200/80",
				isActive && "bg-neutral-200/80"
			)}
		>
			<Icon className="size-4" />
		</button>
	);
};

const Toolbar = ({}) => {
	const {editor} = useEditorStore();

	const section: {
		label: string;
		icon: LucideIcon;
		onClick: () => void;
		isActive?: boolean;
	}[][] = [
		[
			{
				label: "Undo",
				icon: Undo2Icon,
				onClick: () => {
					editor?.chain().focus().undo().run();
				},
			},
			{
				label: "Redo",
				icon: Redo2Icon,
				onClick: () => {
					editor?.chain().focus().redo().run();
				},
			},

			{
				label: "Code Block",
				icon: CodeIcon,
				onClick: () => {
					editor?.chain().focus().toggleCodeBlock().run();
				},
			},
		],
		[
			{
				label: "Bold",
				icon: BoldIcon,
				isActive: editor?.isActive("bold"),
				onClick: () => {
					editor?.chain().focus().toggleBold().run();
				},
			},
			{
				label: "Italic",
				icon: ItalicIcon,
				isActive: editor?.isActive("italic"),
				onClick: () => {
					editor?.chain().focus().toggleItalic().run();
				},
			},
			{
				label: "Underline",
				icon: UnderlineIcon,
				isActive: editor?.isActive("underline"),
				onClick: () => {
					editor?.chain().focus().toggleUnderline().run();
				},
			},
		],
	];

	return (
		<div className=" px-2.5 py-0.5 rounded-md min-h-10 flex items-center gap-x-0.5 overflow-x-auto">
			{section[0].map((item) => (
				<ToolbarButton key={item.label} {...item} />
			))}

			<Separator orientation="vertical" className="h-6 bg-neutral-300" />
			<HeadingButton />
			<Separator orientation="vertical" className="h-6 bg-neutral-300" />
			{section[1].map((item) => (
				<ToolbarButton key={item.label} {...item} />
			))}
			<TextColorButton />
			<HighlightColorButton />
			<Separator orientation="vertical" className="h-6 bg-neutral-300" />
			<LinkButton />
			<ImageButton />
			<AlignButton />
			<ListButton />
		</div>
	);
};

export default Toolbar;
