import type { Route } from "./+types/home";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Creatorverse" },
    { name: "description", content: "Discover and manage content creators." },
  ];
}

export default function Home() {
  return null;
}
