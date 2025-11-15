export const formatMessageTime = (date) =>
  new Date(date).toLocaleString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });

export const formatDate = (date) => {
  const today = new Date();
  const messageDate = new Date(date);
  today.setHours(0, 0, 0, 0); // Reset time to midnight for accurate comparisons
  messageDate.setHours(0, 0, 0, 0);
  const diffInDays = Math.floor((today - messageDate) / (1000 * 60 * 60 * 24));

  if (diffInDays === 0) return "Today"; // Show "Today" for today's messages
  if (diffInDays === 1) return "Yesterday";
  if (diffInDays < 7) {
    return new Intl.DateTimeFormat("en-US", { weekday: "long" }).format(
      messageDate
    );
  }
  return messageDate.toLocaleDateString("en-GB");
};
