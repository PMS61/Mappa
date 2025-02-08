import styles from "./EditorTabs.module.css";

type Tab = {
  id: string;
  name: string;
};

type Props = {
  tabs: Tab[];
  activeTab: string;
  onTabClick: (id: string) => void;
  onTabClose: (id: string) => void;
};

export function EditorTabs({ tabs, activeTab, onTabClick, onTabClose }: Props) {
  return (
    <div className={styles.tabs}>
      {tabs.map((tab, index) => (
        <div
          key={tab.id}
          className={`${styles.tab} ${
            activeTab === tab.id ? styles.active : ""
          }`}
          onClick={() => onTabClick(tab.id)}
          title={`Switch to ${tab.name} (Ctrl + Tab to cycle)`}
        >
          <span className={styles.tabName}>{tab.name}</span>
          <button
            className={styles.closeButton}
            onClick={(e) => {
              e.stopPropagation();
              onTabClose(tab.id);
            }}
            title="Close tab"
          >
            ×
          </button>
        </div>
      ))}
    </div>
  );
}
