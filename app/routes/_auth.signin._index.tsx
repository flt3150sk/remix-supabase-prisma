import { ActionFunctionArgs, json, redirect } from "@vercel/remix";
import { z } from "zod";
import { parseWithZod } from "@conform-to/zod";
import { Form, useActionData } from "@remix-run/react";
import { useForm, getFormProps, getInputProps } from "@conform-to/react";
import { createSupabaseServerClient } from "~/supabase/createSupabaseServerClient";
import { commitSession, getSession } from "~/lib/session.server";

const schema = z.object({
  email: z.string(),
  password: z.string(),
});

export async function action({ request }: ActionFunctionArgs) {
  const supabase = createSupabaseServerClient(request);
  const formData = await request.formData();
  const submission = parseWithZod(formData, { schema });

  if (submission.status !== "success") {
    return json(submission.reply());
  }

  const { data, error } = await supabase.auth.signInWithPassword({
    email: submission.value.email,
    password: submission.value.password,
  });

  if (error) {
    return;
  }

  if (data.session) {
    const session = await getSession(request.headers.get("Cookie"));
    session.set("access_token", data.session.access_token);

    return redirect("/admin/beverages", {
      headers: {
        "Set-Cookie": await commitSession(session),
      },
    });
  }
}

export default function SignInRoute() {
  const result = useActionData<typeof action>();
  const [form, { email, password }] = useForm({
    lastResult: result,
    onValidate: ({ formData }) => parseWithZod(formData, { schema }),
    shouldValidate: "onSubmit",
    shouldRevalidate: "onInput",
  });

  return (
    <div className="min-h-screen bg-gray-100 p-28">
      <div className="max-w-[600px] mx-auto">
        <h2 className="text-2xl mb-10 text-center">SignIn</h2>
        <Form method="POST" {...getFormProps(form)} className="space-y-2">
          <div>
            <label className="block" htmlFor={email.id}>
              Email
            </label>
            <input
              {...getInputProps(email, { type: "text", id: "email" })}
              className="border px-4 py-2 rounded w-full"
            />
            {email.errors && (
              <div>
                {email.errors.map((e, index) => (
                  <p key={index}>{e}</p>
                ))}
              </div>
            )}
          </div>
          <div>
            <label className="block" htmlFor={password.id}>
              Password
            </label>
            <input
              {...getInputProps(password, { type: "password", id: "password" })}
              className="border px-4 py-2 rounded w-full"
            />
            {password.errors && (
              <div>
                {password.errors.map((e, index) => (
                  <p key={index}>{e}</p>
                ))}
              </div>
            )}
          </div>
          <div className="flex justify-end">
            <button className="bg-blue-600 text-white rounded px-4 py-2">
              Sign In
            </button>
          </div>
        </Form>
      </div>
    </div>
  );
}
