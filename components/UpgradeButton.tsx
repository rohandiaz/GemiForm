import Link from "next/link";
import React from "react";
import { Progress } from "./ui/progress";
import { getForms } from "@/actions/getForms";
import { MAX_FREE_FORM } from "@/lib/utils";

type Props = {
  userId: string | undefined;
};

const UpgradeButton: React.FC<Props> = async ({ userId }) => {
  const forms = await getForms();
  const isSubscribed = true; // Assuming user is subscribed

  const formsGenerated = forms?.data?.length;
  const percentage = (formsGenerated! / MAX_FREE_FORM) * 100;

  return (
    <div className="m-3">
      {isSubscribed ? (
        <span className="text-sm">
          You have a subscription plan, you are eligible to create more forms
        </span>
      ) : (
        <>
          <Progress value={percentage} />
          <p>
            {formsGenerated} out of {MAX_FREE_FORM} forms generated. {" "}
            <Link href={"/dashboard/upgrade"} className="text-blue-600 underline">
              Upgrade
            </Link>{" "}
            to generate more forms
          </p>
        </>
      )}
    </div>
  );
};

export default UpgradeButton;
