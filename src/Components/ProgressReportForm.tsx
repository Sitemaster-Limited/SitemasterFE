import React, {useState} from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from './ui/form';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';

const ProgressReportForm = () => {
  const schema = z.object({
    projectName: z.string().min(1, 'Project Name is required'),
    projectManager: z.string().min(1, 'Project Manager is required'),
    compiledBy: z.string().min(1, 'Compiled By is required'),
    reportingPeriod: z.string().min(1, 'Reporting Period is required'),
    projectDueDate: z
      .string()
      .min(1, 'Project Due Date is required')
      .refine((date) => !isNaN(Date.parse(date)), 'Invalid date format'),
    dateSubmitted: z
      .string()
      .min(1, 'Date Submitted is required')
      .refine((date) => !isNaN(Date.parse(date)), 'Invalid date format'),
    summary: z
      .array(
        z.object({
          item: z.string().min(1, 'Item is required'),
          currentStatus: z.enum(['On Time', 'Delayed', 'Changes Needed']),
          priorStatus: z.enum(['On Time', 'Delayed', 'Changes Needed']),
          summary: z.string().optional(),
        })
      )
      .optional(),
    images:z.
      array(
        z.instanceof(File)
        .refine(file => file.type === 'image/jpeg' || file.type === 'image/png', {
          message: "Only JPEG or PNG images are allowed",
        })
        .refine(file => file.size <= 5 * 1024 * 1024, { // 5MB size limit
          message: "Image size must be less than 5MB",
        })
      )
      .min(1, "At least one image is required"),
    tasks: z
      .array(
        z.object({
          task: z.string().min(1, 'Task name is required'),
          status: z.enum(['Finished', 'In Progress', 'Not Started']),
          objective: z.string().optional(),
          plannedDate: z.string().optional(),
          actualDate: z.string().optional(),
          progressComplete: z.string(),
          deliverable: z.string().optional(),
        })
      )
      .optional(),
    issues: z
      .array(
        z.object({
          issue: z.string().min(1, 'Issue description is required'),
          identifiedDate: z
            .string()
            .refine((date) => !isNaN(Date.parse(date)), 'Invalid date format'),
          actionOrIgnore: z.enum(['Action', 'Ignore']),
          action: z.string().min(1, 'This field is required'),
          owner: z.string().min(1, 'Owner is required'),
          resolved: z.enum(['Yes', 'No']),
        })
      )
      .optional(),
  });

  type FormData = z.infer<typeof schema>;

  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    mode: 'onBlur',
    defaultValues: {},
  });

  const { control, handleSubmit, setValue, getValues } = form;

  const {
    fields: taskFields,
    append: appendTask,
    remove: removeTask,
  } = useFieldArray({
    control,
    name: 'tasks',
  });

  const {
    fields: issueFields,
    append: appendIssue,
    remove: removeIssue,
  } = useFieldArray({
    control,
    name: 'issues',
  });

  const {
    fields: summaryFields,
    append: appendSummary,
    remove: removeSummary,
  } = useFieldArray({
    control,
    name: 'summary',
  });

  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newFiles = Array.from(files);
      setUploadedFiles((prevFiles) => [...prevFiles, ...newFiles]);
      setValue('images', [...getValues('images') || [], ...newFiles]); // Update form value

      // Generate image previews
      newFiles.forEach(file => {
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreviews(prev => [...prev, reader.result as string]);
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const handleRemoveFile = (index: number) => {
    const newFiles = uploadedFiles.filter((_, i) => i !== index);
    const newPreviews = previews.filter((_, i) => i !== index);
    setUploadedFiles(newFiles);
    setPreviews(newPreviews);
    setValue('images', newFiles); // Update form value
  };


  const onSubmit = (data: FormData) => {
    console.log(data);
  };

  return (
    <div className="p-4">
      <Form {...form}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="flex flex-col">
            <FormField
              control={control}
              name="projectName"
              render={({field}) => (
                <FormItem className="flex justify-center items-center flex-row gap-2 py-2 px-4">
                  <FormLabel className="w-auto whitespace-nowrap">Project Name:</FormLabel>
                  <FormControl>
                    <Input placeholder="(STORE &amp; LOCATION)" {...field} />
                  </FormControl>
                  <FormMessage/>
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name="projectManager"
              render={({field}) => (
                <FormItem className="flex justify-center items-center flex-row gap-2 py-2 px-4">
                  <FormLabel className="w-auto whitespace-nowrap">Project Manager:</FormLabel>
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
                <FormItem className="flex justify-center items-center flex-row gap-2 py-2 px-4">
                  <FormLabel className="w-auto whitespace-nowrap">Compiled by:</FormLabel>
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
                <FormItem className="flex justify-center items-center flex-row gap-2 py-2 px-4">
                  <FormLabel className="w-auto whitespace-nowrap">Reporting Period:</FormLabel>
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
                <FormItem className="flex justify-center items-center flex-row gap-2 py-2 px-4">
                  <FormLabel className="w-auto whitespace-nowrap">Project Due Date:</FormLabel>
                  <FormControl>
                    <Input type="date" placeholder="YYYY-MM-DD" {...field} />
                  </FormControl>
                  <FormMessage/>
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name="dateSubmitted"
              render={({field}) => (
                <FormItem className="flex justify-center items-center flex-row gap-2 py-2 px-4">
                  <FormLabel className="w-auto whitespace-nowrap">Date Submitted:</FormLabel>
                  <FormControl>
                    <Input type="date" placeholder="YYYY-MM-DD" {...field} />
                  </FormControl>
                  <FormMessage/>
                </FormItem>
              )}
            />

            {/* Images Upload Field */}
            <FormField
              control={control}
              name="images"
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

                  {/* Display uploaded files with previews */}
                  {previews.length > 0 && (
                    <div className="mt-4 grid grid-cols-1 sm:grid-cols-[repeat(auto-fit,_minmax(300px,_1fr))] gap-4">
                      {previews.map((preview, index) => (
                        <div key={index} className="relative group">
                          <img
                            src={preview}
                            alt={`Uploaded ${index}`}
                            className="w-full h-52 object-cover rounded-lg shadow"
                          />
                          {/* "X" Button to remove the image */}
                          <Button
                            variant="destructive"
                            type="button"
                            onClick={() => handleRemoveFile(index)}
                            className="absolute size-8 top-2 right-2 text-white bg-black bg-opacity-60 rounded-md p-1 hover:bg-opacity-100 transition-opacity group-hover:opacity-100 md:opacity-0"
                          >
                            ✕
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </FormItem>
              )}
            />

            {/* Summary Section */}
            <div>
              <div className="flex justify-between items-center mt-2">
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
              <div className="space-y-4 mt-4">
                {summaryFields.map((summaryItem, index) => (
                  <div
                    key={summaryItem.id}
                    className="bg-gray-50 p-4 rounded shadow"
                  >
                    <div className="flex justify-between items-center">
                      <h3 className="font-medium">{form.getValues(`summary.${index}.item`) || `Item ${index + 1}`}</h3>
                      <Button
                        type="button"
                        variant="destructive"
                        onClick={() => removeSummary(index)}
                      >
                        Remove
                      </Button>
                    </div>
                    <div className="mt-2 space-y-2">
                      <FormField
                        control={control}
                        name={`summary.${index}.item`}
                        render={({ field }) => (
                          <FormItem className="flex flex-col items-start">
                            <FormLabel>Item</FormLabel>
                            <FormControl>
                              <Input placeholder="Item" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={control}
                        name={`summary.${index}.currentStatus`}
                        render={({ field }) => (
                          <FormItem className="flex flex-col items-start">
                            <FormLabel>Current Status</FormLabel>
                            <FormControl>
                              <Select
                                onValueChange={field.onChange}
                                value={field.value || 'On Time'}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Current Status" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="On Time">On Time</SelectItem>
                                  <SelectItem value="Delayed">Delayed</SelectItem>
                                  <SelectItem value="Changes Needed">
                                    Changes Needed
                                  </SelectItem>
                                </SelectContent>
                              </Select>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      {/* Prior Status Field */}
                      <FormField
                        control={control}
                        name={`summary.${index}.priorStatus`}
                        render={({ field }) => (
                          <FormItem className="flex flex-col items-start">
                            <FormLabel>Prior Status</FormLabel>
                            <FormControl>
                              <Select
                                onValueChange={field.onChange}
                                value={field.value || 'On Time'}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Prior Status" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="On Time">On Time</SelectItem>
                                  <SelectItem value="Delayed">Delayed</SelectItem>
                                  <SelectItem value="Changes Needed">
                                    Changes Needed
                                  </SelectItem>
                                </SelectContent>
                              </Select>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      {/* Summary Field */}
                      <FormField
                        control={control}
                        name={`summary.${index}.summary`}
                        render={({ field }) => (
                          <FormItem className="flex flex-col items-start">
                            <FormLabel>Summary</FormLabel>
                            <FormControl>
                              <Textarea placeholder="Summary" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Tasks Section */}
            <div>
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
              <div className="space-y-4 mt-4">
                {taskFields.map((taskItem, index) => (
                  <div
                    key={taskItem.id}
                    className="bg-gray-50 p-4 rounded shadow"
                  >
                    <div className="flex justify-between items-center">
                      <h3 className="font-medium">Task {index + 1}</h3>
                      <Button
                        type="button"
                        variant="destructive"
                        onClick={() => removeTask(index)}
                      >
                        Remove
                      </Button>
                    </div>
                    <div className="mt-2 space-y-2">
                      <FormField
                        control={control}
                        name={`tasks.${index}.task`}
                        render={({ field }) => (
                          <FormItem className="flex flex-col items-start">
                            <FormLabel>Task</FormLabel>
                            <FormControl>
                              <Input placeholder="Task Name" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={control}
                        name={`tasks.${index}.status`}
                        render={({ field }) => (
                          <FormItem className="flex flex-col items-start">
                            <FormLabel>Status</FormLabel>
                            <FormControl>
                              <Select
                                onValueChange={field.onChange}
                                value={field.value || 'Not Started'}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Status" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="Finished">Finished</SelectItem>
                                  <SelectItem value="In Progress">
                                    In Progress
                                  </SelectItem>
                                  <SelectItem value="Not Started">
                                    Not Started
                                  </SelectItem>
                                </SelectContent>
                              </Select>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      {/* Objective Field */}
                      <FormField
                        control={control}
                        name={`tasks.${index}.objective`}
                        render={({ field }) => (
                          <FormItem className="flex flex-col items-start">
                            <FormLabel>Objective</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="What's the objective"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      {/* Planned Date Field */}
                      <FormField
                        control={control}
                        name={`tasks.${index}.plannedDate`}
                        render={({ field }) => (
                          <FormItem className="flex flex-col items-start">
                            <FormLabel>Planned Date</FormLabel>
                            <FormControl>
                              <Input type="date" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      {/* Actual Date Field */}
                      <FormField
                        control={control}
                        name={`tasks.${index}.actualDate`}
                        render={({ field }) => (
                          <FormItem className="flex flex-col items-start">
                            <FormLabel>Actual Date</FormLabel>
                            <FormControl>
                              <Input type="date" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      {/* Progress Complete Field */}
                      <FormField
                        control={control}
                        name={`tasks.${index}.progressComplete`}
                        render={({ field }) => (
                          <FormItem className="flex flex-col items-start">
                            <FormLabel>Progress Complete (%)</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                placeholder="0-100"
                                min={0}
                                max={100}
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      {/* Deliverable Field */}
                      <FormField
                        control={control}
                        name={`tasks.${index}.deliverable`}
                        render={({ field }) => (
                          <FormItem className="flex flex-col items-start">
                            <FormLabel>Deliverable</FormLabel>
                            <FormControl>
                              <Select
                                onValueChange={field.onChange}
                                value={field.value || 'Not Started'}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Deliverable" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="Finished">Finished</SelectItem>
                                  <SelectItem value="In Progress">
                                    In Progress
                                  </SelectItem>
                                  <SelectItem value="Not Started">
                                    Not Started
                                  </SelectItem>
                                </SelectContent>
                              </Select>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Issues Section */}
            <div>
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
                      action:'',
                      owner: '',
                      resolved: 'No',
                    })
                  }
                >
                  Add Issue
                </Button>
              </div>
              <div className="space-y-4 mt-4">
                {issueFields.map((issueItem, index) => (
                  <div
                    key={issueItem.id}
                    className="bg-gray-50 p-4 rounded shadow"
                  >
                    <div className="flex justify-between items-center">
                      <h3 className="font-medium">Issue {index + 1}</h3>
                      <Button
                        type="button"
                        variant="destructive"
                        onClick={() => removeIssue(index)}
                      >
                        Remove
                      </Button>
                    </div>
                    <div className="mt-2 space-y-2">
                      <FormField
                        control={control}
                        name={`issues.${index}.issue`}
                        render={({ field }) => (
                          <FormItem className="flex flex-col items-start">
                            <FormLabel>Issue Description</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="Issue Description"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      {/* Identified Date Field */}
                      <FormField
                        control={control}
                        name={`issues.${index}.identifiedDate`}
                        render={({ field }) => (
                          <FormItem className="flex flex-col items-start">
                            <FormLabel>When Identified</FormLabel>
                            <FormControl>
                              <Input type="date" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      {/* Action or Ignore Field */}
                      <FormField
                        control={control}
                        name={`issues.${index}.actionOrIgnore`}
                        render={({ field }) => (
                          <FormItem className="flex flex-col items-start">
                            <FormLabel>Action or Ignore</FormLabel>
                            <FormControl>
                              <Select
                                onValueChange={field.onChange}
                                value={field.value || 'Action'}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Action or Ignore" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="Action">Action</SelectItem>
                                  <SelectItem value="Ignore">Ignore</SelectItem>
                                </SelectContent>
                              </Select>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      {/* Owner Field */}
                      <FormField
                        control={control}
                        name={`issues.${index}.action`}
                        render={({ field }) => (
                          <FormItem className="flex flex-col items-start">
                            <FormLabel>Action description</FormLabel>
                            <FormControl>
                              <Textarea placeholder="Why was this ignored OR what action was taken" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={control}
                        name={`issues.${index}.owner`}
                        render={({ field }) => (
                          <FormItem className="flex flex-col items-start">
                            <FormLabel>Owner</FormLabel>
                            <FormControl>
                              <Input placeholder="Who discovered the issue" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      {/* Resolved Field */}
                      <FormField
                        control={control}
                        name={`issues.${index}.resolved`}
                        render={({ field }) => (
                          <FormItem className="flex flex-col items-start">
                            <FormLabel>Resolved</FormLabel>
                            <FormControl>
                              <Select
                                onValueChange={field.onChange}
                                value={field.value || 'No'}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Yes or No" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="Yes">Yes</SelectItem>
                                  <SelectItem value="No">No</SelectItem>
                                </SelectContent>
                              </Select>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <Button type="submit" className="mx-auto bg-custom-red flex w-fit mt-4">
              Submit Progress Report
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default ProgressReportForm;
