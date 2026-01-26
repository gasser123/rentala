"use client";

import ApplicationCard from "@/components/applications/ApplicationCard";
import Header from "@/components/Header";
import Loading from "@/components/Loading";
import { useGetAuthUserQuery } from "@/state/api";
import { useGetApplicationsQuery } from "@/state/applications-api";
import { CircleCheckBig, Clock, Download, XCircle } from "lucide-react";

const ApplicationsPage = () => {
  const { data: authUser } = useGetAuthUserQuery();

  const {
    data: applications,
    isLoading: applicationsLoading,
    isError: applicationsError,
  } = useGetApplicationsQuery(
    {
      userId: authUser?.cognitoInfo.userId,
      userType: authUser?.userRole,
    },
    { skip: !authUser },
  );

  if (applicationsLoading) {
    return <Loading />;
  }

  if (applicationsError) {
    return <div>Error fetching applications.</div>;
  }

  return (
    <div className="pt-8 pb-5 px-8 w-full">
      <Header title="Applications" subtitle="Track your applications" />
      <div className="w-full">
        {applications?.length === 0 ? (
          <p className="text-center">No applications submitted yet.</p>
        ) : (
          applications?.map((application) => (
            <ApplicationCard
              key={application.id}
              application={application}
              userType="renter"
            >
              <div className="flex justify-between gap-5 w-full pb-4 px-4">
                {application.status === "Approved" ? (
                  <div className="bg-green-100 p-4 text-green-700 grow flex items-center">
                    <CircleCheckBig className="w-5 h-5 mr-2" />
                    The property is being rented by you until{" "}
                    {new Date(application.lease?.endDate).toLocaleDateString()}
                  </div>
                ) : application.status === "Pending" ? (
                  <div className="bg-yellow-100 p-4 text-yellow-700 grow flex items-center">
                    <Clock className="w-5 h-5 mr-2" />
                    Your application is pending approval
                  </div>
                ) : (
                  <div className="bg-red-100 p-4 text-red-700 grow flex items-center">
                    <XCircle className="w-5 h-5 mr-2" />
                    Your application has been denied
                  </div>
                )}

                <button
                  className={`bg-white border border-gray-300 text-gray-700 py-2 px-4
                          rounded-md flex items-center justify-center hover:bg-gray-700 hover:text-gray-50`}
                >
                  <Download className="w-5 h-5 mr-2" />
                  Download Agreement
                </button>
              </div>
            </ApplicationCard>
          ))
        )}
      </div>
    </div>
  );
};

export default ApplicationsPage;
