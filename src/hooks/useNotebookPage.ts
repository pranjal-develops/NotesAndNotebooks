import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { notebookApi } from "../api";
import { convertHtmlToMarkdown, downloadMarkdown, convertMarkdownToHtml } from "../utils/markdownExport";

export function useNotebookPage() {
    const { notebookId, pageId } = useParams<{ notebookId: string; pageId: string }>();
    const navigate = useNavigate();

    const [title, setTitle] = useState("Untitled");
    const [contentHtml, setContentHtml] = useState("");
    const [loading, setLoading] = useState(!!pageId);
    const [saving, setSaving] = useState(false);
    const [isEditing, setIsEditing] = useState(!pageId);
    const [drawings, setDrawings] = useState<string[]>([]);
    const [codeBlocks, setCodeBlocks] = useState<{ language: string; code: string }[]>([]);
    const [images, setImages] = useState<string[]>([]);
    const [charts, setCharts] = useState<any[]>([]);

    // Keep track of the pageId we last rendered
    const [prevPageId, setPrevPageId] = useState(pageId);

    // If pageId changed, reset states during the render phase to avoid cascading renders in useEffect
    if (pageId !== prevPageId) {
        setPrevPageId(pageId);
        setLoading(!!pageId);
        setIsEditing(!pageId);
        if (!pageId) {
            setTitle("Untitled");
            setContentHtml("");
            setDrawings([]);
            setCodeBlocks([]);
            setImages([]);
            setCharts([]);
        }
    }

    useEffect(() => {
        if (!notebookId || !pageId) {
            return;
        }

        let isMounted = true;

        notebookApi.getPage(parseInt(notebookId), parseInt(pageId))
            .then(r => {
                if (!isMounted) return;
                const data = r.data;
                setTitle(data.title || "Untitled");
                setContentHtml(data.contentHtml || "");
                setDrawings(data.drawings || []);
                setCodeBlocks(data.codeBlocks || []);
                setImages(data.images || []);
                setCharts(data.charts || []);
                setIsEditing(false);
            })
            .catch(err => {
                console.error("Failed to fetch page", err);
            })
            .finally(() => {
                if (isMounted) {
                    setLoading(false);
                }
            });

        return () => {
            isMounted = false;
        };
    }, [notebookId, pageId]);

    const handleSave = async () => {
        if (!notebookId) return;

        setSaving(true);
        try {
            const payload = {
                title,
                contentHtml,
                drawings,
                codeBlocks,
                images,
                charts,
            };

            let res;
            if (pageId) {
                res = await notebookApi.updatePage(parseInt(notebookId), parseInt(pageId), payload);
            } else {
                res = await notebookApi.addPage(parseInt(notebookId), payload);
            }

            if (!pageId && res.data.id) {
                navigate(`/notebooks/${notebookId}/pages/${res.data.id}`, { replace: true });
            }

            setIsEditing(false);
            alert("Page saved successfully!");
        } catch (err: any) {
            console.error("Save failed:", err);
            const errorMsg = err.response?.data?.message || err.message || "Unknown error";
            alert(`Failed to save page: ${errorMsg}`);
        } finally {
            setSaving(false);
        }
    };

    const handleExportMarkdown = () => {
        const markdown = convertHtmlToMarkdown(title, contentHtml);
        downloadMarkdown(title || "untitled-page", markdown);
    };

    const handleImportMarkdown = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            const text = event.target?.result as string;
            const html = convertMarkdownToHtml(text);

            // Extract title from the first line if it starts with #
            const lines = text.split('\n');
            if (lines[0].startsWith('# ')) {
                setTitle(lines[0].replace('# ', '').trim());
            } else {
                setTitle(file.name.replace('.md', ''));
            }

            setContentHtml(html);
            setIsEditing(true);
        };
        reader.readAsText(file);
    };

    return {
        notebookId,
        pageId,
        title,
        setTitle,
        contentHtml,
        setContentHtml,
        loading,
        saving,
        isEditing,
        setIsEditing,
        drawings,
        setDrawings,
        codeBlocks,
        setCodeBlocks,
        images,
        setImages,
        handleSave,
        handleExportMarkdown,
        handleImportMarkdown,
    };
}
