import { ExclamationTriangleIcon } from "@radix-ui/react-icons";

export const FormError = ({ message }: { message?: string }) => {
  return (
    <>
      {message && (
        <div className="bg-destructive/15 rounded-md flex items-center gap-x-2 text-sm text-destructive p-1 m-1">
          <ExclamationTriangleIcon />
          <p>{message}</p>
        </div>
      )}
    </>
  );
};
