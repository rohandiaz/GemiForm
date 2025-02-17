"use client";
import React, { useState } from "react";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { publishForm } from "@/actions/publishForm";
import FormPublishDialog from "./FormPublishDialog";
import { Fields } from "@/types/form";
import toast from "react-hot-toast";
import { submitForm } from "@/actions/submitForm";

type Props = { form: any; isEditMode: boolean };

const AiGeneratedForm: React.FC<Props> = ({ form, isEditMode }) => {
  const [successDialogOpen, setSuccessDialogOpen] = useState<boolean>(false);
  const [formData, setFormData] = useState<any>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handlePublish = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isEditMode) {
      await publishForm(form.id);
      setSuccessDialogOpen(true);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const data = await submitForm(form.id, formData);

    if (data?.success) {
      toast.success(data.message);
      setFormData({});
    } else {
      toast.error(data?.message || "Submission failed");
    }
  };

  // 🔍 Debugging: Check content before parsing
  console.log("Raw form.content:", form.content);

  let value;
  try {
    value = typeof form.content === "string" ? JSON.parse(form.content) : form.content;
  } catch (error) {
    console.error("Error parsing form.content:", error);
    value = { formFields: [] };
  }

  // 🔍 Debugging: Check parsed content
  console.log("Parsed value:", value);

  let data: Fields[] = [];

  if (value && typeof value === "object") {
    if (Array.isArray(value)) {
      data = value.length > 0 ? value[0].formFields || [] : [];
    } else {
      data = value.formFields || [];
    }
  }

  // 🔍 Debugging: Check extracted fields
  console.log("Extracted formFields:", data);

  return (
    <div>
      <form onSubmit={isEditMode ? handlePublish : handleSubmit}>
        {data.length === 0 ? (
          <p className="text-red-500">⚠️ No form fields available!</p>
        ) : (
          data.map((item: Fields, index: number) => (
            <div key={index} className="mb-4">
              <Label>{item.label}</Label>
              <Input
                type="text"
                name={item.name}
                placeholder={item.placeholder || "Enter value"}
                required={!isEditMode}
                onChange={handleChange}
              />
            </div>
          ))
        )}
        <Button type="submit">{isEditMode ? "Publish" : "Submit"}</Button>
      </form>
      <FormPublishDialog formId={form.id} open={successDialogOpen} onOpenChange={setSuccessDialogOpen} />
    </div>
  );
};

export default AiGeneratedForm;
