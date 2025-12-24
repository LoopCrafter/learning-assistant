import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeSanitize from "rehype-sanitize";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { dracula } from "react-syntax-highlighter/dist/esm/styles/hljs";

type MarkdownRendererProps = {
  content: string;
};

type CodeProps = {
  inline?: boolean;
  className?: string;
  children: React.ReactNode;
};

const components = {
  h1: (props: any) => <h1 className="text-3xl font-bold my-4" {...props} />,
  h2: (props: any) => <h2 className="text-2xl font-semibold my-3" {...props} />,
  h3: (props: any) => <h3 className="text-xl font-semibold my-2" {...props} />,
  h4: (props: any) => <h4 className="text-lg font-medium my-2" {...props} />,
  h5: (props: any) => <h5 className="text-base font-medium my-1" {...props} />,
  h6: (props: any) => <h6 className="text-sm font-medium my-1" {...props} />,
  p: (props: any) => <p className="my-2 text-gray-800" {...props} />,
  ul: (props: any) => <ul className="list-disc list-inside my-2" {...props} />,
  ol: (props: any) => (
    <ol className="list-decimal list-inside my-2" {...props} />
  ),
  li: (props: any) => <li className="ml-4 my-1" {...props} />,
  blockquote: (props: any) => (
    <blockquote
      className="border-l-4  pl-4 italic my-2 text-neutral-600 border-neutral-300"
      {...props}
    />
  ),
  a: (props: any) => (
    <a className="text-[#00d492] hover:underline" {...props} />
  ),
  pre: (props: any) => (
    <pre
      className="bg-neutral-800 text-white p-3 rounded-md overflow-x-auto text-sm font-mono my-4"
      {...props}
    />
  ),
  code: ({ inline, className, children, ...props }: any) => {
    const match = /language-(\w+)/.exec(className || "");

    if (!inline && match) {
      return (
        <SyntaxHighlighter
          style={dracula}
          language={match[1]}
          PreTag="div"
          className="rounded-md my-2"
        >
          {String(children).replace(/\n$/, "")}
        </SyntaxHighlighter>
      );
    }

    return (
      <code
        className={`bg-neutral-100 text-red-600 px-1 py-0.5 rounded text-sm font-mono ${
          className || ""
        }`}
        {...props}
      >
        {children}
      </code>
    );
  },
  hr: (props: any) => <hr className="my-4 border-gray-300" {...props} />,
  img: (props: any) => <img className="my-2 rounded shadow-md" {...props} />,
  strong: (props: any) => <strong className="font-bold" {...props} />,
  em: (props: any) => <em className="italic" {...props} />,
  del: (props: any) => (
    <del className="line-through text-gray-500" {...props} />
  ),
  br: (props: any) => <br {...props} />,
  span: (props: any) => <span {...props} />,
};

const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content }) => {
  return (
    <div className="text-neutral-700">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeSanitize]}
        components={components}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};

export default MarkdownRenderer;
