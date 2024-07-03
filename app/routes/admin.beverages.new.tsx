import { ActionFunctionArgs, json, redirect } from "@vercel/remix";
import { Form, useActionData } from "@remix-run/react";
import { z } from "zod";
import { db } from "~/lib/db.server";
import {
  useForm,
  getFormProps,
  getInputProps,
  getTextareaProps,
} from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";
import { path } from "~/lib/path";

const schema = z.object({
  name: z.string(),
  description: z.string(),
});

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const submission = parseWithZod(formData, { schema });

  if (submission.status !== "success") {
    return json(submission.reply());
  }

  await db.beverage.create({ data: { ...submission.value, userId: "1" } });
  return redirect(path.admin.beverageIndex);
}

export default function Route() {
  const result = useActionData<typeof action>();
  const [form, { name, description }] = useForm({
    lastResult: result,
    onValidate: ({ formData }) => parseWithZod(formData, { schema }),
    shouldValidate: "onSubmit",
    shouldRevalidate: "onInput",
  });

  return (
    <>
      <h2 className="text-2xl mb-4">Create Beverage</h2>
      <Form method="POST" {...getFormProps(form)} className="space-y-2">
        <div>
          <label className="block" htmlFor="name">
            Name
          </label>
          <input
            {...getInputProps(name, { type: "text", id: "name" })}
            className="border px-4 py-2 rounded w-full"
          />
          {name.errors && (
            <div>
              {name.errors.map((e, index) => (
                <p key={index}>{e}</p>
              ))}
            </div>
          )}
        </div>
        <div>
          <label className="block" htmlFor="description">
            Description
          </label>
          <textarea
            {...getTextareaProps(description)}
            className="border px-4 py-2 rounded w-full"
            rows={10}
          />
          {description.errors && (
            <div>
              {description.errors.map((e, index) => (
                <p key={index}>{e}</p>
              ))}
            </div>
          )}
        </div>
        <div className="flex justify-end">
          <button className="bg-blue-600 text-white rounded px-4 py-2">
            Create
          </button>
        </div>
      </Form>
    </>
  );
}
