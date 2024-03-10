//main page of package
"use client";

import React, { useContext } from "react";
import { useEffect, useState } from "react";
import { AxiosInstance } from "@/app/repositories/config";
import toast from "react-hot-toast";
import Link from "next/link";
import { Context } from "@/app/context/context";

export default function Page() {
  const [refresh, setRefresh] = useState(false);
  const [packageData, setPackageData] = useState([
    {
      heading: "",
      descriptionLong: "",
      expertises: [],
      bgImage: "",
      normalImage: "",
      packageId: "",
      name: "",
    },
  ]);
  const { user }: any = useContext(Context);
  const [loading, setLoading] = useState(false);
  //load faq data
  const loadPackageData = async () => {
    try {
      const { data } = await AxiosInstance.get("/packages");
      console.log(data);
      setRefresh(false);
      setPackageData(data.data);
    } catch (error: any) {
      toast.error(error.message);
    }
  };
  useEffect(() => {
    loadPackageData();
  }, [refresh]);

  useEffect(() => {
    setLoading(false);
  }, [packageData]);
  const handleDelete = async (packageId: string) => {
    try {
      const { data } = await AxiosInstance.delete(`/packages/${packageId}`);
      console.log(data.data);
      setRefresh(true);
    } catch (error: any) {
      console.log(error.message);
    }
  };
  return (
    <>
      {loading ? (
        <>
          <div>Loading</div>
        </>
      ) : (
        <>
          <div className="max-w-screen-xl mx-auto px-4 md:px-8">
            <div className="items-start justify-between md:flex">
              <div className="max-w-lg">
                <h3 className="text-gray-800 text-xl font-bold sm:text-2xl">
                  Packages
                </h3>
              </div>
              <div className="mt-3 md:mt-0">
                <Link
                  href="/admin-dashboard/packages/add"
                  className="inline-block px-4 py-2 text-white duration-150 font-medium bg-indigo-600 rounded-lg hover:bg-indigo-700 active:bg-indigo-700 md:text-sm"
                >
                  Add Packages
                </Link>
              </div>
            </div>
            <div className="mt-12 shadow-sm border rounded-lg overflow-x-auto">
              <table className="w-full table-auto text-sm text-left">
                <thead className="bg-gray-50 text-gray-600 font-medium border-b">
                  <tr>
                    <th className="py-3 px-6">Heading</th>
                    <th className="py-3 px-6">Description</th>
                    <th className="py-3 px-6">Functionality</th>
                    <th className="py-3 px-6">Expertises</th>
                    <th className="py-3 px-6"></th>
                  </tr>
                </thead>
                <tbody className="text-gray-600 divide-y">
                  {packageData &&
                    packageData.length > 0 &&
                    packageData.map((item, idx) => (
                      <tr key={idx}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {item.heading}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {item.descriptionLong.slice(0, 15) + "..."}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {item.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex flex-row gap-[0.5rem]">
                            {item.expertises?.map((i, l) => (
                              <li key={l}>{i}</li>
                            ))}
                          </div>
                        </td>
                        <td className="text-right px-6 whitespace-nowrap">
                          <Link
                            href={`/admin-dashboard/packages/view/${item.packageId}`}
                            className="py-2 px-3 font-medium text-indigo-600 hover:text-indigo-500 duration-150 hover:bg-gray-50 rounded-lg"
                          >
                            View
                          </Link>
                          {user && user.role=="super-admin" && ( <Link
                            href={`/admin-dashboard/packages/edit/${item.packageId}`}
                            className="py-2 px-3 font-medium text-yellow-600 hover:text-yellow-500 duration-150 hover:bg-gray-50 rounded-lg"
                          >
                            Edit
                          </Link>)}
                         
                          {user && user.role=="super-admin" && (
                            <>
                              <button
                                className="py-2 leading-none px-3 font-medium text-red-600 hover:text-red-500 duration-150 hover:bg-gray-50 rounded-lg"
                                onClick={() => handleDelete(item.packageId)}
                              >
                                Delete
                              </button>
                            </>
                          )}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </>
  );
}