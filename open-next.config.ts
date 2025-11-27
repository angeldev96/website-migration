import type { NextConfig } from "next";

import { defineCloudflareConfig } from "@opennextjs/cloudflare";

export default defineCloudflareConfig({
  // Enable incremental cache for better performance
  // incrementalCache: "fetch",
  
  // Tag cache for on-demand revalidation
  // tagCache: "fetch",
});
