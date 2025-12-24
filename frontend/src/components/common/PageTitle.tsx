type PageTitleProps = {
  title: string;
  subtitle?: string;
};

const PageTitle: React.FC<PageTitleProps> = ({ title, subtitle }) => {
  return (
    <div>
      <h1 className="text-2xl font-medium text-slate-900 tracking-tight mb-2">
        {title}
      </h1>
      {subtitle && <p className="text-slate-500 text-sm">{subtitle}</p>}
    </div>
  );
};

export default PageTitle;
