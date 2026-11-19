// A visible placeholder for content Aida still has to supply.
export function Todo({ children }: { children: React.ReactNode }) {
  return (
    <span
      style={{
        fontSize: "0.8em",
        fontStyle: "normal",
        fontWeight: 400,
        letterSpacing: 0,
        textTransform: "none",
        lineHeight: 1.4,
        padding: "0.1em 0.5em",
        border: "1px dashed #d08a2e",
        color: "#d08a2e",
        whiteSpace: "normal",
      }}
    >
      TODO: {children}
    </span>
  );
}
