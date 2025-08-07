"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { PropsWithChildren, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Modal } from "./ui/modal";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { client } from "@/app/lib/client";
import { WEBSITE_VALIDATOR } from "@/lib/validators/website-validator";

const WEBSITE_NAME_VALIDATOR = z.object({
  domain: WEBSITE_VALIDATOR,
});

type WebsiteForm = z.infer<typeof WEBSITE_NAME_VALIDATOR>;

interface CreateWebsiteModel extends PropsWithChildren {
  containerClassName?: string;
}

export const CreateWebsiteModal = ({
  children,
  containerClassName,
}: CreateWebsiteModel) => {
  const [isOpen, setIsOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null); // 💡 hold custom error
  const queryClient = useQueryClient();

  const { mutate: addWebsite, isPending } = useMutation({
    mutationFn: async (data: WebsiteForm) => {
      const res = await client.website.addWebsite.$post(data);

      // Handle custom status code from backend (e.g., 403)
      if (res.status === 403) {
        const body = await res.json();
        throw new Error(body.error || "Website limit reached.");
      }

      return res;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-websites"] });
      reset({ domain: "" });
      setIsOpen(false);
      setErrorMessage(null); // clear any previous error
    },
    onError: (error) => {
      if (error instanceof Error) {
        setErrorMessage("Website limit reached. Please upgrade your plan to add more websites");
      } else {
        setErrorMessage("Something went wrong.");
      }
    },
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<WebsiteForm>({
    resolver: zodResolver(WEBSITE_NAME_VALIDATOR),
  });

  const onSubmit = (data: WebsiteForm) => {
    setErrorMessage(null); // clear before retrying
    addWebsite(data);
  };

  return (
    <>
      <div
        className={`${containerClassName} w-fit`}
        onClick={() => {setErrorMessage(null);
            reset({ domain: "" });
            setIsOpen(true)}}
      >
        {children}
      </div>

      <Modal className="max-w-xl p-8" showModal={isOpen} setShowModal={setIsOpen}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div>
            <h2 className="font-medium text-lg/7 tracking tight text-gray-950">
              New Website
            </h2>
            <p className="text-sm/6 text-gray-600">
              Add a new Website to start managing its events.
            </p>
          </div>

          <div className="space-y-5">
            <div>
              <Label htmlFor="domain">Domain Name</Label>
              <Input
                autoFocus
                id="domain"
                {...register("domain")}
                placeholder="e.g. google.com"
                className="w-full"
              />
              {errors.domain && (
                <p className="mt-1 text-sm text-red-500">{errors.domain.message}</p>
              )}
            </div>

            {errorMessage && (
              <p className="mt-2 text-sm text-red-500">{errorMessage}</p>
            )}
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                reset({ domain: "" });
                setIsOpen(false);
                setErrorMessage(null);
              }}
            >
              Cancel
            </Button>
            <Button disabled={isPending} type="submit">
              {isPending ? "Adding..." : "Add Website"}
            </Button>
          </div>
        </form>
      </Modal>
    </>
  );
};
