export const formatMessageTime = (date) =>
  new Date(date).toLocaleString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
