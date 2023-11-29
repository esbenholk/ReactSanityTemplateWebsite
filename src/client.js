import sanityClient from "@sanity/client";

export default sanityClient({
  projectId: "qldeoq4m",
  dataset: "production",
  apiVersion: "2023-10-06", // use a UTC date string
  useCdn: true, // `false` if you want to ensure fresh data
});
