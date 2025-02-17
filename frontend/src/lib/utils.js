export const formatMessageTime = () =>
  new Date().toLocaleString("en-US", {
    // hour: 'numeric',
    // minute: 'numeric',
    // hour12: true,
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
