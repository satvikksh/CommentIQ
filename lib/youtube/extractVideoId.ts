export function extractVideoId(url: string): string | null {
  try {
    const parsed = new URL(url);

    const hostname = parsed.hostname.replace(/^www\./, "");

    if (hostname === "youtu.be") {
      const id = parsed.pathname.slice(1);
      return /^[A-Za-z0-9_-]{11}$/.test(id) ? id : null;
    }

    if (hostname === "youtube.com" || hostname === "m.youtube.com") {
      if (parsed.pathname === "/watch") {
        const id = parsed.searchParams.get("v");

        if (!id) return null;

        // Must be exactly 11 characters
        if (id.length !== 11) return null;

        if (!/^[A-Za-z0-9_-]{11}$/.test(id)) {
          return null;
        }

        return id;
      }

      if (parsed.pathname.startsWith("/shorts/")) {
        const id = parsed.pathname.split("/")[2];

        return id && /^[A-Za-z0-9_-]{11}$/.test(id) ? id : null;
      }

      if (parsed.pathname.startsWith("/embed/")) {
        const id = parsed.pathname.split("/")[2];

        return id && /^[A-Za-z0-9_-]{11}$/.test(id) ? id : null;
      }
    }

    return null;
  } catch {
    return null;
  }
}
