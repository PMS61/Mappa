"use client";
import Cookies from "js-cookie";

const computeDiff = (aLines, bLines) => {
  let dp = Array(aLines.length + 1)
    .fill(null)
    .map(() => Array(bLines.length + 1).fill(0));

  for (let i = 0; i <= aLines.length; i++) {
    for (let j = 0; j <= bLines.length; j++) {
      if (i === 0) dp[i][j] = j;
      else if (j === 0) dp[i][j] = i;
      else if (aLines[i - 1] === bLines[j - 1]) dp[i][j] = dp[i - 1][j - 1];
      else dp[i][j] = 1 + Math.min(dp[i - 1][j], dp[i][j - 1]);
    }
  }

  let i = aLines.length,
    j = bLines.length,
    diff = [];
  while (i > 0 || j > 0) {
    if (i > 0 && j > 0 && aLines[i - 1] === bLines[j - 1]) {
      diff.unshift({ text: aLines[i - 1], type: "same" });
      i--;
      j--;
    } else if (j > 0 && (i === 0 || dp[i][j - 1] < dp[i - 1][j])) {
      diff.unshift({ text: bLines[j - 1], type: "added" });
      j--;
    } else {
      diff.unshift({ text: aLines[i - 1], type: "deleted" });
      i--;
    }
  }
  return diff;
};

export default function Page() {
  const getFileContents = () => ({
    aText: Cookies.get("alpha") || "",
    bText: Cookies.get("beta") || "",
  });

  const { aText, bText } = getFileContents();
  const aLines = aText.split("\n");
  const bLines = bText.split("\n");
  const diff = computeDiff(aLines, bLines);

  return (
    <div className="p-4 max-w-3xl mx-auto border rounded-lg shadow-lg">
      <h2 className="text-lg font-semibold mb-2">Merge Editor</h2>
      <div className="border p-2 bg-gray-100 rounded-md text-sm font-mono">
        {diff.map((line, index) => (
          <div
            key={index}
            className={
              line.type === "added"
                ? "bg-green-200"
                : line.type === "deleted"
                ? "bg-red-200"
                : ""
            }
          >
            {line.text}
          </div>
        ))}
      </div>
    </div>
  );
}
