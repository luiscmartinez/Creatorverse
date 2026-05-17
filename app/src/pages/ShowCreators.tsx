import { Link } from "react-router-dom";
import CreatorCard from "../components/CreatorCard";
import type { Creator } from "../types";

type ShowCreatorsProps = {
  creators: Creator[];
  errorMessage: string;
  isLoading: boolean;
  onRefresh: () => Promise<void>;
};

export default function ShowCreators({
  creators,
  errorMessage,
  isLoading,
  onRefresh,
}: ShowCreatorsProps) {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-950">
      <section className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-5 py-10 sm:px-8 lg:px-10">
        <header className="flex flex-col gap-5 border-b border-slate-200 pb-8 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-teal-700">
              Creatorverse
            </p>
            <h1 className="mt-2 text-4xl font-bold text-slate-950">
              Content creators
            </h1>
            <p className="mt-3 max-w-2xl text-base leading-7 text-slate-600">
              Keep track of the channels, writers, streamers, and educators you
              want close at hand.
            </p>
          </div>

          <Link
            to="/new"
            className="inline-flex w-fit items-center justify-center rounded-md bg-teal-700 px-4 py-3 text-sm font-bold text-white hover:bg-teal-800"
          >
            Add Creator
          </Link>
        </header>

        {errorMessage ? (
          <div className="rounded-lg border border-red-200 bg-red-50 p-5 text-red-900">
            <p className="font-semibold">Unable to load creators.</p>
            <p className="mt-1 text-sm">{errorMessage}</p>
            <button
              type="button"
              onClick={() => void onRefresh()}
              className="mt-4 rounded-md bg-red-900 px-3 py-2 text-sm font-semibold text-white hover:bg-red-800"
            >
              Try Again
            </button>
          </div>
        ) : null}

        {isLoading ? (
          <div className="rounded-lg border border-slate-200 bg-white p-8 text-slate-600">
            Loading creators...
          </div>
        ) : null}

        {!isLoading && !errorMessage && creators.length === 0 ? (
          <div className="rounded-lg border border-dashed border-slate-300 bg-white p-10 text-center">
            <h2 className="text-2xl font-bold text-slate-950">
              No creators yet
            </h2>
            <p className="mx-auto mt-3 max-w-md text-slate-600">
              Add the first creator to start building your Creatorverse.
            </p>
            <Link
              to="/new"
              className="mt-6 inline-flex rounded-md bg-teal-700 px-4 py-3 text-sm font-bold text-white hover:bg-teal-800"
            >
              Add Creator
            </Link>
          </div>
        ) : null}

        {!isLoading && !errorMessage && creators.length > 0 ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {creators.map((creator) => (
              <CreatorCard key={creator.id} creator={creator} />
            ))}
          </div>
        ) : null}
      </section>
    </main>
  );
}
