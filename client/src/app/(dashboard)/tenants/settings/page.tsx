"use client";
import SettingsForm from "@/components/SettingsForm";
import { useGetAuthUserQuery } from "@/state/api";
import { useUpdateTenantSettingsMutation } from "@/state/tenants-api";
import { Loader } from "@aws-amplify/ui-react";

const SettingsPage = () => {
  const { data: authUser, isLoading } = useGetAuthUserQuery();
  const initialData = {
    name: authUser?.userInfo.name,
    email: authUser?.userInfo.email,
    phoneNumber: authUser?.userInfo.phoneNumber,
  };
  const [updateTenant, { isLoading: submitLoading }] =
    useUpdateTenantSettingsMutation();
  const handleSubmit = async (data: typeof initialData) => {
    await updateTenant({
      cognitoId: authUser?.cognitoInfo.userId,
      ...data,
    });
  };
  if (isLoading) {
    return (
      <div className="flex justify-center items-center w-full h-full">
        <Loader className="w-14! h-14!" />
      </div>
    );
  }
  return (
    <SettingsForm
      initialData={initialData}
      userType="tenant"
      onSubmit={handleSubmit}
      submitLoading={submitLoading}
    />
  );
};

export default SettingsPage;
