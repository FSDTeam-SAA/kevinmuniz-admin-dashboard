import { Suspense } from "react";

import AuthSplitLayout from "@/components/auth/AuthSplitLayout";

import OtpForm from "./_components/OtpForm";

export default function ForgotPasswordOtpPage() {
  return (
    <AuthSplitLayout>
      <Suspense fallback={null}>
        <OtpForm />
      </Suspense>
    </AuthSplitLayout>
  );
}
