import {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  json,
  redirect,
} from "@vercel/remix";
import { Form, useActionData, useLoaderData } from "@remix-run/react";
import { z } from "zod";
import { db } from "~/lib/db.server";
import { useForm, getFormProps, getInputProps } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";
import { path } from "~/lib/path";

export async function loader({ params }: LoaderFunctionArgs) {
  const beverageId = params.beverageId;

  if (!beverageId) {
    return redirect("/404");
  }

  const data = await db.beverage.findUnique({
    where: { id: Number(params.beverageId) },
  });

  if (!data) {
    return redirect("/404");
  }

  return data;
}

const schema = z.object({
  name: z.string(),
});

export async function action({ request, params }: ActionFunctionArgs) {
  const beverageId = Number(params.beverageId);

  const formData = await request.formData();
  const intent = formData.get("intent");
  if (intent === "DELETE") {
    await db.beverage.delete({ where: { id: beverageId } });
    return redirect(path.admin.beverageIndex);
  }

  const submission = parseWithZod(formData, { schema });

  if (submission.status !== "success") {
    return json(submission.reply());
  }

  await db.beverage.update({
    where: { id: beverageId },
    data: submission.value,
  });
  return redirect(path.admin.beverageIndex);
}

export default function Route() {
  const data = useLoaderData<typeof loader>();
  const result = useActionData<typeof action>();
  const [form, { name }] = useForm({
    defaultValue: {
      name: data.name,
    },
    lastResult: result,
    onValidate: ({ formData }) => parseWithZod(formData, { schema }),
    shouldValidate: "onSubmit",
    shouldRevalidate: "onInput",
  });

  return (
    <>
      <h2 className="text-2xl">Edit Beverage</h2>
      <Form method="PUT" {...getFormProps(form)}>
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
        <div className="flex gap-2 justify-end">
          <button name="intent" value="DELETE">
            Delete
          </button>
          <button name="intent" value="EDIT">
            Edit
          </button>
        </div>
      </Form>
    </>
  );
}
