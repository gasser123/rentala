"use client";

import { ApplicationFormData, applicationSchema } from "@/lib/schemas";
import { useGetAuthUserQuery } from "@/state/api";
import { useCreateApplicationMutation } from "@/state/applications-api";
import { useForm } from "react-hook-form";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Form } from "../ui/form";
import { CustomFormField } from "../FormField";
import { Button } from "../ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
const ApplicationModal = ({
  isOpen,
  onClose,
  propertyId,
}: ApplicationModalProps) => {
  const [createApplication, { isLoading: createApplicationLoading }] =
    useCreateApplicationMutation();
  const { data: authUser } = useGetAuthUserQuery();
  const form = useForm<ApplicationFormData>({
    resolver: zodResolver(applicationSchema),
    defaultValues: {
      name: "",
      email: "",
      message: "",
      phoneNumber: "",
    },
  });

  const onSubmit = async (data: ApplicationFormData) => {
    if (!authUser || authUser.userRole !== "tenant") {
      return;
    }
    await createApplication({
      ...data,
      message: data.message?.trim() === "" ? undefined : data.message,
      applicationDate: new Date().toISOString(),
      status: "Pending",
      propertyId,
    });
    onClose();
  };
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-white">
        <DialogHeader className="mb-4">
          <DialogTitle>Submit Application for this Property</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            <CustomFormField
              name="name"
              label="Name"
              type="text"
              placeholder="Enter your full name"
            />
            <CustomFormField
              name="email"
              label="Email"
              type="email"
              placeholder="Enter your email address"
            />
            <CustomFormField
              name="phoneNumber"
              label="Phone Number"
              type="text"
              placeholder="Enter your phone number"
            />
            <CustomFormField
              name="message"
              label="Message (Optional)"
              type="textarea"
              placeholder="Enter any additional information"
            />
            <Button
              type="submit"
              className="bg-gray-700 text-white w-full cursor-pointer"
              disabled={createApplicationLoading}
            >
              {createApplicationLoading
                ? "Submitting..."
                : "Submit Application"}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default ApplicationModal;
