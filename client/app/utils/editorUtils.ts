import * as Y from 'yjs';

export const updateEditorContent = (content: string, getYDoc: (tabId: string) => Y.Doc, activeTab: string) => {
  const activeYDoc = getYDoc(activeTab); // Get the Yjs document for the active tab
  const ytext = activeYDoc.getText("codemirror"); // Get the Yjs text type
  ytext.delete(0, ytext.length); // Clear the existing content
  ytext.insert(0, content); // Insert the new content
};
