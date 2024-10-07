import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFormContext } from "../../../Context/LocalObjectForm";
import { DataTable } from "./Data/data-table";
import { createColumns } from "./Data/columns";
import {Site} from "@/src/Utility/GlobalTypes"

const Sites = () => {

  const {formData} = useFormContext();
  const navigate = useNavigate();
  const siteData = formData.sites?.map((site: Site) => site.siteInfo) || [];
  const columns = useMemo(() => createColumns(formData.sites ?? [], navigate), [formData]);

  return (
    <div className="flex flex-col bg-custom-bg h-screen p-2">

      <div className="h-[6%] rounded-[5px] mb-3">
        <h1 className="text-left text-[34px]">
          My Sites
        </h1>
      </div>
      <DataTable columns={columns} data={siteData} />
    </div>

  );
};

export default Sites;