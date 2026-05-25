'use client';

import Image from 'next/image';

export default function KashdaLogo({
  width = 150,
  height = 40,
}: {
  width?: number;
  height?: number;
}) {
  return (
    <Image
      src="/kashda_logo.svg"
      alt="KASHDA"
      width={width}
      height={height}
      priority
      style={{ width: 'auto', height: 'auto', maxWidth: width, maxHeight: height }}
    />
  );
}
