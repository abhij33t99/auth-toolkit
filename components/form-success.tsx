import { CheckCircledIcon } from "@radix-ui/react-icons";

export const FormSuccess = ({ message }: { message?: string }) => {
  return (
    <>
      {message && (
        <div className="bg-emerald-500/15 rounded-md flex items-center gap-x-2 text-sm text-emerald-500 p-1 m-1">
          <CheckCircledIcon />
          <p>{message}</p>
        </div>
      )}
    </>
  );
};
