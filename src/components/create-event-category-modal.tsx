"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { PropsWithChildren, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { CATEGORY_NAME_VALIDATOR } from "@/lib/validators/category-validator";
import { Modal } from "./ui/modal";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { cn } from "@/utils";
import { Button } from "./ui/button";
import { client } from "@/app/lib/client";

const EVENT_CATEGORY_VALIDATOR = z.object({
    name: CATEGORY_NAME_VALIDATOR,
    color: z
      .string()
      .min(1, "Color is required")
      .regex(/^#[0-9A-F]{6}$/i, "Invalid color format."),
    emoji: z.string().emoji("Invalid emoji").optional(),
    websiteId: z.string()
});

type EventCategoryForm = z.infer<typeof EVENT_CATEGORY_VALIDATOR>;

const COLOR_OPTIONS = [
  "#FF6B6B", "#4ECDC4", "#45B7D1", "#FFA07A", "#98D8C8",
  "#FDCB6E", "#6C5CE7", "#FF85A2", "#2ECC71", "#E17055",
];

const EMOJI_OPTIONS = [
  { emoji: "💰", label: "Money (Sale)" },
  { emoji: "👤", label: "User (Sign-up)" },
  { emoji: "🎉", label: "Celebration" },
  { emoji: "📅", label: "Calendar" },
  { emoji: "🚀", label: "Launch" },
  { emoji: "📢", label: "Announcement" },
  { emoji: "🎓", label: "Graduation" },
  { emoji: "🏆", label: "Achievement" },
  { emoji: "💡", label: "Idea" },
  { emoji: "🔔", label: "Notification" },
];

interface CreateEventCategoryModel extends PropsWithChildren {
  containerClassName?: string;
  id: string;
}

export const CreateEventCategoryModal = ({ children, containerClassName, id }: CreateEventCategoryModel) => {
  const [isOpen, setIsOpen] = useState(false);
  const queryClient = useQueryClient();
    const [errorMessage, setErrorMessage] = useState<string | null>(null); // 💡 hold custom error
  

  const { mutateAsync, isPending: isCreating } = useMutation({
    mutationFn: async (data: EventCategoryForm) => {
      const res = await client.category.createEventCategory.$post(data);

       // Handle custom status code from backend (e.g., 403)
      if (res.status === 403) {
        const body = await res.json();
        throw new Error(body.error || "Category limit reached.");
      }

      await fetch('https://pingpanda-mbc8.onrender.com/api/events', {
        method: 'POST',
        headers: {
          'Authorization': `${process.env.API_KEY}`
        },
        body: JSON.stringify({
          category: 'category',
          fields: {
            field1: 'category creation', 
            field2: 'testing' 
          }
        })
      })

      return res;
    },
    onSuccess: () => {
      // include websiteId in key for granular refetch
      queryClient.invalidateQueries({ queryKey: ["user-event-categories", id] });
      // Reset the form to its default values
    reset({ name: "", color: "", emoji: undefined, websiteId: id });
      setErrorMessage(null); // clear any previous error
      setIsOpen(false);
    },

    onError: (error) => {
      if (error instanceof Error) {
        setErrorMessage("Category limit reached. Please upgrade your plan to add more categories");
      } else {
        setErrorMessage("Something went wrong.");
      }
    },
  });

  const { register, handleSubmit, watch, setValue, reset, formState: { errors } } = useForm<EventCategoryForm>({
    resolver: zodResolver(EVENT_CATEGORY_VALIDATOR),
    defaultValues: { websiteId: id },
  });

  const color = watch("color");
  const selectedEmoji = watch("emoji");

  const onSubmit = async (data: EventCategoryForm) => {
      setErrorMessage(null); // clear any previous error
    console.log("saving...");
    await mutateAsync(data);
    console.log("saved");
  };

  return (
    <>
      <div className={`${containerClassName} w-fit`}
      
      onClick={() =>{
      // Reset the form to its default values
      reset({ name: "", color: "", emoji: undefined, websiteId: id });
      setErrorMessage(null);
      setIsOpen(true)}}>
        {children}
      </div>

      <Modal className="max-w-xl p-8" showModal={isOpen} setShowModal={setIsOpen}>
        <form onSubmit={handleSubmit(onSubmit)}>
          {/* Hidden input for websiteId */}
          <input type="hidden" {...register("websiteId")} />

          <div>
            <h2 className="font-medium text-lg/7 tracking-tight text-gray-950">
              New Event Category
            </h2>
            <p className="text-sm/6 text-gray-600">
              Create a new category to organise your events.
            </p>
          </div>

          <div className="space-y-5">
            {/* Name Field */}
            <div>
              <Label htmlFor="name">Name</Label>
              <Input
                autoFocus
                id="name"
                {...register("name")}
                placeholder="e.g. user-signup"
                className="w-full"
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.name.message}
                </p>
              )}
              {errorMessage && (
                <p className="mt-1 text-sm text-red-500">
                  {errorMessage}
                </p>
              )}
            </div>

            {/* Color Picker */}
            <div>
              <Label>Color</Label>
              <div className="flex pt-3 flex-wrap gap-3">
                {COLOR_OPTIONS.map((bg) => (
                  <button
                    key={bg}
                    type="button"
                    style={{ backgroundColor: bg }}
                    className={cn(
                      "size-10 rounded-full ring-2 ring-offset-2 transition-all",
                      color === bg
                        ? "ring-brand-700 scale-110"
                        : "ring-transparent hover:scale-105"
                    )}
                    onClick={() => setValue("color", bg)}
                  />
                ))}
              </div>
              {errors.color && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.color.message}
                </p>
              )}
            </div>

            {/* Emoji Picker */}
            <div>
              <Label>Emoji</Label>
              <div className="flex flex-wrap py-3 gap-3">
                {EMOJI_OPTIONS.map(({ emoji }) => (
                  <button
                    key={emoji}
                    type="button"
                    className={cn(
                      "size-10 flex items-center justify-center text-xl rounded-md transition-all",
                      selectedEmoji === emoji
                        ? "bg-brand-100 ring-2 ring-brand-700 scale-110"
                        : "bg-brand-100 hover:bg-brand-200"
                    )}
                    onClick={() => setValue("emoji", emoji)}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
              {errors.emoji && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.emoji.message}
                </p>
              )}
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsOpen(false)}
            >
              Cancel
            </Button>
            <Button disabled={isCreating} type="submit">
              {isCreating ? "Creating..." : "Create Category"}
            </Button>
          </div>
        </form>
      </Modal>
    </>
  );
};
