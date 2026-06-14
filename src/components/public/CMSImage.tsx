import Image from "next/image";
import { ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export function CMSImage({
  src,
  alt,
  className,
  priority = false
}: {
  src?: string;
  alt: string;
  className?: string;
  priority?: boolean;
}) {
  if (!src) {
    return (
      <div
        className={cn(
          "flex min-h-56 items-center justify-center rounded-lg border border-[#eadfce] bg-[#f7ead9] text-wine",
          className
        )}
        aria-label={alt}
      >
        <ImageIcon className="h-10 w-10" aria-hidden="true" />
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      fill
      sizes="(max-width: 768px) 100vw, 50vw"
      priority={priority}
      className={cn("object-cover", className)}
    />
  );
}
