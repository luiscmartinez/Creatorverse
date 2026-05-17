import type { FormEvent } from "react";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { supabase } from "../client.js";
import type { Creator } from "../types";

type EditCreatorProps = {
  onCreatorChanged: () => Promise<void>;
};

export default function EditCreator({ onCreatorChanged }: EditCreatorProps) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [url, setUrl] = useState("");
  const [description, setDescription] = useState("");
  const [imageURL, setImageURL] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
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
      } else {
        const creator = data as Creator;
        setName(creator.name);
        setUrl(creator.url);
        setDescription(creator.description);
        setImageURL(creator.imageURL ?? "");
      }

      setIsLoading(false);
    };

    void fetchCreator();
  }, [id]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!id) {
      setErrorMessage("Missing creator id.");
      return;
    }

    setIsSubmitting(true);
    setErrorMessage("");

    const { error } = await supabase
      .from("creators")
      .update({
        name: name.trim(),
        url: url.trim(),
        description: description.trim(),
        imageURL: imageURL.trim() || null,
      })
      .eq("id", id);

    if (error) {
      setErrorMessage(error.message);
      setIsSubmitting(false);
      return;
    }

    await onCreatorChanged();
    navigate(`/creator/${id}`);
  };

  const handleDelete = async () => {
    if (!id) {
      setErrorMessage("Missing creator id.");
      return;
    }

    const confirmed = window.confirm(
      "Delete this creator from your Creatorverse?",
    );

    if (!confirmed) {
      return;
    }

    setIsSubmitting(true);
    setErrorMessage("");

    const { error } = await supabase.from("creators").delete().eq("id", id);

    if (error) {
      setErrorMessage(error.message);
      setIsSubmitting(false);
      return;
    }

    await onCreatorChanged();
    navigate("/");
  };

  return (
    <main className="min-h-screen bg-slate-50 text-slate-950">
      <section className="mx-auto flex w-full max-w-3xl flex-col gap-6 px-5 py-10 sm:px-8 lg:px-10">
        <Link to="/" className="w-fit text-sm font-semibold text-teal-700">
          Back to all creators
        </Link>

        <div>
          <h1 className="text-4xl font-bold text-slate-950">Edit Creator</h1>
          <p className="mt-3 text-slate-600">
            Update profile details or remove this creator from the list.
          </p>
        </div>

        {isLoading ? (
          <div className="rounded-lg border border-slate-200 bg-white p-8 text-slate-600">
            Loading creator...
          </div>
        ) : null}

        {!isLoading ? (
          <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-5 rounded-lg border border-slate-200 bg-white p-6 shadow-sm"
          >
            {errorMessage ? (
              <div className="rounded-md border border-red-200 bg-red-50 p-4 text-sm text-red-900">
                {errorMessage}
              </div>
            ) : null}

            <label className="flex flex-col gap-2 text-sm font-semibold text-slate-800">
              Name
              <input
                required
                type="text"
                value={name}
                onChange={(event) => setName(event.target.value)}
                className="rounded-md border border-slate-300 px-3 py-3 text-base font-normal text-slate-950 outline-none focus:border-teal-700 focus:ring-2 focus:ring-teal-100"
              />
            </label>

            <label className="flex flex-col gap-2 text-sm font-semibold text-slate-800">
              URL
              <input
                required
                type="url"
                value={url}
                onChange={(event) => setUrl(event.target.value)}
                className="rounded-md border border-slate-300 px-3 py-3 text-base font-normal text-slate-950 outline-none focus:border-teal-700 focus:ring-2 focus:ring-teal-100"
              />
            </label>

            <label className="flex flex-col gap-2 text-sm font-semibold text-slate-800">
              Description
              <textarea
                required
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                rows={5}
                className="resize-y rounded-md border border-slate-300 px-3 py-3 text-base font-normal text-slate-950 outline-none focus:border-teal-700 focus:ring-2 focus:ring-teal-100"
              />
            </label>

            <label className="flex flex-col gap-2 text-sm font-semibold text-slate-800">
              Image URL
              <input
                type="url"
                value={imageURL}
                onChange={(event) => setImageURL(event.target.value)}
                className="rounded-md border border-slate-300 px-3 py-3 text-base font-normal text-slate-950 outline-none focus:border-teal-700 focus:ring-2 focus:ring-teal-100"
              />
            </label>

            <div className="flex flex-col gap-3 border-t border-slate-200 pt-5 sm:flex-row sm:justify-between">
              <button
                type="button"
                onClick={() => void handleDelete()}
                disabled={isSubmitting}
                className="rounded-md border border-red-300 px-4 py-3 text-sm font-bold text-red-700 hover:border-red-700 hover:bg-red-50 disabled:cursor-not-allowed disabled:border-slate-300 disabled:text-slate-400"
              >
                Delete Creator
              </button>

              <button
                type="submit"
                disabled={isSubmitting}
                className="rounded-md bg-teal-700 px-4 py-3 text-sm font-bold text-white hover:bg-teal-800 disabled:cursor-not-allowed disabled:bg-slate-400"
              >
                {isSubmitting ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </form>
        ) : null}
      </section>
    </main>
  );
}
