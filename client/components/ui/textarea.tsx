export function Textarea({ value, onChange, rows = 4, className = "" }) {
    return (
      <textarea
        value={value}
        onChange={onChange}
        rows={rows}
        className={`w-full px-3 py-2 border rounded-md ${className}`}
      />
    );
  }