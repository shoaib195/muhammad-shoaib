import { revalidatePath } from "next/cache";

/** Bust public pages after admin CMS writes. */
export function revalidateSite() {
  revalidatePath("/");
  revalidatePath("/work");
  revalidatePath("/work/[slug]", "page");
}
