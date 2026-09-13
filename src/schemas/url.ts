import z from "zod";

const urlSchema = z.strictObject({
  url: z.url("URL not Provided"),
});

export { urlSchema };
