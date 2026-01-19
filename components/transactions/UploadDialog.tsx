"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { UploadIcon } from "@radix-ui/react-icons";

export function UploadDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Upload PDF</Button>
      </DialogTrigger>
      <DialogContent className="bg-zinc-900 text-white rounded-2xl p-8">
        <DialogHeader>
          <DialogTitle>Upload Statement</DialogTitle>
          <DialogDescription className="text-zinc-400">
            Add a PDF statement to automatically import transactions into FinanceFlow.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-6">
          <div className="space-y-3">
            <label className="text-sm font-medium">Statement PDF</label>
            <div className="border border-dashed border-zinc-700 rounded-xl h-48 flex flex-col items-center justify-center text-zinc-400 gap-3">
              <UploadIcon className="h-8 w-8 text-zinc-300" />
              <div className="text-center text-sm">
                <p>Drop your PDF here</p>
                <p>
                  or{" "}
                  <label
                    htmlFor="statement-pdf"
                    className="text-white underline underline-offset-4 cursor-pointer"
                  >
                    click to browse
                  </label>
                </p>
              </div>
              <Input
                id="statement-pdf"
                type="file"
                accept="application/pdf"
                className="hidden"
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Bank / Card Issuer *</label>
            <Select>
              <SelectTrigger className="bg-zinc-800 border-zinc-700 text-white">
                <SelectValue placeholder="Select issuer" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="chase">Chase</SelectItem>
                <SelectItem value="amex">American Express</SelectItem>
                <SelectItem value="citi">Citi</SelectItem>
                <SelectItem value="boa">Bank of America</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Account Name (optional)</label>
            <Input
              placeholder="e.g., Chase Sapphire"
              className="bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-400"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="secondary" type="button">
            Cancel
          </Button>
          <Button
            type="button"
            className="w-full bg-white text-zinc-900 hover:bg-white/90"
          >
            Process PDF
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
