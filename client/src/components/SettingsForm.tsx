"use client";
import { SettingsFormData, settingsSchema } from "@/lib/schemas";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "./ui/form";
import { CustomFormField } from "./FormField";
import { Button } from "./ui/button";
import { Loader } from "@aws-amplify/ui-react";

const SettingsForm = ({
  initialData,
  onSubmit,
  userType,
  submitLoading,
}: SettingsFormProps & { submitLoading: boolean }) => {
  const [editMode, setEditMode] = useState<boolean>(false);
  const form = useForm<SettingsFormData>({
    resolver: zodResolver(settingsSchema),
    defaultValues: initialData,
  });

  const toggleEditMode = () => {
    setEditMode((current) => !current);
    if (editMode) {
      form.reset(initialData);
    }
  };

  const handleSubmit = async (data: SettingsFormData) => {
    await onSubmit(data);
    setEditMode(false);
  };
  return (
    <div className="pt-8 pb-5 px-8 w-3/4">
      <div className="mb-5">
        <h1 className="text-xl font-semibold ">{`${
          userType.charAt(0).toUpperCase() + userType.slice(1)
        } Settings`}</h1>
        <p className="text-sm text-gray-500 mt-1">
          Manage your account preferences and personal information
        </p>
      </div>
      <div className="bg-white rounded-xl p-6 w-full">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-6 w-full"
          >
            <CustomFormField name="name" label="Name" disabled={!editMode} />
            <CustomFormField
              name="email"
              label="Email"
              type="email"
              disabled={!editMode}
            />
            <CustomFormField
              name="phoneNumber"
              label="Phone Number"
              disabled={!editMode}
            />
            <div className="pt-4 flex justify-between ">
              <Button
                type="button"
                onClick={toggleEditMode}
                className="bg-red-500 text-white hover:bg-red-400 cursor-pointer"
              >
                {editMode ? "Cancel" : "Edit"}
              </Button>
              {editMode && (
                <Button
                  type="submit"
                  className="bg-gray-950 text-white hover:bg-gray-800 cursor-pointer"
                  disabled={submitLoading}
                >
                  {submitLoading ? <Loader size="large" /> : "Save Changes"}
                </Button>
              )}
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default SettingsForm;
