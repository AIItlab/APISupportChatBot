import React from 'react';

interface DocumentationImageProps {
  src: string;
  alt?: string;
  caption?: string;
}

export const DocumentationImage: React.FC<DocumentationImageProps> = ({
  src,
  alt,
  caption
}) => {
  return (
    <figure className="my-8 text-center">
      <div className="rounded-lg overflow-hidden shadow-lg bg-white p-4">
        <img
          src={src}
          alt={alt}
          className="max-w-full h-auto mx-auto rounded"
        />
        {(caption || alt) && (
          <figcaption className="mt-2 text-sm text-gray-600">
            {caption || alt}
          </figcaption>
        )}
      </div>
    </figure>
  );
};
