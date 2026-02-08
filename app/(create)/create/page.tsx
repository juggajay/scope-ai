"use client";

import { MotionConfig } from "framer-motion";
import { WizardProvider } from "@/lib/wizard/WizardContext";
import { WizardContainer } from "@/components/create/WizardContainer";

export default function CreatePage() {
  return (
    <MotionConfig reducedMotion="user">
      <WizardProvider>
        <WizardContainer />
      </WizardProvider>
    </MotionConfig>
  );
}
