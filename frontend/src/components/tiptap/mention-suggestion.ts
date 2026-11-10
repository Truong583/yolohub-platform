import { ReactRenderer } from "@tiptap/react";
import tippy, { Instance } from "tippy.js";
import MentionList from "./mention-list";
import type { MentionListRef } from "./mention-list";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type SuggestionProps = any;

export const suggestion = {
  items: ({ query }: { query: string }) => {
    // Mock users data - in real app, this would come from API
    const users = [
      { id: "user1", name: "Phạm Hồng Diêm My" },
      { id: "user2", name: "Huy Lê Tấn" },
      { id: "user3", name: "Nguyễn Văn A" },
      { id: "user4", name: "Trần Thị B" },
      { id: "user5", name: "Lê Văn C" },
    ];

    return users
      .filter((item) => item.name.toLowerCase().startsWith(query.toLowerCase()))
      .slice(0, 5);
  },

  render: () => {
    let component: ReactRenderer<MentionListRef>;
    let popup: Instance[];

    return {
      onStart: (props: SuggestionProps) => {
        component = new ReactRenderer(MentionList, {
          props,
          editor: props.editor,
        });

        if (!props.clientRect) {
          return;
        }

        popup = tippy("body", {
          getReferenceClientRect: () =>
            props.clientRect() || document.body.getBoundingClientRect(),
          appendTo: () => document.body,
          content: component.element,
          showOnCreate: true,
          interactive: true,
          trigger: "manual",
          placement: "bottom-start",
          hideOnClick: false,
          allowHTML: true,
          zIndex: 9999,
          theme: "mention",
          interactiveBorder: 10,
          moveTransition: "",
        });
      },

      onUpdate(props: SuggestionProps) {
        component.updateProps(props);

        if (!props.clientRect) {
          return;
        }

        popup[0].setProps({
          getReferenceClientRect: () =>
            props.clientRect() || document.body.getBoundingClientRect(),
        });
      },

      onKeyDown(props: SuggestionProps) {
        if (props.event?.key === "Escape") {
          popup[0].hide();
          return true;
        }

        return component.ref?.onKeyDown?.(props) || false;
      },

      onExit() {
        popup?.[0]?.destroy();
        component?.destroy();
      },
    };
  },
};
