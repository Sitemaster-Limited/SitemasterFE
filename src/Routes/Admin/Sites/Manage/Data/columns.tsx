"use client"

import React from "react";
import { ColumnDef } from "@tanstack/react-table"
import { Attendance } from "@/src/Utility/GlobalTypes";
import { ArrowUpDown } from "lucide-react"
import { Button } from "../../../../../Components/ui/button";

export const createColumns = (
  setLocation: (value: (((prevState: { latitude: number; longitude: number }) => {
    latitude: number;
    longitude: number
  }) | { latitude: number; longitude: number })) => void,
  isModalOpen: (state: boolean) => void
): ColumnDef<Attendance>[] => {

  return [
    {
      accessorKey: "firstName",
      header: () => <div className="text-left">First Name</div>,
      cell: ({ row }) => {
        return <div className="text-left font-medium">{row.getValue("firstName")}</div>
      },
    },
    {
      accessorKey: "lastName",
      header: () => <div className="text-left">Last Name</div>,
      cell: ({ row }) => {
        return <div className="text-left font-medium">{row.getValue("lastName")}</div>
      },
    },
    {
      accessorKey: "phoneNumber",
      header: () => <div className="text-left">Phone Number</div>,
      cell: ({ row }) => {
        return <div className="text-left font-medium">{row.getValue("phoneNumber")}</div>
      },
    },
    {
      accessorKey: "type",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Action
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => {
        return <div className="text-left font-medium">{row.getValue("type")}</div>
      },
    },
    {
      accessorKey: "time",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Date & Time
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => {
        return <div className="text-left font-medium">{row.getValue("time")}</div>
      },
    },
    {
      id: "location",
      header: () => <div className="text-left">Location</div>,
      cell: ({ row }) => {

        return (
          <button
            onClick={() => {
              setLocation({
                longitude: Number(row.original.longitude),
                latitude: Number(row.original.latitude)
              })
              isModalOpen(true);
            }}
            className="bg-blue-500 text-white py-1 px-3 rounded"
          >
            Show Location
          </button>
        )
      },
    },
  ];
};
