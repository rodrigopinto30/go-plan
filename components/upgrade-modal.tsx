import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Sparkle } from "lucide-react";
import { PricingTable } from "@clerk/nextjs";

const UpgradeModal = ({
  isOpen,
  onClose,
  trigger,
}: {
  isOpen: boolean;
  onClose: () => void;
  trigger: string;
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <div className="flex items-center gap-2 mb-2">
            <Sparkle className="w-6 h-6 text-purple-500" />
            <DialogTitle className="text-2xl">Upgrade to Pro</DialogTitle>
          </div>
          <DialogDescription>
            {trigger === "header" && "Create Unlimited Events with Pro! "}
            {trigger === "limit" && "You've reached you free event limit. "}
            {trigger === "color" && "Custom theme colors are a Pro feature. "}
            Unlock unlimited events and premium features!
          </DialogDescription>
        </DialogHeader>

        <PricingTable
          checkoutProps={{
            appearance: {
              elements: {
                drawerRoot: {
                  zIndex: 2000,
                },
              },
            },
          }}
        />

        <div className="flex gap-3">
          <Button variant="outline" onClick={onClose} className="flex-1">
            Maybe Later
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default UpgradeModal;
