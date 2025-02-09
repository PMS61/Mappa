export function UserAvatar({ name, className }) {
    const initials = name ? name.charAt(0).toUpperCase() : "A";
    return (
      <div className={`flex items-center justify-center rounded-full bg-blue-600 text-white font-medium ${className}`}>
        {initials}
      </div>
    );
  }