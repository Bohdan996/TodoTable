export const textTrimmer = (text: string, maxlength = 20) => {
  const isTextLong = text.length > maxlength;
  const displayText = isTextLong
    ? `${text.slice(0, maxlength)}...`
    : text;

  return displayText;
}

export const highlightText = (text: string, query: string) => {
  if (!query) return text;

  const escapedQuery = query.replace(/[-[\]/{}()*+?.\\^$|]/g, "\\$&");

  const regex = new RegExp(`(${escapedQuery})`, "gi");

  const parts = text.split(regex);
  
  return parts.map((part, index) =>
    regex.test(part) ? (
      <span key={index} style={{ backgroundColor: "yellow" }}>
        {part}
      </span>
    ) : (
      part
    )
  );
};