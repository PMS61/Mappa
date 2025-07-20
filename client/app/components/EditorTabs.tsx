import { FaTimes } from "react-icons/fa";

type Tab = {
  id: string;
  name: string;
};

type Props = {
  tabs: Tab[];
  activeTab: string | null;
  onTabClick: (id: string) => void;
  onTabClose: (id: string) => void;
};

export function EditorTabs({ tabs, activeTab, onTabClick, onTabClose }: Props) {
  return (
    <div className="flex items-end border-b border-gray-200 dark:border-gray-700 flex-grow overflow-x-auto">
      <div className="flex items-center gap-1 pt-2 px-2">
        {tabs.map((tab) => (
          <div
            key={tab.id}
            onClick={() => onTabClick(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-t-lg cursor-pointer transition-colors duration-200 border-b-2 ${
              activeTab === tab.id
                ? "bg-white dark:bg-gray-800 border-blue-500"
                : "bg-gray-100 dark:bg-gray-800/50 border-transparent hover:bg-gray-200 dark:hover:bg-gray-700"
            }`}
            title={tab.name}
          >
            <span
              className={`text-sm font-medium whitespace-nowrap ${
                activeTab === tab.id
                  ? "text-gray-800 dark:text-white"
                  : "text-gray-600 dark:text-gray-400"
              }`}
            >
              {tab.name}
            </span>
            <button
              className="p-1 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-300 dark:hover:bg-gray-600 hover:text-gray-800 dark:hover:text-white transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                onTabClose(tab.id);
              }}
              title={`Close ${tab.name}`}
              aria-label={`Close ${tab.name}`}
            >
              <FaTimes size={12} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
