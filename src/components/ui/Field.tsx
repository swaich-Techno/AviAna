import { cn } from "@/lib/utils";

type FieldProps = {
  label: string;
  name: string;
  className?: string;
  hint?: string;
  required?: boolean;
  children?: React.ReactNode;
} & React.InputHTMLAttributes<HTMLInputElement>;

export function Field({ label, name, className, hint, required, children, ...props }: FieldProps) {
  return (
    <label className={cn("block space-y-2 text-sm font-semibold text-charcoal", className)}>
      <span>
        {label}
        {required ? <span className="text-[#b42318]"> *</span> : null}
      </span>
      {children || (
        <input
          name={name}
          required={required}
          className="min-h-11 w-full rounded-md border border-[#d9c8ac] bg-white px-3 py-2 text-sm text-charcoal shadow-line transition focus:border-wine focus:outline-none focus:ring-2 focus:ring-wine/20"
          {...props}
        />
      )}
      {hint ? <span className="block text-xs font-medium text-[#70645c]">{hint}</span> : null}
    </label>
  );
}

type TextAreaProps = {
  label: string;
  name: string;
  className?: string;
  hint?: string;
  required?: boolean;
} & React.TextareaHTMLAttributes<HTMLTextAreaElement>;

export function TextArea({ label, name, className, hint, required, ...props }: TextAreaProps) {
  return (
    <label className={cn("block space-y-2 text-sm font-semibold text-charcoal", className)}>
      <span>
        {label}
        {required ? <span className="text-[#b42318]"> *</span> : null}
      </span>
      <textarea
        name={name}
        required={required}
        className="min-h-28 w-full rounded-md border border-[#d9c8ac] bg-white px-3 py-2 text-sm text-charcoal shadow-line transition focus:border-wine focus:outline-none focus:ring-2 focus:ring-wine/20"
        {...props}
      />
      {hint ? <span className="block text-xs font-medium text-[#70645c]">{hint}</span> : null}
    </label>
  );
}

type SelectFieldProps = {
  label: string;
  name: string;
  options: string[];
  defaultValue?: string;
  className?: string;
  required?: boolean;
};

export function SelectField({ label, name, options, defaultValue, className, required }: SelectFieldProps) {
  return (
    <label className={cn("block space-y-2 text-sm font-semibold text-charcoal", className)}>
      <span>
        {label}
        {required ? <span className="text-[#b42318]"> *</span> : null}
      </span>
      <select
        name={name}
        defaultValue={defaultValue}
        required={required}
        className="min-h-11 w-full rounded-md border border-[#d9c8ac] bg-white px-3 py-2 text-sm text-charcoal shadow-line transition focus:border-wine focus:outline-none focus:ring-2 focus:ring-wine/20"
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option.replaceAll("_", " ")}
          </option>
        ))}
      </select>
    </label>
  );
}
