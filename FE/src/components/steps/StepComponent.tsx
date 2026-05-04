import { StepId } from "@/types";
import React, { FC } from "react";
import ActivityLevelStep from "./ActivityLevelStep";
import AgeRangeStep from "./AgeRangeStep";
import GoalStep from "./GoalStep";
import NotificationsStep from "./NotificationsStep";
import PreferencesStep from "./PreferencesStep";

interface StepComponentProps {
  stepId: StepId;
}

const StepComponent: FC<StepComponentProps> = ({ stepId }) => {
  switch (stepId) {
    case "age-range":
      return <AgeRangeStep />;
    case "goal":
      return <GoalStep />;
    case "activity-level":
      return <ActivityLevelStep />;
    case "preferences":
      return <PreferencesStep />;
    case "notifications":
      return <NotificationsStep />;
    default:
      return null;
  }
};

export default StepComponent;
