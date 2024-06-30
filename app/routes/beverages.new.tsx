import { ActionFunctionArgs, json, redirect } from "@remix-run/node";
import { Form, useActionData } from "@remix-run/react";
import { z } from "zod";
import { db } from "~/lib/db.server";
import { useForm, getFormProps, getInputProps } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";

const schema = z.object({
  name: z.string(),
});

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const submission = parseWithZod(formData, { schema });

  if (submission.status !== "success") {
    return json(submission.reply());
  }

  await db.beverage.create({ data: submission.value });
  return redirect("/beverages");
}

export default function Route() {
  const result = useActionData<typeof action>();
  const [form, { name }] = useForm({
    lastResult: result,
    onValidate: ({ formData }) => parseWithZod(formData, { schema }),
    shouldValidate: "onSubmit",
    shouldRevalidate: "onInput",
  });

  return (
    <>
      <h2 className="text-2xl">Create Beverage</h2>
      <Form method="POST" {...getFormProps(form)}>
        <div>
          <label htmlFor="name">Name</label>
          <input {...getInputProps(name, { type: "text", id: "name" })} />
          {name.errors && (
            <div>
              {name.errors.map((e, index) => (
                <p key={index}>{e}</p>
              ))}
            </div>
          )}
        </div>
        <button>Create</button>
      </Form>
    </>
  );
}
