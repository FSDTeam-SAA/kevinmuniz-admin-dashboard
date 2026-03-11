import { Suspense } from "react";

import AuthSplitLayout from "@/components/auth/AuthSplitLayout";

import ResetPasswordForm from "./_components/ResetPasswordForm";

export default function ResetPasswordPage() {
  return (
    <AuthSplitLayout>
      <Suspense fallback={null}>
        <ResetPasswordForm />
      </Suspense>
    </AuthSplitLayout>
  );
}
