import {
	IconAlignCenter,
	IconAlignLeft,
	IconAlignRight,
} from "@tabler/icons-react";
import {NodeViewWrapper, ReactNodeViewRenderer} from "@tiptap/react";
import {
	ResizableImage,
	ResizableImageComponent,
	ResizableImageNodeViewRendererProps,
} from "tiptap-extension-resizable-image";
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover";
import {Button} from "@/components/ui/button";
import {cn} from "@/lib/utils";

const NodeView = (props: ResizableImageNodeViewRendererProps) => {
	const {node, updateAttributes} = props;
	const align = node.attrs.align || "center";

	const setImageAlign = (newAlign: string) => {
		updateAttributes({align: newAlign} as Record<string, unknown>);
	};

	const getWrapperStyle = (): React.CSSProperties => {
		const baseStyle: React.CSSProperties = {
			display: "block",
			margin: "1rem 0",
			maxWidth: "100%",
		};

		switch (align) {
			case "left":
				return {
					...baseStyle,
					float: "left",
					marginRight: "1.5rem",
					marginLeft: "0",
				};
			case "right":
				return {
					...baseStyle,
					float: "right",
					marginLeft: "1.5rem",
					marginRight: "0",
				};
			case "center":
			default:
				return {
					...baseStyle,
					marginLeft: "auto",
					marginRight: "auto",
					textAlign: "center",
				};
		}
	};

	return (
		<NodeViewWrapper
			className="image-component"
			data-drag-handle
			style={getWrapperStyle()}
		>
			<Popover modal={true}>
				<PopoverTrigger asChild>
					<div style={{display: "inline-block", position: "relative"}}>
						<ResizableImageComponent {...props} />
					</div>
				</PopoverTrigger>
				<PopoverContent className="w-auto p-2" align="center">
					<div className="flex items-center gap-1">
						<Button
							variant="outline"
							size="icon"
							className={cn("h-9 w-9", align === "left" && "bg-accent")}
							onClick={() => setImageAlign("left")}
						>
							<IconAlignLeft size={18} />
						</Button>
						<Button
							variant="outline"
							size="icon"
							className={cn("h-9 w-9", align === "center" && "bg-accent")}
							onClick={() => setImageAlign("center")}
						>
							<IconAlignCenter size={18} />
						</Button>
						<Button
							variant="outline"
							size="icon"
							className={cn("h-9 w-9", align === "right" && "bg-accent")}
							onClick={() => setImageAlign("right")}
						>
							<IconAlignRight size={18} />
						</Button>
					</div>
				</PopoverContent>
			</Popover>
		</NodeViewWrapper>
	);
};

export const DemoExtension = ResizableImage.extend({
	addAttributes() {
		return {
			...this.parent?.(),
			align: {
				default: "center",
				parseHTML: (element) => element.getAttribute("data-align") || "center",
				renderHTML: (attributes) => {
					return {
						"data-align": attributes.align,
					};
				},
			},
		};
	},
	addNodeView() {
		return ReactNodeViewRenderer((props) =>
			NodeView(props as unknown as ResizableImageNodeViewRendererProps)
		);
	},
});
