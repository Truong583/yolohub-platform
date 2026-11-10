import React from "react";

interface MentionContentProps {
  content: string;
  className?: string;
}

export const MentionContent: React.FC<MentionContentProps> = ({
  content,
  className = "",
}) => {
  return (
    <div
      className={`mention-content ${className}`}
      dangerouslySetInnerHTML={{ __html: content }}
    />
  );
};
