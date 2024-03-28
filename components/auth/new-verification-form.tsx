"use client";

import { newVerification } from "@/actions/new-verification";
import CardWrapper from "@/components/auth/card-wrapper";
import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { HashLoader } from "react-spinners";
import { FormError } from "@/components/form-error";
import { FormSuccess } from "@/components/form-success";

const NewVerificationForm = () => {
  const [error, setError] = useState<string | undefined>();
  const [success, setSuccess] = useState<string | undefined>();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const onSubmit = useCallback(() => {
    console.log(token)
    if (!token) {
      setError("Missing token!");
      return;
    }

    newVerification(token)
      .then((data) => {
        setSuccess(data.success);
        setError(data.error);
      })
      .catch(() => {
        setError("Something went wrong!");
      });
  }, [token]);

  useEffect(() => {
    onSubmit();
  }, [onSubmit]);

  return (
    <CardWrapper
      headerLabel="Confirming your verification! Please wait."
      backButtonLabel="Back to login"
      backButtonHref="/auth/login"
    >
      <div className="flex flex-col w-full items-center justify-center text-emerald-500">
        {!error && !success && <HashLoader />}
        <FormError message={error} />
        <FormSuccess message={success} />
      </div>
    </CardWrapper>
  );
};

export default NewVerificationForm;
