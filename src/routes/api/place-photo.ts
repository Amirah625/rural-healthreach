import { createFileRoute } from "@tanstack/react-router";

import { fetchPlacePhoto } from "@/lib/places.server";

export const Route = createFileRoute("/api/place-photo")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const photoName = new URL(request.url).searchParams.get("name");
        if (!photoName) return new Response("Photo unavailable", { status: 404 });
        return fetchPlacePhoto(photoName);
      },
    },
  },
});