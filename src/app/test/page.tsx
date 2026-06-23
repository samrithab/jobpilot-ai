import { supabase } from "@/lib/supabase";

export default async function TestPage() {
  const { data, error } = await supabase
    .from("jobs")
    .select("*");

  return (
    <main className="p-8">
      <h1 className="text-3xl font-bold">Supabase Connected</h1>

      {error && (
        <p className="mt-4 text-red-500">
          Error: {error.message}
        </p>
      )}

      <pre className="mt-4 bg-slate-100 p-4 rounded">
        {JSON.stringify(data, null, 2)}
      </pre>
    </main>
  );
}