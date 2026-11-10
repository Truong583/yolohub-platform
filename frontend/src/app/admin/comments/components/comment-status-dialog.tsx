"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useUpdateCommentStatus } from "@/hooks/use-comments";
import { MdEdit } from "react-icons/md";
import { toast } from "sonner";
import {
  IComment,
  CommentStatus,
  UpdateCommentStatusRequest,
} from "@/types/comment";
import { formatDistanceToNow } from "date-fns";

// Validation schema for status update only
const commentValidationSchema = yup.object().shape({
  status: yup
    .mixed<CommentStatus>()
    .oneOf(Object.values(CommentStatus), "Please select a valid status")
    .required("Status is required"),
});

type CommentFormData = yup.InferType<typeof commentValidationSchema>;

interface CommentStatusDialogProps {
  comment: IComment;
  onSuccess?: (comment: IComment) => void;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

const CommentStatusDialog = ({
  comment,
  onSuccess,
  open = false,
  onOpenChange,
}: CommentStatusDialogProps) => {
  // API hooks
  const updateCommentMutation = useUpdateCommentStatus();
  const isLoading = updateCommentMutation.isPending;

  // Initialize form
  const form = useForm<CommentFormData>({
    resolver: yupResolver(commentValidationSchema),
    mode: "onChange",
    defaultValues: {
      status: comment.status,
    },
  });

  // Reset form when dialog opens/closes or comment changes
  React.useEffect(() => {
    if (open && comment) {
      form.reset({
        status: comment.status,
      });
    }
  }, [open, comment, form]);

  const onSubmit = async (data: CommentFormData) => {
    try {
      const updateData: UpdateCommentStatusRequest = {
        id: comment._id,
        status: data.status,
      };

      const result = await updateCommentMutation.mutateAsync(updateData);
      toast.success("Comment status updated successfully");

      onOpenChange?.(false);
      form.reset();
      onSuccess?.(result);
    } catch (error: unknown) {
      // Handle API errors
      const errorMessage =
        error instanceof Error
          ? error.message
          : (error as { response?: { data?: { message?: string } } })?.response
              ?.data?.message || "Unknown error";
      toast.error(`Failed to update comment: ${errorMessage}`);
    }
  };

  // Truncate content but keep HTML for display
  const truncatedContent =
    comment.content.length > 200
      ? comment.content.substring(0, 200) + "..."
      : comment.content;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MdEdit className="h-5 w-5" />
            Update Comment Status
          </DialogTitle>
          <DialogDescription>
            Update the moderation status of this comment.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* Comment Information Display */}
            <div className="space-y-3 p-4 bg-muted/50 rounded-lg">
              <div className="text-sm">
                <span className="font-medium">Author:</span>{" "}
                {comment.user?.username || "Unknown User"}
              </div>
              <div className="text-sm">
                <span className="font-medium">Email:</span>{" "}
                {comment.user?.email || "Unknown Email"}
              </div>
              <div className="text-sm">
                <span className="font-medium">Created:</span>{" "}
                {formatDistanceToNow(new Date(comment.createdAt), {
                  addSuffix: true,
                })}
              </div>
              <div className="text-sm">
                <span className="font-medium">Level:</span>{" "}
                {comment.level === 0
                  ? "Main Comment"
                  : `Reply Level ${comment.level}`}
              </div>
              <div className="text-sm">
                <span className="font-medium">Content:</span>
                <div
                  className="mt-1 p-2 bg-background rounded border text-sm leading-relaxed"
                  dangerouslySetInnerHTML={{
                    __html: truncatedContent,
                  }}
                />
              </div>
              <div className="text-sm">
                <span className="font-medium">Current Status:</span>{" "}
                <span
                  className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                    comment.status === CommentStatus.APPROVED
                      ? "bg-green-100 text-green-800"
                      : comment.status === CommentStatus.PENDING
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {comment.status}
                </span>
              </div>
            </div>

            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Update Status *</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className="w-full" disabled={isLoading}>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value={CommentStatus.PENDING}>
                        Pending
                      </SelectItem>
                      <SelectItem value={CommentStatus.APPROVED}>
                        Approved
                      </SelectItem>
                      <SelectItem value={CommentStatus.REJECTED}>
                        Rejected
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange?.(false)}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Updating..." : "Update Status"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CommentStatusDialog;
