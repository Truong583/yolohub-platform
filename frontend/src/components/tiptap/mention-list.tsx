import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useState,
} from "react";

interface MentionListProps {
  items: Array<{ id: string; name: string }>;
  command: (item: { id: string; label: string }) => void;
}

export interface MentionListRef {
  onKeyDown: ({ event }: { event: KeyboardEvent }) => boolean;
}

const MentionList = forwardRef<MentionListRef, MentionListProps>(
  (props, ref) => {
    const [selectedIndex, setSelectedIndex] = useState(0);

    const selectItem = (index: number) => {
      const item = props.items[index];

      if (item) {
        console.log("Selecting mention item:", item);
        props.command({ id: item.id, label: item.name });
      }
    };

    const handleItemClick = (index: number, event: React.MouseEvent) => {
      console.log("Button clicked!", index, props.items[index]);
      event.preventDefault();
      event.stopPropagation();
      selectItem(index);
    };

    const handleItemMouseDown = (index: number, event: React.MouseEvent) => {
      console.log("Button mouse down!", index, props.items[index]);
      event.preventDefault();
      event.stopPropagation();
      selectItem(index);
    };

    const handleItemMouseEnter = (index: number) => {
      console.log("Button mouse enter!", index);
      setSelectedIndex(index);
    };

    const upHandler = () => {
      setSelectedIndex(
        (selectedIndex + props.items.length - 1) % props.items.length
      );
    };

    const downHandler = () => {
      setSelectedIndex((selectedIndex + 1) % props.items.length);
    };

    const enterHandler = () => {
      selectItem(selectedIndex);
    };

    useEffect(() => setSelectedIndex(0), [props.items]);

    useImperativeHandle(ref, () => ({
      onKeyDown: ({ event }) => {
        if (event.key === "ArrowUp") {
          upHandler();
          return true;
        }

        if (event.key === "ArrowDown") {
          downHandler();
          return true;
        }

        if (event.key === "Enter") {
          enterHandler();
          return true;
        }

        return false;
      },
    }));

    return (
      <div
        className="bg-white border border-gray-200 rounded-lg shadow-lg p-1 max-h-48 overflow-y-auto z-[9999] relative"
        style={{ pointerEvents: "auto" }}
      >
        {props.items.length ? (
          props.items.map((item, index) => (
            <button
              className={`w-full text-left px-3 py-2 text-sm rounded hover:bg-gray-100 cursor-pointer transition-colors ${
                index === selectedIndex
                  ? "bg-blue-50 text-blue-600"
                  : "text-gray-900"
              }`}
              key={index}
              onClick={(event) => handleItemClick(index, event)}
              onMouseDown={(event) => handleItemMouseDown(index, event)}
              onMouseEnter={() => handleItemMouseEnter(index)}
              type="button"
              style={{ pointerEvents: "auto" }}
            >
              @{item.name}
            </button>
          ))
        ) : (
          <div className="px-3 py-2 text-sm text-gray-500">
            Không tìm thấy người dùng
          </div>
        )}
      </div>
    );
  }
);

MentionList.displayName = "MentionList";

export default MentionList;
