type TabSelectorProps<T extends string> = {
  options: T[];
  active: T;
  onChange: (value: T) => void;
};

export default function TabSelector<T extends string>({
  options,
  active,
  onChange,
}: TabSelectorProps<T>) {
  return (
    <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
      {options.map((value) => (
        <button
          key={value}
          onClick={() => onChange(value)}
          className={`px-6 py-2.5 rounded-full font-label text-sm font-bold whitespace-nowrap transition-all ${
            active === value
              ? "bg-primary text-white shadow-lg shadow-primary/20"
              : "bg-surface-container-low text-on-surface-variant hover:bg-surface-container-high"
          }`}
        >
          {value}
        </button>
      ))}
    </div>
  );
}
