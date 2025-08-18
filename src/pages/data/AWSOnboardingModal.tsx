import React, { useState, useEffect } from "react";

import useCloudAccountsStore from "@/stores/CloudAccountStore";

import useCompanyStore from "@/stores/CompanyStore";
// Uses shadcn/ui components + lucide-react icons
// Default export: <AWSOnboardingModal />
// Props: companyId (string), templateUrl (string), saasAccountId (string), onClose()

import {
  Check,
  ArrowRight,
  Cloud,
  Link as LinkIcon,
  UploadCloud,
  Copy,
  RefreshCcw,
  ShieldCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import axiosInstance from "@/config/axios/axiosInstance";

import { toast } from "sonner";

function genExternalId() {
  // simple UUID v4 (not cryptographically perfect but fine for UI demo)
  return (
    "ext-" +
    ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, (c) =>
      (
        c ^
        (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))
      ).toString(16),
    )
  );
}

export default function AWSOnboardingModal({
  companyId,
  saasAccountId,
  open,
  onOpenChange,
  connectionName,
  // setAWSExternalId,
  // setAWSARN,
}) {
  const userComp = useCompanyStore((state) => state.userComp);
  const [step, setStep] = useState(1);
  const [externalId, setExternalId] = useState("");
  const [roleName, setRoleName] = useState("");
  const [roleArn, setRoleArn] = useState("");
  const [loading, setLoading] = useState(false);
  const [validationStatus, setValidationStatus] = useState(null); // null | 'valid' | 'invalid'
  const { fetchAccounts } = useCloudAccountsStore();

  useEffect(() => {
    if (!externalId) setExternalId(genExternalId());
  }, []);

  const launchCloudFormation = () => {
    // Build the CloudFormation console URL with templateURL encoded and prefill params
    const params = new URLSearchParams();
    const templateUrl =
      "https://numlock-public-bucket-1.s3.us-west-2.amazonaws.com/onboarding-cloudformation.yml";
    params.set("templateURL", templateUrl);
    // AWS console will open; customers must edit parameters inline.
    // We can't set parameter values via URL reliably across all accounts, so we show instructions.
    const url = `https://console.aws.amazon.com/cloudformation/home#/stacks/create/review?${params.toString()}`;
    window.open(url, "_blank");
  };

  const copyToClipboard = async (val) => {
    try {
      await navigator.clipboard.writeText(val);
      toast("Copied to clipboard");
    } catch (e) {
      toast("Copy failed");
    }
  };

  const submitRoleArn = async () => {
    if (!roleArn || !userComp || !externalId || !connectionName)
      return toast("missing values, enter them! ");
    setLoading(true);
    setValidationStatus(null);
    try {
      // call your backend to register integration and validate by attempting assumerole/costexplorer
      const resp = await axiosInstance.post("/data/aws/register-role/", {
        company_id: userComp.id,
        role_arn: roleArn,
        external_id: externalId,
        name: connectionName,
      });

      const data = resp.data;
      if (resp.status === 201) {
        setValidationStatus("valid");
        setStep(4);
        toast("role validated and saved");
      } else {
        setValidationStatus("invalid");
        toast(
          "validation failed",
          // description: data.error || json.stringify(data),
        );
        console.log("valiation res", resp);
      }
    } catch (err) {
      setValidationStatus("invalid");
      console.log("error registering role:", err);
      toast("network error");
    } finally {
      setLoading(false);
    }
  };
  const changeDialogState = (val) => {
    setStep(1);
    setExternalId(genExternalId());
    setRoleArn("");
    setValidationStatus(null);
    setLoading(false);
    onOpenChange(val);
  };

  return (
    <Dialog open={open} className="  " onOpenChange={changeDialogState}>
      <DialogContent className="min-w-3xl w-full p-6">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-foreground ">
            <Cloud className="w-5 h-5 dark:text-foreground" /> Connect AWS
            Billing
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-6 py-2  w-full  ">
          {/* Stepper */}
          <div className="flex items-center gap-4  mb-0 bg-secondary px-3 py-2 rounded-lg">
            <Step
              label="1. Generate External ID"
              active={step === 1}
              done={step > 1}
            />
            <ArrowRight className="w-4 h-4 text-muted-foreground" />
            <Step
              label="2. Create Stack (one-click)"
              active={step === 2}
              done={step > 2}
            />
            <ArrowRight className="w-4 h-4 text-muted-foreground" />
            <Step
              label="3. Paste Role ARN"
              active={step === 3}
              done={step > 3}
            />
            <ArrowRight className="w-4 h-4 text-muted-foreground" />
            <Step
              label="4. Validate & Sync"
              active={step === 4}
              done={step > 4}
            />
          </div>

          <Separator className="w-full" />

          {/* Step content */}
          {step === 1 && (
            <div className="grid grid-cols-1 gap-4">
              <p className="text-sm dark:text-foreground">
                We generate a unique <strong>External ID</strong> to protect
                this account's role. Copy it and paste into the CloudFormation
                parameter when creating the stack.
              </p>
              <div className="flex items-center gap-2">
                <Input
                  className="rounded-xs"
                  value={externalId}
                  className="dark:text-foreground"
                  readOnly
                />
                <Button
                  onClick={() => {
                    setExternalId(genExternalId());
                  }}
                  variant="outline"
                >
                  <RefreshCcw className="dark:text-foreground" />
                  {/* Regenerate */}
                </Button>
                <Button
                  className=""
                  variant="default"
                  onClick={() => copyToClipboard(externalId)}
                >
                  <Copy />
                  Copy
                </Button>
              </div>
              <div className="text-xs  text-center text-muted-foreground">
                Make sure to keep this External ID secret — it prevents confused
                deputy attacks.
              </div>
              <div className="flex gap-2 justify-end dark:text-foreground">
                <Button
                  variant="outline"
                  onClick={() => changeDialogState(!open)}
                >
                  Cancel
                </Button>
                <Button
                  onClick={() => {
                    // setAWSExternalId(externalId);
                    setStep(2);
                  }}
                >
                  Next
                </Button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="grid grid-cols-1 gap-4">
              <p className="text-sm dark:text-foreground">
                Click the button below to open AWS CloudFormation. On the Create
                stack page, set the following parameters:
              </p>
              <ul className="list-disc pl-6 text-sm dark:text-foreground">
                <li>
                  <strong>ExternalId</strong>: paste the External ID from step
                  1.
                </li>
                <li>
                  {/* TODO: store the id in var */}
                  <strong>SaaSAccountId</strong>: <code>{767397678516}</code>
                </li>
                <li className="text-muted-foreground">
                  <strong>RoleName</strong>: optional (defaults to{" "}
                  <code>{roleName}</code>).
                </li>
              </ul>
              <div className="flex gap-2 justify-end">
                <Button onClick={launchCloudFormation}>
                  <LinkIcon className="mr-2" /> Open CloudFormation
                </Button>
                <Button
                  onClick={() => setStep(3)}
                  className="dark:text-foreground"
                  variant="outline"
                >
                  I created the stack — next
                </Button>
              </div>
              <div className="text-sm text-muted-foreground">
                If stack creation fails, open the stack events in AWS Console
                and fix permissions or role name conflicts.
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="grid grid-cols-1 gap-4">
              <p className="text-sm dark:text-foreground">
                After the stack reaches <strong>CREATE_COMPLETE</strong>, open
                the stack and copy the <code>RoleArn</code> from the outputtab .
                Paste it below.
              </p>
              <Label className="dark:text-foreground">Role ARN</Label>
              <Input
                placeholder="arn:aws:iam::123456789012:role/NumlockBillingAccessRole"
                value={roleArn}
                onChange={(e) => setRoleArn(e.target.value)}
              />
              <div className="flex gap-2">
                <Button onClick={submitRoleArn} disabled={loading}>
                  {loading ? "Validating..." : "Save & Validate"}
                </Button>
                <Button
                  variant="outline"
                  className="dark:text-foreground"
                  onClick={() => {
                    // setAWSARN(roleArn);
                    setStep(2);
                  }}
                >
                  Back
                </Button>
              </div>
              {validationStatus === "valid" && (
                <div className="text-green-600 flex items-center gap-2">
                  <Check className="w-4 h-4" /> Role OK — we will start syncing
                  billing data.
                </div>
              )}
              {validationStatus === "invalid" && (
                <div className="text-red-600">
                  Validation failed. Check role ARN, ExternalId, and permissions
                </div>
              )}
            </div>
          )}

          {step === 4 && (
            <div className="grid grid-cols-1 gap-4 ">
              <p className="flex items-center gap-2 justify-center bg-green-200/30 mx-24">
                <ShieldCheck className="w-5 h-5 text-green-600" /> Your AWS
                account is connected.
              </p>
              <p className="text-sm dark:text-foreground">What happens next:</p>
              <ul className="list-disc pl-6 text-sm dark:text-foreground">
                <li>
                  We validate the role and start a background job to sync
                  billing data daily.
                </li>
                <li>
                  You can revoke access at any time by deleting the role or
                  removing it from our integrations page.
                </li>
              </ul>
              <div className="flex gap-2 justify-end">
                {/* <Button variant="outline" onClick={() => setStep(3)}> */}
                {/*   View Role */}
                {/* </Button> */}
                <Button
                  onClick={() => {
                    fetchAccounts(userComp.id);
                    changeDialogState(false);
                  }}
                >
                  Done
                </Button>
              </div>
            </div>
          )}
        </div>
        {/* <DialogFooter> */}
        {/*   <div className="flex justify-between w-full"> */}
        {/*     <div className="text-sm text-muted-foreground"> */}
        {/*       CloudFormation template:{" "} */}
        {/*       <code className="break-all">{templateUrl}</code> */}
        {/*     </div> */}
        {/*     <div className="flex gap-2"> */}
        {/*       <Button */}
        {/*         variant="ghost" */}
        {/*         onClick={() => copyToClipboard(templateUrl)} */}
        {/*       > */}
        {/*         <Copy className="w-4 h-4 mr-2" /> */}
        {/*         Copy template URL */}
        {/*       </Button> */}
        {/*     </div> */}
        {/*   </div> */}
        {/* </DialogFooter> */}
      </DialogContent>
    </Dialog>
  );
}

function Step({ label, active, done }) {
  return (
    <div className={`flex items-center gap-2  ${done ? "opacity-60" : ""}   `}>
      <div
        className={`w-4 h-4 rounded-full flex items-center justify-center   ${done ? "bg-green-100 text-green-700 text-foreground" : active ? "bg-blue-600 text-white block text-foreground" : " hidden bg-gray-100 text-gray-600 text-foreground"} `}
      >
        {done ? <Check className="w-4 h-4" /> : active ? "•" : "—"}
      </div>
      <div
        className={`text-xs ${active ? "opacity-95 font-bold" : "opacity-50"} dark:text-foreground`}
      >
        {label}
      </div>
    </div>
  );
}
