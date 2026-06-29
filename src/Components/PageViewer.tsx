import React from "react";
import Editor from "@monaco-editor/react";
import { Line } from "react-chartjs-2";
import type { PageDTO } from "./PageEditor";

type Props = { page: PageDTO | null };

const PageViewer: React.FC<Props> = ({ page }) => {
  if (!page) return <div style={{ padding: 24 }}>No page</div>;
  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: 12 }}>
      <h2>{page.title}</h2>
      <div style={{ border: "1px solid #f0f0f0", padding: 12, marginBottom: 12 }}>
        <div dangerouslySetInnerHTML={{ __html: page.contentHtml ?? "" }} />
      </div>

      <div>
        <h4>Images</h4>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {(page.images ?? []).map((s, i) => <img key={i} src={s} style={{ width: 200 }} />)}
        </div>
      </div>

      <div style={{ marginTop: 12 }}>
        <h4>Drawings</h4>
        <div style={{ display: "flex", gap: 8 }}>
          {(page.drawings ?? []).map((d, i) => <img key={i} src={d} style={{ width: 240 }} />)}
        </div>
      </div>

      <div style={{ marginTop: 12 }}>
        <h4>Charts</h4>
        {(page.charts ?? []).map((c, i) => (
          <div key={i} style={{ width: 700, height: 320, marginTop: 8 }}>
            <Line data={(c as any).data} />
          </div>
        ))}
      </div>

      <div style={{ marginTop: 12 }}>
        <h4>Code</h4>
        {(page.codeBlocks ?? []).map(cb => (
          <div key={cb.id} style={{ marginBottom: 12, border: "1px solid #eee" }}>
            <div style={{ background: "#fafafa", padding: 8, fontSize: 13 }}>{cb.language}</div>
            <Editor height="200px" language={cb.language} value={cb.code} options={{ readOnly: true, minimap: { enabled: false } }} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default PageViewer;
