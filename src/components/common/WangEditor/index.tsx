import "@wangeditor/editor/dist/css/style.css"; // 引入 css

import { fileUpload } from "@/utils/oss";
import {
  Boot,
  IDomEditor,
  IEditorConfig,
  IToolbarConfig,
} from "@wangeditor/editor";
import { Editor, Toolbar } from "@wangeditor/editor-for-react";
import { CSSProperties, useEffect, useState } from "react";
import { SafeAny } from "@/types";


type WangEditorTypes = "default" | "lite";

interface IProps {
  value?: string;
  onChange?: (value: string) => void;
  height?: number;
  style?: CSSProperties;
  type?: WangEditorTypes;
  className?: string;
}

type InsertFnType = (url: string, alt: string, href: string) => void;

// 假设 cssString 是你的样式内容
export const wangEditViewCss = `
  .editor-content-view >* { margin: 15px 0 }
  .editor-content-view >h1, .editor-content-view h2, .editor-content-view h3, .editor-content-view h4, .editor-content-view h5, .editor-content-view h6 { margin: 20px 0 !important; }
  .editor-content-view p, .editor-content-view li { white-space: pre-wrap !important; }
  .editor-content-view blockquote { border-left: 8px solid #d0e5f2 !important; padding: 10px 10px !important; margin: 10px 0 !important; background-color: #f1f1f1 !important; }
  .editor-content-view code { font-family: monospace !important; background-color: #eee !important; padding: 3px !important; border-radius: 3px !important; }
  .editor-content-view pre>code { display: block !important; padding: 10px !important; }
  .editor-content-view table { border-collapse: collapse !important; }
  .editor-content-view td, .editor-content-view th { border: 1px solid #ccc !important; min-width: 50px !important; padding: 5px 0 !important; }
  .editor-content-view th { background-color: #f1f1f1 !important; }
  .editor-content-view ul, .editor-content-view ol { padding-left: 20px !important; }
  .editor-content-view input[type="checkbox"] { margin-right: 5px !important; }
  `;

/**
 * 将 wangEditViewCss 的规则内联到 htmlString 的标签上
 */
export function inlineWangEditViewCss(htmlString: string): string {
  const css = wangEditViewCss;
  const ruleRegex = /\.editor-content-view\s*([^{]+)\s*\{([^}]+)\}/g;
  const rules: { selector: string; style: string }[] = [];
  let match;
  while ((match = ruleRegex.exec(css))) {
    rules.push({
      selector: match[1].trim(),
      style: match[2].trim(),
    });
  }

  const wrapper = document.createElement("div");
  wrapper.innerHTML = htmlString;
  const root = wrapper.querySelector(".editor-content-view");
  if (root) {
    rules.forEach(({ selector, style }) => {
      if (selector === ">*") {
        // 直接处理所有子元素
        Array.from(root.children).forEach((el) => {
          const oldStyle = el.getAttribute("style") || "";
          el.setAttribute("style", `${oldStyle};${style}`);
        });
      } else {
        // 其它 selector 仍用 querySelectorAll
        try {
          const nodes = root.querySelectorAll(selector);
          nodes.forEach((el) => {
            const oldStyle = el.getAttribute("style") || "";
            el.setAttribute("style", `${oldStyle};${style}`);
          });
        } catch (e) {
          // 非法 selector 跳过
        }
      }
    });
  }
  return wrapper.children[0].innerHTML;
}

function WangEditor(props: IProps) {
  const { onChange, style, type = "default" } = props;
  const [editor, setEditor] = useState<IDomEditor | null>(null);
  const [value, setValue] = useState<string>(props.value || "");

  // 工具栏配置
  const toolbarConfig: Partial<IToolbarConfig> = {};
  if (type === "lite") {
    toolbarConfig.excludeKeys = [
      "blockquote",
      "group-image",
      "group-video",
      "insertTable",
      "codeBlock",
      "fullScreen",
    ];
  }
  // TS 语法
  // 编辑器配置
  const editorConfig: Partial<IEditorConfig> = {
    placeholder: "请输入内容...",
    MENU_CONF: {},
  };
  editorConfig.MENU_CONF!["lineHeight"] = {
    lineHeightList: ["0.2", "0.3", "0.5", "1", "1.2", "1.3", "1.5", "2", "2.5"],
  };
  editorConfig.MENU_CONF!["fontSize"] = {
    fontSizeList: [
      "5px",
      "6px",
      "8px",
      "9px",
      "10px",
      "12px",
      "13px",
      "14px",
      "15px",
      "16px",
      "19px",
      "22px",
      "24px",
      "29px",
      "32px",
      "40px",
      "48px",
      "10px",
      "10px",
    ],
  };

  editorConfig.MENU_CONF!["uploadImage"] = {
    // 自定义上传
    async customUpload(file: File, insertFn: InsertFnType) {
      const res = await fileUpload(file);
      insertFn(res, "", "");
    },
  };
  editorConfig.MENU_CONF!["uploadVideo"] = {
    async customUpload(file: File, insertFn: SafeAny) {
      const res = await fileUpload(file);
      insertFn(res, "");
    },
  };

  const handleChange = (html: string) => {
    setValue(html);
    // 包裹一层 .editor-content-view
    const htmlWithClass = `<div class="editor-content-view">${html}</div>`;
    const formatHtml = inlineWangEditViewCss(htmlWithClass);
    onChange?.(formatHtml);
  };

  // 及时销毁 editor ，重要！
  useEffect(() => {
    return () => {
      if (editor == null) return;
      editor.destroy();
      setEditor(null);
    };
  }, [editor]);

  return (
    <>
      <div style={{ border: "1px solid #ccc", zIndex: 100 }} className={props.className}>
        <Toolbar
          editor={editor}
          defaultConfig={toolbarConfig}
          mode="default"
          style={{ borderBottom: "1px solid #ccc" }}
        />
        <Editor
          defaultConfig={editorConfig}
          value={value}
          onCreated={setEditor}
          onChange={(editor) => handleChange(editor.getHtml())}
          mode="default"
          style={{ height: "500px", overflowY: "hidden", ...style }}
        />
      </div>
    </>
  );
}

export default WangEditor;
