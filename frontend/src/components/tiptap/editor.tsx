"use client";

import Code from "@tiptap/extension-code";
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import {Color} from "@tiptap/extension-color";
import FontFamily from "@tiptap/extension-font-family";
import Heading from "@tiptap/extension-heading";
import Highlight from "@tiptap/extension-highlight";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import {Table} from "@tiptap/extension-table";
import TableCell from "@tiptap/extension-table-cell";
import TableHeader from "@tiptap/extension-table-header";
import TableRow from "@tiptap/extension-table-row";
import TaskItem from "@tiptap/extension-task-item";
import TaskList from "@tiptap/extension-task-list";
import TextAlign from "@tiptap/extension-text-align";
import {TextStyle} from "@tiptap/extension-text-style";
import Underline from "@tiptap/extension-underline";
import StarterKit from "@tiptap/starter-kit";

import {FontSize} from "@/extensions/font-size";
import {Mention} from "@/extensions/mention";
import {cn} from "@/lib/utils";
import {useEditorStore} from "@/stores/use-editor-store";
import {EditorContent, Editor as TipTapEditor, useEditor} from "@tiptap/react";
import {common, createLowlight} from "lowlight";
import {DemoExtension} from "./demo";

interface EditorProps {
	content?: string;
	onChange?: (content: string) => void;
	onReady?: (editor: TipTapEditor) => void;
	className?: string;
}

const Editor = ({content = "", onChange, onReady, className}: EditorProps) => {
	const {setEditor} = useEditorStore();
	const lowlight = createLowlight();
	lowlight.register(common);

	const editor = useEditor({
		onCreate: ({editor}) => {
			setEditor(editor);
			onReady?.(editor);
		},
		onDestroy: () => {
			setEditor(null);
		},
		onUpdate: ({editor}) => {
			setEditor(editor);
			// Call onChange with HTML content
			onChange?.(editor.getHTML());
		},
		onSelectionUpdate({editor}) {
			setEditor(editor);
		},
		onTransaction({editor}) {
			setEditor(editor);
		},
		onFocus({editor}) {
			setEditor(editor);
		},
		onBlur({editor}) {
			setEditor(editor);
		},
		onContentError({editor}) {
			setEditor(editor);
		},

		editorProps: {
			attributes: {
				style: "padding-left: 10px; padding-right:10px;",
				class: cn(
					"tiptap focus:outline-none print:border-0 bg-white border border-gray-100 rounded-b-md flex flex-col min-h-10 pt-2.5 pr-14 pb-10 cursor-text",
					className
				),
			},
		},
		extensions: [
			StarterKit,
			FontSize,
			Heading,
			FontFamily,
			Color,
			TextAlign.configure({
				types: ["heading", "paragraph"],
			}),
			Highlight.configure({
				multicolor: true,
			}),
			CodeBlockLowlight.configure({
				lowlight,
				defaultLanguage: "javascript",
			}),
			Link.configure({
				openOnClick: false,
				autolink: true,
				defaultProtocol: "https",
			}),
			Mention,
			TextStyle,
			Code,
			DemoExtension.configure({
				defaultWidth: 200,
				defaultHeight: 200,
			}),
			Image,
			Table,
			TableCell,
			TableHeader,
			TableRow,
			TaskItem.configure({nested: true}),
			TaskList,
			Underline,
		],
		content: content,
		immediatelyRender: false,
	});

	return <EditorContent editor={editor} />;
};

export default Editor;
