"use client"

import { ColumnDef } from "@tanstack/react-table"
import { MoreHorizontal } from "lucide-react"
import { Site, siteInfo } from "@/src/Utility/GlobalTypes"

import { Button } from "../../../../Components/ui/button"
import { ArrowUpDown } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../../../Components/ui/dropdown-menu"

export const createColumns = (
  sites: Site[],
  navigate: (to: string, options?: object) => void,
): ColumnDef<siteInfo>[] => {

  return [
    {
      accessorKey: "siteName",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Site
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => {
        return <div className="text-left font-medium">{row.getValue("siteName")}</div>
      },
    },
    {
      accessorKey: "dateCreated",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Date Created
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => {
        return <div className="text-left font-medium">{row.getValue("dateCreated")}</div>
      },
    },
    {
      accessorKey: "siteStatus",
      header: () => <div className="text-left">Status</div>,
      cell: ({ row }) => {
        return <div className="text-left font-medium">{row.getValue("siteStatus")}</div>
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const site = sites.find((site: Site) => site.siteInfo.siteId === row.original.siteId);

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => navigate('edit', {state: {site}})}>
                Edit site
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => navigate('attendance', {state: {site}})}>
                Site attendance
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate('progress', {state: {site}})}>
                Site progress reports
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )
      },
    },
  ];
};
