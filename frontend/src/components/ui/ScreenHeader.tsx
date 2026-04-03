import type { ReactNode } from "react";
import { ArrowLeft } from "lucide-react";

type ScreenHeaderProps = {
  title: string;
  onBack?: () => void;
  rightActions?: ReactNode;
  subTitle?: string;
};

export default function ScreenHeader({
  title,
  onBack,
  rightActions,
  subTitle,
}: ScreenHeaderProps) {
  return (
    <header className="sticky top-0 z-50 glass-header border-b border-outline-variant/10 px-6 py-4">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-4">
          {onBack && (
            <button
              onClick={onBack}
              className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-surface-container-low transition-colors"
              aria-label="Back"
            >
              <ArrowLeft className="w-6 h-6 text-on-surface" />
            </button>
          )}
          <div>
            <h1 className="font-headline font-bold text-xl text-on-surface">
              {title}
            </h1>
            {subTitle && (
              <p className="font-body text-xs text-on-surface-variant">
                {subTitle}
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">{rightActions}</div>
      </div>
    </header>
  );
}
