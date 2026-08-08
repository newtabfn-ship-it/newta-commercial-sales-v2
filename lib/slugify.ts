export function slugify(text: string) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export function createEquipmentSlug(
  title: string,
  referenceNumber: string
) {
  const titleSlug = slugify(title);
  const referenceSlug = slugify(referenceNumber);

  if (
    referenceSlug &&
    titleSlug.endsWith(`-${referenceSlug}`)
  ) {
    return titleSlug;
  }

  return referenceSlug
    ? `${titleSlug}-${referenceSlug}`
    : titleSlug;
}