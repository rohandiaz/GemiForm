"use server";

import prisma from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";
import { z } from "zod";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { revalidatePath } from "next/cache";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);



export const generateForm = async (prevState: unknown, formData: FormData) => {
    try {
        const user = await currentUser();
        if (!user) {
            return { success: false, message: "User not found" };
        }

        // Validate input using zod
        const schema = z.object({
            description: z.string().min(1, "Description is required"),
        });

        const result = schema.safeParse({
            description: formData.get("description") as string,
        });

        if (!result.success) {
            return {
                success: false,
                message: "Invalid form data",
                error: result.error.errors,
            };
        }

        const description = result.data.description;

        if (!process.env.GEMINI_API_KEY) {
            return { success: false, message: "GEMINI API key not found" };
        }

        const prompt = `
Generate a JSON response for a form with the following structure. Ensure the keys and format remain constant in every response.

{
  "formTitle": "string",
  "formFields": [
    {
      "label": "string",
      "name": "string",
      "placeholder": "string"
    }
  ]
}

Requirements:
- Use only the given keys: "formTitle", "formFields", "label", "name", "placeholder".
- Always include at least 3 fields in the "formFields" array.
- Keep the field names consistent across every generation for reliable rendering.
- Provide meaningful placeholder text for each field based on its label.
Return only the JSON object, without any additional explanations.
`;

        // Call Gemini API (Free Model)
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });
        const response = await model.generateContent(`${description} ${prompt}`);

        const formContent = response.response.text();

        if (!formContent) {
            return { success: false, message: "Failed to generate form content" };
        }

        console.log("Generated form ->", formContent);

        // Save to database using Prisma
        const form = await prisma.form.create({
            data: {
                ownerId: user.id,
                content: formContent,
            },
        });

        revalidatePath("/dashboard/forms");

        return {
            success: true,
            message: "Form generated successfully.",
            data: form,
        };
    } catch (error) {
        console.log("Error generating form", error);
        return {
            success: false,
            message: "An error occurred while generating the form.",
        };
    }
};
