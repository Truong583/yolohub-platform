import { Mention as TipTapMention } from "@tiptap/extension-mention";
import { ReactNodeViewRenderer } from "@tiptap/react";
import { MentionNodeView } from "@/components/tiptap/mention-node-view";
import { suggestion } from "@/components/tiptap/mention-suggestion";

export const Mention = TipTapMention.configure({
  HTMLAttributes: {
    class: "mention",
  },
  suggestion,
}).extend({
  addNodeView() {
    return ReactNodeViewRenderer(MentionNodeView);
  },

  parseHTML() {
    return [
      {
        tag: 'span[data-type="mention"]',
      },
    ];
  },

  renderHTML({ node, HTMLAttributes }) {
    return [
      "span",
      {
        ...HTMLAttributes,
        "data-type": "mention",
        "data-id": node.attrs.id,
        "data-label": node.attrs.label,
        class: "mention",
      },
      `@${node.attrs.label ?? node.attrs.id}`,
    ];
  },
});
