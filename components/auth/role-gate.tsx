"use client";

import { useCurrentUserRole } from "@/hooks/use-current-role";
import { UserRole } from "@prisma/client";
import { FormError } from "@/components/form-error";

const RoleGate = ({
  children,
  allowedRole,
}: {
  children: React.ReactNode;
  allowedRole: UserRole;
}) => {
  const role = useCurrentUserRole();
  if (role !== allowedRole)
    return <FormError message="Insufficient permission to view the content!" />;
  return <>{children}</>;
};

export default RoleGate;
