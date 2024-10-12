import React, {useEffect, useState} from 'react';
import {useForm, useFieldArray} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';
import {useNavigate} from 'react-router-dom';
import {Trash2} from 'lucide-react';
import { Badge } from "./ui/badge"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from './ui/form';
import {Button} from './ui/button';
import {Input} from './ui/input';
import {Textarea} from './ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from "./ui/accordion";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle
} from "./ui/dialog";
import {
  ProgressReport,
  ProgressReportSchema,
} from '../Utility/GlobalTypes';
import PostProgress from '../Services/PostProgress';
import PutProgress from '../Services/PutProgress';
import GetReportImages from "../Services/GetReportImages";
import {useFormContext} from "../Context/LocalObjectForm";
import GetClient from "../Services/GetClient";
import Spinner from "./ui/spinner";
import { toast } from "sonner"
import jsPDF from "jspdf";
import autoTable, {Color} from "jspdf-autotable";
import html2canvas from "html2canvas";


interface ProgressReportProps {
  siteId: string;
  clientId: string;
  redirectUrl: string;
  page: string;
  report?: ProgressReport;
}

const ProgressReportForm = ({
                              siteId,
                              clientId,
                              redirectUrl,
                              page,
                              report,
                            }: ProgressReportProps) => {
  const navigate = useNavigate();
  const {formData, updateFormData} = useFormContext();
  const form = useForm<ProgressReport>({
    resolver: zodResolver(ProgressReportSchema),
    mode: 'onBlur',
    defaultValues: {},
  });

  const {control, handleSubmit, reset} = form;

  // Field arrays for dynamic form sections
  const {
    fields: taskFields,
    append: appendTask,
    remove: removeTask,
    replace: replaceTasks,
  } = useFieldArray({
    control,
    name: 'tasks',
  });

  const {
    fields: issueFields,
    append: appendIssue,
    remove: removeIssue,
    replace: replaceIssues,
  } = useFieldArray({
    control,
    name: 'issues',
  });

  const {
    fields: summaryFields,
    append: appendSummary,
    remove: removeSummary,
    replace: replaceSummary,
  } = useFieldArray({
    control,
    name: 'summary',
  });

  const [images, setImages] = useState<(string | File)[]>([]);

  // Fetch existing images when report prop changes
  useEffect(() => {
    const fetchImages = async () => {
      if (report) {
        // Reset the form values with the report object when it changes
        reset({
          projectName: report.projectName,
          projectManager: report.projectManager,
          compiledBy: report.compiledBy,
          reportingPeriod: report.reportingPeriod,
          projectDueDate: report.projectDueDate,
          dateSubmitted: report.dateSubmitted,
          summary: report.summary || [],
          reportImages: report.reportImages || [],
          tasks: report.tasks || [],
          issues: report.issues || [],
        });

        // Replace field arrays with report data
        replaceTasks(report.tasks || []);
        replaceIssues(report.issues || []);
        replaceSummary(report.summary || []);

        // Fetch existing images
        try {
          const images = await GetReportImages(report.reportImages ?? []);
          setImages(images.preSignedUrls);
        } catch (error) {

        }
      } else {
        // If no report is provided, reset the form and field arrays
        reset({});
        replaceTasks([]);
        replaceIssues([]);
        replaceSummary([]);
        setImages([]);
      }
    };

    fetchImages();
  }, [
    report,
    reset,
    replaceTasks,
    replaceIssues,
    replaceSummary,
    clientId,
    siteId,
  ]);

  // Handle new file uploads
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newFiles = Array.from(files); // Convert file list to array
      setImages((prevImages) => [...prevImages, ...newFiles]); // Append new files to images array
    }
  };

// Handle image removal
  const handleRemoveFile = (actualIndex: number) => {
    setImages((prevImages) => prevImages.filter((_, i) => i !== actualIndex));
  };

// Form submission handler
  const onSubmit = async (data: ProgressReport) => {
    // Separate new files and existing image URLs
    const newFiles = images.filter((img) => img instanceof File) as File[];
    const existingUrls = images.filter((img) => typeof img === 'string') as string[];

    const modifiedData = {
      ...data,
      images: existingUrls, // Keep only the existing image URLs
    };

    const currentDate = new Date();
    const formattedDate = currentDate.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

    const formattedTime = currentDate.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: 'numeric',
      hour12: true,
    });

    try {
      // Check if report exists for updating or adding
      if (report && report.reportId) {
        // update report
        await PutProgress(clientId, siteId, report.reportId, page, newFiles, modifiedData);
      } else {
        // add report
        await PostProgress(clientId, siteId, page, newFiles, modifiedData);
      }

      // If you're on the "Admin" page, fetch client data and navigate to a new URL
      if (page === "Admin") {
        const client = await GetClient(clientId);
        updateFormData({ ...formData, sites: client?.sites });
        const site = client?.sites?.find((site) => site.siteInfo.siteId === siteId);
        navigate(redirectUrl, { state: { site } });
      }

      // If successful, show the success toast
      toast("Report saved successfully", {
        description: `${formattedDate} at ${formattedTime}`,
      });
    } catch (error) {
      // Optionally, handle the error and show an error toast
      console.error("Failed to submit the form:", error);
      toast.error("Failed to save the Report", {
        description: `${formattedDate} at ${formattedTime}`,
      });
    }
  };

  const downloadPDF = async () => {
    const doc = new jsPDF();

    // Capture form data
    const projectName = form.getValues("projectName");
    const projectManager = form.getValues("projectManager");
    const compiledBy = form.getValues("compiledBy");
    const reportingPeriod = form.getValues("reportingPeriod");
    const projectDueDate = form.getValues("projectDueDate");
    const dateSubmitted = form.getValues("dateSubmitted");

    // Title
    doc.setFontSize(16);
    doc.text("Progress Report", 105, 15, { align: "center" });

    // General Information Table
    const tableData = [
      [
        { content: "Project Name:", styles: { fillColor: [211, 211, 211] as Color } },
        projectName,
        { content: "Reporting Period:", styles: { fillColor: [211, 211, 211] as Color } },
        reportingPeriod
      ],
      [
        { content: "Project Manager:", styles: { fillColor: [211, 211, 211] as Color } },
        projectManager,
        { content: "Project Due Date:", styles: { fillColor: [211, 211, 211] as Color } },
        projectDueDate
      ],
      [
        { content: "Compiled By:", styles: { fillColor: [211, 211, 211] as Color } },
        compiledBy,
        { content: "Date Submitted:", styles: { fillColor: [211, 211, 211] as Color } },
        dateSubmitted
      ]
    ];

    autoTable(doc, {
      startY: 20,
      headStyles: { fillColor: [0, 0, 0] },
      body: tableData,
      theme: 'grid',
      styles: {
        halign: 'left',
        valign: 'middle',
        fontSize: 10,
        cellPadding: 2
      },
      columnStyles: {
        0: { cellWidth: 35 },
        1: { cellWidth: 55 },
        2: { cellWidth: 35 },
        3: { cellWidth: 55 },
      },
    });

    // Get Y-position after General Information Table
    const finalY1 = (doc as any).lastAutoTable.finalY || 20;

    // Summary Section
    doc.setFontSize(14);
    doc.text("Summary", 105, finalY1 + 10, { align: "center" });

    const summaryFields = form.getValues("summary");

    // Map summary fields into table data
    const summaryData = summaryFields?.map((summaryItem, index) => {
      let statusColor: Color = [255, 255, 255]; // Default white

      // Determine color based on status
      if (summaryItem.currentStatus === "On Time") {
        statusColor = [198, 239, 206]; // Light green
      } else if (summaryItem.currentStatus === "Delayed") {
        statusColor = [255, 199, 206]; // Light red
      } else if (summaryItem.currentStatus === "Changes Needed") {
        statusColor = [255, 235, 156]; // Light yellow
      }

      return [
        { content: summaryItem.item, styles: { fillColor: [255, 255, 255] as Color } },
        { content: summaryItem.currentStatus, styles: { fillColor: statusColor } },
        { content: summaryItem.priorStatus, styles: { fillColor: statusColor as Color } },
        { content: summaryItem.summary, styles: { fillColor: [255, 255, 255] as Color } }
      ];
    });

    // Add headers
    const tableHeaders = [
      { content: "Item" },
      { content: "Current Status" },
      { content: "Prior Status" },
      { content: "Summary" }
    ];

    autoTable(doc, {
      startY: finalY1 + 15,
      head: [tableHeaders],
      headStyles: {
        halign: "left",
        fillColor: [211, 211, 211],
        textColor: [0, 0, 0],
        fontStyle: "normal"
      },
      body: summaryData,
      theme: 'grid',
      styles: {
        halign: 'left',
        valign: 'middle',
        overflow: 'linebreak',
        fontSize: 10,
        cellPadding: 2
      },
      columnStyles: {
        0: { cellWidth: 40 },
        1: { cellWidth: 30 },
        2: { cellWidth: 30 },
        3: { cellWidth: 80 },
      },
      didDrawPage: (data) => {
        const pageCount = doc.getNumberOfPages();
        doc.setFontSize(10);
        doc.text(`Page ${pageCount}`, data.settings.margin.left, doc.internal.pageSize.height - 10);
      },
    });

    // Get Y-position after Summary Table
    const finalY2 = (doc as any).lastAutoTable.finalY || finalY1 + 15;

    // Tasks Section
    doc.setFontSize(14);
    doc.text("Tasks", 105, finalY2 + 10, { align: "center" });

    const taskFields = form.getValues("tasks");

    // Map tasks fields into table data
    const taskData = taskFields?.map((taskItem) => {

      let statusColor: Color = [255, 255, 255]; // Default white

      // Determine color based on status
      if (taskItem.status === "Finished") {
        statusColor = [198, 239, 206]; // Light green
      } else if (taskItem.status === "In Progress") {
        statusColor = [255, 235, 156]; // Light yellow
      }

      return [
        { content: taskItem.task, styles: { fillColor: statusColor as Color } },
        { content: taskItem.status, styles: { fillColor: statusColor as Color } },
        { content: taskItem.objective, styles: { fillColor: statusColor as Color } },
        { content: taskItem.plannedDate, styles: { fillColor: statusColor as Color } },
        { content: taskItem.actualDate, styles: { fillColor: statusColor as Color } },
        { content: taskItem.progressComplete, styles: { fillColor: statusColor as Color } },
        { content: taskItem.deliverable, styles: { fillColor: statusColor as Color } },
      ];
    });

    // Add headers for Tasks Table
    const taskTableHeaders = [
      { content: "Task" },
      { content: "Status" },
      { content: "Objective" },
      { content: "Planned Date" },
      { content: "Actual Date" },
      { content: "Progress Comp (%)" },
      { content: "Deliverable" },
    ];

    autoTable(doc, {
      startY: finalY2 + 15,
      head: [taskTableHeaders],
      headStyles: {
        halign: "left",
        fillColor: [211, 211, 211],
        textColor: [0, 0, 0],
        fontStyle: "normal"
      },
      body: taskData,
      theme: 'grid',
      styles: {
        fontSize: 10,
        cellPadding: 2,
        overflow: 'linebreak', // Ensures text wraps within cell
        halign: 'left',
        valign: 'middle',
      },
      columnStyles: {
        0: { cellWidth: 25 }, // Task
        1: { cellWidth: 20 }, // Status
        2: { cellWidth: 40 }, // Objective
        3: { cellWidth: 25 }, // Planned Date
        4: { cellWidth: 25 }, // Actual Date
        5: { cellWidth: 20 }, // Progress Complete
        6: { cellWidth: 25 }, // Deliverable
      },
      didDrawPage: (data) => {
        const pageCount = doc.getNumberOfPages();
        doc.setFontSize(10);
        doc.text(`Page ${pageCount}`, data.settings.margin.left, doc.internal.pageSize.height - 10);
      },
    });

    const finalY3 = (doc as any).lastAutoTable.finalY || finalY2 + 15;

    // Issues Section
    doc.setFontSize(14);
    doc.text("Issues", 105, finalY3 + 10, { align: "center" });

    const issueFields = form.getValues("issues");

    // Map issues fields into table data
    const issueData = issueFields?.map((issueItem) => {

      let statusColor: Color = [255, 255, 255]; // Default white

      // Determine color based on status
      if (issueItem.resolved === "Yes") {
        statusColor = [198, 239, 206]; // Light green
      } else if (issueItem.resolved === "No") {
        statusColor = [255, 199, 206]; // Light red
      }

      return [
        { content: issueItem.issue },
        { content: issueItem.identifiedDate },
        { content: `${issueItem.actionOrIgnore} - ${issueItem.action}` },
        { content: issueItem.owner },
        { content: issueItem.resolved, styles: { fillColor: statusColor as Color } },
      ];
    });

    // Add headers for Issues Table
    const issueTableHeaders = [
      { content: "Issue Description" },
      { content: "Identified Date" },
      { content: "Action or Ignore" },
      { content: "Owner" },
      { content: "Resolved" },
    ];

    autoTable(doc, {
      startY: finalY3 + 15,
      head: [issueTableHeaders],
      headStyles: {
        halign: "left",
        fillColor: [211, 211, 211],
        textColor: [0, 0, 0],
        fontStyle: "normal"
      },
      body: issueData,
      theme: 'grid',
      styles: {
        fontSize: 10,
        cellPadding: 2,
        overflow: 'linebreak',
        halign: 'left',
        valign: 'middle',
      },
      columnStyles: {
        0: { cellWidth: 55 }, // Issue Description
        1: { cellWidth: 25 }, // Identified Date
        2: { cellWidth: 55 }, // Action or Ignore
        4: { cellWidth: 20 }, // Owner
        5: { cellWidth: 25 }, // Resolved
      },
      didDrawPage: (data) => {
        const pageCount = doc.getNumberOfPages();
        doc.setFontSize(10);
        doc.text(`Page ${pageCount}`, data.settings.margin.left, doc.internal.pageSize.height - 10);
      },
    });

    // Save or Download the PDF
    doc.save("progress-report.pdf");
  };


  return (
    <div className="pt-0 px-4 pb-4 sm:pt-4">
      <div className="flex flex-col sm:flex-row items-start sm:justify-between mb-3">
        <h1 className="text-xl font-semibold mb-1 sm:mb-0">Progress Report Form</h1>
        <Button onClick={downloadPDF}>
          Download as PDF
        </Button>
      </div>
      <Form {...form}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="flex flex-col">
            {/* General Information Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={control}
                name="projectName"
                render={({field}) => (
                  <FormItem className="flex flex-col">
                    <FormLabel className="mr-auto">Project Name:</FormLabel>
                    <FormControl>
                      <Input placeholder="(STORE & LOCATION)" {...field} />
                    </FormControl>
                    <FormMessage/>
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name="projectManager"
                render={({field}) => (
                  <FormItem className="flex flex-col">
                    <FormLabel className="mr-auto">Project Manager:</FormLabel>
                    <FormControl>
                      <Input placeholder="(PM ON RECORD)" {...field} />
                    </FormControl>
                    <FormMessage/>
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name="compiledBy"
                render={({field}) => (
                  <FormItem className="flex flex-col">
                    <FormLabel className="mr-auto">Compiled by:</FormLabel>
                    <FormControl>
                      <Input placeholder="(SITE SUPER)" {...field} />
                    </FormControl>
                    <FormMessage/>
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name="reportingPeriod"
                render={({field}) => (
                  <FormItem className="flex flex-col">
                    <FormLabel className="mr-auto">Reporting Period:</FormLabel>
                    <FormControl>
                      <Input placeholder="Week #" {...field} />
                    </FormControl>
                    <FormMessage/>
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name="projectDueDate"
                render={({field}) => (
                  <FormItem className="flex flex-col">
                    <FormLabel className="mr-auto">Project Due Date:</FormLabel>
                    <FormControl>
                      <Input type="date" className="block" placeholder="YYYY-MM-DD" {...field} />
                    </FormControl>
                    <FormMessage/>
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name="dateSubmitted"
                render={({field}) => (
                  <FormItem className="flex flex-col">
                    <FormLabel className="mr-auto">Date Submitted:</FormLabel>
                    <FormControl>
                      <Input type="date" className="block" placeholder="YYYY-MM-DD" {...field} />
                    </FormControl>
                    <FormMessage/>
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={control}
              name="reportImages"
              render={() => (
                <FormItem className="flex flex-col py-2">
                  <FormLabel className="text-lg font-semibold mr-auto">Upload Images:</FormLabel>
                  <FormControl>
                    <Input
                      type="file"
                      multiple
                      accept="image/jpeg, image/png"
                      onChange={handleFileUpload}
                    />
                  </FormControl>
                  <FormMessage />

                  {/* Display Newly Uploaded Images */}
                  {images.some((image) => image instanceof File) && (
                    <>
                      <h3 className="text-md font-semibold mt-4 mr-auto">Newly Uploaded Images:</h3>
                      <div className="mt-2 grid grid-cols-2 md:grid-cols-4 gap-4">
                        {images.map((image, actualIndex) => {
                          if (image instanceof File) {
                            const file = image as File;
                            const previewUrl = URL.createObjectURL(file);

                            return (
                              <div key={actualIndex} className="relative group">
                                <img
                                  src={previewUrl}
                                  alt={`New Upload ${actualIndex}`}
                                  className="w-full h-52 object-cover rounded-lg shadow cursor-pointer"
                                />
                                {/* "X" Button to remove the image */}
                                <Button
                                  variant="destructive"
                                  type="button"
                                  onClick={() => handleRemoveFile(actualIndex)}
                                  className="absolute size-8 top-2 right-2 text-white bg-black bg-opacity-60 rounded-md p-1 hover:bg-opacity-100 transition-opacity group-hover:opacity-100 md:opacity-0"
                                >
                                  ✕
                                </Button>
                              </div>
                            );
                          }
                          return null;
                        })}
                      </div>
                    </>
                  )}

                  {/* Display Existing Images */}
                  {images.some((image) => typeof image === "string") && (
                    <>
                      <h3 className="text-md font-semibold mt-4 mr-auto">Images:</h3>
                      <div className="mt-2 grid grid-cols-2 md:grid-cols-4 gap-4">
                        {images.map(
                          (image, actualIndex) =>
                            typeof image === "string" && (
                              <div key={actualIndex} className="relative group">
                                <Dialog>
                                  <DialogTrigger asChild>
                                    <img
                                      src={image}
                                      alt={`Existing Image ${actualIndex}`}
                                      className="w-full h-52 object-cover rounded-lg shadow cursor-pointer"
                                    />
                                  </DialogTrigger>
                                  <DialogContent className="h-fit w-fit max-w-[95vw] max-h-[85vh] p-0">
                                    <DialogHeader>
                                      <DialogTitle className="sr-only">Full-Screen Image</DialogTitle>
                                    </DialogHeader>
                                    <div className="flex justify-center items-center h-full mt-2 p-4">
                                      <img
                                        src={image}
                                        alt="Full-Screen"
                                        className="max-w-full max-h-full object-contain rounded-lg"
                                      />
                                    </div>
                                  </DialogContent>
                                </Dialog>
                              </div>
                            )
                        )}
                      </div>
                    </>
                  )}
                </FormItem>
              )}
            />

            {/* Accordion to handle summary items */}
            <div className="flex justify-between items-center mt-4">
              <h2 className="text-lg font-semibold">Summary</h2>
              <Button
                type="button"
                className="bg-custom-black"
                onClick={() =>
                  appendSummary({
                    item: '',
                    currentStatus: 'On Time',
                    priorStatus: 'On Time',
                    summary: '',
                  })
                }
              >
                Add Summary
              </Button>
            </div>
            <div className="w-full space-y-3 mt-4">
              {summaryFields.map((summaryItem, index) => (
                <Accordion key={summaryItem.id} type="single" className="bg-white px-4 rounded-md" collapsible
                           defaultValue={`summary-${index}`}>
                  <AccordionItem value={`summary-${index}`} className="border-b-0">
                    {/* Accordion Trigger */}
                    <AccordionTrigger className="flex items-center">
                      <div className="flex flex-row gap-2">
                        <h3 className="font-medium">
                          {form.getValues(`summary.${index}.item`) || `Item ${index + 1}`}
                        </h3>
                        {form.getValues(`summary.${index}.currentStatus`) === "On Time" &&
                          <Badge
                            className="no-underline bg-green-100 hover:bg-green-100 text-green-800 rounded-md">
                            On Time
                          </Badge>
                        }
                        {form.getValues(`summary.${index}.currentStatus`) === "Changes Needed" && (
                          <Badge className="no-underline bg-yellow-100 hover:bg-yellow-100 text-yellow-800 rounded-md">
                            Changes Needed
                          </Badge>
                        )}
                        {form.getValues(`summary.${index}.currentStatus`) === "Delayed" && (
                          <Badge className="no-underline bg-red-100 hover:bg-red-100 text-red-800 rounded-md">
                            Delayed
                          </Badge>
                        )}
                      </div>
                    </AccordionTrigger>

                    {/* Accordion Content */}
                    <AccordionContent className="px-2">
                    <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Item Field */}
                        <FormField
                          control={control}
                          name={`summary.${index}.item`}
                          render={({field}) => (
                            <FormItem className="flex flex-col">
                              <FormLabel className="mr-auto">Item</FormLabel>
                              <FormControl>
                                <Input placeholder="Item" {...field} />
                              </FormControl>
                              <FormMessage/>
                            </FormItem>
                          )}
                        />

                        {/* Current Status Field */}
                        <FormField
                          control={control}
                          name={`summary.${index}.currentStatus`}
                          render={({field}) => (
                            <FormItem className="flex flex-col">
                              <FormLabel className="mr-auto">Current Status</FormLabel>
                              <FormControl>
                                <Select onValueChange={field.onChange} value={field.value || 'On Time'}>
                                  <SelectTrigger
                                    className={
                                      field.value === 'On Time'
                                        ? 'bg-green-100'
                                        : field.value === 'Delayed'
                                          ? 'bg-red-100'
                                          : field.value === 'Changes Needed'
                                            ? 'bg-yellow-100'
                                            : ''
                                    }
                                  >
                                    <SelectValue placeholder="Current Status" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="On Time" className="bg-green-100 hover:bg-green-200">
                                      On Time
                                    </SelectItem>
                                    <SelectItem value="Delayed" className="bg-red-100 hover:bg-red-200">
                                      Delayed
                                    </SelectItem>
                                    <SelectItem value="Changes Needed" className="bg-yellow-100 hover:bg-yellow-200">
                                      Changes Needed
                                    </SelectItem>
                                  </SelectContent>
                                </Select>
                              </FormControl>
                              <FormMessage/>
                            </FormItem>
                          )}
                        />

                        {/* Prior Status Field */}
                        <FormField
                          control={control}
                          name={`summary.${index}.priorStatus`}
                          render={({field}) => (
                            <FormItem className="flex flex-col">
                              <FormLabel className="mr-auto">Prior Status</FormLabel>
                              <FormControl>
                                <Select onValueChange={field.onChange} value={field.value || 'On Time'}>
                                  <SelectTrigger
                                    className={
                                      field.value === 'On Time'
                                        ? 'bg-green-100'
                                        : field.value === 'Delayed'
                                          ? 'bg-red-100'
                                          : field.value === 'Changes Needed'
                                            ? 'bg-yellow-100'
                                            : ''
                                    }
                                  >
                                    <SelectValue placeholder="Current Status" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="On Time" className="bg-green-100 hover:bg-green-200">
                                      On Time
                                    </SelectItem>
                                    <SelectItem value="Delayed" className="bg-red-100 hover:bg-red-200">
                                      Delayed
                                    </SelectItem>
                                    <SelectItem value="Changes Needed" className="bg-yellow-100 hover:bg-yellow-200">
                                      Changes Needed
                                    </SelectItem>
                                  </SelectContent>
                                </Select>
                              </FormControl>
                              <FormMessage/>
                            </FormItem>
                          )}
                        />

                        {/* Summary Field */}
                        <FormField
                          control={control}
                          name={`summary.${index}.summary`}
                          render={({field}) => (
                            <FormItem className="flex flex-col md:col-span-2">
                              <FormLabel className="mr-auto">Summary</FormLabel>
                              <FormControl>
                                <Textarea placeholder="Summary" {...field} />
                              </FormControl>
                              <FormMessage/>
                            </FormItem>
                          )}
                        />
                      </div>
                      <div className="flex justify-end">
                        <Button
                          type="button"
                          variant="ghost"
                          className="text-custom-red font-semibold text-[16px] pr-0 mt-1"
                          onClick={() => removeSummary(index)}
                        >
                          delete
                          <Trash2 className="text-custom-red h-[18px]"/>
                        </Button>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              ))}
            </div>


            <div className="flex justify-between items-center mt-4">
              <h2 className="text-lg font-semibold">Tasks</h2>
              <Button
                type="button"
                className="bg-custom-black"
                onClick={() =>
                  appendTask({
                    task: '',
                    status: 'Not Started',
                    objective: '',
                    plannedDate: '',
                    actualDate: '',
                    progressComplete: '0',
                    deliverable: 'Not Started',
                  })
                }
              >
                Add Task
              </Button>
            </div>

            <div className="w-full space-y-3 mt-4">
              {taskFields.map((taskItem, index) => (
                <Accordion
                  key={taskItem.id}
                  type="single"
                  className="bg-white px-4 rounded-md"
                  collapsible
                  defaultValue={`task-${index}`}
                >
                  <AccordionItem value={`task-${index}`} className="border-b-0">
                    {/* Accordion Trigger */}
                    <AccordionTrigger className="flex items-center">
                      <div className="flex flex-row gap-2">
                        <h3 className="font-medium">
                          {form.getValues(`tasks.${index}.task`) || `Task ${index + 1}`}
                        </h3>
                        {form.getValues(`tasks.${index}.deliverable`) === "Done" &&
                          <Badge className="no-underline bg-green-100 hover:bg-green-100 text-green-800 rounded-md">Done</Badge>
                        }
                        {form.getValues(`tasks.${index}.deliverable`) === "In Progress" && (
                          <Badge className="no-underline bg-yellow-100 hover:bg-yellow-100 text-yellow-800 rounded-md">
                            In Progress
                          </Badge>
                        )}
                        {form.getValues(`tasks.${index}.deliverable`) === "Not Started" && (
                          <Badge className="no-underline bg-gray-200 hover:bg-gray-200 text-gray-800 rounded-md">
                            Not Started
                          </Badge>
                        )}
                      </div>
                    </AccordionTrigger>

                    {/* Accordion Content */}
                    <AccordionContent className="px-2">
                      <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Task Field */}
                        <FormField
                          control={control}
                          name={`tasks.${index}.task`}
                          render={({field}) => (
                            <FormItem className="flex flex-col">
                              <FormLabel className="mr-auto">Task</FormLabel>
                              <FormControl>
                                <Input placeholder="Task Name" {...field} />
                              </FormControl>
                              <FormMessage/>
                            </FormItem>
                          )}
                        />

                        {/* Status Field */}
                        <FormField
                          control={control}
                          name={`tasks.${index}.status`}
                          render={({field}) => (
                            <FormItem className="flex flex-col">
                              <FormLabel className="mr-auto">Status</FormLabel>
                              <FormControl>
                                <Select onValueChange={field.onChange} value={field.value || 'Not Started'}>
                                  <SelectTrigger
                                    className={
                                      field.value === 'Finished'
                                        ? 'bg-green-100'
                                        : field.value === 'In Progress'
                                          ? 'bg-yellow-100'
                                          : 'bg-white'
                                    }
                                  >
                                    <SelectValue placeholder="Status" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="Finished" className="bg-green-100 hover:bg-green-200">
                                      Finished
                                    </SelectItem>
                                    <SelectItem value="In Progress" className="bg-yellow-100 hover:bg-yellow-200">
                                      In Progress
                                    </SelectItem>
                                    <SelectItem value="Not Started" className="bg-white hover:bg-gray-100">
                                      Not Started
                                    </SelectItem>
                                  </SelectContent>
                                </Select>
                              </FormControl>
                              <FormMessage/>
                            </FormItem>
                          )}
                        />

                        {/* Objective Field */}
                        <FormField
                          control={control}
                          name={`tasks.${index}.objective`}
                          render={({field}) => (
                            <FormItem className="flex flex-col md:col-span-2">
                              <FormLabel className="mr-auto">Objective</FormLabel>
                              <FormControl>
                                <Textarea placeholder="What's the objective" {...field} />
                              </FormControl>
                              <FormMessage/>
                            </FormItem>
                          )}
                        />

                        {/* Planned Date Field */}
                        <FormField
                          control={control}
                          name={`tasks.${index}.plannedDate`}
                          render={({field}) => (
                            <FormItem className="flex flex-col">
                              <FormLabel className="mr-auto">Planned Date</FormLabel>
                              <FormControl>
                                <Input type="date" {...field} />
                              </FormControl>
                              <FormMessage/>
                            </FormItem>
                          )}
                        />

                        {/* Actual Date Field */}
                        <FormField
                          control={control}
                          name={`tasks.${index}.actualDate`}
                          render={({field}) => (
                            <FormItem className="flex flex-col">
                              <FormLabel className="mr-auto">Actual Date</FormLabel>
                              <FormControl>
                                <Input type="date" {...field} />
                              </FormControl>
                              <FormMessage/>
                            </FormItem>
                          )}
                        />

                        {/* Progress Complete Field */}
                        <FormField
                          control={control}
                          name={`tasks.${index}.progressComplete`}
                          render={({field}) => (
                            <FormItem className="flex flex-col">
                              <FormLabel className="mr-auto">Progress Complete (%)</FormLabel>
                              <FormControl>
                                <Input type="number" placeholder="0-100" min={0} max={100} {...field} />
                              </FormControl>
                              <FormMessage/>
                            </FormItem>
                          )}
                        />

                        {/* Deliverable Field */}
                        <FormField
                          control={control}
                          name={`tasks.${index}.deliverable`}
                          render={({field}) => (
                            <FormItem className="flex flex-col">
                              <FormLabel className="mr-auto">Deliverable</FormLabel>
                              <FormControl>
                                <Select onValueChange={field.onChange} value={field.value || 'Not Started'}>
                                  <SelectTrigger
                                    className={
                                      field.value === 'Done'
                                        ? 'bg-green-100'
                                        : field.value === 'In Progress'
                                          ? 'bg-yellow-100'
                                          : 'bg-white'
                                    }
                                  >
                                    <SelectValue placeholder="Deliverable" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="Done" className="bg-green-100 hover:bg-green-200">
                                      Done
                                    </SelectItem>
                                    <SelectItem value="In Progress" className="bg-yellow-100 hover:bg-yellow-200">
                                      In Progress
                                    </SelectItem>
                                    <SelectItem value="Not Started" className="bg-white hover:bg-gray-100">
                                      Not Started
                                    </SelectItem>
                                  </SelectContent>
                                </Select>

                              </FormControl>
                              <FormMessage/>
                            </FormItem>
                          )}
                        />
                      </div>
                      <div className="flex justify-end">
                        <Button
                          type="button"
                          variant="ghost"
                          className="text-custom-red font-semibold text-[16px] pr-0 mt-1"
                          onClick={() => removeTask(index)}
                        >
                          delete
                          <Trash2 className="text-custom-red h-[18px]"/>
                        </Button>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              ))}
            </div>


            <div className="flex justify-between items-center mt-4">
              <h2 className="text-lg font-semibold">Issues</h2>
              <Button
                type="button"
                className="bg-custom-black"
                onClick={() =>
                  appendIssue({
                    issue: '',
                    identifiedDate: '',
                    actionOrIgnore: 'Action',
                    action: '',
                    owner: '',
                    resolved: 'No',
                  })
                }
              >
                Add Issue
              </Button>
            </div>

            <div className="w-full space-y-3 mt-4 mb-28">
              {issueFields.map((issueItem, index) => (
                <Accordion
                  key={issueItem.id}
                  type="single"
                  className="bg-white px-4 rounded-md"
                  collapsible
                  defaultValue={`issue-${index}`}
                >
                  <AccordionItem value={`issue-${index}`} className="border-b-0">
                    {/* Accordion Trigger */}
                    <AccordionTrigger className="flex items-center">
                      <h3 className="font-medium">
                        {`Issue ${index + 1}`}
                      </h3>
                    </AccordionTrigger>

                    {/* Accordion Content */}
                    <AccordionContent className="px-2">
                      <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Issue Description Field */}
                        <FormField
                          control={control}
                          name={`issues.${index}.issue`}
                          render={({field}) => (
                            <FormItem className="flex flex-col md:col-span-2">
                              <FormLabel className="mr-auto">Issue Description</FormLabel>
                              <FormControl>
                                <Textarea placeholder="Issue Description" {...field} />
                              </FormControl>
                              <FormMessage/>
                            </FormItem>
                          )}
                        />

                        {/* Identified Date Field */}
                        <FormField
                          control={control}
                          name={`issues.${index}.identifiedDate`}
                          render={({field}) => (
                            <FormItem className="flex flex-col">
                              <FormLabel className="mr-auto">When Identified</FormLabel>
                              <FormControl>
                                <Input type="date" {...field} />
                              </FormControl>
                              <FormMessage/>
                            </FormItem>
                          )}
                        />

                        {/* Action or Ignore Field */}
                        <FormField
                          control={control}
                          name={`issues.${index}.actionOrIgnore`}
                          render={({field}) => (
                            <FormItem className="flex flex-col">
                              <FormLabel className="mr-auto">Action or Ignore</FormLabel>
                              <FormControl>
                                <Select onValueChange={field.onChange} value={field.value || 'Action'}>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Action or Ignore"/>
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="Action">Action</SelectItem>
                                    <SelectItem value="Ignore">Ignore</SelectItem>
                                  </SelectContent>
                                </Select>
                              </FormControl>
                              <FormMessage/>
                            </FormItem>
                          )}
                        />

                        {/* Action Description Field */}
                        <FormField
                          control={control}
                          name={`issues.${index}.action`}
                          render={({field}) => (
                            <FormItem className="flex flex-col md:col-span-2">
                              <FormLabel className="mr-auto">Action Description</FormLabel>
                              <FormControl>
                                <Textarea placeholder="Why was this ignored OR what action was taken" {...field} />
                              </FormControl>
                              <FormMessage/>
                            </FormItem>
                          )}
                        />

                        {/* Owner Field */}
                        <FormField
                          control={control}
                          name={`issues.${index}.owner`}
                          render={({field}) => (
                            <FormItem className="flex flex-col">
                              <FormLabel className="mr-auto">Owner</FormLabel>
                              <FormControl>
                                <Input placeholder="Who discovered the issue" {...field} />
                              </FormControl>
                              <FormMessage/>
                            </FormItem>
                          )}
                        />

                        {/* Resolved Field */}
                        <FormField
                          control={control}
                          name={`issues.${index}.resolved`}
                          render={({field}) => (
                            <FormItem className="flex flex-col">
                              <FormLabel className="mr-auto">Resolved</FormLabel>
                              <FormControl>
                                <Select onValueChange={field.onChange} value={field.value || 'No'}>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Yes or No"/>
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="Yes">Yes</SelectItem>
                                    <SelectItem value="No">No</SelectItem>
                                  </SelectContent>
                                </Select>
                              </FormControl>
                              <FormMessage/>
                            </FormItem>
                          )}
                        />
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              ))}
            </div>

            <Button
              type="submit"
              className="sticky md:w-52 md:mx-auto bg-custom-red hover:bg-custom-red bottom-4"
              disabled={
                form.formState.isSubmitting
              }
            >
              {form.formState.isSubmitting && (
                <Spinner className="fill-[#DDF5FF]" />
              )}
              {!form.formState.isSubmitting &&
                !form.formState.isSubmitSuccessful && <p>Save Progress Report</p>}
              {form.formState.isSubmitSuccessful && <p>Save Progress Report</p>}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default ProgressReportForm;
