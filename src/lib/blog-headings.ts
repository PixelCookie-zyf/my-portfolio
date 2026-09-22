export interface BlogHeading {
  id: string;
  title: string;
  depth: number;
}

interface MarkdownNode {
  type: string;
  value?: string;
  alt?: string;
  depth?: number;
  children?: MarkdownNode[];
  data?: { hProperties?: Record<string, unknown>; [key: string]: unknown };
}

function headingText(node: MarkdownNode): string {
  if (node.type === "image") return node.alt ?? "";
  if (node.type === "break") return " ";
  if (node.children) return node.children.map(headingText).join("");
  return node.value ?? "";
}

/** Collect the same headings that MDX renders, including formatted heading text. */
export function createHeadingCollector(headings: BlogHeading[]) {
  return function remarkHeadings() {
    return function transform(tree: MarkdownNode) {
      const usedIds = new Set<string>();
      headings.length = 0;

      function visit(node: MarkdownNode) {
        if (node.type === "heading") {
          const title = headingText(node).trim();
          const slug = title
            .normalize("NFKC")
            .toLowerCase()
            .replace(/[^\p{L}\p{N}\s-]/gu, "")
            .trim()
            .replace(/\s+/g, "-") || "heading";
          const baseId = `section-${slug}`;
          let id = baseId;
          let suffix = 2;

          while (usedIds.has(id)) id = `${baseId}-${suffix++}`;
          usedIds.add(id);
          node.data = {
            ...node.data,
            hProperties: { ...node.data?.hProperties, id },
          };

          if (node.depth === 2 || node.depth === 3) {
            headings.push({ id, title, depth: node.depth });
          }
        }

        node.children?.forEach(visit);
      }

      visit(tree);
    };
  };
}
