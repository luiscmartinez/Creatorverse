import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { supabase } from "../client.js";
import type { Creator } from "../types";

function getInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0]?.toUpperCase())
    .join("");
}

export default function ViewCreator() {
  const { id } = useParams();
  const [creator, setCreator] = useState<Creator | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const fetchCreator = async () => {
      if (!id) {
        setErrorMessage("Missing creator id.");
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setErrorMessage("");

      const { data, error } = await supabase
        .from("creators")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        setErrorMessage(error.message);
        setCreator(null);
      } else {
        setCreator(data as Creator);
      }

      setIsLoading(false);
    };

    void fetchCreator();
  }, [id]);

  return (
    <main className="min-h-screen bg-slate-50 text-slate-950">
      <section className="mx-auto flex w-full max-w-5xl flex-col gap-6 px-5 py-10 sm:px-8 lg:px-10">
        <Link to="/" className="w-fit text-sm font-semibold text-teal-700">
          Back to all creators
        </Link>

        {isLoading ? (
          <div className="rounded-lg border border-slate-200 bg-white p-8 text-slate-600">
            Loading creator...
          </div>
        ) : null}

        {errorMessage ? (
          <div className="rounded-lg border border-red-200 bg-red-50 p-5 text-red-900">
            <p className="font-semibold">Unable to load this creator.</p>
            <p className="mt-1 text-sm">{errorMessage}</p>
          </div>
        ) : null}

        {!isLoading && !errorMessage && creator ? (
          <article className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
            {creator.imageURL ? (
              <img
                src={creator.imageURL}
                alt={creator.name}
                className="h-72 w-full object-cover"
              />
            ) : (
              <div className="flex h-72 w-full items-center justify-center bg-slate-900 text-5xl font-bold text-white">
                {getInitials(creator.name) || "CV"}
              </div>
            )}

            <div className="flex flex-col gap-6 p-6 sm:p-8">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <h1 className="text-4xl font-bold text-slate-950">
                    {creator.name}
                  </h1>
                  <a
                    href={creator.url}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-3 block break-words text-base font-semibold text-teal-700 hover:text-teal-900"
                  >
                    {creator.url}
                  </a>
                </div>

                <Link
                  to={`/creator/${creator.id}/edit`}
                  className="inline-flex w-fit rounded-md bg-teal-700 px-4 py-3 text-sm font-bold text-white hover:bg-teal-800"
                >
                  Edit Creator
                </Link>
              </div>

              <p className="text-lg leading-8 text-slate-700">
                {creator.description}
              </p>

              <a
                href={creator.url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex w-fit rounded-md bg-slate-950 px-4 py-3 text-sm font-bold text-white hover:bg-slate-800"
              >
                Visit Creator
              </a>
            </div>
          </article>
        ) : null}
      </section>
    </main>
  );
}
