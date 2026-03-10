import AuthSplitLayout from "@/components/auth/AuthSplitLayout";

import SignInForm from "./_components/SignInForm";

export default function SignInPage() {
  return (
    <AuthSplitLayout>
      <SignInForm />
    </AuthSplitLayout>
  );
}
