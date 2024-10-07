"use client"

import { ColumnDef } from "@tanstack/react-table"
import {Site} from "@/src/Utility/GlobalTypes"

export const columns: ColumnDef<Site>[] = [
  {
    accessorKey: "siteInfo",
    header: "Status",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "amount",
    header: "Amount",
  },
]
