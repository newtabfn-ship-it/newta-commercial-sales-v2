type PageTitleProps = {
  title: string;
  description?: string;
};

export default function PageTitle({
  title,
  description,
}: PageTitleProps) {
  return (
    <div className="mb-8">
      <h1 className="text-4xl font-bold text-[#0B2F24]">
        {title}
      </h1>

      {description && (
        <p className="mt-2 text-gray-600">
          {description}
        </p>
      )}
    </div>
  );
}