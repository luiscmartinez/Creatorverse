import { Link } from "react-router-dom";
import type { Creator } from "../types";

type CreatorCardProps = {
  creator: Creator;
};

function getInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0]?.toUpperCase())
    .join("");
}

export default function CreatorCard({ creator }: CreatorCardProps) {
  const detailPath = `/creator/${creator.id}`;
  const editPath = `/creator/${creator.id}/edit`;

  return (
    <article className="flex h-full flex-col overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <Link to={detailPath} className="block bg-slate-100">
        {creator.imageURL ? (
          <img
            src={creator.imageURL}
            alt={creator.name}
            className="h-48 w-full object-cover"
          />
        ) : (
          <div className="flex h-48 w-full items-center justify-center bg-slate-900 text-4xl font-bold text-white">
            {getInitials(creator.name) || "CV"}
          </div>
        )}
      </Link>

      <div className="flex flex-1 flex-col gap-4 p-5">
        <div>
          <Link
            to={detailPath}
            className="text-xl font-bold text-slate-950 hover:text-teal-700"
          >
            {creator.name}
          </Link>
          <a
            href={creator.url}
            target="_blank"
            rel="noreferrer"
            className="mt-1 block break-words text-sm font-medium text-teal-700 hover:text-teal-900"
          >
            {creator.url}
          </a>
        </div>

        <p className="line-clamp-4 flex-1 text-sm leading-6 text-slate-600">
          {creator.description}
        </p>

        <div className="flex flex-wrap gap-2 pt-2">
          <Link
            to={detailPath}
            className="rounded-md bg-slate-950 px-3 py-2 text-sm font-semibold text-white hover:bg-slate-800"
          >
            View
          </Link>
          <a
            href={creator.url}
            target="_blank"
            rel="noreferrer"
            className="rounded-md border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700 hover:border-teal-700 hover:text-teal-700"
          >
            Visit
          </a>
          <Link
            to={editPath}
            className="rounded-md border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700 hover:border-teal-700 hover:text-teal-700"
          >
            Edit
          </Link>
        </div>
      </div>
    </article>
  );
}
