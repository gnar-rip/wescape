"use client";

import Image from "next/image";

type ItemIconProps = {
  id: number | string;
  size?: number;
  alt?: string;
  className?: string;
};

export default function ItemIcon({ id, size = 24, alt, className }: ItemIconProps) {
  const src = `/api/item-icon/${id}`;
  return (
    <Image
      src={src}
      width={size}
      height={size}
      alt={alt ?? `Item ${id}`}
      className={className ?? "inline-block align-middle"}
    />
  );
}
