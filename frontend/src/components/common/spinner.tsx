import { Loader2 } from "lucide-react";

const Spinner: React.FC<{ size?: number; color?: string }> = ({
  size = 24,
  color = "text-slate-500",
}) => {
  return (
    <div className="flex items-center justify-center h-1/2">
      <Loader2 className={`animate-spin ${color}`} size={size} />
    </div>
  );
};

export default Spinner;
